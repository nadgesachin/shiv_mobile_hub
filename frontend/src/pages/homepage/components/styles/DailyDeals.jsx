import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../../components/AppIcon';
import Image from '../../../../components/AppImage';
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';

const DailyDeals = ({ section, products }) => {
  const [timeLeft, setTimeLeft] = useState("10h:20m");
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const [h, m] = prev.split(/[:hms]/).filter(Boolean).map(Number);
        let totalMinutes = (h || 0) * 60 + (m || 0);
        if (totalMinutes > 0) {
          totalMinutes--;
        }
        const newH = Math.floor(totalMinutes / 60);
        const newM = totalMinutes % 60;
        return `${newH}h ${newM}m`;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-2 space-y-6 bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50 no-scrollbar">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-amber-500 mr-1.5">🕒</span>
            <span>{section.title}</span>
          </h2>
          <div className="bg-gradient-orange-purple px-3 py-1 shadow-colored animate-pulse-glow">
            <span className="text-xs font-bold text-white">
              Ends in {timeLeft}
            </span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              className="min-w-[140px] p-3 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/products-catalog/${product.id}`} className="block">
                <div className="relative mb-2 bg-gray-50 p-2 flex items-center justify-center h-24">
                  <Image src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  {product.discount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold h-6 w-6 flex items-center justify-center">
                      {product.discount}%
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 
               truncate 
               group-hover:text-primary 
               transition-colors">
                  {product.title}
                </p>


                <p className="text-xs text-green-600 font-bold flex items-center mt-1">
                  <span className="mr-1">↓</span> Upto {10}% off
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DailyDeals;
