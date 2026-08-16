/** Funzioni di servizio usate un po' ovunque nel sito. */

/**
 * Costruisce un URL interno tenendo conto di `base` in astro.config.ts.
 * Va usata per ogni link interno: così il sito funziona sia su
 * "username.github.io" sia in un sottopercorso tipo "/blog".
 */
export function link(percorso = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = percorso.startsWith('/') ? percorso : `/${percorso}`;
  return `${base}${p}` || '/';
}

/** Data in italiano, es. "14 agosto 2026". */
export function dataEstesa(data: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(data);
}

/** Data in formato ISO per l'attributo datetime di <time>. */
export function dataISO(data: Date): string {
  return data.toISOString().slice(0, 10);
}

/** Ordina dal più recente al più vecchio. */
export function perDataDecrescente<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

/**
 * In produzione nasconde le bozze; durante `npm run dev` restano visibili,
 * così puoi rileggerle prima di pubblicarle.
 *
 * Decide quali pagine vengono generate.
 */
export function visibile(voce: { data: { draft?: boolean } }): boolean {
  return import.meta.env.DEV || !voce.data.draft;
}

/**
 * Chi compare negli elenchi, nel feed e nelle pagine delle etichette.
 *
 * Esclude anche i post `unlisted`: quelli restano raggiungibili col loro
 * indirizzo, ma non si presentano da soli a chi legge.
 */
export function elencabile(voce: {
  data: { draft?: boolean; unlisted?: boolean };
}): boolean {
  return visibile(voce) && !voce.data.unlisted;
}
