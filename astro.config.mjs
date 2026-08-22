import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://rigonivittorino.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  // Task 66 (SEO): auto-discovers every page Astro defines a route for, not a
  // hand-maintained list — but the integration enumerates from the route
  // manifest, not strictly the static build output, so `prerender: false`
  // routes still show up and need excluding explicitly (confirmed by
  // building once without a filter and inspecting the raw output, not
  // assumed): the root `/` (country-redirect, no real `index.html` is ever
  // produced for it — confirmed directly) and `/it/news/` (a 301 redirect
  // stub to the real, already-separately-listed `/news/` — a sitemap should
  // never point search engines at a redirect instead of its destination).
  // `/en/privacy-policy/` and `/de/privacy-policy/` *are* prerendered but
  // intentionally render no real content (Task 9's own documented decision —
  // see TODO.md/testing.md) — excluded so a sitemap never points search
  // engines at a page with nothing on it.
  integrations: [
    sitemap({
      filter: (page) =>
        page !== "https://rigonivittorino.com/" &&
        !page.endsWith("/it/news/") &&
        !page.endsWith("/en/privacy-policy/") &&
        !page.endsWith("/de/privacy-policy/"),
    }),
  ],
  // Adding an adapter switches Astro to on-demand rendering by default. Every
  // existing page explicitly opts back into static prerendering (see each page's
  // `export const prerender = true`) so Task 1's site is byte-for-byte unaffected;
  // only the new /api/contact route is actually server-rendered on Cloudflare's edge.
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    // Prerendered pages use node:fs to read the transplanted static HTML content
    // (see src/content/main/*.html) — the workerd runtime's Node compat shim
    // doesn't implement real filesystem access, so prerendering (build-time only,
    // unrelated to the one live /api/contact route) needs real Node instead.
    prerenderEnvironment: "node",
  }),
});
