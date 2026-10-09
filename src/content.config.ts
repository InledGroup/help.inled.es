import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Colección de documentación.
 * Jerarquía por carpetas: proyecto → subproyecto → ítem → documento (.md)
 * URL: /docs/<proyecto>/<subproyecto>/<item>/<documento>/
 */
const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
});

export const collections = { docs };
