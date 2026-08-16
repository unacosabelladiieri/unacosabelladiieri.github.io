---
title: Come si scrive un post (promemoria per me)
date: 2026-08-13
description: Tutto quello che si può mettere dentro un post — foto, video, note vocali, formule — con gli esempi copiabili.
tags: [appunti, istruzioni]
math: true
draft: true
---

Questo post è il mio promemoria: ogni cosa che il sito sa fare, con l'esempio
accanto. Quando non ricordo come si incolla un video, torno qui.

È una **bozza**: la vedo solo io, aprendo il sito in locale con `npm run dev`.
Online non compare e non finisce né nel feed né in Google. Per pubblicarlo
basterebbe togliere la riga `draft: true`.

Tutto è Markdown normale, quindi si può scrivere in Obsidian senza sorprese.

## Il frontmatter

In cima a ogni file, fra due righe di trattini:

```yaml
---
title: Il titolo del post
date: 2026-08-13
description: Una riga che compare negli elenchi e nel feed.
tags: [musica, trieste]
math: true        # solo se il post contiene formule
draft: true       # bozza: la vedo in locale, non finisce online
comments: false   # per togliere i commenti da questo post
---
```

Servono solo `title` e la data. Il resto è facoltativo. Al posto di `date` si
può scrivere `pubDate`: valgono uguale.

Il nome del file diventa l'indirizzo: `come-si-scrive-un-post.md` →
`/blog/come-si-scrive-un-post`.

## Il testo

Markdown, che è quasi solo testo normale: *corsivo* con un asterisco,
**grassetto** con due, [un collegamento](https://astro.build) fra parentesi
quadre e tonde.

- elenchi puntati con un trattino
- va a capo da solo

1. e numerati con i numeri
2. la numerazione si sistema da sé

> Le citazioni con il maggiore, come questa.

### Titoli

Un cancelletto per il titolo grande, due per i paragrafi, tre per le
sottosezioni. Il titolo del post arriva già dal frontmatter, quindi nel testo si
comincia da `##`.

## Dove vanno foto, audio e video

Tutti in `src/content/posts/allegati/`, in un mucchio solo. In Obsidian si
imposta una volta e poi non ci si pensa più: *Impostazioni → File e
collegamenti → Percorso predefinito per i nuovi allegati → **nella cartella
specificata sotto***, e lì si scrive `allegati`.

Funziona anche tenerli accanto al post, se un giorno preferissi così: il sito
li cerca in tutti e due i posti.

## Le foto

Si richiamano come in qualsiasi Markdown:

```markdown
![Il sole che cala dietro il molo](allegati/tramonto.jpeg)
```

Se dopo il nome del file si aggiunge una frase fra virgolette, quella diventa la
didascalia sotto la foto:

```markdown
![Il sole che cala dietro il molo](allegati/tramonto.jpeg "Molo Audace, luglio")
```

E viene fuori così:

![Il sole che cala su un trabocco](allegati/tramonto.jpeg "Punta Aderci, 12 agosto")

Il testo fra parentesi quadre è la descrizione per chi non può vedere
l'immagine: vale la pena scriverla comunque.

Le foto vengono ridotte e convertite in WebP quando il sito si costruisce:
si possono caricare direttamente quelle del telefono, senza pensarci.

## I video

Basta incollare l'indirizzo di YouTube su una riga per conto suo, senza altro
intorno:

```markdown
https://youtu.be/4hjLcRNlofY
```

https://youtu.be/4hjLcRNlofY

Funzionano allo stesso modo gli Shorts e Vimeo. In Obsidian resta un link
normale, cliccabile.

Per un video mio si usa la sintassi delle immagini, che il sito riconosce
dall'estensione:

```markdown
![](allegati/mare.mp4)
```

Sopra i 100 MB GitHub rifiuta il file, quindi per le cose lunghe meglio YouTube.

## Le note vocali

Uguale, con il file in `allegati/` — va bene il `.m4a` dei memo vocali del
telefono:

```markdown
![Nota vocale, sul treno per Venezia](allegati/nota-13-agosto.m4a)
```

Il testo fra parentesi quadre diventa il titolo sopra al lettore.

## Le formule

In LaTeX fra simboli di dollaro. In linea, $e^{i\pi} + 1 = 0$, oppure staccate
dal testo con due dollari:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

Anche cose più elaborate:

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

L'unica accortezza è `math: true` nel frontmatter: serve a caricare i caratteri
di KaTeX soltanto nei post che ne hanno bisogno.

Le formule vengono calcolate quando il sito si costruisce, non nel browser di
chi legge: sono immediate e si vedono anche senza JavaScript. Obsidian usa la
stessa sintassi, quindi le vedi già mentre scrivi.

## Il codice

Con tre apici, indicando il linguaggio:

```python
def cosa_bella(giorno):
    """Restituisce una cosa bella del giorno, se ce n'è una."""
    return next((c for c in giorno.cose if c.bella), None)
```

## Le tabelle

| Cosa          | Come si scrive                            |
| ------------- | ----------------------------------------- |
| Foto          | `![descrizione](allegati/foto.jpeg)`      |
| Didascalia    | `![descrizione](allegati/foto.jpeg "…")`  |
| Nota vocale   | `![titolo](allegati/nota.m4a)`            |
| Video mio     | `![](allegati/mare.mp4)`                  |
| YouTube       | l'indirizzo su una riga da solo           |

## Le bozze

`draft: true` tiene il post fuori dal sito pubblico ma visibile in locale.
Quando è pronto, si toglie la riga.
