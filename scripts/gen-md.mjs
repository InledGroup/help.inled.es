#!/usr/bin/env node
/**
 * Post-build: copia el markdown fuente a dist/ con la misma estructura de URLs.
 * /docs/a/b/index.md ← src/content/docs/a/b/index.md
 * /docs/a/b/c/index.md ← src/content/docs/a/b/c.md
 * /index.md ← src/content/docs/index.md
 * Uso: node scripts/gen-md.mjs (después de astro build)
 */
import { readdirSync, statSync, mkdirSync, copyFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";

const SRC = "src/content/docs";
const DIST = "dist";
let count = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith(".md")) {
      const rel = relative(SRC, full); // "a/b/index.md" | "a/b/c.md" | "index.md"
      const parts = rel.split("/");
      const fileName = parts.pop();
      let dest;
      if (fileName === "index.md") {
        dest = parts.length === 0 ? join(DIST, "index.md") : join(DIST, "docs", ...parts, "index.md");
      } else {
        const slug = fileName.replace(/\.md$/, "");
        dest = join(DIST, "docs", ...parts, slug, "index.md");
      }
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(full, dest);
      count++;
    }
  }
}

if (!existsSync(DIST)) {
  console.error("dist/ no existe; ejecuta pnpm astro build primero");
  process.exit(1);
}
walk(SRC);
console.log(`✔ ${count} archivos markdown copiados a dist/`);
