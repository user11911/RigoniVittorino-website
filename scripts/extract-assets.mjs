// Scans every cached in-scope page for referenced images/PDFs/icons under the site's
// own domain (wp-content uploads + theme assets) and downloads each unique one into
// public/ at the exact same path it lives at on the live site (so no URL-rewriting
// logic is needed anywhere else — an absolute URL just has its domain stripped, and a
// domain-relative URL is already the local path). Emits asset-inventory.json, one of
// the required final deliverables.
import { readFile, writeFile, mkdir, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, ".cache/html");
// Task 9: WPML sites typically share one media library across translations,
// so EN/DE pages mostly reference the same asset URLs IT already downloaded
// — scan all three language caches together (IT stays the default/primary
// dir) and let the existing-file check below skip anything already fetched.
const LANG_CACHE_DIRS = [CACHE_DIR, path.join(CACHE_DIR, "en"), path.join(CACHE_DIR, "de")];
const CSS_DIR = path.join(__dirname, ".cache/css");
const PUBLIC_DIR = path.join(__dirname, "../public");
const INVENTORY_FILE = path.join(__dirname, "../asset-inventory.json");

// CSS file -> the absolute directory its own relative url()s resolve against, since
// url(img/foo.png) inside .../geppa/style-custom.min.css means .../geppa/img/foo.png.
const CSS_BASE_DIRS = {
  "style-custom.min.css": "/wp-content/themes/geppa/",
};

const DOMAIN = "https://rigonivittorino.com";

// Only these path prefixes are in-scope: our own uploads + our own theme's static
// image assets. Everything else (fonts.googleapis.com, fontawesome CDN, recaptcha,
// facebook, plugin vendor JS/CSS we're deliberately not re-hosting) is left external.
const IN_SCOPE_PREFIXES = ["/wp-content/uploads/", "/wp-content/themes/geppa/img/"];

function extractUrls(html) {
  const urls = new Set();
  // src="...", href="...pdf"
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) urls.add(m[1]);
  // srcset="url w, url w, ..."
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url) urls.add(url);
    }
  }
  return urls;
}

// Only images/icons/PDFs are meant to be swept up wholesale like this — JS is
// handled deliberately per-file elsewhere (self-hosted verbatim, reimplemented in
// site.js, or intentionally dropped; see IMPLEMENTATION_NOTES.md §5). Without this,
// the generic src="" scan below also matches <script src> tags and pulls in
// unrelated plugin JS we explicitly decided not to use.
const ASSET_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".pdf"];

function toLocalPath(url) {
  let u = url.split("?")[0].split("#")[0]; // strip cache-busting query strings etc.
  if (u.startsWith(DOMAIN)) u = u.slice(DOMAIN.length);
  if (!u.startsWith("/")) return null;
  const inScope = IN_SCOPE_PREFIXES.some((p) => u.startsWith(p));
  if (!inScope) return null;
  const hasAssetExtension = ASSET_EXTENSIONS.some((ext) => u.toLowerCase().endsWith(ext));
  if (!hasAssetExtension) return null;
  return u; // becomes public/<u>, i.e. served at the same absolute path
}

function extractCssUrls(css) {
  const urls = new Set();
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) {
    let u = m[1].trim().replace(/^["']|["']$/g, "");
    if (u.startsWith("data:")) continue;
    urls.add(u);
  }
  return urls;
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const found = new Map(); // localPath -> originalUrl

  for (const dir of LANG_CACHE_DIRS) {
    const files = (await readdir(dir).catch(() => [])).filter((f) => f.endsWith(".html"));
    for (const file of files) {
      const html = await readFile(path.join(dir, file), "utf8");
      for (const url of extractUrls(html)) {
        const local = toLocalPath(url);
        if (!local) continue;
        const original = url.startsWith("http") ? url : `${DOMAIN}${url}`;
        found.set(local, original);
      }
    }
  }

  const cssFiles = (await readdir(CSS_DIR).catch(() => [])).filter((f) => f.endsWith(".css"));
  for (const file of cssFiles) {
    const css = await readFile(path.join(CSS_DIR, file), "utf8");
    const baseDir = CSS_BASE_DIRS[file];
    if (!baseDir) continue; // no relative-url css assets known for this file
    for (const u of extractCssUrls(css)) {
      if (u.startsWith("http") || u.startsWith("//")) continue; // handled like normal absolute urls elsewhere
      const local = `${baseDir}${u}`.replace(/\/\.\//g, "/");
      const original = `${DOMAIN}${local}`;
      found.set(local, original);
    }
  }

  console.log(`Found ${found.size} unique in-scope assets across ${LANG_CACHE_DIRS.length} language caches.`);

  const inventory = [];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  for (const [localPath, originalUrl] of found) {
    const destPath = path.join(PUBLIC_DIR, localPath);
    if (await fileExists(destPath)) {
      inventory.push({ originalUrl, localPath: `public${localPath}`, status: "already-present" });
      skipped++;
      continue;
    }
    await mkdir(path.dirname(destPath), { recursive: true });
    try {
      const res = await fetch(originalUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(destPath, buf);
      inventory.push({ originalUrl, localPath: `public${localPath}`, bytes: buf.length, status: "ok" });
      downloaded++;
    } catch (err) {
      inventory.push({ originalUrl, localPath: `public${localPath}`, status: "error", error: err.message });
      failed++;
      console.log(`FAILED ${originalUrl}: ${err.message}`);
    }
  }

  inventory.sort((a, b) => a.localPath.localeCompare(b.localPath));
  await writeFile(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
  console.log(
    `Downloaded ${downloaded}, already present ${skipped}, failed ${failed}. Inventory -> ${path.relative(process.cwd(), INVENTORY_FILE)}`,
  );
  if (failed) process.exitCode = 1;
}

main();
