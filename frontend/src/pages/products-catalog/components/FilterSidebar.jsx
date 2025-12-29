import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, activeFiltersCount }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-headline font-bold text-lg text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            iconName="RefreshCw"
            iconPosition="left"
            className="text-xs"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-7 pb-7 border-b border-gray-100">
        <h4 className="font-headline font-semibold mb-4 text-sm text-foreground flex items-center gap-2">
          <Icon name="DollarSign" size={16} className="text-primary" />
          Price Range
        </h4>
        <div className="space-y-2.5">
          {[
            { id: 'under-10000', label: 'Under ₹10,000', value: [0, 10000] },
            { id: '10000-20000', label: '₹10,000 - ₹20,000', value: [10000, 20000] },
            { id: '20000-40000', label: '₹20,000 - ₹40,000', value: [20000, 40000] },
            { id: '40000-60000', label: '₹40,000 - ₹60,000', value: [40000, 60000] },
            { id: 'above-60000', label: 'Above ₹60,000', value: [60000, Infinity] }
          ].map((range) => (
            <label key={range.id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={filters.price === range.value}
                onChange={() => onFilterChange('price', range.value)}
                className="sr-only"
              />
              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors" style={{
                backgroundColor: filters.price === range.value ? 'var(--color-primary)' : 'transparent',
                borderColor: filters.price === range.value ? 'var(--color-primary)' : undefined
              }}>
                {filters.price === range.value && (
                  <Icon name="Check" size={12} className="text-white" />
                )}
              </div>
              <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-7 pb-7 border-b border-gray-100">
        <h4 className="font-headline font-semibold mb-4 text-sm text-foreground flex items-center gap-2">
          <Icon name="Package" size={16} className="text-primary" />
          Brands
        </h4>
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {[
            'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google',
            'Vivo', 'OPPO', 'Realme', 'Nothing', 'Motorola',
            'Sony', 'Belkin', 'Anker', 'Spigen'
          ].map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                className="sr-only"
              />
              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors" style={{
                backgroundColor: filters.brand?.includes(brand) ? 'var(--color-primary)' : 'transparent',
                borderColor: filters.brand?.includes(brand) ? 'var(--color-primary)' : undefined
              }}>
                {filters.brand?.includes(brand) && (
                  <Icon name="Check" size={12} className="text-white" />
                )}
              </div>
              <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Features for mobile devices */}
      <div className="mb-7 pb-7 border-b border-gray-100">
        <h4 className="font-headline font-semibold mb-4 text-sm text-foreground flex items-center gap-2">
          <Icon name="Zap" size={16} className="text-primary" />
          Features
        </h4>
        <div className="space-y-2.5">
          {['5G Support', 'Fast Charging', 'Wireless Charging', 'AMOLED Display', 'High Refresh Rate'].map((feature) => (
            <label key={feature} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                className="sr-only"
              />
              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors" style={{
                backgroundColor: filters.features?.includes(feature) ? 'var(--color-primary)' : 'transparent',
                borderColor: filters.features?.includes(feature) ? 'var(--color-primary)' : undefined
              }}>
                {filters.features?.includes(feature) && (
                  <Icon name="Check" size={12} className="text-white" />
                )}
              </div>
              <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                {feature}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="font-headline font-semibold mb-4 text-sm text-foreground flex items-center gap-2">
          <Icon name="Star" size={16} className="text-primary fill-primary" />
          Customer Rating
        </h4>
        <div className="space-y-2.5">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onChange={() => onFilterChange('rating', rating)}
                className="sr-only"
              />
              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors" style={{
                backgroundColor: filters.rating === rating ? 'var(--color-primary)' : 'transparent',
                borderColor: filters.rating === rating ? 'var(--color-primary)' : undefined
              }}>
                {filters.rating === rating && (
                  <Icon name="Check" size={12} className="text-white" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon 
                      key={i} 
                      name="Star" 
                      size={14} 
                      className={`${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                  {rating}+
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;