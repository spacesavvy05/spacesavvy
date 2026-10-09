import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../data/posts';

interface ArticleCardProps {
  post: Post;
  priority?: boolean;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const [pinned, setPinned] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Generate programmatic Pinterest Share URL with complete metadata
  const getPinterestUrl = (): string => {
    if (typeof window === 'undefined') return '';
    const targetUrl = new URL(`/blog/${post.slug}`, window.location.origin).href;
    const mediaUrl = post.featuredImageSrc;
    const desc = `${post.title}. ${post.excerpt} | SpaceSavvy Small Apartment Hacks #SpaceSavvy #SmallApartment #ApartmentHacks #InteriorStyling #HomeOrganization`;

    const params = new URLSearchParams({
      url: targetUrl,
      media: mediaUrl,
      description: desc,
    });

    return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
  };

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const pinUrl = getPinterestUrl();
    if (!pinUrl) return;

    const width = 750;
    const height = 620;
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

    const left = screenWidth / 2 - width / 2 + dualScreenLeft;
    const top = screenHeight / 2 - height / 2 + dualScreenTop;

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
    <article className="group flex flex-col justify-between w-full select-none">
      {/* 2:3 Vertical Visual Container */}
      <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        
        {/* Clickable Image Overlay Link (Sibling of button - zero nested anchor tags) */}
        <Link
          to={`/blog/${post.slug}`}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
          aria-label={`Read ${post.title}`}
        />

        {/* Real Photo with subtle hover zoom */}
        {!imgError ? (
          <img
            src={post.featuredImageSrc}
            alt={post.featuredImageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          /* Graceful warm editorial fallback */
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5] p-6 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
              {post.category}
            </span>
            <p className="font-serif font-bold text-stone-900 text-lg leading-snug">
              {post.title}
            </p>
            <span className="text-[10px] text-amber-700 font-mono font-bold">
              Read Guide →
            </span>
          </div>
        )}

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-transparent pointer-events-none" />

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
          title={`Save "${post.title}" to Pinterest`}
          aria-label={`Save "${post.title}" to Pinterest`}
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

        {/* Framer Motion Toast Feedback */}
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

        {/* Brand Micro-Label */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs py-0.5 px-2 rounded text-[9px] uppercase font-mono tracking-wider text-stone-800 border border-stone-200/50 pointer-events-none">
          SpaceSavvy
        </div>
      </div>

      {/* Text Block */}
      <div className="mt-4 px-1 text-left space-y-1">
        {/* Metadata Row */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-amber-700 font-extrabold text-[11px] tracking-wider uppercase">
            {post.category}
          </span>
          <span className="text-stone-300" aria-hidden="true">·</span>
          <span className="text-stone-400 font-medium text-xs font-mono">
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug line-clamp-2 mt-1 group-hover:text-amber-700 transition-colors">
          <Link to={`/blog/${post.slug}`} className="hover:underline decoration-amber-500 underline-offset-2">
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
