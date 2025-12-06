import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, activeFiltersCount }) => {
  const handleCheckboxChange = (category, value) => {
    const currentValues = filters?.[category] || [];
    const newValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(category, newValues);
  };

  const filterSections = [
    {
      id: 'category',
      title: 'Category',
      icon: 'Grid',
      options: [
        { value: 'smartphones', label: 'Smartphones', count: 45 },
        { value: 'accessories', label: 'Accessories', count: 128 },
        { value: 'tablets', label: 'Tablets', count: 23 },
        { value: 'smartwatches', label: 'Smartwatches', count: 34 },
        { value: 'audio', label: 'Audio Devices', count: 56 },
      ],
    },
    {
      id: 'brand',
      title: 'Brand',
      icon: 'Tag',
      options: [
        { value: 'samsung', label: 'Samsung', count: 67 },
        { value: 'apple', label: 'Apple', count: 45 },
        { value: 'xiaomi', label: 'Xiaomi', count: 52 },
        { value: 'oneplus', label: 'OnePlus', count: 34 },
        { value: 'realme', label: 'Realme', count: 41 },
        { value: 'oppo', label: 'OPPO', count: 38 },
      ],
    },
    {
      id: 'priceRange',
      title: 'Price Range',
      icon: 'IndianRupee',
      options: [
        { value: 'under5k', label: 'Under ₹5,000', count: 89 },
        { value: '5k-10k', label: '₹5,000 - ₹10,000', count: 76 },
        { value: '10k-20k', label: '₹10,000 - ₹20,000', count: 54 },
        { value: '20k-30k', label: '₹20,000 - ₹30,000', count: 43 },
        { value: 'above30k', label: 'Above ₹30,000', count: 38 },
      ],
    },
    {
      id: 'features',
      title: 'Features',
      icon: 'Sparkles',
      options: [
        { value: '5g', label: '5G Support', count: 67 },
        { value: 'fastCharging', label: 'Fast Charging', count: 89 },
        { value: 'wireless', label: 'Wireless Charging', count: 34 },
        { value: 'waterproof', label: 'Water Resistant', count: 45 },
        { value: 'dualSim', label: 'Dual SIM', count: 102 },
      ],
    },
    {
      id: 'storage',
      title: 'Storage',
      icon: 'HardDrive',
      options: [
        { value: '64gb', label: '64GB', count: 45 },
        { value: '128gb', label: '128GB', count: 78 },
        { value: '256gb', label: '256GB', count: 56 },
        { value: '512gb', label: '512GB', count: 23 },
      ],
    },
    {
      id: 'rating',
      title: 'Customer Rating',
      icon: 'Star',
      options: [
        { value: '4plus', label: '4★ & Above', count: 156 },
        { value: '3plus', label: '3★ & Above', count: 234 },
        { value: '2plus', label: '2★ & Above', count: 278 },
      ],
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-headline font-bold text-foreground flex items-center space-x-2">
          <Icon name="SlidersHorizontal" size={20} color="var(--color-primary)" />
          <span>Filters</span>
        </h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
      {activeFiltersCount > 0 && (
        <div className="mb-6 p-3 bg-primary/10 rounded-md">
          <p className="text-sm font-medium text-primary">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
          </p>
        </div>
      )}
      <div className="space-y-6">
        {filterSections?.map((section) => (
          <div key={section?.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
              <Icon name={section?.icon} size={16} color="var(--color-muted-foreground)" />
              <span>{section?.title}</span>
            </h3>
            <div className="space-y-2">
              {section?.options?.map((option) => (
                <label
                  key={option?.value}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Checkbox
                      checked={(filters?.[section?.id] || [])?.includes(option?.value)}
                      onChange={() => handleCheckboxChange(section?.id, option?.value)}
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-smooth">
                      {option?.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">({option?.count})</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <Button variant="default" fullWidth iconName="Check" iconPosition="left">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;