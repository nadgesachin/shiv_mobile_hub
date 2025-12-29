# Component Usage Guide
## Quick Reference for Premium UI Components

---

## 🎯 Button Component

### Basic Usage
```jsx
import Button from '@/components/ui/Button';

// Default button
<Button>Click me</Button>

// With variant
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="premium">Premium</Button>

// With size
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icon
<Button iconName="ShoppingCart" iconPosition="left">
  Add to Cart
</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

### Available Variants
- `default` - Primary blue button
- `secondary` - Secondary teal button
- `outline` - Outlined button
- `ghost` - Ghost button (minimal)
- `link` - Link button
- `success` - Green success button
- `warning` - Amber warning button
- `danger` - Red danger button
- `destructive` - Red destructive button
- `premium` - Gradient premium button

---

## 📦 Product Card Component

### Basic Usage
```jsx
import ProductCard from '@/components/products/ProductCard';

<ProductCard 
  product={{
    _id: '123',
    name: 'iPhone 15 Pro',
    description: 'Latest flagship smartphone',
    price: 99999,
    originalPrice: 119999,
    images: [{ url: 'image.jpg', alt: 'Product' }],
    rating: 4.5,
    reviewCount: 128,
    stockStatus: 'in-stock', // 'in-stock', 'low-stock', 'out-of-stock'
    badge: 'New',
    category: 'smartphones'
  }}
/>
```

### Product Object Structure
```javascript
{
  _id: string,
  name: string,
  description: string,
  price: number,
  originalPrice: number,
  images: [{ url: string, alt: string }],
  rating: number (0-5),
  reviewCount: number,
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock',
  badge: string (optional),
  category: string
}
```

---

## 🔍 Input Component

### Basic Usage
```jsx
import Input from '@/components/ui/Input';

// Text input
<Input 
  type="text"
  placeholder="Enter text..."
  label="Name"
  required
/>

// Email input
<Input 
  type="email"
  placeholder="your@email.com"
  label="Email"
/>

// Search input
<Input 
  type="search"
  placeholder="Search..."
/>

// With error
<Input 
  type="text"
  error="This field is required"
  label="Username"
/>

// With description
<Input 
  type="text"
  label="Password"
  description="Must be at least 8 characters"
/>

// Checkbox
<Input 
  type="checkbox"
  label="I agree to terms"
/>

// Radio button
<Input 
  type="radio"
  label="Option 1"
  name="options"
/>
```

### Props
- `type` - Input type (text, email, password, search, checkbox, radio)
- `label` - Label text
- `placeholder` - Placeholder text
- `error` - Error message
- `description` - Helper text
- `required` - Required field indicator
- `disabled` - Disabled state

---

## 📋 Select Component

### Basic Usage
```jsx
import Select from '@/components/ui/Select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'google', label: 'Google' }
];

// Basic select
<Select 
  value={selected}
  onChange={setSelected}
  options={options}
  placeholder="Choose a brand..."
/>

// Searchable
<Select 
  value={selected}
  onChange={setSelected}
  options={options}
  searchable
  placeholder="Search brands..."
/>

// Multiple selection
<Select 
  value={selected}
  onChange={setSelected}
  options={options}
  multiple
/>

// With label
<Select 
  value={selected}
  onChange={setSelected}
  options={options}
  label="Select Brand"
  required
/>

// Clearable
<Select 
  value={selected}
  onChange={setSelected}
  options={options}
  clearable
/>

// With error
<Select 
  value={selected}
  onChange={setSelected}
  options={options}
  error="Please select a brand"
/>
```

### Props
- `value` - Selected value(s)
- `onChange` - Change handler
- `options` - Array of { value, label }
- `placeholder` - Placeholder text
- `searchable` - Enable search
- `multiple` - Allow multiple selection
- `clearable` - Show clear button
- `label` - Label text
- `error` - Error message
- `disabled` - Disabled state

---

## ✅ Checkbox Component

### Basic Usage
```jsx
import { Checkbox, CheckboxGroup } from '@/components/ui/Checkbox';

// Single checkbox
<Checkbox 
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="I agree"
/>

// Checkbox group
<CheckboxGroup label="Select options" required>
  <Checkbox label="Option 1" />
  <Checkbox label="Option 2" />
  <Checkbox label="Option 3" />
</CheckboxGroup>

// With description
<Checkbox 
  label="Subscribe to newsletter"
  description="We'll send you weekly updates"
/>

// Indeterminate state
<Checkbox 
  indeterminate
  label="Select all"
/>

// Disabled
<Checkbox 
  label="Disabled option"
  disabled
