# RatherChat API Documentation

A modern, interactive API documentation viewer built with Vue 3 and Vite. This project provides a clean and intuitive interface for viewing OpenAPI specifications.

## Features

- 🎨 Modern and clean UI with dark theme
- 🔍 Real-time search across endpoints, parameters, and tags
- 🎯 Color-coded HTTP methods and response statuses
- 📚 Organized endpoints by tags with descriptions
- 🔗 Interactive endpoint expansion
- 📝 JSON request/response examples
- 🚀 Fast and responsive interface

## Project Structure

The project follows a modular OpenAPI specification structure:

```
api-docs/
├── public/
│   ├── openapi/
│   │   ├── info/
│   │   │   └── info.yaml           # API information and servers
│   │   └── endpoints/
│   │       ├── tags/
│   │       │   └── tags.yaml       # API tags definitions
│   │       ├── paths/
│   │       │   ├── pet.yaml        # Pet endpoints
│   │       │   ├── store.yaml      # Store endpoints
│   │       │   └── user.yaml       # User endpoints
│   │       └── examples/
│   │           ├── pet/            # Pet endpoint examples
│   │           ├── store/          # Store endpoint examples
│   │           └── user/           # User endpoint examples
│   └── test.yaml                   # Legacy single-file OpenAPI spec
└── src/
    ├── components/                 # Vue components
    ├── composables/               # Vue composables
    └── assets/                   # Styles and assets
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Adding New API Documentation

1. Choose the appropriate domain folder in `public/openapi/endpoints/paths/`
2. Create your endpoint definition file (e.g., `new-domain.yaml`)
3. Add examples in `public/openapi/endpoints/examples/new-domain/`
4. Add the tag in `public/openapi/endpoints/tags/tags.yaml`
5. Reference your new files in `public/openapi/main.yaml`

## Development

- The project uses Vue 3 with Composition API
- Styling is done with SCSS modules
- OpenAPI 3.1.0 specification is used for API documentation
- File references use $ref for modular organization

For more details, see the docs folder:
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Style Guide](docs/STYLE_GUIDE.md)
- [Context](docs/context.md)
