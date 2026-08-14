# Una cosa bella di ieri

Blog personale, costruito con [Astro](https://astro.build) e pubblicato
gratuitamente su GitHub Pages.

---

## Da fare la prima volta

### 1. Metti il tuo nome utente

In [`src/site.config.ts`](src/site.config.ts) sostituisci `USERNAME` con il tuo
nome utente GitHub, sia in `url` sia in `comments.repo`. Nello stesso file ci
sono anche titolo, sottotitolo e collegamenti del footer.

### 2. Crea il repository e pubblica

Il repository deve chiamarsi **`nomeutente.github.io`** (con il tuo nome utente
al posto di `nomeutente`): è quello che dà l'indirizzo gratuito
`https://nomeutente.github.io`.

```bash
gh repo create nomeutente.github.io --public --source=. --remote=origin --push
```

Senza `gh`, crea il repository a mano su github.com e poi:

```bash
git remote add origin https://github.com/nomeutente/nomeutente.github.io.git
git branch -M main
git push -u origin main
```

### 3. Accendi GitHub Pages

Nel repository: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.

Da qui in avanti ogni `git push` ripubblica il sito da solo, in un paio di
minuti. Lo stato si controlla nella scheda **Actions**.

> Se preferisci un repository con un altro nome (es. `blog`), il sito finirà su
> `https://nomeutente.github.io/blog`: in quel caso scommenta la riga `base` in
> [`astro.config.ts`](astro.config.ts).

---

## Lavorare al sito

```bash
npm run dev
```

Apre il sito su <http://localhost:4321> e ricarica a ogni salvataggio.

```bash
npm run build
```

Costruisce il sito in `dist/` — utile per controllare che tutto regga prima di
pubblicare.

---

## Scrivere

### Un post

Crea un file in `src/content/posts/`, con estensione `.mdx`:

```mdx
---
title: Il titolo del post
date: 2026-08-14
description: Una riga che compare negli elenchi e nel feed RSS.
tags: [musica, trieste]
---

Il testo, in Markdown.
```

Il nome del file diventa l'indirizzo: `sabato-sera.mdx` → `/blog/sabato-sera`.

Campi disponibili nel frontmatter:

| Campo         | Obbligatorio | A cosa serve                                       |
| ------------- | ------------ | -------------------------------------------------- |
| `title`       | sì           | titolo del post                                    |
| `date`        | sì           | data di pubblicazione, ordina gli elenchi          |
| `description` | no           | riassunto per elenchi, feed e anteprime social     |
| `tags`        | no           | etichette, con pagina propria (`/tag/musica`)      |
| `cover`       | no           | immagine di apertura, percorso relativo al post    |
| `coverAlt`    | no           | descrizione dell'immagine di apertura              |
| `math`        | no           | `true` se il post contiene formule                 |
| `draft`       | no           | `true` = visibile solo in locale                   |
| `comments`    | no           | `false` per togliere i commenti da quel post       |
| `updated`     | no           | data dell'ultima modifica                          |

### Cosa si può mettere dentro un post

Questi componenti si usano direttamente, senza importarli:

```mdx
<Figure src="/immagini/foto.jpg" alt="Descrizione" >Didascalia</Figure>
<YouTube id="4hjLcRNlofY" title="Titolo del video" />
<Audio src="/audio/nota.m4a" titolo="Nota vocale" />
<Video src="/video/mare.mp4" />
```

Per le foto conviene tenerle accanto al post e importarle: vengono ridotte e
convertite in WebP durante la build.

```mdx
import foto from './nome-del-post/foto.jpg';

<Figure src={foto} alt="Descrizione" />
```

Le formule si scrivono in LaTeX fra dollari — `$e^{i\pi}+1=0$` in linea, `$$…$$`
staccate — ricordandosi `math: true` nel frontmatter.

Il post [`come-si-scrive-un-post.mdx`](src/content/posts/come-si-scrive-un-post.mdx)
contiene tutti gli esempi funzionanti: si può tenere come promemoria o
cancellare.

### Dove vanno i file

| Cosa                        | Dove                              |
| --------------------------- | --------------------------------- |
| Post                        | `src/content/posts/`              |
| Foto di un post             | accanto al post, in una sottocartella |
| Foto generiche              | `public/immagini/`                |
| Audio e note vocali         | `public/audio/`                   |
| Video propri (max ~100 MB)  | `public/video/`                   |

---

## Le sezioni collaterali

Libri, Musica, Schermo e Viaggi sono gallerie di schede: la copertina è
cliccabile e apre una pagina con il testo e, se vuoi, il rimando a un post.

**Ora sono spente.** Per accenderne una, metti `enabled: true` in
[`src/site.config.ts`](src/site.config.ts). Da spenta, la sezione sparisce dal
menu e le sue pagine non vengono nemmeno generate: i contenuti restano al loro
posto, pronti per quando vorrai riaccenderla.

Una scheda è un file in `src/content/libri/` (o `musica/`, `schermo/`, `viaggi/`):

```mdx
---
title: Le otto montagne
subtitle: Paolo Cognetti
cover: ./copertine/le-otto-montagne.jpg
date: 2026-07-28      # quando l'ho letto: ordina la galleria
year: 2016            # anno dell'opera
rating: 5             # facoltativo, da 1 a 5
post: sabato-sera     # facoltativo: rimando a un post del blog
link: https://…       # facoltativo: collegamento esterno
---

Il testo sulla scheda.
```

Il campo `post` vuole il nome del file del post, senza estensione. Se il post
non esiste, il rimando semplicemente non compare.

Le copertine dei contenuti di esempio sono segnaposto generati a colori: vanno
sostituite con quelle vere (in `src/content/<sezione>/copertine/`).

Per aggiungere una sezione nuova servono tre passaggi: una voce in `sections`
dentro `site.config.ts`, il tipo corrispondente in `Section['slug']`, e una
collection in [`src/content.config.ts`](src/content.config.ts) copiando una
delle esistenti.

---

## I commenti

Sono spenti. Si appoggiano a [Giscus](https://giscus.app), che usa le
**Discussions** del repository: gratis, senza server, senza pubblicità. Chi
commenta deve avere un account GitHub.

Per accenderli:

1. il repository deve essere pubblico;
2. **Settings → General → Features → Discussions**: attiva;
3. installa l'app <https://github.com/apps/giscus> sul repository;
4. vai su <https://giscus.app>, inserisci `nomeutente/nomeutente.github.io` e
   copia i valori `data-repo-id` e `data-category-id` che compaiono in fondo;
5. incollali in `comments` dentro `src/site.config.ts` e metti `enabled: true`.

---

## Come è fatto

```
src/
├── site.config.ts      ← titolo, sezioni on/off, commenti: si tocca solo questo
├── content.config.ts   ← struttura dei contenuti
├── content/            ← i testi: posts, libri, musica, schermo, viaggi
├── components/         ← Figure, YouTube, Audio, Video, Comments…
├── layouts/            ← impaginazione di pagine e post
├── pages/              ← gli indirizzi del sito
└── styles/global.css   ← colori e tipografia, tutti in cima al file
```

Il sito è statico: nessun database, nessun server, nessun tracciamento. Le
formule sono calcolate durante la build, le immagini ridimensionate e convertite
in WebP.

I colori si cambiano dalle variabili in cima a
[`src/styles/global.css`](src/styles/global.css). Tema chiaro e scuro seguono
l'impostazione del sistema di chi legge.

---

## Se un giorno vuoi un dominio tuo

Si compra il dominio, si aggiunge un file `public/CNAME` con dentro solo il
dominio, si imposta il DNS come indicato in Settings → Pages, e si aggiorna
`url` in `src/site.config.ts`. Gli indirizzi dei post non cambiano.
