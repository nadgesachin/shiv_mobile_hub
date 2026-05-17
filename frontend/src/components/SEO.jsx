import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Shiv Mobile Hub',
  description = 'Your trusted destination for premium mobile phones, accessories, and repair services',
  keywords = 'mobile phones, smartphones, mobile accessories, phone repair, mobile hub',
  image = '/logo.png',
  url = window.location.href,
  type = 'website',
}) => {
  const siteName = 'Shiv Mobile Hub';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
    </Helmet>
  );
};

// Predefined SEO templates
export const ProductSEO = ({ product }) => (
  <SEO
    title={product.name}
    description={product.description || `Buy ${product.name} at best price with warranty and genuine quality`}
    keywords={`${product.name}, ${product.category?.name}, buy ${product.name}, ${product.brand}`}
    image={product.images?.[0]?.url}
    type="product"
  />
);

export const CategorySEO = ({ category }) => (
  <SEO
    title={category.name}
    description={category.description || `Browse ${category.name} with best deals and offers`}
    keywords={`${category.name}, mobile accessories, phone ${category.name}`}
  />
);

export const ServiceSEO = ({ service }) => (
  <SEO
    title={service.name}
    description={service.description || `Professional ${service.name} service at affordable prices`}
    keywords={`${service.name}, mobile repair, phone service`}
    type="service"
  />
);

export default SEO;
