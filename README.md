# Mini Golf Score

Mini Golf Score is an offline-first Progressive Web App for scoring mini golf rounds. It is built for fast one-handed scoring on mobile, with saved courses, flexible players and holes, round history, and shareable results.

## Live App

https://mingolfscore.netlify.app

## Features

- Progressive Web App with installable metadata and service worker.
- Next.js App Router with TypeScript.
- Variable number of players.
- Variable number of holes.
- User-created golf courses with custom hole names and pars.
- Course editing, duplication, archiving, and reuse.
- Active round auto-save using IndexedDB.
- Offline local storage with Dexie.
- Hole-by-hole mobile scoring with quick score buttons.
- Editable full scorecard.
- Final results, rankings, awards, and native sharing.
- Completed round history.
- Data export, import, and local data reset.
- Netlify-ready deployment configuration.

## Tech Stack

- Next.js
- React
- TypeScript
- Dexie / IndexedDB
- Lucide React
- Netlify

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run TypeScript checks:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

Audit production dependencies:

```bash
npm audit --omit=dev
```

## Deployment

The project includes a `netlify.toml` configured for Netlify builds:

```toml
[build]
  command = "npm run build"
```

Netlify handles the Next.js output using its Next.js runtime.

## Product Plan

The detailed product and technical plan is in [MINIGOLF_PWA_PLAN.md](./MINIGOLF_PWA_PLAN.md).
