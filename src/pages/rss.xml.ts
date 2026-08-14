import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

import { site } from '../site.config';
import { perDataDecrescente, visibile } from '../lib/utils';

export async function GET(context: APIContext) {
  const post = (await getCollection('posts')).filter(visibile).sort(perDataDecrescente);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: false,
    items: post.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.date,
      link: `/blog/${p.id}`,
      categories: p.data.tags,
    })),
    customData: `<language>${site.lang}</language>`,
  });
}
