/**
 * Fa in modo che i post restino Markdown puro — scrivibili e leggibili in
 * Obsidian — senza rinunciare a foto con didascalia, note vocali e video.
 *
 * Le trasformazioni, tutte a partire da sintassi Markdown standard:
 *
 *   ![Descrizione](foto.jpeg "Didascalia")   → figure + figcaption, con
 *                                              l'immagine ottimizzata da Astro
 *   ![](nota-vocale.m4a)                     → lettore audio
 *   ![](mare.mp4)                            → lettore video
 *   https://youtu.be/xxxx  (da solo su una riga) → video incorporato
 *
 * In Obsidian le prime tre restano immagini/allegati e l'ultima un link:
 * niente si rompe da nessuna delle due parti.
 */
import { visit } from 'unist-util-visit';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { indirizzoPubblico } from './media-accanto-ai-post.mjs';

const AUDIO = ['.mp3', '.m4a', '.wav', '.ogg', '.oga', '.aac', '.flac', '.opus'];
const VIDEO = ['.mp4', '.webm', '.mov', '.m4v'];

const estensione = (url = '') => {
  const pulito = url.split('?')[0].split('#')[0].toLowerCase();
  const punto = pulito.lastIndexOf('.');
  return punto === -1 ? '' : pulito.slice(punto);
};

const esterno = (url = '') =>
  /^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('/');

/** "girasoli.jpeg" → "./girasoli.jpeg", perché Astro lo tratti come relativo. */
const normalizza = (url = '') =>
  esterno(url) || url.startsWith('./') || url.startsWith('../') ? url : `./${url}`;

/**
 * Indirizzo di una nota vocale o di un video.
 *
 * Le immagini le prende in carico Astro, che le ottimizza e le copia da sé;
 * audio e video no, quindi li serve l'integrazione media-accanto-ai-post, che
 * li pubblica sotto /media/. Qui si calcola quell'indirizzo.
 */
