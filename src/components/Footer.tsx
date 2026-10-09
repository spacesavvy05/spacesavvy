import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 text-left">
      <div className="max-w-6xl mx-auto py-10 px-6">
        {/* 3-Column Tightened Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1 (Brand & Mission): md:col-span-5 */}
          <div className="md:col-span-5">
            <Link
              to="/"
              className="font-serif text-2xl font-bold text-stone-100 hover:text-amber-400 transition-colors duration-150 inline-block"
            >
              SpaceSavvy.
            </Link>
            <p className="text-xs text-stone-400 mt-3 max-w-sm leading-relaxed">
              Practical small-space organization, compact room setups, and budget-friendly finds curated for real apartments. Zero drywall damage, 100% renter-friendly.
            </p>

            {/* Curated Shop Callout in Footer */}
            <div className="mt-4 pt-4 border-t border-stone-800/80">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors bg-stone-800/80 hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700/60"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Browse The Shop Blueprint</span>
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-stone-400">
              <a
                href="https://pinterest.com/spacesavvyhacks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors duration-150"
                aria-label="Follow SpaceSavvy on Pinterest"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
                <span>Pinterest</span>
              </a>

              <a
                href="https://instagram.com/spacesavvyhacks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors duration-150"
                aria-label="Follow SpaceSavvy on Instagram"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Col 2 (Explore): md:col-span-3 */}
          <div className="md:col-span-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-3 block">
              EXPLORE
            </span>
            <ul className="text-xs text-stone-400 space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-150 block font-medium"
                >
                  Shop The Blueprint ✨
                </Link>
              </li>
              <li>
                <Link
                  to="/category/small-spaces"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Small Apartment Living
                </Link>
              </li>
              <li>
                <Link
                  to="/category/kitchen-dining"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Kitchen & Dining Storage
                </Link>
              </li>
              <li>
                <Link
                  to="/category/workspaces"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Compact Workspaces
                </Link>
              </li>
              <li>
                <Link
                  to="/category/amazon-finds"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Curated Amazon Finds
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 (Info & Legal): md:col-span-4 */}
          <div className="md:col-span-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-3 block">
              LEGAL & ABOUT
            </span>
            <ul className="text-xs text-stone-400 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  About SpaceSavvy
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate-disclosure"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Affiliate Disclosure (FTC Compliant)
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Privacy Policy & Cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  Terms of Service & Rental Advisory
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-disclaimer"
                  className="hover:text-amber-400 transition-colors duration-150 block"
                >
                  AI & Synthetic Media Statement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Compact Bottom Bar */}
        <div className="border-t border-stone-800 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 SpaceSavvy. All rights reserved.</p>
          <p className="text-center sm:text-right">
            SpaceSavvy is an Amazon Associate and earns from qualifying purchases at zero added cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
