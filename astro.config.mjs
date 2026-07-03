import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://rigonivittorino.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
