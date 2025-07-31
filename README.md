# Client Portal Demo

This repository contains a demo client portal built with **Next.js**. It showcases a simple authentication page and a dashboard with sections for accounts, documents, messages, reports and tasks. The project uses TypeScript, Tailwind CSS and Jest for unit testing.

## Directory structure

```
src/
  app/             # Next.js app router pages and layouts
  components/      # Shared React components
  context/         # React context for global state
  hooks/           # Custom hooks and their tests
  lib/             # Helper utilities (e.g. auth, misc utils)
  types/           # Shared TypeScript types
public/            # Static assets served by Next.js
```

## Getting started

1. Install dependencies with `npm install`.
2. Run the development server:

```bash
npm run dev
```

Open <http://localhost:3000> in your browser to view the app.

### Running tests

Unit tests are executed with Jest:

```bash
npm test
```

### Linting

ESLint is configured with Next.js rules:

```bash
npm run lint
```

### Building for production

Create an optimized build and start the server:

```bash
npm run build
npm start
```

## Learn more

For more details about Next.js see the [Next.js documentation](https://nextjs.org/docs).

## License

This project is licensed under the [MIT License](LICENSE).
