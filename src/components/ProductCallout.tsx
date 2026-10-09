import React, { useState } from 'react';
import { Product } from '../data/posts';

interface ProductCalloutProps {
  product: Product;
}

export default function ProductCallout({ product }: ProductCalloutProps) {
  const [imgError, setImgError] = useState(false);
  if (!product) return null;

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 my-8 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-800">
            SHOP THIS LOOK
          </span>
        </div>
        <span className="text-xs font-mono text-stone-600 bg-stone-100 px-3 py-1 rounded-full font-medium inline-flex items-center gap-1.5">
          <span>Amazon Verified Spec</span>
          <span>•</span>
          <span className="font-semibold text-stone-800">Rating {product.rating}</span>
        </span>
      </div>

      {/* Main Content: Thumbnail + Specs */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Product Image Thumbnail */}
        {product.image && !imgError && (
          <div className="w-full sm:w-36 sm:h-36 aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shrink-0 relative group">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Specs Details */}
        <div className="flex-1 min-w-0 space-y-3 w-full">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-0.5">
              Product Spec
            </span>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h4>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-black text-amber-700 font-serif">
              {product.price}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-600">
            <div className="bg-stone-50 px-3 py-2 rounded-xl border border-stone-100">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-0.5">
                Dimensions
              </span>
              <span className="font-medium text-stone-800">{product.dimensions}</span>
            </div>
            <div className="bg-stone-50 px-3 py-2 rounded-xl border border-stone-100">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-0.5">
                Material
              </span>
              <span className="font-medium text-stone-800">{product.material}</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer"
            >
              <span>View Verified Item on Amazon</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
