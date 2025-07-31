# Client Portal Demo

This project is a simple client dashboard built with **Next.js** and TypeScript. After logging in, users land on a dashboard with quick links to sections for accounts, documents, messages, reports and tasks. Styling is handled with Tailwind CSS and components are tested with Jest.

## Folder Structure

```
src/
  app/             # Next.js app router pages and layouts
  components/      # Reusable React components
  context/         # React context for global state
  hooks/           # Custom hooks and their tests
  lib/             # Helper utilities (auth, etc.)
  types/           # Shared TypeScript types
public/            # Static assets served by Next.js
```

## Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

### Linting

```bash
npm run lint
```

### Running Tests

```bash
npm test
```

### Production Build

Create the optimized build output:

```bash
npm run build
```

## Deployment

After running `npm run build`, start the server with:

```bash
npm start
```

The application can also be deployed to any platform that supports Node.js, such as Vercel or a traditional hosting provider.

## License

Released under the [MIT License](LICENSE).
