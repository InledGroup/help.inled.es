/**
 * @interface HelpArticle
 * Represets a help article in the system.
 * Representa un artículo de ayuda en el sistema.
 */
export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  group: string; // The "folder" or category / La "carpeta" o categoría
  updatedAt: Date;
  author: string;
}
