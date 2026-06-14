import type { HelpArticle } from "../domain/HelpArticle";

/**
 * Maps GitHub Issues to our HelpArticle domain model.
 * Mapea las Issues de GitHub a nuestro modelo de dominio HelpArticle.
 */
export class GitHubIssueMapper {
  static toDomain(issue: any): HelpArticle {
    // We expect the slug and group to be in the issue body as frontmatter or specific tags
    // Esperamos que el slug y el grupo estén en el cuerpo de la issue como frontmatter o etiquetas específicas
    
    const body = issue.body || "";
    const meta = this.parseBodyMeta(body);

    return {
      id: issue.id.toString(),
      title: issue.title,
      slug: meta.slug || this.slugify(issue.title),
      content: meta.content,
      group: meta.group || "General",
      updatedAt: new Date(issue.updated_at),
      author: issue.user.login,
    };
  }

  private static parseBodyMeta(body: string) {
    // Simple regex to extract slug and group from the body if they exist in a "config" block
    // Regex simple para extraer slug y grupo del cuerpo si existen en un bloque de "config"
    const slugMatch = body.match(/slug:\s*([^\n\r]+)/);
    const groupMatch = body.match(/group:\s*([^\n\r]+)/);
    
    // Remove the config lines from the content
    // Quitar las líneas de configuración del contenido
    const content = body.replace(/slug:\s*[^\n\r]+\n?/, "").replace(/group:\s*[^\n\r]+\n?/, "").trim();

    return {
      slug: slugMatch ? slugMatch[1].trim() : null,
      group: groupMatch ? groupMatch[1].trim() : null,
      content
    };
  }

  private static slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
