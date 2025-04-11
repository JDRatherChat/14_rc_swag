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
│   │       └── index.scss  # Main styles and variables
│   ├── components/         # Vue components
│   │   └── layout/         # Layout components
│   │       ├── AppHeader/  # Header with search and download
│   │       ├── AppInfo/    # Project info and metadata
│   │       ├── AppMain/    # API endpoints display
│   │       └── AppServers/ # Server information
│   ├── composables/        # Reusable composition functions
│   │   └── useOpenApi.js   # OpenAPI spec handling
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── public/                # Public static assets
│   ├── test.yaml         # OpenAPI specification
│   ├── tos.md           # Terms of Service
│   └── rc_white_logo.png # RatherChat logo
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## Component Architecture

### Layout Components
- `AppHeader`: Main navigation, search, and schema download
- `AppInfo`: Project metadata and contact information
- `AppMain`: API endpoint display with tag grouping
- `AppServers`: Server configuration display

### Features by Component

#### AppHeader
- Logo and title display
- Search functionality for endpoints
- Schema download button
- Consistent 75vw width layout

#### AppInfo
- Project name and version display
- OpenAPI specification version
- Project description section
- Terms of Service link
- Contact developer button
- Enhanced button styling

#### AppMain
- Tag-based endpoint grouping
- Expandable tag sections
- Individual endpoint expansion
- Method-based color coding
- Parameter and response display
- Search filtering capability
- Consistent layout with header

#### AppServers
- Server information display
- Enhanced padding alignment
- Consistent styling with other components

## Development Guidelines

1. Component Organization
   - Each component in its own directory
   - Component-specific styles in SCSS modules
   - Consistent naming conventions

2. Styling Practices
   - Use SCSS modules for scoped styles
   - Follow color scheme guidelines
   - Maintain consistent spacing
   - Use defined variables for colors and spacing

3. State Management
   - Use Vue 3 Composition API
   - Local state for component-specific data
   - Props for component communication
   - Emit events for parent updates

4. Code Quality
   - Maintain documentation
   - Use TypeScript types where beneficial
   - Follow Vue 3 best practices
   - Keep components focused and modular

## Build and Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Recent Updates

1. Component Structure
   - Reorganized layout components
   - Added AppServers component
   - Updated component hierarchy

2. Feature Enhancements
   - Added tag-based grouping
   - Improved endpoint expansion
   - Enhanced button styling
   - Updated layout consistency

3. Documentation
   - Updated component documentation
   - Added feature descriptions
   - Improved build instructions
