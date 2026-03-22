# Doodle Chat

A real-time chat application built as a frontend coding challenge for Doodle.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Data Fetching:** TanStack React Query — polling-based real-time updates (5s interval) with optimistic cache updates
- **State Management:** React Context + `useSyncExternalStore` for SSR-safe user identity persistence via localStorage
- **Styling:** CSS Modules with a design-token system (CSS custom properties), responsive design, dark mode support
- **Testing:** Vitest + React Testing Library + jsdom
- **Code Quality:** ESLint 9 (flat config) with Prettier, Husky + lint-staged pre-commit hooks

## Architecture Decisions

- **Polling over WebSockets:** The API is REST-based, so polling with deduplication (`Set`-based merge) provides real-time feel without extra infrastructure.
- **Two-step input flow:** Users enter their name first (persisted in localStorage), then see the message input. This avoids requiring a full auth system while providing identity.
- **`useSyncExternalStore`:** Chosen over `useState` + `useEffect` for localStorage access to avoid hydration mismatches in Next.js SSR.
- **Component memoization:** `ChatBubble` is wrapped in `React.memo()` to prevent unnecessary re-renders during polling updates.
- **CSS Modules over CSS-in-JS:** Zero runtime cost, native CSS features, and good developer experience with TypeScript support.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Create environment variables
echo 'NEXT_PUBLIC_API_URL=http://localhost:3000' > .env.local
echo 'NEXT_PUBLIC_API_TOKEN=super-secret-doodle-token' >> .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Environment Variables

| Variable                       | Description           | Default                     |
| ------------------------------ | --------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`          | Chat API base URL     | `http://localhost:3000`     |
| `NEXT_PUBLIC_API_TOKEN`        | API bearer token      | `super-secret-doodle-token` |
| `NEXT_PUBLIC_POLLING_INTERVAL` | Polling interval (ms) | `20000`                     |

## Available Scripts

| Command                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Start development server                     |
| `npm run build`         | Production build                             |
| `npm run lint`          | Run ESLint                                   |
| `npm run type-check`    | TypeScript type checking                     |
| `npm run test`          | Run tests in watch mode                      |
| `npm run test:run`      | Run tests once                               |
| `npm run test:coverage` | Run tests with coverage report               |
| `npm run check-all`     | Type-check + lint + test + build (CI script) |

## Project Structure

```
app/                  # Next.js App Router
  layout.tsx          # Root layout with providers and metadata
  page.tsx            # Home page composing Header + MessageList + MessageInput
  globals.css         # Design tokens, reset, and layout styles
components/
  Header/             # App header with title and user display
  ChatBubble/         # Individual chat message with self/other styling (memoized)
  ChatInput/          # Two-step input: name prompt → message input
  ChatList/           # Scrollable message feed with auto-scroll
context/
  userContext.tsx      # React Context for user identity management
hooks/
  useMessages.ts      # React Query hooks for fetching and sending messages
lib/
  api.ts              # HTTP client for the chat API
  types.ts            # TypeScript interfaces
  utils.ts            # Utility functions (timestamp formatting)
  providers.tsx       # QueryClient provider
```

## Accessibility

- Semantic HTML (`<article>`, `<header>`, `<main>`, `<section>`, `<time>`)
- ARIA attributes (`role="log"`, `aria-live="polite"`, `aria-label` on forms and messages)
- Screen-reader-only labels for form inputs
- Visible focus indicators on interactive elements
- Keyboard-navigable interface
