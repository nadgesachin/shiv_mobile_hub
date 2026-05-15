import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Header from 'components/ui/Header';
import Footer from 'components/ui/Footer';

const QUICK_LINKS = [
  { label: 'Browse phones', icon: 'Smartphone', to: '/products-catalog?category=smartphones', accent: 'from-blue-500 to-cyan-500' },
  { label: 'Book a repair', icon: 'Wrench', to: '/services-hub?category=repair', accent: 'from-orange-500 to-rose-600' },
  { label: 'Recharge / Bill', icon: 'Receipt', to: '/services-hub?category=recharge', accent: 'from-emerald-500 to-teal-500' },
  { label: 'CSC services', icon: 'FileText', to: '/csc-portal', accent: 'from-purple-500 to-indigo-500' },
];

const NotFound = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/products-catalog?search=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-gradient-to-b from-white via-slate-50 to-white pt-10 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative"
          >
            <h1 className="font-headline text-[8rem] sm:text-[12rem] leading-none font-black text-transparent bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600 bg-clip-text opacity-90">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Icon name="Compass" size={120} className="text-rose-500/15" />
            </div>
          </motion.div>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            Hmm, this corner of the store is empty.
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            The page you tried to reach doesn't exist — but we've got plenty more you'll like.
          </p>

          <form onSubmit={handleSearch} className="mt-7 max-w-xl mx-auto">
            <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 shadow-soft px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
              <Icon name="Search" size={18} className="text-muted-foreground flex-shrink-0 ml-2" />
              <input
                type="text"
                placeholder="Search products, services, brands..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-foreground text-background text-sm font-semibold px-5 py-2 rounded-full hover:bg-foreground/90 transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Or jump to
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-medium p-4 text-center transition-all"
                >
                  <div
                    className={`mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br ${q.accent} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon name={q.icon} size={22} />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground">
                    {q.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => window.history?.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-foreground font-medium hover:bg-slate-50 transition"
            >
              <Icon name="ArrowLeft" size={16} /> Go back
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition"
            >
              <Icon name="Home" size={16} /> Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
