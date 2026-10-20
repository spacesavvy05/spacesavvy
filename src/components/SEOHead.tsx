import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export default function SEOHead({
  title,
  description,
  canonicalPath,
  ogImage = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
  ogType = 'website',
}: SEOHeadProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('SpaceSavvy') ? title : `${title} | SpaceSavvy`;
    document.title = fullTitle;

    // 2. Helper to set or create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 3. Update canonical URL
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://spacesavvy-olive.vercel.app';
    const targetUrl = canonicalPath ? `${origin}${canonicalPath}` : `${origin}${location.pathname}`;
    setMeta('property', 'og:url', targetUrl);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', targetUrl);
  }, [title, description, canonicalPath, ogImage, ogType, location.pathname]);

  return null;
}
