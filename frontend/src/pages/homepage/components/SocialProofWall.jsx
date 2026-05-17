import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import apiService from '../../../services/api';

const FALLBACK = [
  {
    name: 'Rajesh Kumar',
    role: 'Small business owner',
    rating: 5,
    comment:
      'Got my PAN updated in 3 days. The CSC team here actually knows what they’re doing.',
    service: 'CSC Services',
    avatar: 'https://i.pravatar.cc/120?u=rajesh',
  },
  {
    name: 'Priya Sharma',
    role: 'Teacher',
    rating: 5,
    comment:
      'Cracked iPhone screen replaced in 2 hours with original parts and a 6-month warranty.',
    service: 'Mobile Repair',
    avatar: 'https://i.pravatar.cc/120?u=priya',
  },
  {
    name: 'Aakash Verma',
    role: 'College student',
    rating: 5,
    comment:
      'Found a great phone within budget. Staff helped me compare three options without rushing.',
    service: 'Product Purchase',
    avatar: 'https://i.pravatar.cc/120?u=aakash',
  },
  {
    name: 'Sunita Patel',
    role: 'Homemaker',
    rating: 5,
    comment:
      'Pay all my bills here in one trip. Fast, reliable, and the receipts arrive instantly.',
    service: 'Bill Payments',
    avatar: 'https://i.pravatar.cc/120?u=sunita',
  },
  {
    name: 'Mohit Singh',
    role: 'Delivery partner',
    rating: 5,
    comment:
      'Quick recharge and the staff even helped fix a charging issue. Best in the area.',
    service: 'Mobile Recharge',
    avatar: 'https://i.pravatar.cc/120?u=mohit',
  },
  {
    name: 'Neha Joshi',
    role: 'Working professional',
    rating: 5,
    comment:
      'Sold my old phone here — got the best quote and the trade-in was instant.',
    service: 'Sell Old Phone',
    avatar: 'https://i.pravatar.cc/120?u=neha',
  },
];

const SocialProofWall = () => {
  const [reviews, setReviews] = useState(FALLBACK);

  useEffect(() => {
    let mounted = true;
    apiService
      .getReviews({ status: 'approved', limit: 8 })
      .then((res) => {
        if (!mounted) return;
        // Backend returns { success, reviews, summary } at the root; tolerate older nested shape.
        const list = res?.reviews || res?.data?.reviews || [];
        if (list.length >= 3) {
          setReviews(
            list.map((r) => ({
              name: r.user?.name || r.name || 'Customer',
              role: r.user?.role || r.title || '',
              rating: r.rating || 5,
              comment: r.comment || r.text,
              service: r.serviceTitle || r.productTitle || '',
              avatar:
                r.user?.avatar ||
                `https://i.pravatar.cc/120?u=${encodeURIComponent(r._id || r.name)}`,
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Split into two rows for the marquee
  const half = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, half);
  const row2 = reviews.slice(half).length ? reviews.slice(half) : row1.slice().reverse();

  const Card = ({ r }) => (
    <div className="flex-shrink-0 w-[300px] sm:w-[360px] rounded-3xl bg-white p-6 shadow-soft border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={r.avatar}
          alt={r.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
          loading="lazy"
        />
        <div>
          <div className="font-semibold text-foreground">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.role}</div>
        </div>
        <div className="ml-auto flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: r.rating || 5 }).map((_, i) => (
            <Icon key={i} name="Star" size={14} className="fill-current" />
          ))}
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">{r.comment}</p>
      {r.service && (
        <span className="inline-flex mt-3 text-[11px] uppercase tracking-wider font-semibold text-primary">
          {r.service}
        </span>
      )}
    </div>
  );

  const MarqueeRow = ({ items, direction = 'left', duration = 40 }) => (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-5 will-change-transform py-2"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((r, i) => (
          <Card key={`${r.name}-${i}`} r={r} />
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="w-full py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-soft">
          <Icon name="Heart" size={12} className="text-rose-500" /> Loved by 12,000+ customers
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          What customers are saying
        </h2>
      </div>

      <div className="space-y-5">
        <MarqueeRow items={row1} direction="left" duration={45} />
        <MarqueeRow items={row2} direction="right" duration={55} />
      </div>
    </section>
  );
};

export default SocialProofWall;