/>
```

### Props
- `checked` - Checked state
- `label` - Label text
- `description` - Helper text
- `indeterminate` - Indeterminate state
- `disabled` - Disabled state
- `required` - Required field
- `error` - Error message

---

## 🔔 Toast Notifications

### Basic Usage
```jsx
import Toast from '@/components/ui/Toast';

// In your App.jsx
<Toast />

// Then use anywhere in your app
Toast.success('Item added to cart!');
Toast.error('Something went wrong');
Toast.info('Please note this information');
Toast.warn('Are you sure?');
```

### With Options
```jsx
Toast.success('Success!', {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
```

---

## 🎨 Filter Sidebar

### Basic Usage
```jsx
import FilterSidebar from '@/pages/products-catalog/components/FilterSidebar';

const [filters, setFilters] = useState({
  price: null,
  brand: [],
  features: [],
  rating: null
});

<FilterSidebar 
  filters={filters}
  onFilterChange={(key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }}
  onClearFilters={() => setFilters({
    price: null,
    brand: [],
    features: [],
    rating: null
  })}
  activeFiltersCount={Object.values(filters).filter(v => v).length}
/>
```

### Filter Structure
```javascript
{
  price: [min, max] | null,
  brand: string[],
  features: string[],
  rating: number | null
}
```

---

## 🎬 Animations

### Using Animation Classes
```jsx
// Fade in from bottom
<div className="animate-fadeInUp">Content</div>

// Fade in from top
<div className="animate-fadeInDown">Content</div>

// Slide in from right
<div className="animate-slideInRight">Content</div>

// Slide in from left
<div className="animate-slideInLeft">Content</div>

// Scale in
<div className="animate-scaleIn">Content</div>

// Pulse effect
<div className="animate-pulse">Loading...</div>

// Shimmer (skeleton loader)
<div className="animate-shimmer h-12 w-full rounded-lg"></div>

// Bounce
<div className="animate-bounce">Bouncing</div>
```

---

## 📱 Mobile Optimization Classes

### Touch Targets
```jsx
// Ensure 44px minimum touch target
<button className="touch-target">Tap me</button>
```

### Responsive Visibility
```jsx
// Hide on mobile, show on desktop
<div className="hidden sm:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="sm:hidden">Mobile only</div>
```

### Responsive Spacing
```jsx
// Mobile: p-4, Desktop: p-8
<div className="p-4 lg:p-8">Content</div>

// Mobile: text-sm, Desktop: text-lg
<p className="text-sm lg:text-lg">Text</p>
```

---

## 🎯 Color Utilities

### Using CSS Variables
```jsx
// Primary color
<div style={{ color: 'var(--color-primary)' }}>Primary</div>

// Secondary color
<div style={{ color: 'var(--color-secondary)' }}>Secondary</div>

// Success color
<div style={{ color: 'var(--color-success)' }}>Success</div>

// Error color
<div style={{ color: 'var(--color-error)' }}>Error</div>
```

### Tailwind Color Classes
```jsx
// Text colors
<p className="text-primary">Primary text</p>
<p className="text-success">Success text</p>
<p className="text-error">Error text</p>

// Background colors
<div className="bg-primary text-primary-foreground">Primary BG</div>
<div className="bg-success text-success-foreground">Success BG</div>

// Border colors
<div className="border border-primary">Primary border</div>
<div className="border border-gray-200">Gray border</div>
```

---

## 🔧 Common Patterns

### Product Grid
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {products.map(product => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
```

### Form with Validation
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

const [errors, setErrors] = useState({});

<form onSubmit={handleSubmit}>
  <Input 
    label="Name"
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
    error={errors.name}
    required
  />
  
  <Input 
    type="email"
    label="Email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    error={errors.email}
    required
  />
  
  <Button type="submit" fullWidth>Submit</Button>
</form>
```

### Responsive Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
  {/* Content */}
</div>
```

---

## 💡 Tips & Best Practices

### 1. **Consistent Spacing**
```jsx
// Use consistent spacing scale
<div className="p-4 sm:p-6 lg:p-8">
  <h2 className="mb-4">Title</h2>
  <p className="mb-6">Content</p>
</div>
```

### 2. **Responsive Typography**
```jsx
// Scale typography for different screens
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Heading
</h1>
```

### 3. **Touch-Friendly Buttons**
```jsx
// Ensure buttons are at least 44px tall
<Button size="lg" className="touch-target">
  Tap me
</Button>
```

### 4. **Loading States**
```jsx
<Button loading disabled>
  Processing...
</Button>
```

### 5. **Error Handling**
```jsx
<Input 
  error={error ? "This field is required" : ""}
  label="Email"
/>
```

---

## 📚 Additional Resources

- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev
- **Design System:** See `DESIGN_SYSTEM.md`
- **Component Files:** `src/components/ui/`

---

**Last Updated:** December 2024
**Version:** 1.0
