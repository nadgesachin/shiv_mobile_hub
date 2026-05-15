import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import HorizontalScrollSection from '../../../components/ui/HorizontalScrollSection';

const CTASection = () => {
  const ctaCards = [
    {
      id: 1,
      title: "Need Urgent Mobile Repair?",
      description: "Get your phone fixed by experts with genuine parts and warranty",
      icon: "Wrench",
      color: "var(--color-primary)",
      bgColor: "bg-primary/10",
      cta: { text: "Book Repair Now", link: "/services-hub" },
      features: ["Same Day Service", "Genuine Parts", "6 Month Warranty"]
    },
    {
      id: 2,
      title: "Government Services Made Easy",
      description: "Complete all your document work with expert guidance",
      icon: "FileText",
      color: "var(--color-secondary)",
      bgColor: "bg-secondary/10",
      cta: { text: "Visit CSC Portal", link: "/csc-portal" },
      features: ["CSC Authorized", "Fast Processing", "Expert Help"]
    },
    {
      id: 3,
      title: "Explore Latest Mobiles",
      description: "Discover newest smartphones and accessories at best prices",
      icon: "ShoppingBag",
      color: "var(--color-success)",
      bgColor: "bg-success/10",
      cta: { text: "Browse Products", link: "/products-catalog" },
      features: ["Latest Models", "Best Prices", "Genuine Products"]
    }
  ];

  const gradientColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-30" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the service you need and experience hassle-free digital convenience
          </p>
        </motion.div>

        <HorizontalScrollSection
          title=""
          gradient="from-purple-600 to-pink-600"
          showArrows={true}
          showDots={false}
        >
          {ctaCards?.map((card, index) => (
            <motion.div
              key={card?.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="flex-shrink-0 w-96"
            >
              <div className="relative h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                {/* Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[index]} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 bg-gradient-to-br ${gradientColors[index]} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon name={card?.icon} size={36} className="text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${gradientColors[index]} bg-clip-text text-transparent`}>
                    {card?.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6">{card?.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {card?.features?.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        >
                          <Icon name="CheckCircle" size={18} className="text-green-500" />
                        </motion.div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link to={card?.cta?.link}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full relative overflow-hidden rounded-2xl group/btn"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[index]}`} />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                      <div className="relative px-6 py-4 flex items-center justify-center gap-2">
                        <span className="text-white font-semibold">{card?.cta?.text}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Icon name="ArrowRight" size={18} className="text-white" />
                        </motion.div>
                      </div>
                    </motion.button>
                  </Link>
                </div>

                {/* Hover Effect - Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${gradientColors[index]} opacity-0 group-hover:opacity-100 blur-3xl -z-10 transition-opacity duration-500`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </HorizontalScrollSection>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-card rounded-xl shadow-soft">
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={24} color="var(--color-primary)" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Need Help? Call Us</p>
                <p className="text-lg font-semibold text-foreground">+91 98765 43210</p>
              </div>
            </div>
            <span className="hidden sm:inline text-muted-foreground">or</span>
            <Link to="/contact">
              <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                Chat with Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;