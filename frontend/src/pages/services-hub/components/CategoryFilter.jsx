import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  console.log('CategoryFilter categories:', categories);
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-headline font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Filter" size={18} />
        Filter by Category
      </h3>
      <div className="space-y-2">
        {categories?.map((category) => (
          <button
            key={category?._id}
            onClick={() => onCategoryChange(category?.slug)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-smooth touch-target ${
              activeCategory === category?.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon 
                name={category?.icon || 'Grid3x3'} 
                size={20}
                color={activeCategory === category?._id ? 'currentColor' : (category?.color || 'var(--color-primary)')}
              />
              <span className="font-medium text-sm">{category?.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;