import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, activeFiltersCount }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm">Price Range</h4>
        <div className="space-y-2">
          {[
            { id: 'under-10000', label: 'Under ₹10,000', value: [0, 10000] },
            { id: '10000-20000', label: '₹10,000 - ₹20,000', value: [10000, 20000] },
            { id: '20000-40000', label: '₹20,000 - ₹40,000', value: [20000, 40000] },
            { id: '40000-60000', label: '₹40,000 - ₹60,000', value: [40000, 60000] },
            { id: 'above-60000', label: 'Above ₹60,000', value: [60000, Infinity] }
          ].map((range) => (
            <div key={range.id} className="flex items-center">
              <input
                type="checkbox"
                id={range.id}
                checked={filters.price === range.value}
                onChange={() => onFilterChange('price', range.value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor={range.id} className="ml-2 text-sm text-foreground">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm">Brands</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {[
            'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google',
            'Vivo', 'OPPO', 'Realme', 'Nothing', 'Motorola',
            'Sony', 'Belkin', 'Anker', 'Spigen'
          ].map((brand) => (
            <div key={brand} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={filters.brand?.includes(brand) || false}
                onChange={() => {
                  const currentBrands = filters.brand || [];
                  const updatedBrands = currentBrands.includes(brand)
                    ? currentBrands.filter(b => b !== brand)
                    : [...currentBrands, brand];
                  onFilterChange('brand', updatedBrands);
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-foreground">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Features for mobile devices */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm">Features</h4>
        <div className="space-y-2">
          {['5G Support', 'Fast Charging', 'Wireless Charging', 'AMOLED Display', 'High Refresh Rate'].map((feature) => (
            <div key={feature} className="flex items-center">
              <input
                type="checkbox"
                id={`feature-${feature}`}
                checked={filters.features?.includes(feature) || false}
                onChange={() => {
                  const currentFeatures = filters.features || [];
                  const updatedFeatures = currentFeatures.includes(feature)
                    ? currentFeatures.filter(f => f !== feature)
                    : [...currentFeatures, feature];
                  onFilterChange('features', updatedFeatures);
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-foreground">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Rating */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm">Customer Rating</h4>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="checkbox"
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onChange={() => onFilterChange('rating', rating)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-foreground flex items-center">
                <span>{rating}+ </span>
                <div className="flex ml-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon 
                      key={i} 
                      name="Star" 
                      size={12} 
                      color={i < Math.floor(rating) ? "var(--color-warning)" : "var(--color-muted)"}
                      className={i < Math.floor(rating) ? "fill-current" : ""}
                    />
                  ))}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;