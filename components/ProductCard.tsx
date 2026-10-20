import React from 'react';
import { ShopProduct } from '../data/shopProducts';

export interface ProductCardProps {
  product: ShopProduct & {
    title?: string;
    highlight?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const targetUrl = product.affiliateUrl || 'https://amazon.com';
  const displayTitle = product.title || product.name;
  const displayDescription = product.description || product.highlight || '';

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="group flex flex-col justify-between bg-white border border-stone-200/90 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer"
    >
      <div>
        {/* Image Showcase */}
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#F7F5F0] overflow-hidden mb-4 border border-stone-100">
          <img
            src={product.image}
            alt={displayTitle}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Category Eyebrow */}
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 mb-1.5">
          {product.category}
        </p>

        {/* Product Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-700 leading-snug line-clamp-3 min-h-[4.2rem] mb-2 transition-colors duration-200">
          {displayTitle}
        </h3>

        {/* Editorial Takeaway / Description */}
        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 min-h-[3.8rem] mb-5">
          {displayDescription}
        </p>
      </div>

      {/* High-Impact Price & Animated Amber Button */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 mt-auto">
        <span className="text-[11px] font-semibold text-stone-500">See price on Amazon</span>
        <span className="relative inline-flex items-center gap-2 bg-amber-600 group-hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-sm group-hover:shadow-md group-hover:scale-105 active:scale-95 transition-all duration-200 ease-out">
          <span>Check Price</span>
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 text-sm">
            ↗
          </span>
        </span>
      </div>
    </a>
  );
}
