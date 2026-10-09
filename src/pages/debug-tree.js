import { getCollection } from "astro:content";
import { buildTree } from "../lib/tree";

export async function GET() {
  const entries = await getCollection("docs");
  const tree = buildTree(entries);
  const dump = (n, acc = []) => {
    acc.push(
      `${"  ".repeat(Math.max(0, n.depth + 1))}${n.kind === "folder" ? "📁" : "📄"} ${n.slug || "ROOT"} → ${n.href} | "${n.title}"`
    );
    if (n.kind === "folder") {
      n.docs.forEach((d) => dumpNode(d, acc, n.depth + 2));
      n.children.forEach((c) => dump(c, acc));
    }
    return acc;
  };
  const dumpNode = (d, acc, depth) => {
    acc.push(`${"  ".repeat(depth)}📄 ${d.slug} → ${d.href} | "${d.title}"`);
  };
  return new Response(
    `ids:\n${entries.map((e) => e.id).join("\n")}\n\nTREE:\n${dump(tree).join("\n")}`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
