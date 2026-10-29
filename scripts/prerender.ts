/**
 * SpaceSavvy prerender (runs after `vite build`).
 *
 * Your site is a single-page React app: without this, every URL returns the same
 * empty index.html with the homepage title. Google, Pinterest, Facebook and AI
 * search crawlers then see no article text and the wrong title.
 *
 * This script writes a real HTML file for every page (dist/blog/<slug>/index.html etc.)
 * with the correct title, description, canonical URL, social-share tags, structured
 * data and the article text. React still loads on top and takes over as normal.
 * It also writes a fresh dist/sitemap.xml so new articles are always included.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { posts, type Post } from '../src/data/posts';

const SITE = 'https://spacesavvy-olive.vercel.app';
const SANITY_URL =
  'https://h67xdo8v.apicdn.sanity.io/v2024-01-01/data/query/production';
const DIST = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');
const today = new Date().toISOString().slice(0, 10);

// [text](url) -> <a> (applied to already-escaped text)
const links = (s: string) =>
  s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const plain = (s = '') => String(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const clip = (s = '', n = 158) => {
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
};

const CATEGORY_SLUG: Record<string, string> = {
  'Small Space Living': 'small-spaces',
  'Kitchen & Dining': 'kitchen-dining',
  'Compact Workspaces': 'workspaces',
  'Gaming Setups': 'gaming-setups',
  'Holiday Decor': 'holiday-decor',
  'Curated Amazon Finds': 'amazon-finds',
};

interface PageMeta {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: object[];
  body?: string; // static HTML placed inside #root for crawlers
}

function render(page: PageMeta): string {
  const url = SITE + page.path;
  const fullTitle = page.title.includes('SpaceSavvy') ? page.title : `${page.title} | SpaceSavvy`;
  const desc = clip(page.description);
  let html = template;

  const setTag = (re: RegExp, replacement: string) => {
    html = re.test(html) ? html.replace(re, replacement) : html.replace('</head>', `  ${replacement}\n  </head>`);
  };

  setTag(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`);
  setTag(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`);
  setTag(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />`);
  setTag(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${page.type || 'website'}" />`);
  setTag(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
  setTag(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(fullTitle)}" />`);
  setTag(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`);
  setTag(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`);
  setTag(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(desc)}" />`);
  if (page.image) {
    setTag(/<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${esc(page.image)}" />`);
    setTag(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(page.image)}" />`);
    // Article images are a different size than the default homepage image.
    html = html.replace(/\s*<meta property="og:image:(width|height|alt)"[^>]*>/g, '');
  }
  if (page.jsonLd?.length) {
    const ld = page.jsonLd
      .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
      .join('\n    ');
    html = html.replace('</head>', `    ${ld}\n  </head>`);
  }
  if (page.body) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div style="max-width:720px;margin:0 auto;padding:24px 16px;font-family:system-ui,sans-serif;color:#44403c;line-height:1.6">${page.body}</div></div>`,
    );
  }
  return html;
}

function write(path: string, html: string) {
  // "/blog/x" -> dist/blog/x.html (served at /blog/x thanks to cleanUrls in vercel.json)
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path.replace(/^\//, '') + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ---------- Articles ----------
interface ArticleLike {
  slug: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  date?: string;
  takeaway?: string;
  intro?: string[];
  atAGlance?: { label: string; pick: string }[];
  situations?: { situation: string; pick: string }[];
  mistakes?: string[];
  keyTakeaways?: string[];
  related?: { slug: string; title: string }[];
  pins?: { src: string; alt: string }[];
  sections: {
    title: string;
    body: string;
    productName?: string;
    productUrl?: string;
    image?: string;
    imageAlt?: string;
    group?: string;
    groupAnswer?: string;
    alsoGood?: { label: string; name: string; affiliateUrl: string }[];
  }[];
  faqs: { question: string; answer: string }[];
}

const abs = (u?: string) => (u && u.startsWith('/') ? SITE + u : u);

function articlePage(a: ArticleLike): PageMeta {
  const url = `${SITE}/blog/${a.slug}`;
  a = { ...a, image: abs(a.image) };
  const catSlug = CATEGORY_SLUG[a.category];
  const parsedDate = a.date ? new Date(a.date) : null;
  const isoDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: clip(plain(a.description)),
      image: a.image ? [a.image] : undefined,
      datePublished: isoDate,
      dateModified: isoDate,
      author: { '@type': 'Organization', name: 'SpaceSavvy', url: `${SITE}/about` },
      publisher: { '@type': 'Organization', name: 'SpaceSavvy', url: SITE },
      mainEntityOfPage: url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        ...(catSlug
          ? [{ '@type': 'ListItem', position: 2, name: a.category, item: `${SITE}/category/${catSlug}` }]
          : []),
        { '@type': 'ListItem', position: catSlug ? 3 : 2, name: a.title, item: url },
      ],
    },
  ];
  if (a.faqs.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: a.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  const hasGroups = a.sections.some((s) => s.group);
  const pinHtml = (p?: { src: string; alt: string }) =>
    p ? `<p><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="800" height="1200" loading="lazy" style="max-width:360px;width:100%;height:auto" /></p>` : '';
  const sectionsHtml = a.sections
    .map((s) => {
      const paras = String(s.body || '')
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p) => {
          const ls = p.split('\n').map((l) => l.trim()).filter(Boolean);
          if (ls.length > 1 && ls.every((l) => l.startsWith('- ')))
            return `<ul>${ls.map((l) => `<li>${links(esc(l.slice(2)))}</li>`).join('')}</ul>`;
          if (ls.length > 1 && ls.every((l) => /^\d+\.\s/.test(l)))
            return `<ol>${ls.map((l) => `<li>${links(esc(l.replace(/^\d+\.\s/, '')))}</li>`).join('')}</ol>`;
          if (ls[0]?.startsWith('### ')) return `<h3>${esc(ls[0].slice(4))}</h3>`;
          return `<p>${links(esc(p))}</p>`;
        })
        .join('');
      const img = s.image ? `<img src="${esc(s.image)}" alt="${esc(s.imageAlt || s.title)}" loading="lazy" style="max-width:100%;height:auto" />` : '';
      const product = s.productName
        ? `<p><a href="${esc(s.productUrl || '#')}" rel="sponsored nofollow noopener">${esc(s.productName)} – check price on Amazon</a></p>`
        : '';
      const also = s.alsoGood?.length
        ? `<p>Also good: ${s.alsoGood
            .map((g) => `${esc(g.label)}: <a href="${esc(g.affiliateUrl)}" rel="sponsored nofollow noopener">${esc(g.name)}</a>`)
            .join(' · ')}</p>`
        : '';
      const head = hasGroups ? `<h3>${esc(s.title)}</h3>` : `<h2>${esc(s.title)}</h2>`;
      return `${s.group ? `<h2>${esc(s.group)}</h2>${s.groupAnswer ? `<p>${links(esc(s.groupAnswer))}</p>` : ''}` : ''}${head}${paras}${img}${product}${also}`;
    })
    .join('');
  const faqHtml = a.faqs.length
    ? `<h2>Frequently Asked Questions</h2>${a.faqs.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('')}`
    : '';

  const body =
    `<nav><a href="/">Home</a>${catSlug ? ` › <a href="/category/${catSlug}">${esc(a.category)}</a>` : ''}</nav>` +
    `<h1>${esc(a.title)}</h1><p>By SpaceSavvy</p>` +
    `<p><em>As an Amazon Associate I earn from qualifying purchases.</em></p>` +
    (a.takeaway ? `<p><strong>The SpaceSavvy Takeaway:</strong> ${esc(a.takeaway)}</p>` : '') +
    (a.intro || []).map((p) => `<p>${links(esc(p))}</p>`).join('') +
    pinHtml(a.pins?.[0]) +
    (a.atAGlance?.length
      ? `<h2>At a Glance: Our Top Picks</h2><ul>${a.atAGlance.map((g) => `<li><strong>${esc(g.label)}:</strong> ${links(esc(g.pick))}</li>`).join('')}</ul>`
      : '') +
    (a.situations?.length
      ? `<h2>Pick Your Situation</h2><ul>${a.situations.map((s) => `<li><strong>${esc(s.situation)}:</strong> ${links(esc(s.pick))}</li>`).join('')}</ul>`
      : '') +
    sectionsHtml +
    pinHtml(a.pins?.[1]) +
    (a.keyTakeaways?.length ? `<h2>Key Takeaways</h2><ul>${a.keyTakeaways.map((k) => `<li>${links(esc(k))}</li>`).join('')}</ul>` : '') +
    (a.mistakes?.length ? `<h2>Mistakes to Avoid</h2><ul>${a.mistakes.map((m) => `<li>${links(esc(m))}</li>`).join('')}</ul>` : '') +
    (a.related?.length
      ? `<h2>Keep Reading</h2><ul>${a.related.map((r) => `<li><a href="/blog/${esc(r.slug)}">${esc(r.title)}</a></li>`).join('')}</ul>`
      : '') +
    faqHtml;

  return {
    path: `/blog/${a.slug}`,
    title: a.title,
    description: a.description || a.takeaway || a.title,
    image: a.image,
    type: 'article',
    jsonLd,
    body,
  };
}

const fromStatic = (p: Post): ArticleLike => ({
  slug: p.slug,
  title: p.title,
  description: p.excerpt,
  category: p.category,
  image: p.featuredImageSrc,
  date: p.publishDate,
  takeaway: p.takeaway,
  intro: p.intro,
  atAGlance: p.atAGlance,
  situations: p.situations,
  mistakes: p.mistakes,
  keyTakeaways: p.keyTakeaways,
  related: (p.related || [])
    .map((r) => posts.find((q) => q.slug === r))
    .filter((q): q is Post => Boolean(q))
    .map((q) => ({ slug: q.slug, title: q.title })),
  pins: p.pins,
  sections: p.sections.map((s) => ({
    title: s.title,
    body: s.body,
    image: s.image,
    imageAlt: s.imageAlt,
    productName: s.product?.name,
    productUrl: s.product?.affiliateUrl,
    group: s.group,
    groupAnswer: s.groupAnswer,
    alsoGood: s.alsoGood,
  })),
  faqs: p.faqs || [],
});

async function sanityArticles(): Promise<ArticleLike[]> {
  const query = `*[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    "title": coalesce(title, postTitle),
    "seoTitle": seoTitle,
    "description": coalesce(seoDescription, excerpt, takeaway, keyTakeaway),
    category,
    "takeaway": coalesce(takeaway, keyTakeaway),
    "image": coalesce(mainImage.asset->url, featuredImage.asset->url),
    "date": coalesce(publishedAt, publishDate, _createdAt),
    body,
    "sections": coalesce(sections, articleSections)[]{
      "title": coalesce(title, sectionTitle),
      "body": coalesce(body, bodyText),
      "productName": coalesce(product.name, amazonProductCallout.productName),
      "productUrl": coalesce(product.affiliateUrl, amazonProductCallout.amazonAffiliateUrl)
    },
    "faqs": faqs[]{question, answer}
  }`;
  try {
    const res = await fetch(`${SANITY_URL}?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { result } = (await res.json()) as { result: any[] };
    return (result || []).map((d) => {
      let sections = (d.sections || []).filter((s: any) => s && s.title);
      // Portable-text body: turn headings + paragraphs into sections
      if (!sections.length && Array.isArray(d.body)) {
        let cur: any = { title: '', body: '' };
        for (const block of d.body) {
          if (block._type === 'block') {
            const text = (block.children || []).map((c: any) => c.text).join('');
            if (block.style === 'h2') {
              if (cur.title || cur.body) sections.push(cur);
              cur = { title: text, body: '' };
            } else if (text.trim()) {
              cur.body += (cur.body ? '\n\n' : '') + text;
            }
          } else if (block._type === 'productCard' && block.productName) {
            cur.productName = block.productName;
            cur.productUrl = block.affiliateUrl;
          }
        }
        if (cur.title || cur.body) sections.push(cur);
      }
      return {
        slug: d.slug,
        title: d.seoTitle || d.title || d.slug,
        description: d.description || '',
        category: d.category || 'Small Space Living',
        image: d.image,
        date: d.date,
        takeaway: d.takeaway,
        sections,
        faqs: (d.faqs || []).filter((f: any) => f && f.question),
      } as ArticleLike;
    });
  } catch (err) {
    console.warn('[prerender] Could not load Sanity posts, skipping them:', (err as Error).message);
    return [];
  }
}

// ---------- Static pages ----------
const staticPages: PageMeta[] = [
  { path: '/shop', title: 'Curated Home Essentials & Apartment Storage Finds', description: 'Smart storage solutions, compact furniture, and functional organizers to help you clear clutter and streamline your space.' },
  { path: '/about', title: 'About SpaceSavvy - Our Story & How We Pick Products', description: 'Simple ideas for a calmer, better-organized home. Learn how SpaceSavvy picks renter-friendly storage, compact furniture layouts, and home decor.' },
  { path: '/affiliate-disclosure', title: 'Affiliate Disclosure', description: "SpaceSavvy's FTC and Amazon Associates disclosure. As an Amazon Associate I earn from qualifying purchases." },
  { path: '/privacy-policy', title: 'Privacy Policy & Cookie Disclosures', description: "SpaceSavvy's privacy policy, cookie information, and how visitor data is handled." },
  { path: '/terms', title: 'Terms of Service & Rental Advisory', description: "SpaceSavvy's terms of service, editorial use conditions, and landlord wall-safety advisory." },
  { path: '/ai-disclaimer', title: 'AI & Synthetic Media Statement', description: 'How SpaceSavvy uses AI for research, drafts and illustrations, and how products are checked before publishing.' },
  { path: '/sitemap', title: 'Sitemap', description: 'Every SpaceSavvy guide and page in one place.' },
];
const categoryPages: PageMeta[] = [
  { path: '/category/small-spaces', title: 'Small Space Living Ideas for Studios & Apartments', description: 'Studio layouts, multipurpose furniture and renter-friendly styling ideas for small apartments.' },
  { path: '/category/kitchen-dining', title: 'Small Kitchen & Dining Organization Ideas', description: 'Counter risers, magnetic storage, pantry and cabinet organization ideas for small apartment kitchens.' },
  { path: '/category/workspaces', title: 'Compact Workspace & Small Desk Ideas', description: 'Desk setups for apartment corners and nooks, with clamp-on and no-drill gear for small spaces.' },
  { path: '/category/gaming-setups', title: 'Small Gaming Room & Gaming Setup Ideas', description: 'Gaming room and desk setup ideas for small apartments and bedrooms, with clamp-on, no-drill gear that saves space.' },
  { path: '/category/holiday-decor', title: 'Holiday Decor Ideas for Small Apartments', description: 'No-drill Christmas decor, small-space tree ideas and holiday storage for renters.' },
  { path: '/category/amazon-finds', title: 'Curated Amazon Finds for Small Apartments', description: 'Renter-friendly Amazon storage and organization picks for small apartments.' },
];

// ---------- Run ----------
const sanity = await sanityArticles();
const staticSlugs = new Set(posts.map((p) => p.slug));
const articles = [...posts.map(fromStatic), ...sanity.filter((a) => !staticSlugs.has(a.slug))];

// Homepage: fix canonical/og:url and add a crawlable list of articles
write(
  '/',
  render({
    path: '/',
    title: 'SpaceSavvy - Small Apartment Organization & Home Hacks',
    description: 'Renter-friendly storage ideas, small apartment layouts, compact desk setups and curated Amazon finds for small spaces.',
    body:
      '<h1>SpaceSavvy: Small Apartment Organization & Home Hacks</h1><ul>' +
      articles.map((a) => `<li><a href="/blog/${esc(a.slug)}">${esc(a.title)}</a></li>`).join('') +
      '</ul>',
  }),
);
for (const p of [...staticPages, ...categoryPages]) write(p.path, render(p));
for (const a of articles) write(`/blog/${a.slug}`, render(articlePage(a)));

// Sitemap
const urls = [
  { loc: '/', pri: '1.0' },
  ...categoryPages.map((p) => ({ loc: p.path, pri: '0.8' })),
  ...articles.map((a) => ({ loc: `/blog/${a.slug}`, pri: '0.9' })),
  ...staticPages.map((p) => ({ loc: p.path, pri: '0.5' })),
];
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.pri}</priority>\n  </url>`)
      .join('\n') +
    `\n</urlset>\n`,
);

console.log(`[prerender] wrote ${articles.length} articles, ${staticPages.length + categoryPages.length + 1} other pages, sitemap with ${urls.length} URLs`);
