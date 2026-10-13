import React, { useState } from 'react';
import { Product } from '../data/posts';

interface ProductCalloutProps {
  product: Product;
}

export default function ProductCallout({ product }: ProductCalloutProps) {
  const [imgError, setImgError] = useState(false);
  if (!product) return null;

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden my-10 shadow-sm transition-all duration-300 hover:shadow-md max-w-xl mx-auto">
      {/* top badge bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-stone-50/80 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-stone-800">
            editor pick
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200/60 font-medium">
          verified spec • rating {product.rating}
        </span>
      </div>

      {/* large full-width product image */}
      {product.image && !imgError && (
        <div className="w-full aspect-[4/3] bg-stone-50 overflow-hidden relative group border-b border-stone-100">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>
      )}

      {/* card body */}
      <div className="p-6 sm:p-7 space-y-5">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-amber-700 block mb-1 font-semibold">
            recommended piece
          </span>
          <h4 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
            {product.name}
          </h4>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-stone-900 font-serif">
            {product.price}
          </span>
        </div>

        {/* dimensions and material pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-0.5">
              dimensions
            </span>
            <span className="font-medium text-stone-800">{product.dimensions}</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-0.5">
              material
            </span>
            <span className="font-medium text-stone-800">{product.material}</span>
          </div>
        </div>

        {/* full-width call to action button */}
        <div className="pt-2">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer text-center"
          >
            <span>view verified item on amazon</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}