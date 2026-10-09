import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import CategoryDetail from './pages/CategoryDetail';
import Shop from './pages/Shop';
import AffiliateDisclosure from './pages/AffiliateDisclosure';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AIDisclaimer from './pages/AIDisclaimer';
import About from './pages/About';
import SitemapPage from './pages/Sitemap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ScrollToTop helper on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Global warm linen off-white container */}
      <div className="min-h-screen bg-[#FAF8F5] text-stone-700 font-sans flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 selection:font-semibold">
        {/* REFACTORED HIGH-CONTRAST NAVBAR */}
        <Navbar />

        {/* MAIN BODY AREA */}
        <main className="flex-grow pt-0 mt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/ai-disclaimer" element={<AIDisclaimer />} />
            <Route path="/about" element={<About />} />
            <Route path="/sitemap" element={<SitemapPage />} />
          </Routes>
        </main>

        {/* GLOBAL FOOTER */}
        <Footer />
      </div>
    </Router>
  );
}
