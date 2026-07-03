import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://rigonivittorino.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
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
