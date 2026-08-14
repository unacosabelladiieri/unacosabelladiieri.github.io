# Una cosa bella di ieri

Blog personale di Vittorio, costruito con [Astro](https://astro.build) e
pubblicato gratuitamente su GitHub Pages all'indirizzo
<https://unacosabelladiieri.github.io>.

I post sono file Markdown normali: si possono scrivere in Obsidian.

Il sito vive in un'organizzazione GitHub dedicata, `unacosabelladiieri`, in modo
da restare separato dal profilo personale e lasciarne libero l'indirizzo.

---

## Pubblicare il sito la prima volta

**1. Crea l'organizzazione.** Su GitHub: menu in alto a destra → *Your
organizations* → **New organization** → piano **Free**. Chiamala esattamente
`unacosabelladiieri`: il nome diventa l'indirizzo del sito. Alla richiesta di
invitare altre persone, salta.

**2. Crea il repository dentro l'organizzazione**, pubblico, chiamato
`unacosabelladiieri.github.io` — stesso nome dell'organizzazione seguito da
`.github.io`, è questo che gli fa prendere l'indirizzo alla radice. Senza
README, senza `.gitignore`, senza licenza: il contenuto arriva dal computer.

**3. Invia il codice:**

```bash
git push -u origin main
```

**4. Accendi la pubblicazione**: nel repository, **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

**5. Attiva i commenti**: vedi più sotto, la sezione *I commenti*.

Da qui in avanti ogni `git push` ripubblica il sito da solo, in un paio di
minuti. Lo stato si vede nella scheda **Actions**.

---

## Lavorare al sito

```bash
npm run dev
```

Apre il sito su <http://localhost:4321> e ricarica a ogni salvataggio. È qui che
si vedono le bozze, che online restano nascoste.

```bash
npm run build
```

Costruisce il sito in `dist/`: utile per controllare che tutto regga prima di
pubblicare.

> Se cambi `astro.config.ts` mentre il server gira, fermalo e riavvialo: la
> configurazione viene letta solo all'avvio.

---

## Scrivere un post

Un file `.md` in `src/content/posts/`, con le eventuali foto **nella stessa
cartella**:

```markdown
---
title: Il titolo del post
date: 2026-08-14
description: Una riga che compare negli elenchi e nel feed RSS.
tags: [mare, agosto]
cover: ./foto-di-apertura.jpeg
---

Il testo, in Markdown normale.
```

Il nome del file diventa l'indirizzo: `eclissi.md` → `/blog/eclissi`.

### Il frontmatter

| Campo         | Obbligatorio | A cosa serve                                   |
| ------------- | ------------ | ---------------------------------------------- |
| `title`       | sì           | titolo del post                                |
| `date`        | sì           | data di pubblicazione (vale anche `pubDate`)   |
| `description` | no           | riassunto per elenchi, feed e anteprime social |
| `tags`        | no           | etichette, con pagina propria (`/tag/mare`)    |
| `cover`       | no           | immagine di apertura, es. `./foto.jpeg`        |
| `coverAlt`    | no           | descrizione dell'immagine di apertura          |
| `math`        | no           | `true` se il post contiene formule             |
| `draft`       | no           | `true` = visibile solo in locale               |
| `comments`    | no           | `false` per togliere i commenti da quel post   |
| `updated`     | no           | data dell'ultima modifica                      |

### Foto, video, note vocali

Tutto con sintassi Markdown standard, quella che Obsidian scrive da sé:

```markdown
![Descrizione della foto](tramonto.jpeg)
![Descrizione della foto](tramonto.jpeg "Questa diventa la didascalia")
![Nota vocale dal treno](nota-vocale.m4a)
![](mare.mp4)

https://youtu.be/4hjLcRNlofY
```

- **Foto** — vengono ridotte e convertite in WebP quando il sito si costruisce:
  si possono mettere direttamente quelle del telefono. Il testo fra parentesi
  quadre è la descrizione per chi non vede l'immagine; la frase fra virgolette,
  se c'è, diventa la didascalia sotto la foto.
- **Audio** (`.m4a`, `.mp3`, `.wav`, `.ogg`) — diventa un lettore; il testo fra
  parentesi quadre fa da titolo.
- **Video propri** (`.mp4`, `.webm`, `.mov`) — diventano un lettore video. GitHub
  rifiuta i file oltre i 100 MB: per le cose lunghe meglio YouTube.
- **YouTube, Shorts e Vimeo** — basta l'indirizzo su una riga per conto suo.

Il meccanismo sta in [`src/lib/remark-media.mjs`](src/lib/remark-media.mjs). In
Obsidian queste righe restano immagini, allegati e link: niente si rompe da
nessuna delle due parti.

### Formule

In LaTeX fra dollari — `$e^{i\pi}+1=0$` in linea, `$$…$$` staccate dal testo —
ricordandosi `math: true` nel frontmatter. Sono calcolate quando il sito si
costruisce, quindi si vedono anche senza JavaScript. Obsidian usa la stessa
sintassi.

### Scrivere in Obsidian

Basta aprire `src/content/posts/` come cartella (o come vault) di Obsidian.
Un'accortezza nelle impostazioni, in **File e collegamenti**:

- **Usa collegamenti \[\[Wiki\]\]**: *disattivato*, così le immagini vengono
  scritte come `![](foto.jpeg)` invece che come `![[foto.jpeg]]`;
- **Percorso predefinito dei nuovi allegati**: *stessa cartella del file*.

Il promemoria `come-si-scrive-un-post.md` è una bozza con tutti gli esempi
funzionanti: si vede solo in locale, e si può cancellare quando non serve più.

---

## Il tema chiaro e scuro

Il sito segue le impostazioni del sistema di chi legge. Il tasto in alto a
destra permette di forzare l'uno o l'altro: la scelta resta salvata in quel
browser e ha la precedenza. I colori si cambiano dalle variabili in cima a
[`src/styles/global.css`](src/styles/global.css).

---

## Le sezioni collaterali

Libri, Musica, Schermo e Viaggi sono gallerie di schede: la copertina è
cliccabile e apre una pagina con il testo e, se vuoi, il rimando a un post.

**Ora sono spente.** Per accenderne una, metti `enabled: true` in
[`src/site.config.ts`](src/site.config.ts). Da spenta, la sezione sparisce dal
menu e le sue pagine non vengono nemmeno generate: i contenuti restano al loro
posto, pronti per quando vorrai riaccenderla.

Una scheda è un file `.md` in `src/content/libri/` (o `musica/`, `schermo/`,
`viaggi/`):

```markdown
---
title: Le otto montagne
subtitle: Paolo Cognetti
cover: ./copertine/le-otto-montagne.jpg
date: 2026-07-28      # quando l'ho letto: ordina la galleria
year: 2016            # anno dell'opera
rating: 5             # facoltativo, da 1 a 5
post: eclissi         # facoltativo: rimando a un post del blog
link: https://…       # facoltativo: collegamento esterno
---

Il testo sulla scheda.
```

Il campo `post` vuole il nome del file del post, senza estensione. Se il post
non esiste, il rimando semplicemente non compare.

Le copertine dei contenuti di esempio sono segnaposto generati a colori: vanno
sostituite con quelle vere, in `src/content/<sezione>/copertine/`.

Per aggiungere una sezione nuova servono tre passaggi: una voce in `sections`
dentro `site.config.ts`, il tipo corrispondente in `Section['slug']`, e una
collection in [`src/content.config.ts`](src/content.config.ts) copiando una
delle esistenti.

---

## I commenti

Sono gestiti da [Giscus](https://giscus.app), che si appoggia alle
**Discussions** del repository: gratis, senza server, senza pubblicità. Chi
commenta deve avere un account GitHub.

Vanno accesi una volta sola, dopo aver creato il repository:

1. nel repository: **Settings → General → Features → Discussions**, spunta;
2. installa <https://github.com/apps/giscus> sul repository
   dell'organizzazione;
3. vai su <https://giscus.app>, inserisci
   `unacosabelladiieri/unacosabelladiieri.github.io` e scorri fino allo
   snippet in fondo alla pagina;
4. copia `data-repo-id` e `data-category-id` dentro `comments` in
   [`src/site.config.ts`](src/site.config.ts);
5. `git push`, e i commenti sono online.

Finché quei due valori sono vuoti i commenti non compaiono, ma il resto del
sito funziona normalmente.

---

## Come è fatto

```
src/
├── site.config.ts      ← titolo, sezioni on/off, commenti: si tocca solo questo
├── content.config.ts   ← struttura dei contenuti
├── content/            ← i testi: posts, libri, musica, schermo, viaggi
├── components/         ← testata, commenti, tasto del tema…
├── layouts/            ← impaginazione di pagine e post
├── pages/              ← gli indirizzi del sito
├── lib/                ← funzioni di servizio e il plugin per i media
└── styles/global.css   ← colori e tipografia, tutti in cima al file
```

Il sito è statico: nessun database, nessun server, nessun tracciamento.

---

## Se un giorno vuoi un dominio tuo

Si compra il dominio, si aggiunge un file `public/CNAME` con dentro solo il
dominio, si imposta il DNS come indicato in Settings → Pages, e si aggiorna
`url` in `src/site.config.ts`. Gli indirizzi dei post non cambiano.
