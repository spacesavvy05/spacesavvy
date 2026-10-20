import React, { useState } from 'react';
import { Product, AltPick } from '../data/posts';

interface ProductCalloutProps {
  product: Product;
  alsoGood?: AltPick[];
}

// Compact product card: name + one button, with optional "Also good" picks inside the same card.
export default function ProductCallout({ product, alsoGood }: ProductCalloutProps) {
  const [imgError, setImgError] = useState(false);
  if (!product) return null;

  const details = [product.dimensions, product.material].filter(Boolean).join(' · ');
  const extras = Array.isArray(alsoGood) ? alsoGood.filter((p) => p && p.name && p.affiliateUrl) : [];

  return (
    <div className="my-8 max-w-xl mx-auto bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        {product.image && !imgError && (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-20 h-20 object-contain rounded-xl border border-stone-100 bg-white shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block mb-0.5">
            Our pick
          </span>
          <p className="font-serif text-lg font-bold text-stone-900 leading-snug">{product.name}</p>
          {details && <p className="text-xs text-stone-500 mt-1">{details}</p>}
        </div>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-colors duration-200 cursor-pointer text-center"
        >
          <span>Check price on Amazon</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {extras.length > 0 && (
        <div className="border-t border-stone-100 bg-stone-50/70 px-4 sm:px-5 py-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-1.5">Also good</p>
          <ul className="space-y-1.5">
            {extras.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-snug">
                <span className="shrink-0 mt-0.5 rounded-full bg-white border border-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-stone-600">
                  {p.label}
                </span>
                <a
                  href={p.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="text-stone-800 font-semibold underline decoration-amber-400 underline-offset-2 hover:text-amber-800"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
