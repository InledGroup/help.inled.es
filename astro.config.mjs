import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const site = "https://help.inled.es";

export default defineConfig({
  site,
  trailingSlash: "ignore",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
