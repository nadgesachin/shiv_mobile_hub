import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-headline font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Filter" size={18} />
        Filter by Category
      </h3>
      <div className="space-y-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-smooth touch-target ${
              activeCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon 
                name={category?.icon} 
                size={20} 
                color={activeCategory === category?.id ? 'currentColor' : category?.color}
              />
              <span className="font-medium text-sm">{category?.name}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              activeCategory === category?.id
                ? 'bg-primary-foreground/20'
                : 'bg-background'
            }`}>
              {category?.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;