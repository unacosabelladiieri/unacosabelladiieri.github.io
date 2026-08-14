import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Il blog principale: un file .md o .mdx per post in src/content/posts/.
 * Il nome del file diventa l'URL, salvo `slug` esplicito nel frontmatter.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // data di pubblicazione, es. 2026-08-14
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      /** riassunto: appare nell'elenco, nei metadati social e nel feed RSS */
      description: z.string().optional(),
      /** immagine di apertura, relativa al file del post */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /** true = non compare in elenchi, feed e sitemap */
      draft: z.boolean().default(false),
      /** false = nasconde i commenti su questo singolo post */
      comments: z.boolean().default(true),
      /** true = carica il CSS di KaTeX su questo post (per le formule) */
      math: z.boolean().default(false),
    }),
});

/**
 * Schema condiviso dalle sezioni collaterali (Libri, Musica, Schermo, Viaggi).
 * Ogni scheda ha una copertina cliccabile e una sua pagina di dettaglio.
 */
const schedaSchema = ({ image }: { image: () => any }) =>
  z.object({
    /** titolo dell'opera: libro, disco, film, luogo */
    title: z.string(),
    /** autore, artista, regista, paese… mostrato sotto al titolo */
    subtitle: z.string().optional(),
    /** copertina: immagine accanto al file .mdx, es. ./copertine/foo.jpg */
    cover: image().optional(),
    coverAlt: z.string().optional(),
    /** data in cui l'ho letto/ascoltato/visto/visitato: ordina la galleria */
    date: z.coerce.date(),
    /** anno dell'opera, mostrato nella scheda */
    year: z.number().optional(),
    /** valutazione facoltativa da 1 a 5, mostrata come pallini */
    rating: z.number().min(1).max(5).optional(),
    /**
     * Rimando a un post del blog: lo slug del file in src/content/posts/.
     * La scheda mostrerà un link "Ne ho scritto qui".
     */
    post: z.string().optional(),
    /** link esterno facoltativo (es. l'album su Bandcamp) */
    link: z.string().url().optional(),
    linkLabel: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  });

const libri = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/libri' }),
  schema: schedaSchema,
});

const musica = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/musica' }),
  schema: schedaSchema,
});

const schermo = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/schermo' }),
  schema: schedaSchema,
});

const viaggi = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/viaggi' }),
  schema: schedaSchema,
});

export const collections = { posts, libri, musica, schermo, viaggi };
