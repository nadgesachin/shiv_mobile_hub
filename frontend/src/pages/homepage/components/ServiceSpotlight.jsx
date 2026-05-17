import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../../services/api';
import PremiumServiceCard from '../../../components/ui/cards/PremiumServiceCard';

const ServiceSpotlight = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiService
      .getServices({ limit: 6 }, true)
      .then((res) => {
        if (!mounted) return;
        const list = res?.data?.services || res?.services || [];
        setServices(list);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-slate-100 animate-shimmer" />
          ))}
        </div>
      </section>
    );
  }

  if (!services.length) return null;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const rawImage =
              typeof s.image === 'string' ? s.image : s.image?.url;

            const imageUrl =
              rawImage && rawImage.trim()
                ? rawImage
                : 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80';

            return (
              <PremiumServiceCard
                key={s._id || i}
                index={i}
                service={{
                  ...s,
                  image: imageUrl,
                  imageAlt:
                    s.imageAlt ||
                    s.image?.alt ||
                    s.name ||
                    'Service',
                  popular: s.isPopular,
                  link:
                    s.link ||
                    `/services-hub/${s.slug || s._id || ''}`,
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default ServiceSpotlight;
