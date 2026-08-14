import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { site } from './src/site.config';

export default defineConfig({
  site: site.url,
  /**
   * Se pubblichi su un repo di progetto (es. github.com/username/blog) e non su
   * "username.github.io", scommenta la riga seguente con il nome del repo:
   */
  // base: '/blog',

  integrations: [
    mdx(),
    // le pagine delle etichette sono solo un aiuto alla navigazione:
    // restano fuori dalla sitemap, come dichiarano già con noindex
    sitemap({ filter: (pagina) => !pagina.includes('/tag/') }),
  ],

  markdown: {
    // $...$ in linea e $$...$$ in blocco, resi in HTML durante la build:
    // nessun JavaScript da caricare nel browser.
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  image: {
    // le copertine vengono ridimensionate e convertite in fase di build
    responsiveStyles: true,
  },
});
