import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, SlidersHorizontal, BookOpen } from 'lucide-react';
import { posts, Post } from '../../../src/data/posts';
import ArticleCard from '../../../src/components/ArticleCard';
import SEOHead from '../../../src/components/SEOHead';

// Map slug in URL to actual category display name and metadata
interface CategoryMeta {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  'small-spaces': {
    title: 'Small Space Living',
    subtitle: 'Studio & Compact Apartment Blueprints',
    description:
      'High-impact square-meter mastery, spatial flow, multipurpose furniture systems, and renter-friendly styling for compact homes.',
    badge: 'Spatial Blueprints',
  },
  'kitchen-dining': {
    title: 'Kitchen & Dining',
    subtitle: 'Micro-Kitchen & Pantry Organization',
    description:
      'Clever vertical counter risers, magnetic storage, drawer dividers, and space-saving dining hacks that turn small kitchens into culinary sanctuaries.',
    badge: 'Kitchen Systems',
  },
  'workspaces': {
    title: 'Compact Workspaces',
    subtitle: 'Apartment Corner & Desk Setups',
    description:
      'Ergonomic, clutter-free desk configurations designed specifically for apartment corners, nooks, and multi-functional living areas.',
    badge: 'Productivity Nooks',
  },
  'amazon-finds': {
    title: 'Curated Amazon Finds',
    subtitle: 'Practical, Vetted Apartment Storage',
    description:
      'Hand-vetted, high-quality home decor, storage essentials, and renter-approved organization pieces available on Amazon with genuine utility.',
    badge: 'Vetted Quality',
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  // Resolve category configuration
  const categoryInfo = useMemo(() => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    if (CATEGORY_MAP[cleanSlug]) {
      return CATEGORY_MAP[cleanSlug];
    }
    // Fallback: match by normalized category string
    const match = Object.entries(CATEGORY_MAP).find(
      ([k, v]) =>
        k === cleanSlug ||
        v.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug
    );
    return (
      match?.[1] || {
        title: cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        subtitle: 'Curated SpaceSavvy Collection',
        description: 'Explore our latest Scandinavian-inspired small apartment design guides and organization systems.',
        badge: 'Curated Collection',
      }
    );
  }, [slug]);

  // Filter posts belonging to this category
  const filteredPosts = useMemo(() => {
    if (!categoryInfo) return [];
    return posts.filter(
      (p) =>
        p.category.toLowerCase().trim() === categoryInfo.title.toLowerCase().trim() ||
        (categoryInfo.title === 'Curated Amazon Finds' &&
          (p.category.includes('Amazon') || p.category === 'Curated Amazon Finds')) ||
        (categoryInfo.title === 'Compact Workspaces' &&
          (p.category.includes('Workspace') || p.category === 'Compact Workspaces')) ||
        (categoryInfo.title === 'Kitchen & Dining' &&
          (p.category.includes('Kitchen') || p.category === 'Kitchen & Dining')) ||
        (categoryInfo.title === 'Small Space Living' &&
          (p.category.includes('Small Space') || p.category === 'Small Space Living'))
    );
  }, [categoryInfo]);

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
        "name": categoryInfo?.title || 'Category',
        "item": `https://spacesavvy.com/category/${slug || 'all'}`
      }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-20">
      <SEOHead
        title={categoryInfo?.title || 'Design Category'}
        description={categoryInfo?.description || 'Curated small space living and organization guides.'}
        canonicalPath={`/category/${slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-stone-500 mb-6 sm:mb-8">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-stone-400" />
        <span className="text-stone-400">Category</span>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate">
          {categoryInfo?.title || 'Collection'}
        </span>
      </nav>

      {/* Category Header Hero */}
      <header className="border-b border-stone-200/80 pb-10 mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          <SlidersHorizontal className="w-3 h-3 text-amber-700" />
          <span>{categoryInfo?.badge || 'CURATED HUB'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15] mb-4">
          {categoryInfo?.title}
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-stone-600 mb-4 max-w-2xl">
          {categoryInfo?.subtitle}
        </p>
        <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl">
          {categoryInfo?.description}
        </p>
      </header>

      {/* Articles Section */}
      <section aria-labelledby="category-articles-heading">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 id="category-articles-heading" className="font-serif text-xl sm:text-2xl font-black text-stone-900">
              Curated Guides & Blueprints
            </h2>
            <span className="text-xs font-mono bg-stone-200/70 text-stone-700 px-2.5 py-0.5 rounded-full font-bold">
              {filteredPosts.length}
            </span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          /* Empty State Fallback */
          <div className="bg-white rounded-3xl border border-stone-200/90 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-800">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">
              Guides in Production
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Our editorial stylists are staging and testing new renter-friendly solutions for this category. Check out our existing blueprints in the meantime.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs px-6 py-3 rounded-full transition shadow-sm"
            >
              <span>Explore All Featured Guides</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
