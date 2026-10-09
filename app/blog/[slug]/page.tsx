import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
  ArrowRight,
  ChevronDown,
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { posts, Post, Section } from '../../../src/data/posts';
import ArticleCard from '../../../src/components/ArticleCard';
import FaqAccordion from '../../../src/components/FaqAccordion';
import ProductCallout from '../../../src/components/ProductCallout';
import SEOHead from '../../../src/components/SEOHead';

interface PageProps {
  params?: {
    slug?: string;
  };
}

// Interactive 2:3 Vertical Visual with Framer Motion Pinterest Pulse & Toast
function ArticleImage({ section, postTitle, postCategory, postSlug }: {
  section: Section;
  postTitle: string;
  postCategory: string;
  postSlug: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;

    const targetUrl = new URL(`/blog/${postSlug}`, window.location.origin).href;
    const mediaUrl = section.image;
    const desc = `${section.title}. ${section.product.name} | SpaceSavvy Small Apartment Living Hacks #SpaceSavvy #SmallApartment #ApartmentHacks #InteriorStyling #HomeOrganization`;

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
    <div className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-2xl overflow-hidden my-6 border border-stone-200 shadow-sm group bg-[#F5EFE6]">
      {/* Real photo or graceful fallback */}
      {!imgError ? (
        <img
          src={section.image}
          alt={section.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5] p-6 flex flex-col justify-between select-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
            {postCategory}
          </span>
          <p className="font-serif font-bold text-stone-900 text-lg leading-snug">
            {section.title}
          </p>
          <span className="text-xs text-amber-800 font-mono font-bold">
            SpaceSavvy Verified Spec
          </span>
        </div>
      )}

      {/* Floating Red Pinterest '📌 Save' Button with hover pulse */}
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
        title={`Save "${section.title}" to Pinterest`}
        aria-label={`Save "${section.title}" to Pinterest`}
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

      {/* Toast Feedback */}
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
  const post: Post | undefined = posts.find(p => p.slug === slug) || posts[0];

  // Sidebar newsletter state
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [sidebarSubscribed, setSidebarSubscribed] = useState(false);

  // Table of Contents collapse toggle (open by default)
  const [tocOpen, setTocOpen] = useState(true);

  // Reading progress indicator
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSidebarNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail || !sidebarEmail.includes('@')) return;
    setSidebarSubscribed(true);
  };

  // Trending Renter Guides: List of 3 popular articles
  const trendingArticles = posts
    .filter(p => p.slug !== post?.slug)
    .slice(0, 3);

  // Related guides shelf: 4 articles from same category (or fallback to latest)
  const relatedShelf = posts
    .filter(p => p.category === post?.category && p.slug !== post?.slug)
    .concat(posts.filter(p => p.slug !== post?.slug))
    .slice(0, 4);

  // Default fallback FAQs for Schema.org & Accordion if post lacks custom ones
  const defaultFaqs = [
    {
      question: "Are these storage recommendations suitable for renters?",
      answer: "Yes. Every solution highlighted features zero-drill tension mounting, stud-only hardware, or certified surface-safe adhesives that leave walls intact when moving out."
    },
    {
      question: "How do I choose the right furniture dimensions for a compact apartment?",
      answer: "Measure the primary door swing and floor pathways first. Keep a minimum 30-inch clearance for walking corridors, and prioritize vertical wall storage over deep floor footprints."
    },
    {
      question: "Where can I find budget-friendly compact home decor?",
      answer: "We curate verified Amazon finds that combine solid pine, powder-coated steel, and durable canvas organizers to maintain high visual appeal while staying under $25 to $60."
    }
  ];

  const activeFaqs = post?.faqs && post.faqs.length > 0 ? post.faqs : defaultFaqs;

  if (!post) {
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

  // Schema.org Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.takeaway,
    "image": post.featuredImageSrc || post.sections[0]?.image,
    "datePublished": "2026-10-01T08:00:00+00:00",
    "dateModified": "2026-10-08T08:00:00+00:00",
    "author": {
      "@type": "Organization",
      "name": "SpaceSavvy Editorial",
      "url": "https://pinterest.com/spacesavvyhacks"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SpaceSavvy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? window.location.href : `https://spacesavvy.com/blog/${post.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spacesavvy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.category,
        "item": `https://spacesavvy.com/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://spacesavvy.com/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-800">
      <SEOHead
        title={post.title}
        description={post.excerpt || post.takeaway || 'Small space organization guide and apartment layout blueprint.'}
        canonicalPath={`/blog/${post.slug}`}
        ogImage={post.featuredImageSrc || post.sections[0]?.image}
        ogType="article"
      />

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500/20 z-[60] pointer-events-none">
        <div
          className="h-full bg-amber-600 transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Schema.org BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 2-COLUMN DESKTOP GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ============================================================== */}
        {/* MAIN ARTICLE RAIL (lg:col-span-8 space-y-8) */}
        {/* ============================================================== */}
        <main className="lg:col-span-8 space-y-8 min-w-0">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-4 flex-wrap">
            <Link to="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link 
              to={`/?category=${encodeURIComponent(post.category)}`}
              className="hover:text-amber-700 transition-colors"
            >
              {post.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-800 font-semibold truncate max-w-xs sm:max-w-md">
              {post.title}
            </span>
          </nav>

          {/* H1 Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 leading-[1.18] mb-3 tracking-tight">
            {post.title}
          </h1>

          {/* Meta Row: Date, read time, and "Renter-Approved Specs" badge */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-3 border-y border-stone-200 text-xs text-stone-600 mb-8">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{post.publishDate || "October 2026"}</span>
            </div>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{post.readTime}</span>
            </div>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Renter-Approved Specs
            </span>
          </div>

          {/* Quick Takeaway Box */}
          <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 mb-8 shadow-xs">
            <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase font-mono block mb-2">
              THE SPACESAVVY TAKEAWAY
            </span>
            <p className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed font-medium">
              {post.takeaway}
            </p>
          </section>

          {/* Interactive Editorial Table of Contents */}
          <nav 
            aria-label="Table of Contents"
            className="bg-[#F9F7F4] border border-stone-200/90 rounded-2xl p-5 sm:p-6 mb-10 shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" aria-hidden="true" />
                <span className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-amber-700" />
                  In This Guide (Table of Contents)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTocOpen(!tocOpen)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-stone-200/50 cursor-pointer"
                aria-expanded={tocOpen}
                aria-controls="table-of-contents-list"
              >
                <span>{tocOpen ? 'Hide' : 'Show'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    tocOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {tocOpen && (
              <ol
                id="table-of-contents-list"
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-4 pt-4 border-t border-stone-200/60 list-decimal list-inside text-sm text-stone-700 font-medium"
              >
                {post.sections.map((section, index) => (
                  <li key={index} className="truncate">
                    <a
                      href={`#section-${index + 1}`}
                      className="hover:text-amber-700 hover:underline transition"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </nav>

          {/* Section Loop (Each Design Idea) */}
          <div className="space-y-12">
            {post.sections.map((section, idx) => (
              <article 
                key={idx} 
                id={`section-${idx + 1}`}
                className="border-b border-stone-200/80 pb-12 last:border-b-0 last:pb-0 scroll-mt-24"
              >
                {/* Subheading */}
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 mt-12 mb-4 leading-tight tracking-tight">
                  {section.title}
                </h2>

                {/* Paragraph: Natural, human editorial copy */}
                <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6">
                  {section.body}
                </p>

                {/* Vertical 2:3 Visual Frame */}
                <ArticleImage
                  section={section}
                  postTitle={post.title}
                  postCategory={post.category}
                  postSlug={post.slug}
                />

                {/* In-Article Product Callout Card */}
                <ProductCallout product={section.product} />
              </article>
            ))}
          </div>

        </main>

        {/* ============================================================== */}
        {/* STICKY SIDEBAR RAIL (lg:col-span-4 hidden lg:block) */}
        {/* ============================================================== */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="space-y-8 sticky top-24 self-start">
            
            {/* 1. Editorial Studio Card */}
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

            {/* 2. Trending Renter Guides: List of 3 popular articles */}
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

            {/* 3. Weekly Checklist Box */}
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
                  <span>Check your inbox. Sent!</span>
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
                    GET THE CHECKLIST →
                  </button>
                </form>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* ============================================================== */}
      {/* BOTTOM SECTIONS (FULL WIDTH) */}
      {/* ============================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-16">
        
        {/* 1. FAQ Accordion with Schema.org JSON-LD Output */}
        <section className="border-t border-stone-200 pt-10">
          <FaqAccordion items={activeFaqs} />
        </section>

        {/* 2. Related Guides: 4 Article Cards */}
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
                to={`/?category=${encodeURIComponent(post.category)}`}
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
