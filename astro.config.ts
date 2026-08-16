import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// @ts-expect-error — plugin locale in JavaScript, senza tipi
import { remarkMedia } from './src/lib/remark-media.mjs';
// @ts-expect-error — integrazione locale in JavaScript, senza tipi
import { mediaAccantoAiPost } from './src/lib/media-accanto-ai-post.mjs';
// @ts-expect-error — modulo locale in JavaScript, senza tipi
import { slugNonElencati } from './src/lib/non-elencati.mjs';

const nonElencati: string[] = slugNonElencati();

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
    // porta nel sito le note vocali e i video tenuti accanto ai post
    mediaAccantoAiPost(),
    // Fuori dalla sitemap: le pagine delle etichette, che sono solo un aiuto
    // alla navigazione, e i post non elencati. Entrambi lo dichiarano già
    // con noindex; qui si evita anche di segnalarli ai motori.
    sitemap({
      filter: (pagina) =>
        !pagina.includes('/tag/') &&
        !nonElencati.some((slug) => pagina.includes(`/blog/${slug}`)),
    }),
  ],

  markdown: {
    // remarkMedia: foto con didascalia, note vocali, video e YouTube
    //   scritti in Markdown normale (vedi src/lib/remark-media.mjs).
    // remarkMath: $...$ in linea e $$...$$ in blocco, resi in HTML durante
    //   la build — nessun JavaScript da caricare nel browser.
    remarkPlugins: [remarkMedia, remarkMath],
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
