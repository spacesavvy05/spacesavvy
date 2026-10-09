import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { posts, Post } from '../data/posts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Filter matching articles by title, category, or takeaway (and excerpt)
  const filteredPosts: Post[] = trimmed
    ? posts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(trimmed);
        const categoryMatch = post.category.toLowerCase().includes(trimmed);
        const takeawayMatch = post.takeaway?.toLowerCase().includes(trimmed);
        const excerptMatch = post.excerpt?.toLowerCase().includes(trimmed);
        return titleMatch || categoryMatch || takeawayMatch || excerptMatch;
      })
    : posts.slice(0, 4); // Show top 4 recommended guides when input is blank

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-stone-900/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search guides and hacks"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] border border-stone-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-white">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-stone-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search small-space hacks, guides, or products..."
              className="w-full font-sans text-stone-900 text-base sm:text-lg bg-white rounded-2xl pl-12 pr-24 py-3.5 sm:py-4 border border-stone-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-stone-400 transition"
            />
            <div className="absolute right-3.5 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-stone-400 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md transition"
                aria-label="Close search"
              >
                <span>ESC</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="sm:hidden p-1.5 text-stone-600 hover:text-stone-900"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick filter suggestion pills */}
          {!trimmed && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Popular:</span>
              {['Drop-Leaf Desk', 'Kitchen Storage', 'Renter Hacks', 'Corner Shelving'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="bg-stone-100 hover:bg-amber-100 hover:text-amber-800 text-stone-600 px-2.5 py-1 rounded-full text-xs transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 px-1 pb-1">
            <span>
              {trimmed ? (
                <>
                  Found <strong className="text-stone-900">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'guide' : 'guides'}
                </>
              ) : (
                'Featured & Recommended Guides'
              )}
            </span>
            {trimmed && (
              <span className="text-[11px] font-mono text-stone-400">
                Live Results
              </span>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-2.5">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  onClick={onClose}
                  className="group block bg-white hover:bg-stone-50 border border-stone-200/90 hover:border-amber-300 rounded-2xl p-4 sm:p-4.5 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {post.readTime}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors text-base sm:text-lg leading-snug">
                        {post.title}
                      </h4>
                      {post.takeaway && (
                        <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed">
                          {post.takeaway}
                        </p>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 group-hover:bg-amber-100 text-stone-400 group-hover:text-amber-700 transition flex-shrink-0 mt-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Clear empty state */
            <div className="py-12 px-4 text-center bg-white rounded-2xl border border-stone-200/80">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-serif text-lg font-bold text-stone-900 mb-1">
                No guides found for that search.
              </p>
              <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed">
                Try searching for keywords like &ldquo;corner&rdquo;, &ldquo;drop-leaf&rdquo;, &ldquo;kitchen&rdquo;, &ldquo;organizer&rdquo;, or &ldquo;lighting&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Shortcuts */}
        <div className="p-3 sm:px-5 bg-stone-100/70 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px]">
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-600 shadow-2xs">ESC</kbd> to close
            <span className="mx-1.5 text-stone-300">·</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-600 shadow-2xs">/</kbd> to search anytime
          </span>
          <Link
            to="/shop"
            onClick={onClose}
            className="text-amber-800 hover:text-amber-900 font-bold hover:underline ml-auto flex items-center gap-1"
          >
            <span>Browse All Product Finds</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
