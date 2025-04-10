# Style Guide

## CSS Architecture

### Directory Structure
```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss    # Global variables
│       ├── _mixins.scss       # Reusable mixins
│       ├── _reset.scss        # CSS reset/normalize
│       └── main.scss          # Main stylesheet
└── components/
    └── ComponentName/
        └── ComponentName.module.scss  # Component-specific styles
```

### Naming Conventions
- Use kebab-case for class names
- Use PascalCase for component names
- Use camelCase for SCSS variables and mixins

### CSS Modules
- Each component has its own scoped stylesheet
- Use composition for shared styles
- Avoid global styles except for base elements

### Variables
```scss
// Colors
$primary-color: #2c3e50;
$secondary-color: #42b983;
$text-color: #333333;
$background-color: #ffffff;

// Typography
$font-family-base: 'Inter', sans-serif;
$font-size-base: 16px;
$line-height-base: 1.5;

// Spacing
$spacing-unit: 8px;
$container-padding: $spacing-unit * 2;

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

### Layout Guidelines
- Use CSS Grid for page-level layouts
- Use Flexbox for component-level layouts
- Maintain consistent spacing using variables
- Use relative units (rem, em) for typography
- Use pixels for borders and small details

### Responsive Design
- Mobile-first approach
- Use breakpoint mixins for consistent media queries
- Fluid typography where appropriate

### Best Practices
1. Use CSS Modules to avoid specificity issues
2. Keep selectors shallow and specific
3. Use CSS custom properties for dynamic values
4. Maintain consistent spacing using the spacing system
5. Document complex CSS implementations
