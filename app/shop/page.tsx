import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { shopProducts, ROOM_CATEGORIES, RoomCategory, ShopProduct } from '../../data/shopProducts';
import ProductCard from '../../components/ProductCard';
import SEOHead from '../../src/components/SEOHead';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<RoomCategory>('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return shopProducts
      .filter((product) => {
        const matchesCategory =
          activeCategory === 'All Items' || product.category === activeCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.material.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return parseFloat(b.rating) - parseFloat(a.rating);
        }
        if (sortBy === 'price-asc') {
          const priceA = parseFloat(a.price.replace('$', ''));
          const priceB = parseFloat(b.price.replace('$', ''));
          return priceA - priceB;
        }
        if (sortBy === 'price-desc') {
          const priceA = parseFloat(a.price.replace('$', ''));
          const priceB = parseFloat(b.price.replace('$', ''));
          return priceB - priceA;
        }
        return 0; // featured default order
      });
  }, [activeCategory, searchQuery, sortBy]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Items': shopProducts.length };
    shopProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Curated Home Essentials | SpaceSavvy",
    "description": "Smart storage solutions, compact furniture, and functional organizers to help you clear clutter and streamline your space.",
    "url": "https://spacesavvy-olive.vercel.app/shop",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": shopProducts.slice(0, 15).map((prod, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": prod.name,
          "image": prod.image,
          "description": prod.description
        }
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-24 text-stone-800">
      <SEOHead
        title="Curated Home Essentials & Apartment Storage Blueprint"
        description="Smart storage solutions, compact furniture, and functional organizers to help you clear clutter and streamline your space."
        canonicalPath="/shop"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopSchema) }}
      />
      {/* 1. Clean Editorial Header */}
      <header className="mb-8">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60 inline-flex items-center gap-1.5 mb-3">
          <Sparkles className="w-3 h-3 text-amber-600" />
          CURATED CATALOG
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 leading-tight mb-3">
          Curated Home Essentials
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
          Smart storage solutions, compact furniture, and functional organizers to help you clear clutter and streamline your space.
        </p>
      </header>

      {/* 2. Filter Bar & Search Controls */}
      <div className="space-y-4 mb-8">
        {/* Clean Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ROOM_CATEGORIES.map((category) => {
            const count = categoryCounts[category] || 0;
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm ring-2 ring-stone-900'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-stone-700 text-stone-200' : 'bg-stone-200/80 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, material, or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm bg-white border border-stone-200/90 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700"
            >
              <option value="featured">Featured Curations</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Product Results Status Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 pb-3 border-b border-stone-200/70">
        <p>
          Showing <strong className="text-stone-800">{filteredProducts.length}</strong> vetted essentials
          {activeCategory !== 'All Items' && (
            <span> in <strong className="text-amber-800">{activeCategory}</strong></span>
          )}
        </p>
        <span className="text-[11px] font-mono text-stone-400">Renter-Friendly · Easy Setup</span>
      </div>

      {/* 4. Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
          <Filter className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">No products match your criteria</h3>
          <p className="text-xs text-stone-500 mb-4">
            Try adjusting your search terms or select "All Items" to view our complete catalog.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All Items');
              setSearchQuery('');
            }}
            className="text-xs font-semibold px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 mt-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 5. Curation Standards Footer Banner */}
      <section className="mt-16 bg-[#F9F7F4] border border-stone-200/90 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              OUR CURATION PROCESS
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Thoughtfully selected for form, function, and ease.
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every organizer, compact desk, and storage piece is chosen for durable materials, positive real-world reviews, and effortless everyday setup—whether you own or rent.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-white border border-stone-200/80 px-4 py-3 rounded-xl shadow-xs shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Links checked regularly</span>
          </div>
        </div>
      </section>
    </div>
  );
}
