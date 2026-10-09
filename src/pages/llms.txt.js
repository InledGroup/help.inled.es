import { getCollection } from "astro:content";

const SITE = "https://help.inled.es";

export async function GET() {
  const entries = await getCollection("docs");

  const urlOf = (id) => {
    const parts = id.replace(/\.md$/, "").split("/");
    const fileName = parts.pop();
    if (fileName === "index") {
      // index de carpeta (o raíz → "/")
      if (parts.length === 0) return { html: "/", md: "/index.md" };
      return { html: "/docs/" + parts.join("/") + "/", md: "/docs/" + parts.join("/") + "/index.md" };
    }
    return {
      html: "/docs/" + [...parts, fileName].join("/") + "/",
      md: "/docs/" + [...parts, fileName].join("/") + "/index.md",
    };
  // unificado: los docs sueltos también se sirven como <doc>/index.md
  };

  const lines = [
    `# Inled Docs`,
    ``,
    `> Documentación oficial de Inled Group — Pulsar OS y sus ediciones (Mac, TV, Pear), extensiones de Chrome y más herramientas libres. Dream, Build.`,
    ``,
    `Cada página está disponible en HTML y en Markdown crudo (misma URL terminada en index.md).`,
    ``,
  ];
  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  for (const e of sorted) {
    const u = urlOf(e.id);
    const title = e.data.title || u.html;
    lines.push(`- [${title}]${e.data.subtitle ? `: ${e.data.subtitle}` : ""}(${SITE}${u.html}) [Markdown: ${SITE}${u.md}]`);
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
