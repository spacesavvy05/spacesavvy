import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Keyboard shortcut listener for / and Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Small Spaces', path: '/category/small-spaces' },
    { label: 'Kitchen & Dining', path: '/category/kitchen-dining' },
    { label: 'Workspaces', path: '/category/workspaces' },
    { label: 'Amazon Finds', path: '/category/amazon-finds' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 py-3.5 px-4 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-black tracking-tight text-stone-950 hover:text-amber-800 transition-colors"
          >
            SpaceSavvy
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-semibold text-sm transition tracking-normal ${
                    isActive
                      ? 'text-amber-800 font-bold'
                      : 'text-stone-900 hover:text-amber-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions: Search Button & Shop Finds */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-stone-700 hover:text-stone-900 hover:bg-stone-100 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Search guides and hacks (/ or Ctrl+K)"
              title="Search (/ or ⌘K)"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link
              to="/shop"
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm"
            >
              Shop Finds
            </Link>
          </div>

          {/* Mobile Actions: Search Trigger & Hamburger Button */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-stone-700 hover:text-stone-900 hover:bg-stone-100 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Search guides and hacks"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-900 hover:text-amber-700 transition-colors rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FAF8F5] border-b border-stone-200/90 shadow-lg px-6 py-6 space-y-4">
            <nav className="flex flex-col gap-3.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-stone-900 font-semibold text-base hover:text-amber-700 transition py-1"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 rounded-full transition shadow-sm"
                >
                  Shop Finds
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal Overlay */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
