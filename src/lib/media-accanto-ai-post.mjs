/**
 * Fa in modo che note vocali e video tenuti accanto al post funzionino
 * davvero, come già succede per le foto.
 *
 * Astro sa ottimizzare e copiare le immagini dei post, ma di audio e video
 * non si occupa: restano nella cartella dei contenuti e non arrivano mai nel
 * sito costruito. Questa integrazione colma il buco:
 *
 *  - durante `npm run dev` serve i file direttamente da src/content/;
 *  - durante `npm run build` li copia in dist/media/.
 *
 * L'indirizzo pubblico ricalca il percorso dentro src/content, così due post
 * possono avere allegati con lo stesso nome senza pestarsi i piedi:
 *
 *   src/content/posts/FFVII-Prelude.m4a  →  /media/posts/FFVII-Prelude.m4a
 */
import { createReadStream, existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ESTENSIONI_MEDIA = [
  '.m4a',
  '.mp3',
  '.wav',
  '.ogg',
  '.oga',
  '.aac',
  '.flac',
  '.opus',
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
];

const TIPI = {
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.opus': 'audio/opus',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
};

const RADICE = resolve('src/content');

/** Tutti i file audio e video sotto src/content/, a qualsiasi profondità. */
async function cerca(cartella = RADICE, trovati = []) {
  if (!existsSync(cartella)) return trovati;

  for (const voce of await readdir(cartella, { withFileTypes: true })) {
    const percorso = join(cartella, voce.name);
    if (voce.isDirectory()) await cerca(percorso, trovati);
    else if (ESTENSIONI_MEDIA.includes(extname(voce.name).toLowerCase()))
      trovati.push(percorso);
  }

  return trovati;
}

/** Da percorso su disco a indirizzo pubblico: /media/posts/nota.m4a */
export const indirizzoPubblico = (percorso) =>
  `/media/${relative(RADICE, percorso).split(/[\\/]/).join('/')}`;

export function mediaAccantoAiPost() {
  return {
    name: 'media-accanto-ai-post',
    hooks: {
      // in sviluppo: serviti al volo, senza copiarli da nessuna parte
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, res, avanti) => {
          const url = decodeURIComponent((req.url ?? '').split('?')[0]);
          if (!url.startsWith('/media/')) return avanti();

          const percorso = join(RADICE, url.slice('/media/'.length));
          // niente scorciatoie fuori dalla cartella dei contenuti
          if (!percorso.startsWith(RADICE) || !existsSync(percorso)) return avanti();

          res.setHeader(
            'Content-Type',
            TIPI[extname(percorso).toLowerCase()] ?? 'application/octet-stream',
          );
          createReadStream(percorso).pipe(res);
        });
      },

      // in costruzione: copiati dentro il sito
      'astro:build:done': async ({ dir, logger }) => {
        const file = await cerca();
        if (file.length === 0) return;

        for (const origine of file) {
          const destinazione = join(
            fileURLToPath(dir),
            indirizzoPubblico(origine).slice(1),
          );
          await mkdir(dirname(destinazione), { recursive: true });
          await copyFile(origine, destinazione);
        }

        const peso = (
          await Promise.all(file.map(async (f) => (await stat(f)).size))
        ).reduce((a, b) => a + b, 0);

        logger.info(
          `${file.length} file audio/video copiati (${Math.round(peso / 1024)} kB)`,
        );
      },
    },
  };
}
