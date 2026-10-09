// Simulación offline del buildTree para depurar
const titleize = (slug) =>
  ({ "chrome-extensions": "Chrome Extensions", "inled-tools": "Inled Tools" })[slug] ||
  slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

const ids = [
  "index", "inled-tools", "pulsar-os", "inled-tools/chrome-extensions", "pulsar-os/architecture",
  "pulsar-os/architecture/agents_spec", "pulsar-os/architecture/cajita_ui_spec",
  "pulsar-os/architecture/gnome_settings", "pulsar-os/architecture/gateways_spec",
  "pulsar-os/architecture/sayri", "pulsar-os/architecture/skills_spec",
  "pulsar-os/contributing/contribute", "pulsar-os/architecture/store",
  "pulsar-os/contributing", "pulsar-os/contributing/use-ai",
  "pulsar-os/getting-started/welcome", "pulsar-os/installation/install-pulsar-os",
  "inled-tools/chrome-extensions/cleany", "pulsar-os/hardware/hibernation-and-session-restore",
];
const dataTitle = (id) => {
  const t = {
    index: "Inled Docs",
    "inled-tools": "Inled Tools",
    "pulsar-os": "Pulsar OS",
    "inled-tools/chrome-extensions": "Chrome Extensions",
    "pulsar-os/architecture": "Architecture and technical details",
    "pulsar-os/contributing": "We appreciate your contribution!",
    "pulsar-os/getting-started": "Getting Started",
    "pulsar-os/installation": "Installation",
    "pulsar-os/hardware": "Hardware",
  };
  return t[id] || id.split("/").pop().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const root = { kind: "folder", slug: "", title: "Inled Docs", path: [], href: "/", depth: -1, docs: [], children: [] };
const titleCache = new Map();

for (const id of ids) {
  const parts = id.split("/");
  const fileName = parts.pop();
  const isIndex = fileName === "index";
  const docSlug = isIndex ? "index" : fileName;

  let node = root;
  for (const part of parts) {
    let child = node.children.find((c) => c.slug === part);
    if (!child) {
      child = { kind: "folder", slug: part, title: titleize(part), path: [...node.path, part], href: "/docs/" + [...node.path, part].join("/") + "/", depth: node.depth + 1, docs: [], children: [] };
      node.children.push(child);
    }
    node = child;
  }
  const leaf = { kind: "doc", slug: docSlug, id, href: isIndex ? node.href : "/docs/" + [...node.path, docSlug].join("/") + "/", title: dataTitle(id) || (isIndex ? node.title : titleize(docSlug)) };
  if (isIndex) {
    node.title = leaf.title;
    node.docs.unshift(leaf);
  } else {
    node.docs.push(leaf);
  }
}

const consolidate = (n) => {
  for (const c of n.children) consolidate(c);
  const folderMap = new Map(n.children.map((c) => [c.slug, c]));
  const kept = [];
  for (const d of n.docs) {
    const folder = folderMap.get(d.slug);
    if (folder) {
      folder.title = d.title;
    } else {
      kept.push(d);
    }
  }
  n.docs = kept;
};
consolidate(root);

const show = (n, d) => {
  console.log("  ".repeat(d) + (n.kind === "folder" ? "📁" : "📄") + " " + n.slug + " → " + n.href + ' | "' + n.title + '"');
  if (n.kind === "folder") {
    n.docs.forEach((x) => console.log("  ".repeat(d + 1) + "📄 " + x.slug + " → " + x.href + ' | "' + x.title + '"'));
    n.children.forEach((c) => show(c, d + 1));
  }
};
show(root, 0);
