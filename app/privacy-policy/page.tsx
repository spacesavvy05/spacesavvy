import React from 'react';
import { ShieldCheck, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../../src/components/SEOHead';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-stone-800">
      <SEOHead
        title="Privacy Policy & Cookie Disclosures"
        description="SpaceSavvy's GDPR, CCPA, and Google AdSense privacy policies, cookie transparency, and visitor data protections."
        canonicalPath="/privacy-policy"
      />
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 font-semibold font-mono mb-3">
        <ShieldCheck className="w-4 h-4 text-amber-700" />
        <span>Legal & Privacy Protection</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-black mb-4 leading-tight tracking-tight">
        Privacy Policy & Cookie Disclosures
      </h1>

      <p className="text-stone-500 text-xs sm:text-sm font-mono mb-8 pb-6 border-b border-stone-200">
        Last Updated: October 9, 2026 · GDPR & CCPA/CPRA Compliant
      </p>

      <div className="prose prose-stone max-w-none text-stone-600 space-y-6 leading-relaxed font-sans text-sm md:text-base">
        <p>
          At SpaceSavvy (accessible from spacesavvy-olive.vercel.app and related web endpoints), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of information collected and recorded by SpaceSavvy and how we utilize it.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-2">
          Information We Collect
        </h2>
        <p>
          We collect minimal, standard non-identifying telemetry needed to ensure fast delivery and mobile responsiveness:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-700">
          <li><strong>Log Files:</strong> Like most web servers, we log standard IP addresses, browser types, Internet Service Providers (ISP), date/time stamps, referring/exit pages, and click counts to analyze user trends and optimize site performance.</li>
          <li><strong>Cookies & Local Storage:</strong> We use local storage purely to remember user preferences (such as saved Pinterest bookmarks or table of contents collapse state).</li>
        </ul>

        <h2 id="cookies" className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          Google AdSense & DoubleClick DART Cookies
        </h2>
        <p>
          Google is a third-party vendor on our site. Google uses cookies, including DART cookies, to serve relevant advertisements to visitors based upon their visit to this and other websites across the web.
        </p>
        <p>
          Visitors may choose to decline or customize the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-medium hover:underline">https://policies.google.com/technologies/ads</a>.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          Amazon Associates & Affiliate Tracking
        </h2>
        <p>
          When you click on outbound product links to Amazon.com, Amazon places session cookies on your device to track referral attribution as described in our <Link to="/affiliate-disclosure" className="text-amber-800 font-semibold hover:underline">Affiliate Disclosure</Link>. SpaceSavvy does not collect or store your personal billing or address information.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          GDPR & CCPA Rights
        </h2>
        <p>
          Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain the right to request access to, deletion of, or restriction of any personal data. Because we do not mandate user registration or store private consumer records, our systems hold zero personal dossiers.
        </p>

        <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
          <Link to="/affiliate-disclosure" className="text-amber-800 hover:underline mr-4">Affiliate Disclosure</Link>
          <Link to="/terms" className="text-amber-800 hover:underline mr-4">Terms of Service</Link>
          <Link to="/ai-disclaimer" className="text-amber-800 hover:underline">AI Transparency</Link>
        </div>
      </div>
    </div>
  );
}
