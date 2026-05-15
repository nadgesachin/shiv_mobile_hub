import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ACTIONS = [
  {
    name: 'Recharge',
    icon: 'Smartphone',
    desc: 'Prepaid & postpaid',
    gradient: 'from-blue-500 to-cyan-400',
    link: '/services-hub?category=recharge',
  },
  {
    name: 'Bill Pay',
    icon: 'Receipt',
    desc: 'Electricity, DTH, gas',
    gradient: 'from-emerald-500 to-teal-400',
    link: '/services-hub?category=bills',
  },
  {
    name: 'Repair',
    icon: 'Wrench',
    desc: 'Same-day service',
    gradient: 'from-orange-500 to-rose-500',
    link: '/services-hub?category=repair',
  },
  {
    name: 'CSC',
    icon: 'FileText',
    desc: 'Govt. documents',
    gradient: 'from-purple-500 to-indigo-500',
    link: '/csc-portal',
  },
  {
    name: 'Compare',
    icon: 'GitCompare',
    desc: 'Top phones side-by-side',
    gradient: 'from-fuchsia-500 to-pink-500',
    link: '/products-catalog?compare=1',
  },
  {
    name: 'Sell Old',
    icon: 'Tag',
    desc: 'Instant quote',
    gradient: 'from-amber-500 to-orange-500',
    link: '/contact?topic=sell',
  },
];

const QuickActionsGrid = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Quick actions</h2>
          <p className="text-sm text-muted-foreground">One tap. Done.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {ACTIONS.map((a, idx) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.04 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to={a.link}
              className="group relative block overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-medium border border-gray-100 p-4 sm:p-5 transition-all"
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${a.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
              >
                <Icon name={a.icon} size={22} />
              </div>
              <div className="mt-3 font-semibold text-sm sm:text-base text-foreground">
                {a.name}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {a.desc}
              </div>
              <div
                className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${a.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default QuickActionsGrid;
