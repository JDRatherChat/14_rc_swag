# Project Structure

## Directory Organization

```
api-docs/
├── public/                # Static assets and OpenAPI files
│   ├── openapi/          # OpenAPI specification files
│   │   ├── info/         # API information
│   │   │   └── info.yaml # Base API info and servers
│   │   └── endpoints/    # API endpoints and examples
│   │       ├── tags/     # Tag definitions
│   │       ├── paths/    # Endpoint definitions by domain
│   │       └── examples/ # Response examples by domain
│   ├── rc_white_logo.png # RatherChat logo
│   └── test.yaml        # Legacy single-file spec
├── src/                  # Source code
│   ├── components/       # Vue components
│   │   └── layout/      # Layout components
│   │       ├── AppHeader/
│   │       ├── AppInfo/
│   │       └── AppMain/
│   ├── composables/     # Vue composables
│   │   └── useOpenApi.js
│   ├── assets/         # Assets and styles
│   │   └── styles/    # SCSS files
│   ├── App.vue        # Root component
│   └── main.js        # Application entry
└── docs/              # Documentation
    ├── context.md
    ├── PROJECT_STRUCTURE.md
    └── STYLE_GUIDE.md
```

## Component Structure

### AppHeader
- Logo display
- Search functionality
- Schema download button

### AppMain
- Tag-based endpoint grouping
- Endpoint display
- Parameter details
- Response examples

### AppInfo
- API information display
- Server details
- Contact information

## OpenAPI File Structure

### info.yaml
```yaml
info:
  title: API Title
  description: API Description
  version: 1.0.0
  ...

servers:
  - url: https://api.example.com
    description: Production
```

### tags.yaml
```yaml
tags:
  - name: Domain
    description: Domain Description
```

### paths/[domain].yaml
```yaml
paths:
  /endpoint:
    get:
      tags:
        - Domain
      summary: Endpoint Summary
      responses:
        '200':
          $ref: '../examples/domain/endpoint.yaml#/200'
```

### examples/[domain]/[endpoint].yaml
```yaml
'200':
  description: Success
  content:
    application/json:
      example:
        property: value
```

## Style Organization

### SCSS Structure
```
styles/
├── _variables.scss  # Global variables
├── _mixins.scss    # Reusable mixins
├── _reset.scss     # CSS reset
└── index.scss      # Main style entry
```

## Build System

- Vite for development and build
- NPM for package management
- ESLint for code quality
- Prettier for code formatting
