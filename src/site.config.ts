/**
 * Configurazione centrale del sito.
 * È l'unico file che serve toccare per le impostazioni generali:
 * titolo, autore, URL, commenti e sezioni collaterali.
 */

export const site = {
  title: 'Una cosa bella di ieri',
  // Sottotitolo mostrato in home e nei metadati
  description:
    "Appunti su cose belle, per dimenticarsele qui in attesa di altre. Tutto inizia da un'eclissi.",
  author: 'Vittorio',
  /** Come firmi il copyright in fondo alle pagine. */
  firma: 'v.',
  lang: 'it',
  /**
   * URL pubblico del sito.
   * Per un sito utente (repo "username.github.io") basta questo.
   * Per un repo di progetto va valorizzato anche `base` in astro.config.ts.
   */
  url: 'https://unacosabelladiieri.github.io',
  // Mostrati nel footer. Lascia stringa vuota per nascondere una voce.
  social: {
    email: '',
    // volutamente vuoto: il blog sta per conto suo, staccato dal profilo
    // GitHub accademico. Metti 'unacosabelladiieri' per rimandare
    // all'organizzazione, o il tuo nome utente se cambi idea.
    github: '',
    instagram: '',
  },
} as const;

/**
 * Statistiche di lettura, tenute da GoatCounter: quante visite, quali pagine,
 * da dove arrivano. Sono private (le vedi solo tu, entrando nel tuo pannello),
 * non usa cookie e non profila nessuno — quindi niente banner da mettere.
 *
 * Per accenderle:
 *  1. apri un account gratuito su https://www.goatcounter.com (piano
 *     "Personal", gratuito per uso non commerciale);
 *  2. scegli un codice per il sito: diventerà l'indirizzo del tuo pannello,
 *     per esempio `cosabella` → https://cosabella.goatcounter.com;
 *  3. scrivi quel codice qui sotto, in `codice`.
 *
 * Con `codice` vuoto non viene caricato nulla: il sito resta senza alcuno
 * script di terzi.
 */
export const statistiche = {
  // pannello: https://unacosabelladiieri.goatcounter.com
  codice: 'unacosabelladiieri',
} as const;

/**
 * Commenti tramite Giscus (GitHub Discussions): gratuito, senza server e
 * senza tracciamento pubblicitario.
 *
 * Per attivarli:
 *  1. il repository del sito deve essere pubblico;
 *  2. abilita le Discussions in Settings → General → Features;
 *  3. installa l'app https://github.com/apps/giscus sul repository;
 *  4. vai su https://giscus.app, incolla `username/repository` e copia
 *     i valori `data-repo-id` e `data-category-id` qui sotto;
 *  5. metti `enabled: true`.
 */
export const comments = {
  enabled: true,
  repo: 'unacosabelladiieri/unacosabelladiieri.github.io',
  repoId: 'R_kgDOT4mx9A',
  // In "Announcements" solo tu puoi aprire discussioni: le apre giscus a nome
  // del sito, una per post, e i lettori rispondono lì sotto.
  category: 'Announcements',
  categoryId: 'DIC_kwDOT4mx9M4DDYjl',
  // 'pathname' associa la discussione all'URL del post
  mapping: 'pathname',
  lang: 'it',
} as const;

/**
 * Sezioni collaterali.
 *
 * Ogni sezione è una galleria di schede: la copertina è cliccabile e apre una
 * pagina con il testo sull'opera ed eventualmente il rimando a un post del blog.
 *
 * `enabled: false` la disattiva completamente: sparisce dal menu, le sue pagine
 * non vengono generate e resta fuori da sitemap e feed. I contenuti restano sul
 * disco, pronti per quando vorrai riaccenderla.
 */
export type Section = {
  /** slug usato nell'URL e nome della cartella in src/content/ */
  slug: 'libri' | 'musica' | 'schermo' | 'viaggi';
  /** etichetta nel menu */
  label: string;
  /** testo introduttivo in cima alla galleria */
  intro: string;
  /** proporzione delle copertine nella griglia */
  ratio: 'portrait' | 'square' | 'landscape';
  enabled: boolean;
};

export const sections: Section[] = [
  {
    slug: 'libri',
    label: 'Libri',
    intro: 'Quello che ho letto, con qualche riga su ciascuno.',
    ratio: 'portrait',
    enabled: false,
  },
  {
    slug: 'musica',
    label: 'Musica',
    intro: 'Dischi e canzoni che mi sono rimasti addosso.',
    ratio: 'square',
    enabled: false,
  },
  {
    slug: 'schermo',
    label: 'Schermo',
    intro: 'Film e serie, visti e ripensati.',
    ratio: 'portrait',
    enabled: false,
  },
  {
    slug: 'viaggi',
    label: 'Viaggi',
    intro: 'Posti dove sono stato e che vale la pena raccontare.',
    ratio: 'landscape',
    enabled: false,
  },
];

/** Solo le sezioni attive: usata da menu, rotte, sitemap. */
export const activeSections = sections.filter((s) => s.enabled);

export const getSection = (slug: string): Section | undefined =>
  sections.find((s) => s.slug === slug);