function indirizzo(url, cartella) {
  if (esterno(url)) return url;

  const pulito = url.replace(/^\.\//, '');
  const suDisco = cartella ? join(cartella, pulito) : null;

  // se il file non è accanto al post, si lascia il percorso com'era scritto:
  // magari punta a public/, dove i file vengono serviti così come sono
  return suDisco && existsSync(suDisco) ? indirizzoPubblico(suDisco) : normalizza(url);
}

const scappa = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Riconosce YouTube, gli Shorts e Vimeo. */
function incorporabile(url) {
  const yt = url.match(
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) {
    const t = url.match(/[?&](?:t|start)=(\d+)/);
    return {
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}${t ? `?start=${t[1]}` : ''}`,
    };
  }

  const vimeo = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo[1]}` };

  return null;
}

const nodoHtml = (value) => ({ type: 'html', value });

const lettoreAudio = (url, titolo) => `
<figure class="audio">
  ${titolo ? `<p class="audio__titolo">${scappa(titolo)}</p>` : ''}
  <audio controls preload="none" src="${scappa(url)}">
    <a href="${scappa(url)}">Scarica l'audio</a>
  </audio>
</figure>`;

const lettoreVideo = (url, titolo) => `
<figure>
  <video src="${scappa(url)}" controls playsinline preload="metadata"></video>
  ${titolo ? `<figcaption>${scappa(titolo)}</figcaption>` : ''}
</figure>`;

const lettoreIncorporato = (src, titolo) => `
<figure class="incorporato">
  <div class="incorporato__cornice">
    <iframe src="${scappa(src)}" title="${scappa(titolo || 'Video')}" loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
  ${titolo ? `<figcaption>${scappa(titolo)}</figcaption>` : ''}
</figure>`;

/** `![[foto.jpeg]]` e `![[foto.jpeg|didascalia]]`, come li scrive Obsidian. */
const WIKILINK = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

/**
 * Traduce i collegamenti Wiki in immagini vere.
 *
 * Se il file richiamato non è accanto al post, il testo viene lasciato
 * com'è e la build avvisa: meglio un avviso in fondo al terminale che
 * l'intero sito che non si costruisce per una foto rimasta indietro.
 */
function espandiWikilink(figli, cartella) {
  const risultato = [];

  for (const figlio of figli) {
    if (figlio.type !== 'text' || !figlio.value.includes('![[')) {
      risultato.push(figlio);
      continue;
    }

    let da = 0;
    for (const trovato of figlio.value.matchAll(WIKILINK)) {
      const [intero, nome, didascalia] = trovato;
      const prima = figlio.value.slice(da, trovato.index);
      if (prima) risultato.push({ type: 'text', value: prima });

      const file = nome.trim();
      if (cartella && existsSync(resolve(cartella, file))) {
        risultato.push({
          type: 'image',
          url: `./${file}`,
          alt: didascalia?.trim() || '',
          title: null,
        });
      } else {
        console.warn(
          `[remark-media] immagine non trovata accanto al post: "${file}" — ` +
            `copiala in ${cartella ?? 'la cartella del post'}`,
        );
        risultato.push({ type: 'text', value: intero });
      }

      da = trovato.index + intero.length;
    }

    const resto = figlio.value.slice(da);
    if (resto) risultato.push({ type: 'text', value: resto });
  }

  return risultato;
}

export function remarkMedia() {
  return (tree, file) => {
    const cartella = file?.path ? dirname(file.path) : null;

    // 0. I collegamenti Wiki diventano immagini, prima di ogni altra cosa.
    visit(tree, 'paragraph', (paragrafo) => {
      paragrafo.children = espandiWikilink(paragrafo.children, cartella);
    });

    // 1. Audio e video scritti come immagini: diventano lettori veri.
    //    Va fatto prima di tutto il resto, così non finiscono dentro un <figure>.
    visit(tree, 'paragraph', (paragrafo) => {
      paragrafo.children = paragrafo.children.map((figlio) => {
        if (figlio.type !== 'image') return figlio;

        const ext = estensione(figlio.url);
        if (!AUDIO.includes(ext) && !VIDEO.includes(ext)) return figlio;

        const didascalia = figlio.title || figlio.alt;
        const url = indirizzo(figlio.url, cartella);

        return nodoHtml(
          AUDIO.includes(ext) ? lettoreAudio(url, didascalia) : lettoreVideo(url, didascalia),
        );
      });
    });

    // 2. Un indirizzo di YouTube o Vimeo da solo su una riga diventa il video.
    visit(tree, 'paragraph', (paragrafo) => {
      if (paragrafo.children.length !== 1) return;
      const solo = paragrafo.children[0];

      const url =
        solo.type === 'link' && solo.children.length === 1 && solo.children[0].type === 'text'
          ? solo.url
          : solo.type === 'text'
            ? solo.value.trim()
            : null;
      if (!url) return;

      const video = incorporabile(url);
      if (!video) return;

      paragrafo.children = [nodoHtml(lettoreIncorporato(video.src, solo.title))];
      paragrafo.data = { ...paragrafo.data, hName: 'div' };
    });

    // 3. Percorsi relativi: Astro li vuole con "./" davanti per ottimizzarli.
    visit(tree, 'image', (immagine) => {
      immagine.url = normalizza(immagine.url);
    });

    // 4. Un'immagine sola in un paragrafo diventa una figura;
    //    il titolo fra virgolette, se c'è, diventa la didascalia.
    visit(tree, 'paragraph', (paragrafo) => {
      const figli = paragrafo.children.filter(
        (f) => !(f.type === 'text' && f.value.trim() === ''),
      );
      if (figli.length !== 1 || figli[0].type !== 'image') return;

      const immagine = figli[0];
      paragrafo.children = [immagine];
      paragrafo.data = { ...paragrafo.data, hName: 'figure' };

      if (immagine.title) {
        paragrafo.children.push({
          type: 'paragraph',
          data: { hName: 'figcaption' },
          children: [{ type: 'text', value: immagine.title }],
        });
        // il titolo è già visibile come didascalia: toglierlo evita
        // che compaia anche come tooltip al passaggio del mouse
        immagine.title = null;
      }
    });
  };
}
