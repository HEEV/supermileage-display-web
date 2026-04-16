# Supermileage Display Web

This project is a React + TypeScript app built with [Vite](https://vite.dev/).

## Requirements

- Node.js 20+
- Yarn 4 (Corepack is supported)

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the development server:

```bash
yarn dev
```

By default, Vite serves the app at [http://localhost:5173](http://localhost:5173).

## Available Scripts

- `yarn dev` (same as `yarn start`): Start the Vite dev server with hot reload.
- `yarn build`: Type-check and create a production build.
- `yarn preview`: Preview the production build locally.
- `yarn lint`: Run ESLint and apply auto-fixes to TSX source files.

## Build Output

The production build is generated in the `dist` directory.

## Deployment

Deploy the contents of `dist` to any static hosting provider.

## CI

GitHub Actions includes a lint workflow in `.github/workflows/eslint.yml`.

- Trigger: push to all branches except `main`
- Install: `npm ci` (plus temporary SARIF formatter install)
- Check: ESLint using `eslint.config.mjs`
- Output: SARIF upload for GitHub code scanning

To run the same eslint command locally, run the following:

```sh
 npx eslint . --config eslint.config.mjs --ignore-pattern "node_modules/" --ignore-pattern "build/"
```

## Tech Stack

- Vite
- React 19
- TypeScript
- ESLint
