// Task 9: plain-fetch route smoke test — no Playwright/Chromium (confirmed
// unable to launch in this sandbox: missing libnspr4.so, no passwordless
// sudo). Covers every implemented it/en/de route, the shared /news/ route,
// the /it/news/ redirect, and root "/" country routing. Substitutes for the
// existing Playwright-based scripts/route-smoke-test.mjs, which is left
// untouched/historical and still documented as non-runnable here.
import { allRoutes, allRoutesForLang } from "./routes.mjs";

const BASE = process.env.LOCAL_BASE_URL || "http://localhost:4321";

async function check(path, expectedStatus, extra = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: "manual", headers: extra.headers ?? {} });
  const ok = res.status === expectedStatus;
  const location = res.headers.get("location");
  let detail = `${res.status}`;
  if (location) detail += ` -> ${location}`;
  console.log(`${ok ? "OK  " : "FAIL"} ${path} (expected ${expectedStatus}, got ${detail})`);
  if (extra.expectLocation && location !== extra.expectLocation) {
    console.log(`     Location mismatch: expected ${extra.expectLocation}, got ${location}`);
    return false;
  }
  return ok;
}

async function main() {
  let allOk = true;

  console.log("--- IT routes (existing, must remain 200) ---");
  for (const route of allRoutes()) {
    // /it/news/ is intentionally now a redirect to the shared /news/ (Task 9),
    // checked separately below — not a regression, so not asserted as 200 here.
    if (route.kind === "news") continue;
    allOk = (await check(`/it/${route.path}`, 200)) && allOk;
  }

  console.log("--- EN routes ---");
  for (const route of allRoutesForLang("en")) {
    allOk = (await check(`/en/${route.path}`, 200)) && allOk;
  }

  console.log("--- DE routes ---");
  for (const route of allRoutesForLang("de")) {
    allOk = (await check(`/de/${route.path}`, 200)) && allOk;
  }

  console.log("--- Shared News + redirect ---");
  allOk = (await check("/news/", 200)) && allOk;
  allOk = (await check("/it/news/", 301, { expectLocation: "/news/" })) && allOk;

  console.log("--- Root country routing ---");
  allOk = (await check("/", 302, { expectLocation: "/en/" })) && allOk;
  allOk = (await check("/", 302, { headers: { "cf-ipcountry": "IT" }, expectLocation: "/it/" })) && allOk;
  allOk = (await check("/", 302, { headers: { "cf-ipcountry": "DE" }, expectLocation: "/de/" })) && allOk;
  allOk = (await check("/", 302, { headers: { "cf-ipcountry": "US" }, expectLocation: "/en/" })) && allOk;

  console.log(allOk ? "\nAll routes OK." : "\nSome routes FAILED.");
  if (!allOk) process.exitCode = 1;
}

main();
