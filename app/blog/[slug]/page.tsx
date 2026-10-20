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
import { posts, Post, Section } from '../../../src/data/posts';
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
function ArticleImage({ imageUrl, title, postCategory, postSlug, productName }: {
  imageUrl: string;
  title: string;
  postCategory: string;
  postSlug: string;
  productName?: string;
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
          alt={title}
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

  const activePost = sanityPost || staticMatch;

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
      return activePost.sections
        .filter((s: any) => s && s.title)
        .map((s: any, idx: number) => ({
          id: slugifyHeading(s.title, idx),
          text: formatSectionHeading(s.title, idx)
        }));
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

  const trendingArticles = posts.filter(p => p.slug !== slug).slice(0, 3);
  const relatedShelf = posts
    .filter(p => p.category === category && p.slug !== slug)
    .concat(posts.filter(p => p.slug !== slug))
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

                return (
                  <article 
                    key={idx} 
                    id={secId}
                    className="border-b border-stone-200/80 pb-12 last:border-b-0 last:pb-0 scroll-mt-28"
                  >
                    <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 mt-10 mb-4 leading-tight tracking-tight">
                      {formattedTitle}
                    </h2>

                    {formattedBody.split(/\n\s*\n/).map((para: string, pIdx: number) => {
                      const labelMatch = para.match(/^(Renter tip:|Watch out:)\s*/);
                      if (labelMatch) {
                        const isTip = labelMatch[1] === 'Renter tip:';
                        return (
                          <p
                            key={pIdx}
                            className={`text-stone-700 leading-relaxed text-sm sm:text-base mb-3 pl-4 border-l-4 ${isTip ? 'border-emerald-500' : 'border-amber-500'}`}
                          >
                            <strong className="text-stone-900">{isTip ? 'Renter tip:' : 'Watch out:'}</strong>{' '}
                            {para.slice(labelMatch[0].length)}
                          </p>
                        );
                      }
                      return (
                        <p key={pIdx} className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6">
                          {para}
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
                      />
                    )}

                    {section.product && <ProductCallout product={section.product} />}
                  </article>
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
                        className={`block text-[13px] leading-relaxed py-2.5 px-3 rounded-xl transition-all duration-150 border-l-[3px] ${
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