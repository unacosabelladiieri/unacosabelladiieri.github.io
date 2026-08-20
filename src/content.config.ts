import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const CARTELLA_POST = 'src/content/posts';
const ESTENSIONI_IMMAGINE = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

/**
 * Sistema il percorso della copertina prima che Astro provi ad aprirla.
 *
 * Fa due cortesie, perché sbagliare qui ferma la costruzione dell'intero
 * sito e il messaggio d'errore arriva solo dopo il push:
 *
 *  - accetta la barra iniziale (`/allegati/foto.jpg`), che scrivono certi
 *    editor esterni;
 *  - se il file non c'è ma esiste con un'altra estensione — il classico
 *    `.jpg` scritto al posto di `.jpeg` — usa quella giusta.
 *
 * Se non trova proprio nulla lascia il valore com'era, così l'errore di
 * Astro resta chiaro e indica il nome che avevi scritto.
 */
function risolviCopertina(valore: unknown): unknown {
  if (typeof valore !== 'string' || valore.startsWith('http')) return valore;

  const relativo = valore.startsWith('/') ? `.${valore}` : valore;
  const suDisco = (percorso: string) =>
    join(CARTELLA_POST, percorso.replace(/^\.\//, ''));

  if (existsSync(suDisco(relativo))) return relativo;

  // negli indirizzi gli spazi diventano %20: "foto%201.jpeg" è "foto 1.jpeg"
  try {
    const decodificato = decodeURIComponent(relativo);
    if (decodificato !== relativo && existsSync(suDisco(decodificato)))
      return decodificato;
  } catch {
    // codifica malformata: si prosegue con gli altri tentativi
  }

  const senzaEstensione = relativo.replace(/\.[^./]+$/, '');
  for (const estensione of ESTENSIONI_IMMAGINE) {
    const tentativo = `${senzaEstensione}${estensione}`;
    if (existsSync(suDisco(tentativo))) return tentativo;
  }

  return relativo;
}

/**
 * Il blog principale: un file .md o .mdx per post in src/content/posts/.
 * Il nome del file diventa l'URL, salvo `slug` esplicito nel frontmatter.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
      title: z.string(),
      /** data di pubblicazione, es. 2026-08-14 — va bene anche `pubDate` */
      date: z.coerce.date().optional(),
      pubDate: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      /** riassunto: appare nell'elenco, nei metadati social e nel feed RSS */
      description: z.string().optional(),
      /**
       * Immagine di apertura, indicata come percorso relativo al post.
       *
       * Il `preprocess` accetta anche la forma con la barra iniziale
       * (`/allegati/foto.jpg`): è quella che scrivono certi editor esterni,
       * e senza questa tolleranza la costruzione del sito fallirebbe.
       */
      cover: z.preprocess(risolviCopertina, image().optional()).optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /** true = non viene proprio pubblicato: si vede solo in locale */
      draft: z.boolean().default(false),
      /**
       * true = pubblicato e raggiungibile da chiunque abbia l'indirizzo, ma
       * fuori dagli elenchi, dal feed e dai motori di ricerca. Serve per le
       * pagine di servizio, tipo il promemoria su come si scrivono i post.
       */
      unlisted: z.boolean().default(false),
      /** false = nasconde i commenti su questo singolo post */
      comments: z.boolean().default(true),
      /** true = carica il CSS di KaTeX su questo post (per le formule) */
      math: z.boolean().default(false),
      })
      // `date` e `pubDate` sono intercambiabili: vale quella che c'è
      .transform((dati, ctx) => {
        const date = dati.date ?? dati.pubDate;
        if (!date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Manca la data: aggiungi `date` (o `pubDate`) nel frontmatter.',
          });
          return z.NEVER;
        }
        return { ...dati, date };
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
