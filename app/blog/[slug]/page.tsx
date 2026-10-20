import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
  ArrowRight,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { posts, Post, Section, PinItem, AltPick } from '../../../src/data/posts';
import { client } from '../../../src/lib/sanity';
import { subscribeEmail } from '../../../src/lib/subscribe';
import { PortableText } from '@portabletext/react';
import ArticleCard from '../../../src/components/ArticleCard';
import FaqAccordion from '../../../src/components/FaqAccordion';
import ProductCallout from '../../../src/components/ProductCallout';
import SEOHead from '../../../src/components/SEOHead';

interface PageProps {
  params?: {
    slug?: string;
  };
}

interface TocItem {
  id: string;
  text: string;
  level?: number; // 2 = question group, 3 = idea inside a group
}

function slugifyHeading(text: string, index: number): string {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return clean || `section-${index + 1}`;
}

// Capitalizes the first letter of sentences and cleans up lowercase titles
function formatSentenceCase(text?: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

// Automatically numbers section titles ("1. Title") and capitalizes key words if all lowercase
function formatSectionHeading(title?: string, index?: number): string {
  if (!title) return '';
  let clean = title.trim();

  // If the heading is entirely lowercase, convert to clean Title Case
  if (clean === clean.toLowerCase()) {
    const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of']);
    clean = clean
      .split(' ')
      .map((word, idx) => {
        if (idx > 0 && minorWords.has(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  } else {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Add "1. ", "2. " prefix if it doesn't already start with a number
  if (typeof index === 'number' && !/^\d+[\.\)]/.test(clean)) {
    return `${index + 1}. ${clean}`;
  }
  return clean;
}

// Fits any image resolution cleanly without cutting off edges
// Turns [text](/blog/slug) or [text](https://...) inside article text into real links
function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href, bold] = m;
    if (bold) {
      out.push(<strong key={`b${i++}`} className="font-semibold text-stone-900">{bold}</strong>);
      last = m.index + m[0].length;
      continue;
    }
    out.push(
      href.startsWith('/') ? (
        <Link key={`l${i++}`} to={href} className="text-amber-800 font-semibold underline underline-offset-2 hover:text-amber-900">
          {label}
        </Link>
      ) : (
        <a key={`l${i++}`} href={href} target="_blank" rel="noopener noreferrer" className="text-amber-800 font-semibold underline underline-offset-2 hover:text-amber-900">
          {label}
        </a>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Mid-article newsletter box (shown after section 4)
function InlineNewsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || sending) return;
    setSending(true);
    setError('');
    const ok = await subscribeEmail(email);
    setSending(false);
    if (ok) setDone(true);
    else setError('Something went wrong. Please try again.');
  };
  return (
    <aside className="my-4 bg-gradient-to-br from-[#FFF4E6] via-[#FAF3EA] to-[#FDE8D0] border border-amber-300/70 rounded-2xl p-5 sm:p-6">
      <p className="font-serif text-lg font-bold text-stone-900 mb-1">Get the free Small Space Checklist</p>
      <p className="text-sm text-stone-600 mb-3 italic">Renter-friendly storage ideas and new guides, sent to your inbox. Unsubscribe anytime.</p>
      {done ? (
        <p className="text-sm font-semibold text-emerald-800">Almost done! Check your inbox to confirm and get the checklist.</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2.5 rounded-full border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button type="submit" className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer">
            {sending ? 'Sending…' : 'Get the checklist →'}
          </button>
          {error && <p className="text-xs text-red-600 w-full">{error}</p>}
        </form>
      )}
    </aside>
  );
}

// A pin graphic inside the article with a big "Save to Pinterest" button
function PinBlock({ pin, postSlug }: { pin: PinItem; postSlug: string }) {
  const save = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams({
      url: `${window.location.origin}/blog/${postSlug}`,
      media: new URL(pin.src, window.location.origin).href,
      description: pin.description,
    });
    window.open(
      `https://www.pinterest.com/pin/create/button/?${params.toString()}`,
      'pinterest-pin-window',
      'width=750,height=620,toolbar=0,location=0,menubar=0,status=0,scrollbars=yes,resizable=yes'
    );
  };
  return (
    <figure className="my-10 mx-auto w-full max-w-[360px]">
      <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200 bg-white">
        <img
          src={pin.src}
          alt={pin.alt}
          width={800}
          height={1200}
          loading="lazy"
          decoding="async"
          data-pin-description={pin.description}
          className="w-full h-auto block"
        />
      </div>
      <button
        type="button"
        onClick={save}
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white font-bold text-sm py-3 shadow-sm transition-colors cursor-pointer"
      >
        <span aria-hidden="true">📌</span> Save to Pinterest
      </button>
      <figcaption className="mt-2 text-center text-xs text-stone-500">Save this idea so you can find it later</figcaption>
    </figure>
  );
}

// Smaller extra picks under the main product card
function AlsoGood({ picks }: { picks: AltPick[] }) {
  return (
    <div className="-mt-6 mb-2 max-w-xl mx-auto rounded-2xl border border-stone-200 bg-white px-5 py-3.5">
      <p className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold mb-2">Also good</p>
      <ul className="space-y-2">
        {picks.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-snug">
            <span className="shrink-0 mt-0.5 rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-stone-600">
              {p.label}
            </span>
            <a
              href={p.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="text-stone-800 font-semibold underline decoration-amber-400 underline-offset-2 hover:text-amber-800"
            >
              {p.name} <span className="whitespace-nowrap text-amber-700">→ check price</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArticleImage({ imageUrl, title, postCategory, postSlug, productName, alt }: {
  imageUrl: string;
  title: string;
  postCategory: string;
  postSlug: string;
  productName?: string;
  alt?: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;

    const targetUrl = new URL(`/blog/${postSlug}`, window.location.origin).href;
    const mediaUrl = imageUrl;
    const desc = `${title}${productName ? `. ${productName}` : ''} | SpaceSavvy Small Apartment Living Hacks #SpaceSavvy #SmallApartment #ApartmentHacks #InteriorStyling #HomeOrganization`;

    const params = new URLSearchParams({
      url: targetUrl,
      media: mediaUrl,
      description: desc,
    });

    const pinUrl = `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
    const width = 750;
    const height = 620;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      pinUrl,
      'pinterest-pin-window',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,status=0,scrollbars=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(pinUrl, '_blank', 'noopener,noreferrer');
    } else {
      popup.focus();
    }

    setPinned(true);
    setShowToast(true);

    setTimeout(() => {
      setPinned(false);
      setShowToast(false);
    }, 2800);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden my-6 border border-stone-200 shadow-sm group bg-white">
      {!imgError && imageUrl ? (
        <img
          src={imageUrl}
          alt={alt || title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-auto max-h-[540px] object-contain bg-white mx-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5] p-6 flex flex-col justify-between select-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
            {postCategory}
          </span>
          <p className="font-serif font-bold text-stone-900 text-lg leading-snug">
            {title}
          </p>
          <span className="text-xs text-amber-800 font-mono font-bold">
            SpaceSavvy Idea
          </span>
        </div>
      )}

      <motion.button
        type="button"
        onClick={handlePin}
        whileHover={{
          scale: [1, 1.06, 1.02, 1.06],
          boxShadow: [
            "0 4px 6px -1px rgba(220, 38, 38, 0.35), 0 2px 4px -2px rgba(220, 38, 38, 0.3)",
            "0 10px 15px -3px rgba(220, 38, 38, 0.5), 0 4px 6px -4px rgba(220, 38, 38, 0.4)",
            "0 4px 6px -1px rgba(220, 38, 38, 0.35), 0 2px 4px -2px rgba(220, 38, 38, 0.3)"
          ],
          transition: { repeat: Infinity, duration: 1.3, ease: "easeInOut" }
        }}
        whileTap={{ scale: 0.92 }}
        className={`absolute top-3.5 right-3.5 z-20 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-md transition-colors duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 ${
          pinned ? 'bg-stone-900' : 'bg-red-600 hover:bg-red-700'
        } opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100`}
        title={`Save "${title}" to Pinterest`}
        aria-label={`Save "${title}" to Pinterest`}
      >
        {pinned ? (
          <>
            <Check className="h-3 w-3 stroke-[3]" />
            <span className="font-sans whitespace-nowrap text-[11px]">Saved!</span>
          </>
        ) : (
          <>
            <span className="text-[11px] leading-none">📌</span>
            <span className="font-sans whitespace-nowrap text-[11px] tracking-tight">Save</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className="absolute bottom-4 inset-x-3 mx-auto w-fit z-30 flex items-center gap-1.5 bg-stone-900/95 text-white px-3.5 py-1.5 rounded-full shadow-2xl border border-stone-700/60 backdrop-blur-md whitespace-nowrap text-xs font-sans pointer-events-none"
          >
            <span className="text-[10px]">📌</span>
            <span className="font-semibold text-white tracking-tight text-[11px]">Saved to your Board</span>
            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArticleTemplate({ params }: PageProps = {}) {
  const routerParams = useParams<{ slug?: string }>();
  const slug = params?.slug || routerParams.slug;

  const staticMatch = posts.find(p => p.slug === slug);
  const [sanityPost, setSanityPost] = useState<any | null>(null);
  const [loadingSanity, setLoadingSanity] = useState(!staticMatch);

  useEffect(() => {
    async function fetchSanityArticle() {
      if (!slug) return;
      if (posts.some(p => p.slug === slug)) {
        setLoadingSanity(false);
        return;
      }
      try {
        setLoadingSanity(true);
        const data = await client.fetch(
          `*[_type == "post" && slug.current == $slug][0]{
            "slug": slug.current,
            "title": coalesce(title, postTitle),
            seoTitle,
            seoDescription,
            category,
            readTime,
            "takeaway": coalesce(takeaway, keyTakeaway),
            "excerpt": coalesce(seoDescription, excerpt, takeaway, keyTakeaway),
            "publishDate": coalesce(publishedAt, publishDate),
            "featuredImageSrc": coalesce(mainImage.asset->url, featuredImage.asset->url),
            "featuredImageAlt": coalesce(mainImage.alt, featuredImage.alt, title, postTitle),
            body[]{
              ...,
              _type == "image" => {
                "imageUrl": asset->url,
                alt
              },
              _type == "productCard" => {
                productName,
                price,
                dimensions,
                material,
                rating,
                affiliateUrl,
                "productImageUrl": productImage.asset->url
              }
            },
            "sections": coalesce(sections, articleSections)[]{
              "title": coalesce(title, sectionTitle),
              "body": coalesce(body, bodyText),
              "image": coalesce(image.asset->url, sectionImage.asset->url),
              "product": {
                "name": coalesce(product.name, amazonProductCallout.productName),
                "price": coalesce(product.price, amazonProductCallout.price),
                "dimensions": coalesce(product.dimensions, amazonProductCallout.dimensions),
                "material": coalesce(product.material, amazonProductCallout.material),
                "rating": coalesce(product.rating, amazonProductCallout.rating),
                "affiliateUrl": coalesce(product.affiliateUrl, amazonProductCallout.amazonAffiliateUrl),
                "image": coalesce(product.productImage.asset->url, amazonProductCallout.productWhiteBgPhoto.asset->url)
              }
            },
            faqs[]{
              question,
              answer
            }
          }`,
          { slug }
        );

        if (data) {
          setSanityPost(data);
        } else {
          setSanityPost(null);
        }
      } catch (err) {
        console.error('Error fetching post from Sanity:', err);
      } finally {
        setLoadingSanity(false);
      }
    }

    fetchSanityArticle();
  }, [slug]);

  const activePost = staticMatch || sanityPost;

  // Automatically build Table of Contents from H2/H3 blocks OR structured sections
  const tocItems: TocItem[] = useMemo(() => {
    if (!activePost) return [];

    if (activePost.body && Array.isArray(activePost.body) && activePost.body.length > 0) {
      const headings: TocItem[] = [];
      let h2Index = 0;
      activePost.body.forEach((block: any) => {
        if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
          const rawText = (block.children || []).map((c: any) => c.text).join('').trim();
          if (rawText) {
            const formattedText = block.style === 'h2'
              ? formatSectionHeading(rawText, h2Index++)
              : formatSectionHeading(rawText);
            headings.push({
              id: slugifyHeading(rawText, headings.length),
              text: formattedText
            });
          }
        }
      });
      return headings;
    }

    if (activePost.sections && Array.isArray(activePost.sections)) {
      const hasGroups = activePost.sections.some((s: any) => s && s.group);
      const items: TocItem[] = [];
      activePost.sections.forEach((s: any, idx: number) => {
        if (!s || !s.title) return;
        if (s.group) items.push({ id: slugifyHeading(s.group, idx), text: s.group, level: 2 });
        items.push({ id: slugifyHeading(s.title, idx), text: formatSectionHeading(s.title, idx), level: hasGroups ? 3 : 2 });
      });
      return items;
    }

    return [];
  }, [activePost]);

  const [activeId, setActiveId] = useState<string>('');
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [sidebarSubscribed, setSidebarSubscribed] = useState(false);
  const [sidebarSending, setSidebarSending] = useState(false);
  const [sidebarError, setSidebarError] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);

  // Scroll spy for sticky right-hand Table of Contents
  useEffect(() => {
    if (tocItems.length > 0 && !activeId) {
      setActiveId(tocItems[0].id);
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setReadingProgress(progress);
      }

      const scrollPosition = window.scrollY + 180;
      let currentActive = tocItems[0]?.id || '';

      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            currentActive = item.id;
          }
        }
      }
      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  const handleSidebarNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail || !sidebarEmail.includes('@') || sidebarSending) return;
    setSidebarSending(true);
    setSidebarError('');
    const ok = await subscribeEmail(sidebarEmail);
    setSidebarSending(false);
    if (ok) setSidebarSubscribed(true);
    else setSidebarError('Something went wrong. Please try again.');
  };

  if (loadingSanity && !activePost) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-serif text-xl text-stone-500">Loading Blueprint...</p>
      </div>
    );
  }

  if (!activePost) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-4">Guide Not Found</h1>
        <p className="text-stone-600 mb-8">The requested small space blueprint could not be located.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-full"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const title = activePost.title || 'Untitled Guide';
  const seoTitle = activePost.seoTitle || title;
  const category = activePost.category || 'Compact Workspaces';
  const readTime = activePost.readTime
    ? String(activePost.readTime).toLowerCase().includes('read')
      ? activePost.readTime
      : `${activePost.readTime} read`
    : '6 min read';
  const publishDate = activePost.publishDate
    ? new Date(activePost.publishDate).toString() !== 'Invalid Date' && String(activePost.publishDate).includes('T')
      ? new Date(activePost.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : activePost.publishDate
    : 'October 2026';
  const takeaway = formatSentenceCase(activePost.takeaway || '');
  const excerpt = formatSentenceCase(
    activePost.seoDescription || activePost.excerpt || takeaway || 'Small space organization guide and apartment layout blueprint.'
  );
  const featuredImageSrc = activePost.featuredImageSrc || activePost.sections?.[0]?.image || '';

  const usesAiImages = String(activePost.featuredImageSrc || '').startsWith('/images/blog/');
  const pins: PinItem[] = Array.isArray(activePost.pins) ? activePost.pins : [];
  const hasGroups = Array.isArray(activePost.sections) && activePost.sections.some((s: any) => s && s.group);
  const keepReading: Post[] = (Array.isArray(activePost.related) ? activePost.related : [])
    .map((r: string) => posts.find(p => p.slug === r))
    .filter((p: Post | undefined): p is Post => Boolean(p));
  const keepReadingSlugs = new Set(keepReading.map(p => p.slug));

  const trendingArticles = posts.filter(p => p.slug !== slug).slice(0, 3);
  const relatedShelf = posts
    .filter(p => p.category === category && p.slug !== slug && !keepReadingSlugs.has(p.slug))
    .concat(posts.filter(p => p.slug !== slug && !keepReadingSlugs.has(p.slug)))
    .filter((p, i, arr) => arr.findIndex(q => q.slug === p.slug) === i)
    .slice(0, 4);

  const defaultFaqs = [
    {
      question: "Are these storage recommendations suitable for renters?",
      answer: "Yes. Most picks use no-drill options like tension rods, clamps or removable adhesive. When something needs screws, we say so in its 'Watch out' note."
    },
    {
      question: "How do I choose the right furniture dimensions for a compact apartment?",
      answer: "Measure the primary door swing and floor pathways first. Leave a comfortable walkway (around 36 inches is a common guideline), and prioritize vertical wall storage over deep floor footprints."
    },
    {
      question: "Where can I find budget-friendly compact home decor?",
      answer: "We pick well-reviewed, renter-friendly Amazon finds and link straight to each product, so you can check the current price and reviews yourself."
    }
  ];

  const rawFaqs = activePost.faqs && activePost.faqs.length > 0 ? activePost.faqs : defaultFaqs;
  const activeFaqs = rawFaqs.map((f: any) => ({
    question: formatSentenceCase(f.question),
    answer: formatSentenceCase(f.answer)
  }));

  let headingCounter = 0;
  let h2NumberCounter = 0;

  const portableTextComponents = {
    block: {
      h2: ({ value }: any) => {
        const rawText = (value.children || []).map((c: any) => c.text).join('').trim();
        const id = slugifyHeading(rawText, headingCounter++);
        const formattedHeading = formatSectionHeading(rawText, h2NumberCounter++);
        return (
          <h2
            id={id}
            className="font-serif text-2xl sm:text-3xl font-black text-stone-900 mt-12 mb-4 leading-tight tracking-tight scroll-mt-28"
          >
            {formattedHeading}
          </h2>
        );
      },
      h3: ({ value }: any) => {
        const rawText = (value.children || []).map((c: any) => c.text).join('').trim();
        const id = slugifyHeading(rawText, headingCounter++);
        return (
          <h3
            id={id}
            className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-8 mb-3 leading-snug scroll-mt-28"
          >
            {formatSectionHeading(rawText)}
          </h3>
        );
      },
      normal: ({ children }: any) => (
        <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-amber-600 bg-amber-50/50 pl-5 py-3 my-6 italic font-serif text-stone-800 rounded-r-xl">
          {children}
        </blockquote>
      ),
    },
    types: {
      image: ({ value }: any) => (
        <ArticleImage
          imageUrl={value.imageUrl}
          title={formatSentenceCase(value.alt || title)}
          postCategory={category}
          postSlug={slug || ''}
        />
      ),
      productCard: ({ value }: any) => (
        <div className="my-8">
          <ProductCallout
            product={{
              name: value.productName || 'Recommended Space-Saving Essential',
              price: '',
              dimensions: value.dimensions || '',
              material: value.material || '',
              rating: '',
              affiliateUrl: value.affiliateUrl || 'https://www.amazon.com',
              image: value.productImageUrl || ''
            }}
          />
        </div>
      ),
    },
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-800">
      <SEOHead
        title={seoTitle}
        description={excerpt}
        canonicalPath={`/blog/${slug}`}
        ogImage={featuredImageSrc}
        ogType="article"
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500/20 z-[60] pointer-events-none">
        <div
          className="h-full bg-amber-600 transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 2-COLUMN DESKTOP GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ============================================================== */}
        {/* MAIN ARTICLE RAIL (lg:col-span-8 space-y-8)                    */}
        {/* ============================================================== */}
        <main className="lg:col-span-8 space-y-6 min-w-0">
          {/* TWEAK 1: Breadcrumb font changed from font-mono to font-sans and truncation removed */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-stone-500 mb-3 flex-wrap">
            <Link to="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link 
              to={`/?category=${encodeURIComponent(category)}`}
              className="hover:text-amber-700 transition-colors"
            >
              {category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-800 font-medium">
              {title}
            </span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-[1.18] mb-2 tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-3 border-y border-stone-200 text-xs text-stone-600">
            <span className="font-semibold text-stone-800">
              By SpaceSavvy
            </span>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{publishDate}</span>
            </div>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{readTime}</span>
            </div>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Editor Picks
            </span>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed bg-stone-100/80 border border-stone-200 rounded-xl px-4 py-2.5">
            <strong className="font-semibold text-stone-900">As an Amazon Associate I earn from qualifying purchases.</strong> SpaceSavvy is reader-supported, at no extra cost to you.{' '}
            <Link to="/affiliate-disclosure" className="underline hover:text-stone-800">
              Learn more
            </Link>.
            {usesAiImages && (
              <>
                {' '}Some images are AI-generated for inspiration only.{' '}
                <Link to="/ai-disclaimer" className="underline hover:text-stone-800">Details</Link>.
              </>
            )}
          </p>

          {/* TWEAK 3: Takeaway box with leading-relaxed */}
          {takeaway && (
            <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 mb-8 shadow-xs">
              <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase font-mono block mb-2">
                THE SPACESAVVY TAKEAWAY
              </span>
              <p className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed font-medium">
                {takeaway}
              </p>
            </section>
          )}

          {Array.isArray(activePost.intro) && activePost.intro.length > 0 && (
            <div className="mb-6">
              {activePost.intro.map((para: string, i: number) => (
                <p key={i} className="text-stone-700 leading-relaxed text-base sm:text-lg mb-5">
                  {renderInline(para)}
                </p>
              ))}
            </div>
          )}

          {pins[0] && <PinBlock pin={pins[0]} postSlug={slug || ''} />}

          {Array.isArray(activePost.atAGlance) && activePost.atAGlance.length > 0 && (
            <section className="bg-white border border-stone-200/90 rounded-2xl p-5 mb-8 shadow-xs">
              <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase font-mono block mb-3">
                AT A GLANCE: OUR TOP PICKS
              </span>
              <ul className="space-y-2">
                {activePost.atAGlance.map((g: { label: string; pick: string }, i: number) => (
                  <li key={i} className="text-sm sm:text-base text-stone-700 leading-snug">
                    <strong className="text-stone-900">{g.label}:</strong> {renderInline(g.pick)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Array.isArray(activePost.situations) && activePost.situations.length > 0 && (
            <section className="bg-white border border-stone-200/90 rounded-2xl p-5 mb-8 shadow-xs">
              <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase font-mono block mb-3">
                PICK YOUR SITUATION
              </span>
              <dl className="divide-y divide-stone-100">
                {activePost.situations.map((s: { situation: string; pick: string }, i: number) => (
                  <div key={i} className="py-2.5 grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-1 sm:gap-4">
                    <dt className="text-sm font-semibold text-stone-900">{s.situation}</dt>
                    <dd className="text-sm text-stone-700 m-0">{renderInline(s.pick)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* MOBILE TABLE OF CONTENTS (desktop has the sticky sidebar) */}
          {tocItems.length > 3 && (
            <details className="lg:hidden bg-white border border-stone-200/90 rounded-2xl mb-8 shadow-xs group">
              <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-4 text-sm font-bold text-stone-900">
                <span>In this article</span>
                <ChevronRight className="w-4 h-4 text-stone-400 transition-transform group-open:rotate-90" />
              </summary>
              <nav aria-label="In this article" className="px-5 pb-4 space-y-1 border-t border-stone-100 pt-3">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(e, item.id)}
                    className={`block py-1.5 leading-snug ${item.level === 3 ? 'pl-4 text-[13px] text-stone-600' : 'text-sm font-semibold text-stone-900'} hover:text-amber-800`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </details>
          )}

          {activePost.body && Array.isArray(activePost.body) && activePost.body.length > 0 ? (
            <div className="space-y-4">
              <PortableText value={activePost.body} components={portableTextComponents} />
            </div>
          ) : activePost.sections && activePost.sections.length > 0 ? (
            <div className="space-y-12">
              {activePost.sections.map((section: Section, idx: number) => {
                const secId = slugifyHeading(section.title, idx);
                const formattedTitle = formatSectionHeading(section.title, idx);
                const formattedBody = formatSentenceCase(section.body);

                const isDuplicatePhoto =
                  Boolean(section.image) &&
                  Boolean(section.product?.image) &&
                  section.image === section.product?.image;

                const IdeaHeading = hasGroups ? 'h3' : 'h2';

                return (
                  <React.Fragment key={idx}>
                  {section.group && (
                    <h2
                      id={slugifyHeading(section.group, idx)}
                      className="font-serif text-2xl sm:text-3xl font-black text-stone-900 pt-6 leading-tight tracking-tight scroll-mt-28 border-t-4 border-amber-500/70 mt-16 mb-0"
                    >
                      {section.group}
                    </h2>
                  )}
                  <article 
                    id={secId}
                    className="border-b border-stone-200/80 pb-12 last:border-b-0 last:pb-0 scroll-mt-28"
                  >
                    <IdeaHeading className={`font-serif font-black text-stone-900 mb-4 leading-tight tracking-tight ${hasGroups ? 'text-xl sm:text-2xl mt-6' : 'text-2xl sm:text-3xl mt-10'}`}>
                      {formattedTitle}
                    </IdeaHeading>

                    {formattedBody.split(/\n\s*\n/).map((para: string, pIdx: number) => {
                      const labelMatch = para.match(/^(Renter tip:|Watch out:|Good to know:)\s*/);
                      if (labelMatch) {
                        const isTip = labelMatch[1] !== 'Watch out:';
                        return (
                          <p
                            key={pIdx}
                            className={`text-stone-700 leading-relaxed text-sm sm:text-base mb-3 pl-4 border-l-4 ${isTip ? 'border-emerald-500' : 'border-amber-500'}`}
                          >
                            <strong className="text-stone-900">{labelMatch[1]}</strong>{' '}
                            {renderInline(para.slice(labelMatch[0].length))}
                          </p>
                        );
                      }
                      const lines = para.split('\n').map((l: string) => l.trim()).filter(Boolean);
                      const isBullets = lines.length > 1 && lines.every((l: string) => l.startsWith('- '));
                      const isSteps = lines.length > 1 && lines.every((l: string) => /^\d+\.\s/.test(l));
                      if (isBullets || isSteps) {
                        const ListTag = isSteps ? 'ol' : 'ul';
                        return (
                          <ListTag
                            key={pIdx}
                            className={`${isSteps ? 'list-decimal' : 'list-disc'} pl-6 mb-6 space-y-2 text-stone-700 leading-relaxed text-base sm:text-lg marker:text-amber-700 marker:font-bold`}
                          >
                            {lines.map((l: string, li: number) => (
                              <li key={li}>{renderInline(l.replace(/^(- |\d+\.\s)/, ''))}</li>
                            ))}
                          </ListTag>
                        );
                      }
                      if (lines[0]?.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} className="font-serif text-xl font-bold text-stone-900 mt-6 mb-3">
                            {lines[0].slice(4)}
                          </h3>
                        );
                      }
                      return (
                        <p key={pIdx} className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6">
                          {renderInline(para)}
                        </p>
                      );
                    })}

                    {!isDuplicatePhoto && section.image && (
                      <ArticleImage
                        imageUrl={section.image}
                        title={formattedTitle}
                        postCategory={category}
                        postSlug={slug || ''}
                        productName={section.product?.name}
                        alt={section.imageAlt}
                      />
                    )}

                    {section.product && <ProductCallout product={section.product} />}
                    {Array.isArray(section.alsoGood) && section.alsoGood.length > 0 && (
                      <AlsoGood picks={section.alsoGood} />
                    )}
                  </article>
                  {idx === 3 && activePost.sections.length > 5 && <InlineNewsletter />}
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 text-center my-8">
              <p className="font-serif text-lg font-bold text-stone-800 mb-1">
                Ready for your article content
              </p>
              <p className="text-xs text-stone-500">
                Open Sanity Studio (localhost:3333), paste your article into the "Article Content" box, and hit Publish.
              </p>
            </div>
          )}

          {pins[1] && <PinBlock pin={pins[1]} postSlug={slug || ''} />}

          {/* KEY TAKEAWAYS */}
          {Array.isArray(activePost.keyTakeaways) && activePost.keyTakeaways.length > 0 && (
            <section className="mt-12 bg-white border-l-4 border-amber-600 border-y border-r border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h2 className="font-serif text-2xl font-black text-stone-900 mb-4">Key Takeaways</h2>
              <ul className="space-y-2.5">
                {activePost.keyTakeaways.map((k: string, i: number) => (
                  <li key={i} className="flex gap-3 text-stone-700 leading-relaxed">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>{renderInline(k)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* MISTAKES TO AVOID */}
          {Array.isArray(activePost.mistakes) && activePost.mistakes.length > 0 && (
            <section className="mt-12 bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 sm:p-6">
              <h2 className="font-serif text-2xl font-black text-stone-900 mb-4">Mistakes to Avoid</h2>
              <ul className="space-y-3">
                {activePost.mistakes.map((m: string, i: number) => (
                  <li key={i} className="flex gap-3 text-stone-700 leading-relaxed">
                    <span className="text-amber-700 font-black shrink-0" aria-hidden="true">✕</span>
                    <span>{renderInline(m)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* KEEP READING */}
          {keepReading.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-black text-stone-900 mb-4">Keep Reading</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keepReading.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="group flex items-center gap-3 bg-white border border-stone-200/90 rounded-2xl p-3 hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={p.featuredImageSrc || p.sections[0]?.image}
                        alt={p.featuredImageAlt || p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-amber-700 font-semibold block uppercase">{p.category}</span>
                      <span className="text-sm font-bold text-stone-900 leading-snug line-clamp-3 group-hover:text-amber-800">{p.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* HOW WE CHOSE THESE PICKS */}
          {(activePost.sections?.some((s: any) => s.product) ||
            activePost.body?.some?.((b: any) => b._type === 'productCard')) && (
            <section className="mt-12 bg-stone-50 border border-stone-200/90 rounded-2xl p-5 sm:p-6">
              <p className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold mb-2">How we chose these picks</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                We compared product listings, sizes, materials and real customer reviews, and favoured renter-friendly options that need no drilling.
                We don't physically test every item, and we flag known limitations in each "Watch out" note. Prices and availability change,
                so always check the current details on Amazon before you buy.
              </p>
            </section>
          )}

          {/* AUTHOR BOX */}
          <section className="mt-12 bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-serif font-black text-xl flex items-center justify-center shrink-0" aria-hidden="true">
              S
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold mb-1">Written by</p>
              <p className="font-serif text-lg font-bold text-stone-900 mb-1">SpaceSavvy</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                SpaceSavvy is a small-space blog for renters. We pick products by comparing specs, Amazon listings and customer reviews. We don't physically test every item, and we always flag anything that needs drilling.{' '}
                <Link to="/about" className="text-amber-800 font-semibold underline">More about us</Link>.
              </p>
            </div>
          </section>
        </main>

        {/* ============================================================== */}
        {/* STICKY RIGHT SIDEBAR WITH ACTIVE-SCROLL TABLE OF CONTENTS      */}
        {/* ============================================================== */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="space-y-6 sticky top-24 self-start">
            
            {/* TWEAK 2: TOC with py-2.5 spacing, bold active states, and relaxed line height */}
            {tocItems.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm text-left">
                <h3 className="font-sans text-sm font-bold text-stone-900 pb-3 mb-3 border-b border-stone-100">
                  Table of Contents
                </h3>
                <nav
                  aria-label="Table of Contents"
                  className="max-h-[340px] overflow-y-auto pr-1 space-y-1"
                >
                  {tocItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToHeading(e, item.id)}
                        className={`block leading-relaxed py-2.5 px-3 rounded-xl transition-all duration-150 border-l-[3px] ${item.level === 3 ? 'ml-3 text-[12.5px]' : 'text-[13px] font-semibold'} ${
                          isActive
                            ? 'bg-amber-50/90 text-amber-900 font-bold border-amber-600 shadow-2xs'
                            : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-bold block mb-1">
                EDITORIAL CURATION
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                About SpaceSavvy
              </h3>
              <p className="text-xs text-amber-800 font-semibold mb-3">
                Curated Small-Space Living
              </p>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                We scout and curate stylish, renter-friendly storage finds and compact furniture layouts designed specifically for tight floor plans. No fluff, just practical ideas.
              </p>
              <a
                href="https://pinterest.com/spacesavvyhacks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>Explore Our Pinterest Boards →</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-bold block mb-3">
                TRENDING RENTER GUIDES
              </span>
              <div className="space-y-4">
                {trendingArticles.map(trend => (
                  <Link
                    key={trend.slug}
                    to={`/blog/${trend.slug}`}
                    className="group flex items-center gap-3 text-left"
                  >
                    <div className="relative w-14 aspect-[2/3] rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200/70">
                      <img
                        src={trend.featuredImageSrc || trend.sections[0]?.image}
                        alt={trend.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-amber-700 font-semibold block uppercase">
                        {trend.category}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                        {trend.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                        {trend.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FFF4E6] via-[#FAF3EA] to-[#FDE8D0] rounded-2xl p-6 border border-amber-300/70 shadow-sm text-left">
              <span className="text-[10px] font-bold tracking-widest text-amber-800 uppercase font-mono block mb-1">
                FREE WEEKLY CHEAT SHEET
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Get the Small Space Checklist
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Tight corner storage blueprints and curated Amazon finds sent weekly.
              </p>
              {sidebarSubscribed ? (
                <div className="py-2.5 px-3 bg-white/90 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Almost done! Check your inbox to confirm.</span>
                </div>
              ) : (
                <form onSubmit={handleSidebarNewsletter} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    value={sidebarEmail}
                    onChange={(e) => setSidebarEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 rounded-full border border-stone-300 text-xs bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    {sidebarSending ? 'SENDING…' : 'GET THE CHECKLIST →'}
                  </button>
                  {sidebarError && <p className="text-[11px] text-red-600">{sidebarError}</p>}
                </form>
              )}
            </div>

          </div>
        </aside>
      </div>

      {readingProgress > 15 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-16 space-y-16">
        <section className="border-t border-stone-200 pt-10">
          <FaqAccordion items={activeFaqs} />
        </section>

        {relatedShelf.length > 0 && (
          <section className="border-t border-stone-200 pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-amber-700 font-bold block mb-1">
                  MORE EDITORIAL GUIDES
                </span>
                <h2 className="font-serif text-2xl font-black text-stone-900">
                  More Small Space Guides You'll Love
                </h2>
              </div>
              <Link
                to={`/?category=${encodeURIComponent(category)}`}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedShelf.map(relPost => (
                <ArticleCard key={relPost.slug} post={relPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}