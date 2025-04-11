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
│       └── index.scss         # Main stylesheet
└── components/
    └── layout/
        ├── AppHeader/
        ├── AppInfo/
        ├── AppMain/
        └── AppServers/
            └── *.module.scss   # Component-specific styles
```

### Naming Conventions
- Use kebab-case for class names
- Use PascalCase for component names
- Use camelCase for SCSS variables and mixins
- Prefix layout components with 'App'

### CSS Modules
- Each component has its own scoped stylesheet
- Use composition for shared styles
- Avoid global styles except for base elements
- Import global variables and mixins in each module

### Variables
```scss
// Colors
$primary-color: #2c3e50;
$secondary-color: #42b983;
$text-color: #333333;
$background-color: #ffffff;
$border-color: rgba(0, 0, 0, 0.1);

// Method Colors
$method-get: #2196F3;    // Light blue
$method-post: #4CAF50;   // Green
$method-put: #FF9800;    // Orange
$method-delete: #F44336; // Red
$method-patch: #9C27B0;  // Purple

// Typography
$font-family-base: 'Inter', sans-serif;
$font-family-mono: 'Fira Code', monospace;
$font-size-base: 16px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$line-height-base: 1.5;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Layout
$header-height: 64px;
$container-width: 75vw;
$border-radius-sm: 4px;
$border-radius-md: 6px;

// Transitions
$transition-fast: 0.2s ease;
$transition-medium: 0.3s ease;
```

### Component-Specific Styles

#### AppHeader
```scss
.header {
  position: fixed;
  height: $header-height;
  width: 100%;
}

.container {
  width: $container-width;
  padding-left: calc($spacing-xl + 32px + #{$spacing-sm});
}
```

#### AppMain
```scss
.container {
  width: $container-width;
  padding-left: calc($spacing-xl + 10px + #{$spacing-sm});
}

.tagGroup {
  width: 100%;
  border-bottom: 1px solid $border-color;
}

.endpointHeader {
  cursor: pointer;
  transition: background-color $transition-fast;
}
```

### Layout Guidelines
- Use fixed header with consistent height
- Maintain 75vw width for main content
- Left-align text and content
- Use consistent padding across components
- Implement smooth transitions for interactive elements

### Interactive Elements
- Hover effects for buttons and clickable items
- Smooth transitions for expansions and state changes
- Clear visual feedback for interactive elements
- Consistent button styling across components

### HTTP Method Colors
- GET: Light blue (#2196F3)
- POST: Green (#4CAF50)
- PUT: Orange (#FF9800)
- DELETE: Red (#F44336)
- PATCH: Purple (#9C27B0)

### Best Practices
1. Use CSS Modules for component isolation
2. Maintain consistent spacing using variables
3. Implement smooth transitions for better UX
4. Follow color scheme for HTTP methods
5. Use proper typography hierarchy
6. Ensure responsive behavior
7. Keep styles modular and reusable

### Recent Updates
1. Added consistent container width (75vw)
2. Updated padding calculations
3. Enhanced button hover states
4. Improved tag group styling
5. Added transition effects
6. Standardized HTTP method colors
