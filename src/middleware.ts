import { defineMiddleware } from "astro:middleware";
import { getCollection } from "astro:content";

/**
 * URLs terminadas en /index.md o /index.md (raíz) devuelven el markdown crudo.
 * Solo atiende peticiones GET ".md"; el resto pasa al router normal.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  if (request.method !== "GET") return next();

  const pathname = url.pathname.replace(/\/+$/, "");
  if (!(pathname === "/index.md" || pathname.endsWith("/index.md"))) return next();

  // segs: "docs/pulsar-os/mac-edition" | "" (raíz)
  let segs = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  segs = segs.filter((s) => s !== "docs");
  const mdPath = segs.length === 0 ? "" : segs.join("/");

  // id en la colección: "" → "index.md"; "a/b" → "a/b/index.md"; "a/b/doc" → "a/b/doc.md"
  const segsArr = mdPath ? mdPath.split("/") : [];
  const id =
    segsArr.length === 0
      ? "index.md"
      : [...segsArr.slice(0, -1), segsArr[segsArr.length - 1] + ".md"].join("/");

  const entries = await getCollection("docs");
  let entry = entries.find((e) => e.id === id);
  if (!entry) return next(); // deja que el 404 actúe

  return new Response(entry.body ?? "", {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
});
