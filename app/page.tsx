import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Filter, X, Check, Star, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { posts as staticPosts, Post } from '../src/data/posts';
import { client } from '../src/lib/sanity';
import { subscribeEmail } from '../src/lib/subscribe';
import ArticleCard from '../src/components/ArticleCard';
import SEOHead from '../src/components/SEOHead';

export default function HomePage() {
  const [allPosts, setAllPosts] = useState<Post[]>(staticPosts);

  useEffect(() => {
    async function loadSanityPosts() {
      try {
        // Fetches both your current Sanity post format AND any future simplified posts
        const sanityData = await client.fetch(`*[_type == "post" && defined(slug.current)] | order(_createdAt desc){
          "slug": slug.current,
          "title": coalesce(title, postTitle),
          category,
          readTime,
          "takeaway": coalesce(takeaway, keyTakeaway),
          "excerpt": coalesce(excerpt, seoDescription, keyTakeaway, "Read the full space-saving guide inside."),
          "publishDate": coalesce(publishDate, publishedAt),
          "featuredImageSrc": coalesce(featuredImage.asset->url, mainImage.asset->url),
          "featuredImageAlt": coalesce(featuredImage.alt, mainImage.alt, title, postTitle)
        }`);

        if (sanityData && sanityData.length > 0) {
          const formattedSanityPosts: Post[] = sanityData.map((p: any) => {
            // Map Sanity category to match homepage shelves
            let mappedCategory: Post['category'] = 'Compact Workspaces';
            const rawCat = (p.category || '').toLowerCase();
            if (rawCat.includes('kitchen')) mappedCategory = 'Kitchen & Dining';
            else if (rawCat.includes('gaming')) mappedCategory = 'Gaming Setups';
            else if (rawCat.includes('holiday') || rawCat.includes('christmas')) mappedCategory = 'Holiday Decor';
            else if (rawCat.includes('amazon') || rawCat.includes('find')) mappedCategory = 'Curated Amazon Finds';
            else if (rawCat.includes('small') || rawCat.includes('living') || rawCat.includes('studio')) mappedCategory = 'Small Space Living';
            else if (rawCat.includes('workspace') || rawCat.includes('desk') || rawCat.includes('gaming')) mappedCategory = 'Compact Workspaces';

            return {
              slug: p.slug,
              title: p.title || 'Untitled Guide',
              category: mappedCategory,
              readTime: p.readTime || '5 min read',
              takeaway: p.takeaway || '',
              excerpt: p.excerpt,
              publishDate: p.publishDate
                ? new Date(p.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'October 14, 2026',
              featuredImageSrc: p.featuredImageSrc || 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=800',
              featuredImageAlt: p.featuredImageAlt || p.title || 'SpaceSavvy Guide',
              sections: []
            };
          });

          // Articles in src/data/posts.ts take priority over Sanity copies with the same slug
          const staticSlugs = new Set(staticPosts.map(p => p.slug));
          const merged = [
            ...formattedSanityPosts.filter(sp => !staticSlugs.has(sp.slug)),
            ...staticPosts
          ];
          setAllPosts(merged);
        }
      } catch (err) {
        console.error('Sanity fetch error (check CORS settings if blocked):', err);
      }
    }
    loadSanityPosts();
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategoryParam = searchParams.get('category');

  // Filtered view if user navigated to a category from the top nav
  const isFiltered = Boolean(activeCategoryParam);
  const filteredPosts = isFiltered
    ? allPosts.filter(
        p =>
          p.category.toLowerCase().includes(activeCategoryParam!.toLowerCase()) ||
          activeCategoryParam!.toLowerCase().includes(p.category.toLowerCase())
      )
    : [];

  // Grouped posts for dedicated editorial shelves (4 distinct articles per shelf)
  const latestPosts = allPosts.slice(0, 4);
  const kitchenPosts = allPosts.filter(p => p.category === 'Kitchen & Dining').slice(0, 4);
  const workspacePosts = allPosts.filter(p => p.category === 'Compact Workspaces').slice(0, 4);
  const budgetPosts = allPosts.filter(p => p.category === 'Curated Amazon Finds').slice(0, 4);
  const smallSpacePosts = allPosts.filter(p => p.category === 'Small Space Living').slice(0, 4);

  // Newsletter Lead Magnet state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subSending, setSubSending] = useState(false);
  const [subError, setSubError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || subSending) return;
    setSubSending(true);
    setSubError('');
    const ok = await subscribeEmail(email);
    setSubSending(false);
    if (ok) setSubscribed(true);
    else setSubError('Something went wrong. Please try again.');
  };

  return (
    <div className="pt-4 sm:pt-6 pb-12 space-y-16 md:space-y-24">
      <SEOHead
        title="SpaceSavvy - Small Apartment Organization & Home Hacks"
        description="A warm, design-forward Scandinavian editorial blog focused on compact living hacks, budget-friendly apartment storage, and Amazon home organization finds."
        canonicalPath="/"
      />
      {/* 1. HOMEPAGE HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-lg bg-stone-900 w-full min-h-[500px] h-[75vh] max-h-[660px] flex items-end">
          {/* High-Performance Static Hero Background Image */}
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
            alt="Curated Scandinavian compact apartment interior with space-saving decor"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent pointer-events-none" />

          {/* Bottom-Left Aligned Curation Content Overlay */}
          <div className="relative z-10 p-6 sm:p-12 text-white max-w-3xl space-y-4">
            <span className="bg-amber-600/90 text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block">
              POPULAR GUIDE
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-white tracking-tight">
              Your space can look like your dream board.
            </h1>

            <p className="text-stone-200 text-sm sm:text-lg leading-relaxed max-w-2xl">
              Curated room setups, clever storage hacks, and stylish finds to help you make every corner of your home look and feel effortless.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <a
                href="#guides"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-full shadow-md transition inline-flex items-center gap-2"
              >
                <span>Explore Guides →</span>
              </a>
              <a
                href="#newsletter"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold uppercase px-6 py-3 rounded-full transition inline-flex items-center gap-2"
              >
                <span>Free Checklist</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERED CATEGORY VIEW (Shown when category query is present) */}
      {isFiltered && (
        <section className="max-w-7xl mx-auto px-6 space-y-8 border-t border-stone-200/80 pt-10">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-semibold block">
                  Filtered Category Shelf
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {activeCategoryParam} ({filteredPosts.length} Guides)
                </h2>
              </div>
            </div>
            <Link
              to="/"
              className="text-xs font-mono text-stone-500 hover:text-stone-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPosts.map(article => (
              <ArticleCard key={article.slug} post={article} />
            ))}
          </div>
        </section>
      )}

      {/* 2. THE LATEST GUIDES */}
      <section id="guides" className="max-w-7xl mx-auto px-6 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-700 font-bold block mb-1">
              Fresh Staged Ideas
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium">The Latest Guides</h2>
          </div>
          <span className="text-xs font-mono text-stone-500">Updated Weekly · {allPosts.length} Curated Blueprints</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestPosts.map(article => (
            <ArticleCard key={article.slug} post={article} />
          ))}
        </div>
      </section>

      {/* 3. CATEGORY SHELF: KITCHEN & DINING STORAGE */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-700 font-bold block mb-1">
              Culinary Nooks & Pantries
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium">Kitchen & Dining Storage</h2>
          </div>
          <Link
            to="/?category=Kitchen%20%26%20Dining"
            className="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <span>SEE ALL KITCHEN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {kitchenPosts.map(article => (
            <ArticleCard key={article.slug} post={article} />
          ))}
        </div>
      </section>

      {/* 4. CREATOR PHILOSOPHY BANNER */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#F4EFE6] rounded-3xl border border-stone-200/50 p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-bold block">
              CLEVER HOME LIVING
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight font-medium">
              Simple setups for a calmer, better-organized home.
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed max-w-xl">
              Finding good home pieces shouldn't take hours of digging through cheap junk or dealing with complicated renovations. We do the heavy research for you—reading through customer reviews, dimensions, and easy setups that real people already use and love. Simple, stylish ideas to help you clear clutter, style your spaces, and make every room work better.
            </p>

            {/* 3 High-Converting Elevated Feature Stat Cards with Tactile Hover Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {/* Card 1 */}
              <div className="group bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-md cursor-pointer flex flex-col justify-between text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-2xl font-black text-stone-900 font-serif">100%</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800 mt-2 block">
                    SIMPLE & PRACTICAL
                  </span>
                  <p className="text-[12px] text-stone-500 leading-snug mt-1">
                    Easy-to-install pieces and damage-free hardware with zero complicated construction.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-md cursor-pointer flex flex-col justify-between text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0">
                    <Star className="w-5 h-5 stroke-[2.2] fill-amber-100" />
                  </div>
                  <span className="text-2xl font-black text-stone-900 font-serif">4.5★+</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800 mt-2 block">
                    COMMUNITY-VETTED
                  </span>
                  <p className="text-[12px] text-stone-500 leading-snug mt-1">
                    Chosen using real customer reviews, product specs, and everyday practicality.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-md cursor-pointer flex flex-col justify-between text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0">
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-2xl font-black text-stone-900 font-serif">Zero</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800 mt-2 block">
                    CHAOS & CLUTTER
                  </span>
                  <p className="text-[12px] text-stone-500 leading-snug mt-1">
                    Smart ideas that make kitchen counters, desks, and living rooms feel open and organized.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4:3 Rounded Landscape Real Photo */}
          <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200/80 shadow-md bg-stone-100 group">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
              alt="Comfortable small reading alcove with a cozy neutral chair"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* 5. CATEGORY SHELF: COMPACT WORKSPACES & DESK HACKS */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-700 font-bold block mb-1">
              Micro Offices & Studios
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium">Compact Workspaces & Desk Hacks</h2>
          </div>
          <Link
            to="/?category=Compact%20Workspaces"
            className="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <span>SEE ALL WORKSPACES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workspacePosts.map(article => (
            <ArticleCard key={article.slug} post={article} />
          ))}
        </div>
      </section>

      {/* 6. AFFILIATE FEATURE SHELF: CURATED AMAZON FINDS */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-700 font-bold block mb-1">
              Affordable, Renter-Friendly Gear
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium">Curated Amazon Finds</h2>
          </div>
          <Link
            to="/?category=Curated%20Amazon%20Finds"
            className="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <span>EXPLORE CURATED FINDS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {budgetPosts.map(article => (
            <ArticleCard key={article.slug} post={article} />
          ))}
        </div>
      </section>

      {/* 7. SMALL APARTMENT HACKS */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-700 font-bold block mb-1">
              Micro Room Makeovers
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium">Small Apartment Hacks</h2>
          </div>
          <Link
            to="/?category=Small%20Space%20Living"
            className="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <span>SEE ALL SMALL SPACES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {smallSpacePosts.map(article => (
            <ArticleCard key={article.slug} post={article} />
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER LEAD MAGNET CARD */}
      <section id="newsletter" className="px-6 scroll-mt-24">
        <div className="max-w-2xl mx-auto my-16 rounded-3xl p-8 sm:p-12 text-center border border-amber-300/60 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-[#FFF4E6] via-[#FAF3EA] to-[#FDE8D0] relative overflow-hidden">
          {/* Ambient warm gradient orbs */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-gradient-to-br from-amber-400/25 to-orange-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-gradient-to-tr from-amber-300/30 to-yellow-200/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 block mb-2">
              FREE WEEKLY EMAIL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-3">
              Get the Small Space Checklist
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
              Every Sunday, I share five renter-friendly storage ideas and under $25 Amazon finds that fit tiny rooms. No filler, unsubscribe whenever you want.
            </p>

            {subscribed ? (
              <div className="bg-white/95 border border-amber-200/80 rounded-2xl p-6 max-w-md mx-auto text-center space-y-2 shadow-xs">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 mb-1">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-serif">Check your inbox</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We just sent a confirmation email to{' '}
                  <span className="font-semibold text-stone-800">{email}</span>. Click the link inside and your Small Space Checklist will follow.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="px-5 py-3.5 rounded-full border border-stone-300 bg-white/95 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner flex-1 placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md transition-all duration-200 active:scale-95 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  {subSending ? 'SENDING…' : 'GET THE CHECKLIST →'}
                </button>
                {subError && <p className="text-xs text-red-600 w-full text-center">{subError}</p>}
              </form>
            )}

            <span className="text-[11px] text-stone-500 mt-3 block">
              Free forever. Your email stays private.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}