# Project Structure

## Directory Organization

```
api-docs/
├── docs/                    # Project documentation
│   ├── context.md          # Project context and progress
│   ├── STYLE_GUIDE.md      # CSS and styling guidelines
│   └── PROJECT_STRUCTURE.md # This file
├── src/
│   ├── assets/             # Static assets and global styles
│   │   └── styles/         # Global SCSS files
│   ├── components/         # Vue components
│   │   ├── layout/         # Layout components
│   │   ├── common/         # Shared/reusable components
│   │   └── api/           # API documentation specific components
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── public/                # Public static assets
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## Component Architecture

### Layout Components
- `AppHeader`: Main navigation and branding
- `AppSidebar`: API navigation menu
- `AppMain`: Main content area
- `AppFooter`: Footer information

### Common Components
- `Button`: Reusable button component
- `Card`: Content container
- `Search`: Search functionality

### API Components
- `EndpointList`: List of API endpoints
- `EndpointDetail`: Detailed endpoint information
- `CodeExample`: Code snippet display

## Development Guidelines

1. Each component should be in its own directory with associated styles
2. Use SCSS modules for component-specific styles
3. Follow Vue 3 Composition API patterns
4. Maintain documentation as new components are added

## Build and Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
