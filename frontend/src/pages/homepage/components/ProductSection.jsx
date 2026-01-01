import React from 'react';
import { styleComponents } from './styles';
import ProductCarousel from './styles/ProductCarousel';

const ProductSection = ({ section, products }) => {
  const StyleComponent = styleComponents[section.style];

  if (StyleComponent) {
    return <StyleComponent section={section} products={products} />;
  }

  // Default to ProductCarousel if no specific style component is found
  return <ProductCarousel section={section} products={products} />;
};


export default ProductSection;
