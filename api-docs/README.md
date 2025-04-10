# RatherChat API Documentation Frontend

A Vue 3 desktop application for displaying and managing RatherChat's API documentation. Built with modern web technologies and best practices for maintainability and extensibility.

## 🚀 Features

- Modern, professional dark theme interface
- Interactive API endpoint documentation
- OpenAPI 3.1.0 specification support
- Real-time endpoint search filtering
- Color-coded HTTP methods
- Expandable endpoint details
- JSON response examples
- Terms of Service documentation

## 🛠️ Tech Stack

- Vue 3 with Composition API
- Vite for blazing fast development
- SCSS modules for component-scoped styling
- Modern JavaScript (ES6+)

## 📦 Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to project directory
cd api-docs

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Documentation

Find detailed documentation in the `docs` folder:
- `context.md` - Project context and progress
- `endpoints.yaml` - OpenAPI specification
- `tos.md` - Terms of Service

## 🏗️ Project Structure

```
api-docs/
├── public/
│   ├── endpoints.yaml    # OpenAPI specification
│   ├── tos.md           # Terms of Service
│   ├── rc_white_logo.png
│   └── fb_1.jpg
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── AppHeader/  # Logo, search, and schema download
│   │       ├── AppInfo/    # Project info and metadata
│   │       └── AppMain/    # API endpoints display
│   ├── assets/
│   │   └── styles/        # SCSS variables and mixins
│   └── App.vue
└── docs/
    └── context.md         # Project documentation
```

## 🧩 Components

### AppHeader
- Project logo display
- Real-time search functionality
- Schema download button

### AppInfo
- Project name and version display
- OpenAPI version information
- Project description
- Terms of Service link
- Developer contact button

### AppMain
- API endpoint listing
- Color-coded HTTP methods
- Expandable endpoint details
- JSON response examples
- Search result filtering

## 🎨 Styling

We use SCSS modules with a professional dark theme:
- 80vw content width for optimal readability
- Left-aligned content for consistency
- Color-coded HTTP methods for quick identification
- Smooth transitions for expandable sections
- Monospace fonts for code examples
- Consistent spacing system

## 🔜 Upcoming Features

1. Complete OpenAPI specification integration
2. Enhanced search capabilities
3. Response schema documentation
4. Proper error handling
5. Additional interactive features

## 📝 License

[Your License] 2025 RatherChat
