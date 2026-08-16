/**
 * Elenca i post marcati `unlisted: true`, per tenerli fuori dalla sitemap.
 *
 * La sitemap si costruisce in astro.config.ts, dove non si può interrogare
 * la collezione dei contenuti: si leggono quindi i file direttamente.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const POSTS = 'src/content/posts';

export function slugNonElencati() {
  if (!existsSync(POSTS)) return [];

  return readdirSync(POSTS)
    .filter((nome) => nome.endsWith('.md') || nome.endsWith('.mdx'))
    .filter((nome) => {
      const testo = readFileSync(join(POSTS, nome), 'utf8');
      const frontmatter = testo.split(/^---$/m)[1] ?? '';
      return /^\s*unlisted:\s*true\s*$/m.test(frontmatter);
    })
    .map((nome) => nome.replace(/\.mdx?$/, ''));
}
