import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileSwipe from '../../../../components/ui/animations/MobileSwipe';
import useViewport from '../../../../hooks/useViewport';

const CategoryGrid = ({ section, products }) => {
  const navigate = useNavigate();
  const viewport = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

  // TODO: Replace with dynamic categories from API or section data
  const categories = [
    {
      name: "Smartphones & Tablets",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Laptops & Computers",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Televisions & Smart TVs",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Smart Watches & Wearables",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Headphones & Earphones",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Speakers & Audio Systems",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50 rounded-2xl shadow-sm border border-gray-100">
      <MobileSwipe
        onSwipeLeft={() => setCurrentIndex(Math.min(currentIndex + 1, Math.ceil(categories.length / 2) - 1))}
        onSwipeRight={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
        className="touch-pan-y"
      >
        <motion.div
          className="grid grid-rows-2 grid-flow-col auto-cols-max gap-4 w-max"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="card-premium flex flex-col items-center p-2 transition-all duration-300 hover:-translate-y-2 group"
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-gray-100 rounded-full overflow-hidden shadow-sm flex items-center justify-center p-2 group-hover:bg-blue-100 transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-3 text-sm font-medium text-center text-gradient">{cat.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </MobileSwipe>
    </div>
  );
};

export default CategoryGrid;
