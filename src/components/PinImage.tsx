import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export interface PinImageProps {
  src: string;
  alt: string;
  title: string;
  postUrl?: string;
  category?: string;
  aspectRatio?: '2/3' | '16/9' | '4/3' | '1/1' | 'auto';
  className?: string;
  priority?: boolean;
}

export default function PinImage({
  src,
  alt,
  title,
  postUrl,
  category = 'SpaceSavvy Blueprint',
  aspectRatio = '2/3',
  className = '',
}: PinImageProps) {
  const [pinned, setPinned] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '2/3':
        return 'aspect-[2/3]';
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-[4/3]';
      case '1/1':
        return 'aspect-square';
      default:
        return 'aspect-[2/3]';
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    let targetUrl = window.location.href;
    if (postUrl) {
      try {
        targetUrl = new URL(postUrl, window.location.origin).href;
      } catch {
        targetUrl = window.location.href;
      }
    }

    let mediaUrl = src;
    try {
      mediaUrl = new URL(src, window.location.origin).href;
    } catch {
      mediaUrl = src;
    }

    const pinDescription = `${title}. ${alt || title} | SpaceSavvy Small Apartment Living & Storage Hacks #SpaceSavvy #SmallApartment #ApartmentHacks #InteriorStyling #HomeOrganization #ScandiHome`;

    const params = new URLSearchParams({
      url: targetUrl,
      media: mediaUrl,
      description: pinDescription,
    });

    const pinterestUrl = `https://www.pinterest.com/pin/create/button/?${params.toString()}`;

    const width = 750;
    const height = 620;
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = screenWidth / 2 - width / 2 + dualScreenLeft;
    const top = screenHeight / 2 - height / 2 + dualScreenTop;

    const popup = window.open(
      pinterestUrl,
      'pinterest-pin-window',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,status=0,scrollbars=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(pinterestUrl, '_blank', 'noopener,noreferrer');
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
    <div
      className={`group relative w-full ${getAspectClass()} overflow-hidden rounded-2xl border border-stone-200/90 shadow-md bg-stone-100 ${className}`}
    >
      {/* Editorial Fallback Placeholder if Image Fails or Loads Slowly */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5] select-none pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase font-mono text-stone-500 font-bold">
            {category}
          </span>
          <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
            CURATED
          </span>
        </div>
        <div className="my-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
            SpaceSavvy Idea
          </span>
          <p className="text-lg sm:text-xl font-serif font-black text-stone-900 leading-tight">
            {title}
          </p>
          <div className="w-8 h-0.5 bg-amber-600"></div>
        </div>
        <p className="text-xs text-stone-600 line-clamp-2">
          {alt}
        </p>
      </div>

      {/* Render Main Image */}
      {!imgError && src && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Subtle Dark Gradient Overlay at Top for Button Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Floating Pinterest Save Button */}
      <motion.button
        type="button"
        onClick={handlePin}
        whileHover={{
          scale: [1, 1.05, 1.02, 1.05],
          transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
        }}
        whileTap={{ scale: 0.94 }}
        className={`absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-md transition-all duration-200 cursor-pointer select-none focus:outline-none ${
          pinned ? 'bg-stone-950 text-white' : 'bg-[#E60023] hover:bg-[#ad081b]'
        } opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100`}
        aria-label={`Save "${title}" to Pinterest`}
        title={`Save to Pinterest`}
      >
        {pinned ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Saved!</span>
          </>
        ) : (
          <>
            <span className="text-xs leading-none">📌</span>
            <span>Save</span>
          </>
        )}
      </motion.button>

      {/* Brand Watermark Bottom Left */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-stone-900 border border-stone-200/80 shadow-xs pointer-events-none">
        SpaceSavvy
      </div>

      {/* Save Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            className="absolute bottom-4 inset-x-3 mx-auto w-fit z-30 flex items-center gap-2 bg-stone-950/95 text-white px-4 py-2 rounded-full shadow-2xl border border-stone-800 text-xs font-sans whitespace-nowrap pointer-events-none"
          >
            <span className="w-4 h-4 rounded-full bg-[#E60023] text-white flex items-center justify-center shrink-0 text-[10px]">
              📌
            </span>
            <span className="font-semibold">Saved to your Board</span>
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
