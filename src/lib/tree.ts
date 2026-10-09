/**
 * Jerarquía: proyecto → subproyecto → ítem → documento.
 * Cada carpeta contempla su index.md con { title, subtitle } en el frontmatter.
 * El index de una subcarpeta nunca se muestra como página independiente en la
 * carpeta madre: se accede clicando la subcarpeta, que hereda el título real.
 */

export type DocLeaf = {
  kind: "doc";
  slug: string; // segmento de URL (nombre de archivo sin .md)
  id: string; // id original de la colección (con .md) para render()
  href: string; // URL pública /docs/a/b/doc/
  title: string;
  subtitle?: string;
  excerpt: string;
  depth: number;
};

export type FolderNode = {
  kind: "folder";
  slug: string;
  title: string;
  subtitle?: string;
  path: string[]; // segmentos hasta esta carpeta, sin incluir la raíz
  href: string; // URL de su index
  depth: number;
  docs: DocLeaf[];
  children: FolderNode[];
};

export type TreeNode = FolderNode | DocLeaf;
export type DocsTree = FolderNode; // raíz virtual (no genera página propia)

const TITLES: Record<string, string> = {
  "pulsar-os": "Pulsar OS",
  "inled-tools": "Inled Tools",
  "mac-edition": "Mac Edition",
  "tv-edition": "TV Edition",
  "pear-edition": "Pear Edition",
  "chrome-extensions": "Chrome Extensions",
  "office-suite": "Office Suite",
  architecture: "Architecture",
  contributing: "Contributing",
  "getting-started": "Getting Started",
  hardware: "Hardware",
  installation: "Installation",
  mypdf: "MyPDF",
  mymetadata: "MyMetadata",
  indoc: "InDoc",
  insuite: "InSuite",
  cleany: "Cleany",
  tabnest: "TabNest",
  guia: "Guide",
  "como-funciona": "How it works",
};

export function titleize(slug: string): string {
  if (TITLES[slug]) return TITLES[slug];
  return slug
    .split("-")
    .map((w) => (w.toLowerCase() === "os" ? "OS" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Resumen de texto plano a partir del body (elimina markdown básico). */
function excerptOf(raw: string, len = 160): string {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, ""); // quita frontmatter
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, len);
}

export interface DocsEntryLike {
  id: string; // "a/b/doc.md" o "a/b" (el loader colapsa index.md al id de carpeta)
  body: string; // markdown crudo
  data: { title: string; subtitle?: string };
}

/** href de un documento: /docs/a/b/doc/ */
export function docHref(path: string[], slug: string): string {
  return "/docs/" + [...path, slug].join("/") + "/";
}

/** href de una carpeta: /docs/a/b/ (la raíz apunta a /) */
export function folderHref(path: string[]): string {
  return path.length === 0 ? "/" : "/docs/" + path.join("/") + "/";
}

export function buildTree(entries: DocsEntryLike[]): DocsTree {
  const root: DocsTree = {
    kind: "folder",
    slug: "",
    title: "Inled Docs",
    path: [],
    href: "/",
    depth: -1,
    docs: [],
    children: [],
  };

  for (const e of entries) {
    const parts = e.id.replace(/\.md$/, "").split("/");
    const fileName = parts.pop() as string;
    const isIndex = fileName === "index";
    const docSlug = isIndex ? "index" : fileName;

    // desciende creando carpetas
    let node: FolderNode = root;
    for (const part of parts) {
      let child = node.children.find((c) => c.slug === part);
      if (!child) {
        child = {
          kind: "folder",
          slug: part,
          title: titleize(part),
          path: [...node.path, part],
          href: folderHref([...node.path, part]),
          depth: node.depth + 1,
          docs: [],
          children: [],
        };
        node.children.push(child);
      }
      node = child;
    }

    const leaf: DocLeaf = {
      kind: "doc",
      slug: docSlug,
      id: e.id,
      // el index de la raíz apunta a /; el de una carpeta, a la carpeta
      href: isIndex ? node.href : docHref(node.path, docSlug),
      title: e.data.title || (isIndex ? node.title : titleize(docSlug)),
      subtitle: e.data.subtitle,
      excerpt: excerptOf(e.body),
      depth: node.depth + 1,
    };

    if (isIndex) {
      // el index.md define title/subtitle de su carpeta
      node.title = e.data.title || node.title;
      node.subtitle = e.data.subtitle;
      node.docs.unshift(leaf); // el index siempre primero
    } else {
      node.docs.push(leaf);
    }
  }

  /**
   * Consolidación: el loader glob de Astro colapsa "a/b/index.md" al id "a/b",
   * por lo que el index de una subcarpeta puede aterrizar como "doc" en la
   * carpeta madre con slug = nombre de la subcarpeta. Fusionamos ese leaf con
   * la subcarpeta: su título/subtitle pasan a la carpeta. Así el index de una
   * subcarpeta jamás se renderiza como página independiente en la madre.
   */
  const consolidate = (n: FolderNode) => {
    for (const c of n.children) consolidate(c);
    const folderMap = new Map(n.children.map((c) => [c.slug, c]));
    const kept: DocLeaf[] = [];
    for (const d of n.docs) {
      const folder = folderMap.get(d.slug);
      if (folder) {
        folder.title = d.title;
        folder.subtitle = d.subtitle ?? folder.subtitle;
        const idxLeaf = folder.docs.find((x) => x.slug === "index");
        if (idxLeaf) {
          idxLeaf.title = d.title;
          idxLeaf.subtitle = d.subtitle;
          idxLeaf.excerpt = d.excerpt;
        }
        // el leaf dupe se descarta: la subcarpeta ya apunta a su index
      } else {
        kept.push(d);
      }
    }
    n.docs = kept;
  };
  consolidate(root);

  const sortRec = (n: FolderNode) => {
    // docs: index primero, luego alfabético
    n.docs.sort((a, b) => {
      if (a.slug === "index") return -1;
      if (b.slug === "index") return 1;
      return a.slug.localeCompare(b.slug);
    });
    n.children.sort((a, b) => a.slug.localeCompare(b.slug));
    n.children.forEach(sortRec);
  };
  sortRec(root);
  return root;
}

/** Busca un nodo carpeta por path de segmentos. */
export function findFolder(tree: DocsTree, segs: string[]): FolderNode | undefined {
  let node: FolderNode = tree;
  for (const s of segs) {
    const next = node.children.find((c) => c.slug === s);
    if (!next) return undefined;
    node = next;
  }
  return node;
}
