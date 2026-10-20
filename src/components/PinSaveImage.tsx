import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PinSaveImageProps {
  src?: string;
  alt: string;
  title: string;
  description?: string;
  articleUrl?: string;
  aspectClass?: string; // e.g. "aspect-[2/3]" or "aspect-[3/4]"
  category?: string;
  id?: number;
  className?: string;
}

export default function PinSaveImage({
  src,
  alt,
  title,
  description,
  articleUrl,
  aspectClass = "aspect-[2/3]",
  category,
  id,
  className = ""
}: PinSaveImageProps) {
  const [imageError, setImageError] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Programmatically construct the official Pinterest Pin Create URL with complete metadata
  const getPinterestShareUrl = (): string => {
    if (typeof window === 'undefined') return '';

    // 1. Resolve full target article/page URL
    let targetUrl = window.location.href;
    if (articleUrl) {
      try {
        targetUrl = new URL(articleUrl, window.location.origin).href;
      } catch {
        targetUrl = articleUrl;
      }
    }

    // 2. Resolve absolute media image URL
    const fallbackMedia = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200";
    let targetMedia = src || fallbackMedia;
    if (targetMedia && !targetMedia.startsWith('http')) {
      try {
        targetMedia = new URL(targetMedia, window.location.origin).href;
      } catch {
        // fallback to existing string
      }
    }

    // 3. Construct rich, high-intent Pinterest description with keywords and hashtags
    const detailedSnippet = (description || alt || title).trim();
    const pinDescription = `${title}. ${detailedSnippet} | SpaceSavvy Small Apartment Living & Storage Hacks #SpaceSavvy #SmallApartment #ApartmentHacks #InteriorStyling #HomeOrganization #ScandiHome`;

    // 4. Encode query parameters
    const params = new URLSearchParams({
      url: targetUrl,
      media: targetMedia,
      description: pinDescription,
    });

    return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
  };

  // Trigger Pinterest Pin Create popup and trigger the toast notification
  const handlePinIt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const pinterestUrl = getPinterestShareUrl();
    if (!pinterestUrl) return;

    // Center the Pinterest popup window on user screen
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

    // If popup blocker triggers, open in new tab gracefully
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
      className={`group relative w-full ${aspectClass} overflow-hidden rounded-2xl border border-stone-200/60 bg-[#F4EFE6] transition-all duration-300 hover:shadow-lg hover:border-stone-300 ${className}`}
    >
      {/* Background Texture Mesh Fallback (Zero-Broken-Image Policy) */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5EFE6] to-[#EAE2D5] select-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase font-mono text-stone-500 font-semibold">
            {category || "SPACESAVVY DESIGN"}
          </span>
          {id && (
            <span className="text-xs font-mono font-semibold text-stone-400">
              #{String(id).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Clean Typographic Minimalist Editorial Core */}
        <div className="my-auto text-left space-y-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-amber-800 font-bold block">
            SpaceSavvy Idea
          </span>
          <p className="text-xl font-serif font-bold text-stone-900 leading-tight">
            {title}
          </p>
          <div className="w-6 h-0.5 bg-amber-600"></div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-sans text-stone-700 line-clamp-2 leading-relaxed">
            {description || alt}
          </p>
          <div className="flex items-center text-[10px] text-amber-700 font-bold gap-1">
            <span>Read Guide</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Real Image Layer (Loads if available and valid) */}
      {!imageError && src && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}

      {/* Soft Hover Overlay Tint */}
      <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Optional full-card clickable navigation overlay for the article (Sibling of button, NOT wrapping it) */}
      {articleUrl && (
        articleUrl.startsWith('http') ? (
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
            aria-label={`Read ${title}`}
          />
        ) : (
          <Link
            to={articleUrl}
            className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
            aria-label={`Read ${title}`}
          />
        )
      )}

      {/* Floating '📌 Save' Action Button with Framer Motion hover pulse animation */}
      <motion.button
        type="button"
        onClick={handlePinIt}
        whileHover={{
          scale: [1, 1.06, 1.02, 1.06],
          boxShadow: [
            "0 4px 6px -1px rgba(230, 0, 35, 0.3), 0 2px 4px -2px rgba(230, 0, 35, 0.3)",
            "0 10px 15px -3px rgba(230, 0, 35, 0.45), 0 4px 6px -4px rgba(230, 0, 35, 0.45)",
            "0 4px 6px -1px rgba(230, 0, 35, 0.3), 0 2px 4px -2px rgba(230, 0, 35, 0.3)"
          ],
          transition: {
            repeat: Infinity,
            duration: 1.3,
            ease: "easeInOut"
          }
        }}
        whileTap={{ scale: 0.93 }}
        className={`absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-colors duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E60023] ${
          pinned
            ? 'bg-stone-900 text-white'
            : 'bg-[#E60023] hover:bg-[#ad081b]'
        } opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100`}
        title={`Save "${title}" to your Board`}
        aria-label={`Save "${title}" to your Board`}
      >
        {pinned ? (
          <>
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="font-sans whitespace-nowrap text-[11px] font-bold">Saved!</span>
          </>
        ) : (
          <>
            <span className="text-xs leading-none">📌</span>
            <span className="font-sans whitespace-nowrap text-[11px] font-bold tracking-tight">Save</span>
          </>
        )}
      </motion.button>

      {/* Lightweight Framer-Motion Toast Notification: 'Saved to your Board' */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className="absolute bottom-5 inset-x-3 mx-auto w-fit z-30 flex items-center gap-2 bg-stone-900/95 text-white px-4 py-2 rounded-full shadow-2xl border border-stone-700/60 backdrop-blur-md whitespace-nowrap text-xs font-sans pointer-events-none"
          >
            <span className="w-4 h-4 rounded-full bg-[#E60023] text-white flex items-center justify-center shrink-0 text-[10px]">
              📌
            </span>
            <span className="font-semibold text-white tracking-wide">Saved to your Board</span>
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Brand Tag on bottom left of image */}
      <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-xs py-1 px-2.5 rounded-md text-[10px] uppercase font-mono tracking-wider text-stone-800 border border-stone-100 shadow-xs pointer-events-none">
        SpaceSavvy
      </div>
    </div>
  );
}
