import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

import BentoHero from "./components/BentoHero";
import QuickActionsGrid from "./components/QuickActionsGrid";
import BrandMarquee from "./components/BrandMarquee";
import DynamicSections from "./components/DynamicSections";
import ServiceSpotlight from "./components/ServiceSpotlight";
import CategoryCloud from "./components/CategoryCloud";
import SocialProofWall from "./components/SocialProofWall";
import CTASection from "./components/CTASection";
import RecentlyViewed from "../../components/products/RecentlyViewed";

const Homepage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <SEO
        title="Shiv Mobile Hub — Phones, Repair, Recharge & CSC, all in one place"
        description="Buy the latest smartphones, get same-day repair, instant recharges, bill payments and Govt. CSC services. Trusted by 12,000+ customers."
      />

      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white overflow-x-hidden">
        <Header />

        <main className="pb-24 md:pb-0">
          {/* 1. Hero — bento grid with featured + live stats + flash deal */}
          <BentoHero />

          {/* 2. Quick actions — one-tap services */}
          <QuickActionsGrid />

          {/* 3. Brand marquee */}
          <BrandMarquee />

          {/* 4. Dynamic backend-driven product sections (Trending, Deals, etc.) */}
          <DynamicSections />

          {/* 5. Service spotlight — premium 3D cards */}
          <ServiceSpotlight />

          {/* 6. Browse by category */}
          <CategoryCloud />

          {/* 7. Recently viewed (personal) */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <RecentlyViewed />
            </div>
          </section>

          {/* 8. Social proof — twin marquees of customer reviews */}
          <SocialProofWall />

          {/* 9. CTA cards */}
          <CTASection />
        </main>

        <Footer />

        {/* Sticky bottom action bar (mobile only) — quick contact + WhatsApp */}
        <div className="fixed bottom-0 inset-x-0 md:hidden z-40 p-3 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-2">
            <Link
              to="/services-hub"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-semibold active:scale-95 transition"
            >
              <Icon name="Calendar" size={16} /> Book service
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi%20Shiv%20Mobile%20Hub"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-white shadow-md active:scale-95 transition"
              aria-label="WhatsApp"
            >
              <Icon name="MessageCircle" size={20} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
