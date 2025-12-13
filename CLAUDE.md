# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation site for the Roulette API, built with [Mintlify](https://mintlify.com). The site includes product documentation and an auto-generated API reference from OpenAPI specs.

## Commands

- `npm run dev` - Start local development server (runs on http://localhost:3000)
- `npm run build` - Bundle OpenAPI specs (same as `npm run bundle`)
- `npm run bundle` - Combine modular OpenAPI YAML files into single openapi.json/openapi.yaml

## Architecture

### OpenAPI Spec Structure

The API specification is split across multiple YAML files in `/openapi/` for maintainability:

```
openapi/
├── base.yaml              # Core OpenAPI metadata (info, servers, security)
├── paths/                 # API endpoint definitions (one file per resource)
│   ├── companies.yaml
│   ├── company-statuses.yaml
│   ├── dashboard.yaml
│   └── ...
├── components/
│   ├── schemas/          # Data model definitions
│   ├── parameters/       # Reusable parameters
│   └── responses/        # Reusable responses
└── examples/             # Example request/response payloads
```

The bundler script (`scripts/bundle-openapi.mjs`) merges all YAML files into `openapi.json` and `openapi.yaml` at the repo root. **Always run `npm run bundle` after modifying any OpenAPI YAML files.**

### Documentation Structure

- `docs.json` - Mintlify configuration (navigation, theming, API settings)
- `index.mdx`, `quickstart.mdx`, `authentication.mdx` - Getting started pages
- `concepts/` - Core concept explanations (companies, pipeline, sharing)
- `api-reference/` - API documentation pages (auto-generated from OpenAPI)

### API Configuration

The API reference is configured in `docs.json` to:
- Use bearer token authentication
- Point to base URL: `https://www.useroulette.com/api/v1`
- Auto-generate endpoints from `/openapi.json`
