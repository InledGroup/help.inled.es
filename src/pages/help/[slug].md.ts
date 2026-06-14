import { ArticleService } from '../../infrastructure/github/GitHubService';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  const articleService = new ArticleService();
  const articles = await articleService.getAllArticles();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return new Response('Artículo no encontrado', { status: 404 });
  }

  // Devolvemos el contenido Markdown original con los metadatos
  // We return the original Markdown content with metadata
  const rawContent = `slug: ${article.slug}
group: ${article.group}

${article.content}`;

  return new Response(rawContent, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
    },
  });
};

export async function getStaticPaths() {
  const articleService = new ArticleService();
  const articles = await articleService.getAllArticles();
  
  return articles.map(article => ({
    params: { slug: article.slug },
  }));
}
