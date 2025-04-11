# Style Guide

## Colors

### Theme Colors
```scss
$background-color: #1a1a1a;      // Dark background
$text-color: #ffffff;            // White text
$border-color: #333333;          // Dark borders
$secondary-color: #4CAF50;       // Green accent
```

### HTTP Methods
```scss
GET: #2196F3     // Light blue
POST: #4CAF50    // Green
PUT: #FF9800     // Orange
DELETE: #F44336  // Red
PATCH: #9C27B0   // Purple
```

### Response Status
```scss
2xx: #4CAF50    // Green for success
4xx: #F44336    // Red for client errors
5xx: #FF9800    // Orange for server errors
```

## Typography

### Font Families
```scss
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Font Sizes
```scss
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
```

## Spacing

### Base Units
```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### Layout
```scss
$header-height: 64px;
$sidebar-width: 250px;
$container-width: 80vw;
```

## Borders & Shadows

### Borders
```scss
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
```

### Shadows
```scss
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
```

## Transitions

### Duration
```scss
$transition-fast: 0.15s ease;
$transition-normal: 0.25s ease;
$transition-slow: 0.35s ease;
```

## Components

### Buttons
```scss
.button {
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  font-weight: 600;
  transition: all $transition-fast;
}
```

### Inputs
```scss
.input {
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  background-color: rgba($text-color, 0.1);
  border: 1px solid $border-color;
}
```

### Cards
```scss
.card {
  background-color: rgba($text-color, 0.05);
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  padding: $spacing-md;
}
```

## Best Practices

1. **SCSS Modules**
   - Use SCSS modules for component-scoped styles
   - Import global variables and mixins as needed
   - Keep component styles focused and minimal

2. **Responsive Design**
   - Use relative units (rem, em) for typography
   - Use viewport units for layout (vw, vh)
   - Implement mobile-first media queries

3. **Dark Theme**
   - Use proper contrast ratios for accessibility
   - Implement subtle gradients for depth
   - Use opacity for interactive states

4. **Code Organization**
   - Group related styles together
   - Use consistent naming conventions
   - Comment complex calculations or effects

5. **Performance**
   - Minimize nested selectors
   - Use efficient selectors
   - Avoid expensive properties
   - Optimize transitions and animations
