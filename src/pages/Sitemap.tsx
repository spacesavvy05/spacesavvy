import React from 'react';
import { Map, FileText, ArrowRight, LayoutGrid, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { posts, CATEGORIES } from '../data/posts';

export default function SitemapPage() {
  const categorySlugMap: Record<string, string> = {
    'Small Space Living': 'small-spaces',
    'Kitchen & Dining': 'kitchen-dining',
    'Compact Workspaces': 'workspaces',
    'Curated Amazon Finds': 'amazon-finds',
  };

  const pageSections = [
    {
      title: "Core Editorial Content & Shopping",
      icon: LayoutGrid,
      links: [
        { name: "Editorial Homepage", path: "/" },
        { name: "Shop The Look Blueprint (Curated Catalog)", path: "/shop" },
        { name: "About SpaceSavvy & Editorial Manifesto", path: "/about" },
        { name: "HTML Sitemap Index", path: "/sitemap" },
      ],
    },
    {
      title: "Design Category Hubs",
      icon: Map,
      links: CATEGORIES.map((category) => {
        const slug = categorySlugMap[category] || 'small-spaces';
        return {
          name: `${category} Editorial Hub`,
          path: `/category/${slug}`,
        };
      }),
    },
    {
      title: "Deep-Dive Design Guides",
      icon: FileText,
      links: posts.map((post) => ({
        name: post.title,
        path: `/blog/${post.slug}`,
      })),
    },
    {
      title: "Legal & Regulatory Compliance",
      icon: ShieldCheck,
      links: [
        { name: "FTC Affiliate Disclosure", path: "/affiliate-disclosure" },
        { name: "GDPR & AdSense Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service & Rental Advisory", path: "/terms" },
        { name: "Synthetic Media & AI Disclaimer", path: "/ai-disclaimer" },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-stone-800">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 font-semibold font-mono mb-3">
        <LayoutGrid className="w-4 h-4" />
        <span>Technical SEO & Directory Index</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-black mb-4 leading-tight tracking-tight">
        SpaceSavvy Sitemap Directory
      </h1>

      <p className="text-stone-500 text-xs sm:text-sm font-mono mb-10 pb-6 border-b border-stone-200">
        Host: spacesavvy.com · Validated for Search Engine Crawlers & Readers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {pageSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="space-y-3 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg pb-2 border-b border-stone-150">
                <Icon className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{section.title}</span>
              </div>

              <ul className="space-y-2 pt-1">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="group flex items-start gap-2 text-sm text-stone-700 hover:text-amber-800 transition-colors py-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 mt-1 shrink-0 group-hover:translate-x-0.5 group-hover:text-amber-700 transition-transform" />
                      <div className="space-y-0.5">
                        <span className="font-sans font-medium">{link.name}</span>
                        <p className="text-[10px] text-stone-400 font-mono tracking-tight break-all">
                          https://spacesavvy.com{link.path}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
