import { GitHubIssueMapper } from "./GitHubIssueMapper";
import type { HelpArticle } from "../../core/domain/HelpArticle";
import fs from 'node:fs';
import path from 'node:path';

/**
 * Service to fetch articles from both Local files and GitHub.
 * Servicio para obtener artículos tanto de archivos locales como de GitHub.
 */
export class ArticleService {
  private repo: string;
  private owner: string;
  private token?: string;
  private localPath = path.join(process.cwd(), 'src/content/help');

  constructor() {
    this.owner = import.meta.env.GITHUB_OWNER || "";
    this.repo = import.meta.env.GITHUB_REPO || "";
    this.token = import.meta.env.GITHUB_TOKEN;
  }

  async getAllArticles(): Promise<HelpArticle[]> {
    const localArticles = this.getLocalArticles();
    const remoteArticles = await this.getRemoteArticles();
    
    return [...localArticles, ...remoteArticles];
  }

  private getLocalArticles(): HelpArticle[] {
    try {
      if (!fs.existsSync(this.localPath)) return [];
      
      const files = fs.readdirSync(this.localPath);
      return files.filter(f => f.endsWith('.md')).map(file => {
        const content = fs.readFileSync(path.join(this.localPath, file), 'utf-8');
        // Usamos el mismo mapper para mantener consistencia / Same mapper for consistency
        return GitHubIssueMapper.toDomain({
          id: file,
          title: file.replace('.md', ''),
          body: content,
          updated_at: new Date().toISOString(),
          user: { login: 'Local' }
        });
      });
    } catch (e) {
      console.error("Error loading local articles:", e);
      return [];
    }
  }

  private async getRemoteArticles(): Promise<HelpArticle[]> {
    if (!this.owner || !this.repo) return [];

    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/issues?labels=documentation&state=open`;
    
    try {
      const response = await fetch(url, {
        headers: this.token ? { Authorization: `token ${this.token}` } : {},
      });
      if (!response.ok) return [];
      const issues = await response.json();
      return issues.map((issue: any) => GitHubIssueMapper.toDomain(issue));
    } catch (error) {
      return [];
    }
  }
}
