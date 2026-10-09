import { getCollection } from "astro:content";

const slugify = (s) =>
  s.toLowerCase().replace(/[^\wáéíóúñü\s-]/g, "").trim().replace(/\s+/g, "-");

export async function GET() {
  const entries = await getCollection("docs");

  const toText = (raw) =>
    raw
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*`_~|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const sectionsOf = (raw) => {
    const lines = raw.replace(/^---\n[\s\S]*?\n---\n/, "").split("\n");
    const sections = [{ heading: "", buf: [] }];
    for (const line of lines) {
      const m = line.match(/^#{2,3}\s+(.*)$/);
      if (m) sections.push({ heading: m[1].trim(), buf: [] });
      else sections[sections.length - 1].buf.push(line);
    }
    return sections.map((s) => ({ heading: s.heading, text: toText(s.buf.join(" ")) })).filter((s) => s.text.length > 30);
  };

  const docs = entries.flatMap((e) => {
    const parts = e.id.replace(/\.md$/, "").split("/");
    const fileName = parts.pop();
    const isIndex = fileName === "index";
    const title = e.data.title || fileName;

    let href;
    if (isIndex) {
      href = parts.length === 0 ? "/" : "/docs/" + parts.join("/") + "/";
    } else {
      href = "/docs/" + [...parts, fileName].join("/") + "/";
    }

    return sectionsOf(e.body ?? "").map((s, i) => ({
      title,
      section: s.heading || "",
      text: s.text.slice(0, 900),
      href: i === 0 ? href : href + "#" + slugify(s.heading),
    }));
  });

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
