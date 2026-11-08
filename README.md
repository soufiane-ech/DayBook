# DayBook

A clean, minimal journal and todo list that runs in the browser. Everything you write is saved in your browser's localStorage, so there is no account or server.

Built with React, TypeScript, Vite, and Tailwind CSS. Includes light and dark themes and a distraction-free focus mode for writing.

## Getting started

```bash
npm install
npm run dev
```

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Starts the development server        |
| `npm run build`   | Type-checks and builds to `dist/`    |
| `npm run preview` | Serves the production build locally  |

## Project structure

```
src/
  components/   Shared UI (navigation, theme toggle, toasts, empty state)
  features/
    journal/    Entries, moods, tags, search and filters, reader, and editor
    todos/      Tasks, priorities, filters and sorting, composer, and list
  hooks/        Reusable hooks (hash routing, localStorage)
  lib/          Small helpers (dates, ids, theme)
  App.tsx       App shell and section switching
  index.css     Tailwind import, design tokens, animations
```

Each feature owns its types, its state hook, and its components. Shared design tokens such as colors, fonts, and animations are defined once, in the `@theme` block of `src/index.css`.
