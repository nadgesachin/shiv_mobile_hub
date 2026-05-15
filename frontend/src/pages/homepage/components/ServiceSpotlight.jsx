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