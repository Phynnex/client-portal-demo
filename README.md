# Client Portal Demo

A sample client dashboard built with **Next.js**, TypeScript and Tailwind CSS. Users log in and access sections for accounts, documents, messages, reports and tasks.

## Folder Structure

- `src/app` – Next.js routes and layouts
- `src/components` – shared UI components
- `src/context` – React context for global state
- `src/hooks` – custom hooks with tests
- `src/lib` – helper utilities
- `src/types` – shared TypeScript types
- `public` – static assets served by Next.js

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the project root with the following values:

```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

These variables are required for the NextAuth authentication setup.

### Lint

```bash
npm run lint
```

### Tests

```bash
npm test
```


### Build
=======
### Shadcn UI Library

This project uses wrapper components based on the **shadcn/ui** library. If the
dependencies were not installed automatically, run:

```bash
npm install @shadcn/ui
```



```bash
npm run build
```

## License

Released under the [MIT License](LICENSE).
