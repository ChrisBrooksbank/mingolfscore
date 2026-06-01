# Mini Golf Scoring PWA Plan

Date: 2026-06-01

## 1. Product Vision

Build a world-class mini golf scoring Progressive Web App that is faster than paper, easier than a native app download, reliable on patchy course Wi-Fi, and delightful enough that groups want to use it every round.

The app should work as:

- A personal scorecard for casual players.
- A group game companion for friends and families.
- A long-term score history and rivalry tracker.
- A course-ready digital scorecard that can eventually support QR course presets, branded course pages, and live leaderboards.

The first-class experience is mobile web/PWA, because mini golf is usually played standing outdoors, one-handed, with intermittent attention. The app must feel instant, readable in sunlight, forgiving of mistakes, and usable while walking between holes.

## 2. Research Summary

Current mini golf scoring products cluster around a few strong patterns:

- Mini Golf Scorekeeper emphasizes one-hand scoring, big plus/minus buttons, swipeable holes, live golf-style grids, color-coded performance, post-round stats, shareable results, recent players, custom pars, full game history, and QR-based course loading.
- MiniGolfHQ emphasizes browser-first access with no download or login, QR code start, live cloud scoring, shareable result links, optional player profiles, local caching during signal drops, course presets, and course-owner dashboards.
- PuttScores and PlayThru Mini focus on operator workflows: QR scorecards, browser-based scoring, branding, live leaderboards, analytics, setup in minutes, and no app download.
- Existing Android/iOS scorecard apps often cover basics such as multiple players, score history, and score entry, but many feel utilitarian rather than premium.

Key lesson: the winning app is not just "a score table." It is an event companion: setup is near-zero, scoring is thumb-native, totals are instant, the end result feels shareable, and the data creates a reason to return.

Sources:

- Mini Golf Scorekeeper App Store listing: https://apps.apple.com/us/app/mini-golf-scorekeeper/id6759857484
- MiniGolfHQ scorecard feature page: https://www.minigolfhq.com/mini-golf-scorecard
- PuttScores platform page: https://puttscores.com/
- PlayThru Mini online scorecards: https://www.playthrumini.com/
- Netlify Next.js docs: https://docs.netlify.com/frameworks/next-js/overview/
- MDN PWA best practices: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices

## 3. Target Users

### Casual Groups

Friends, couples, families, parties, and date nights who want scoring to be quick and fun.

Needs:

- Start a round in under 30 seconds.
- Add any number of players.
- Pick 9, 12, 18, or custom hole counts.
- Fix mistakes quickly.
- See who is winning without doing math.
- Share the final score.

### Repeat Players

People who play mini golf regularly and care about history, rivalries, personal bests, and course records.

Needs:

- Saved player profiles.
- Round history.
- Course history.
- Personal stats and trends.
- Head-to-head records.

### Course Operators

Not required for MVP, but the architecture should leave room for course pages and QR presets.

Needs:

- Branded course scorecards.
- Preconfigured pars and hole names.
- QR code entry.
- Live venue leaderboard.
- Analytics on rounds started and completed.

## 4. Product Principles

1. Faster than paper.
   Every interaction should reduce friction: no required account, minimal setup, big controls, instant totals.

2. Built for one hand.
   The scoring UI should sit in the thumb zone with large tap targets, haptic-friendly interactions where supported, and no tiny grid editing as the primary scoring path.

3. Offline-first by default.
   A round in progress must survive bad connectivity, app restarts, tab closes, and accidental refreshes.

4. Clear in sunlight.
   High contrast, large type, restrained color, and no low-contrast decorative UI on the active scoring screen.

5. Forgiving.
   Mistakes are expected. Undo, edit, resume, and recover flows should be obvious.

6. Social at the end.
   The app should produce a satisfying final result: rankings, awards, fun stats, and a shareable image/link.

7. Premium without being fussy.
   World-class means polished, reliable, and thoughtfully animated, not visually noisy.

## 5. MVP Scope

### Core Round Setup

- Create a new round.
- Add, remove, rename, and reorder players.
- Support variable player count.
- Choose hole count: 6, 9, 12, 15, 18, or custom.
- Create a new golf course from setup if it does not already exist.
- Select from saved golf courses.
- Optional par setup:
  - Default all holes to par 2 or par 3.
  - Edit par per hole.
  - Save course template locally.
- Optional course name.
- Optional round name/date.

### User-Created Golf Courses

- Add new golf courses directly in the app.
- Store course name, location, notes, hole count, hole names, and par per hole.
- Support common mini golf formats plus custom hole counts.
- Let users create a course before a round or during round setup.
- Let users duplicate an existing course to make a variation.
- Let users edit saved courses without changing historical round snapshots.
- Let users archive courses instead of permanently deleting them by default.
- Show course-level history:
  - Rounds played.
  - Best score.
  - Average score.
  - Most frequent players.
  - Hardest and easiest holes.
- Allow course search/filter by name, location, and recently played.
- Keep course data available offline.

### Active Scoring

- Hole-by-hole scoring screen optimized for mobile.
- Big plus/minus controls per player.
- Quick score chips: 1, 2, 3, 4, 5, 6, 7+.
- "Hole-in-one" shortcut.
- Current hole indicator and navigation.
- Swipe or button navigation between holes.
- Running totals and rank movement.
- Per-hole par comparison:
  - Hole-in-one.
  - Under par.
  - Par.
  - Over par.
- Undo last score change.
- Auto-save after every edit.
- Resume active round after browser close.

### Scoreboard

- Golf-style grid view with players as rows and holes as columns.
- Sticky player names and total column.
- Color coding for standout results.
- Sort by current rank.
- Tie handling.
- Current-hole highlight.

### Round Completion

- End round confirmation.
- Final ranking.
- Winner banner.
- Awards and fun stats:
  - Most hole-in-ones.
  - Best single hole.
  - Worst single hole.
  - Biggest comeback.
  - Most consistent player.
  - Closest rivalry.
- Share result as:
  - Native share text.
  - Copyable summary.
  - Generated result image in a later milestone.

### History

- Local round history.
- Round detail replay.
- Search/filter by course, player, date, winner.
- Player stats:
  - Rounds played.
  - Wins.
  - Average score.
  - Best score.
  - Hole-in-ones.
  - Head-to-head record.
- Delete or archive rounds.

### PWA Capabilities

- Installable app with manifest.
- App icons and splash-ready metadata.
- Offline shell.
- Offline access to active round and local history.
- Service worker caching for app assets.
- Update prompt when a new app version is available.
- Clear "refresh to update" pattern that does not disrupt a round in progress.

## 6. World-Class Feature Backlog

### Course Templates

- Save user-created golf courses locally.
- Course name, location, hole count, hole names, and pars.
- Duplicate/edit templates.
- QR import/export format for course presets.
- Public course directory later.

### QR Course Start

- Course operators print QR code.
- Player scans QR and lands in preconfigured scorecard.
- QR payload contains course slug or signed template ID.
- Offline fallback caches course once loaded.

### Live Multiplayer Sync

- Invite link for group members.
- One scorekeeper mode or multi-device scoring mode.
- Real-time score updates.
- Conflict resolution for simultaneous edits.
- Presence indicators.
- "Who is scoring?" lock per hole or per player.

### Shareable Result Cards

- Generate a polished image after each round.
- Themes:
  - Classic scorecard.
  - Neon indoor golf.
  - Family-friendly.
  - Minimal social story.
- Include ranking, score, course, date, awards, and QR/link back to round.

### Challenge Modes

- Optional fun modifiers:
  - Random challenge per hole.
  - Team play.
  - Match play.
  - Skins.
  - Elimination.
  - Stableford-style points.
- Keep standard scoring as the default.

### Smart Insights

- Personal best alerts.
- Rivalry summaries.
- "You beat Chris by 3 strokes for the first time."
- Course record tracking.
- Win streaks.
- Average score by hole.
- Hardest/easiest hole detection.

### Course Operator Dashboard

- Course profile and branding.
- Manage holes and pars.
- Generate QR codes.
- Live leaderboard screen.
- Daily/weekly/monthly analytics.
- Export round data.
- Optional paid SaaS tier.

## 7. Recommended Technology Stack

### Frontend

- Next.js App Router.
- TypeScript.
- React.
- Tailwind CSS or a small design-system layer using CSS variables.
- Zustand or Jotai for local UI/game state.
- React Hook Form plus Zod for setup forms.
- Framer Motion for restrained transitions.
- Lucide React for icons.

### PWA and Offline

- Web app manifest via Next.js metadata or `public/manifest.webmanifest`.
- Service worker using Serwist or a carefully maintained custom Workbox setup.
- App shell caching.
- Runtime caching for static assets.
- IndexedDB for local rounds, players, courses, and sync queue.
- Dexie as the IndexedDB wrapper.
- BroadcastChannel for multi-tab round safety.
- Update prompt with service worker lifecycle handling.

### Data

MVP:

- Local-first IndexedDB.
- No required login.
- Export/import JSON backup.

Later:

- Optional account sync.
- Netlify Functions for API.
- Netlify Blobs or a hosted database for lightweight shared rounds and course templates.
- Consider Neon, Supabase, Turso, or PlanetScale if relational querying becomes central.

### Deployment

- Netlify hosting.
- Netlify Next.js support via OpenNext adapter.
- Git-based deploys.
- Deploy previews for every PR.
- Production deploys from `main`.
- Netlify environment variables for API keys and feature flags.
- Skew protection enabled to reduce client-side errors when a new deployment goes live.

### Analytics and Quality

- Privacy-conscious product analytics.
- Web Vitals.
- Sentry or similar error tracking.
- Lighthouse PWA checks in CI.
- Playwright mobile smoke tests.
- Unit tests for scoring logic.

## 8. Architecture

### App Routes

- `/` - Resume active round or start screen.
- `/new` - Round setup.
- `/round/[roundId]` - Active scoring.
- `/round/[roundId]/scoreboard` - Full scoreboard.
- `/round/[roundId]/results` - Final results.
- `/history` - Round history.
- `/history/[roundId]` - Historical round details.
- `/players` - Player stats and management.
- `/courses` - User-created golf courses and saved templates.
- `/courses/new` - Add a new golf course.
- `/courses/[courseId]` - Course detail, stats, and edit.
- `/scan` - QR scan/import later.
- `/settings` - Theme, data export, install/update status.

### Core Domain Models

```ts
type Player = {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
};

type Course = {
  id: string;
  name: string;
  location?: string;
  notes?: string;
  holeCount: number;
  holes: Hole[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

type Hole = {
  number: number;
  name?: string;
  par: number;
};

type Round = {
  id: string;
  courseId?: string;
  courseSnapshot: CourseSnapshot;
  players: RoundPlayer[];
  scores: ScoreEntry[];
  status: "draft" | "active" | "complete" | "archived";
  currentHole: number;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
};

type ScoreEntry = {
  playerId: string;
  holeNumber: number;
  strokes: number | null;
  updatedAt: string;
};
```

### Scoring Engine

The scoring engine should be pure TypeScript with no React dependencies.

Responsibilities:

- Calculate player totals.
- Calculate ranks and ties.
- Calculate par deltas.
- Detect completed holes.
- Detect completed rounds.
- Generate awards.
- Generate history stats.
- Validate score ranges.
- Support future scoring modes.

This engine should have strong unit test coverage because it is the heart of the app.

### Local-First Storage

Use IndexedDB as the source of truth on the client.

Stores:

- `players`
- `courses`
- `rounds`
- `settings`
- `syncQueue`
- `appMeta`

Important guarantees:

- Every score edit is persisted immediately.
- Round updates are timestamped.
- Active round recovery is automatic.
- Schema migrations are explicit and tested.
- User can export all data.
- User can wipe local data from settings.

### Sync Strategy

MVP is local-only. Design the data layer so cloud sync can be added without rewriting the app.

Later sync model:

- Local mutation creates an operation in `syncQueue`.
- UI updates immediately.
- Background sync sends queued operations.
- Server stores canonical round state.
- Conflict rules:
  - Last-write-wins for simple metadata.
  - Per-score timestamp conflict resolution.
  - Round completion can be reopened by host only.

## 9. UX Plan

### First Launch

Primary action: "Start round."

Secondary actions:

- Resume active round, if one exists.
- View history.
- Use saved course.

Avoid a marketing-style landing page. The first screen should be the app.

### Setup Flow

Step 1: Players

- Add names quickly.
- Recent players as one-tap chips.
- Random color assignment.
- Drag to reorder.

Step 2: Course

- Choose hole count.
- Choose default par.
- Optional course name.
- Advanced: edit pars.

Step 3: Start

- Review players and holes.
- Start round.

### Active Scoring Screen

Layout:

- Top: course/round label, current hole, par, compact rank summary.
- Middle: player scoring list.
- Bottom: previous/next hole controls and scoreboard button.

Each player row:

- Player color and name.
- Current hole score.
- Large minus and plus buttons.
- Total and rank.
- Quick hole-in-one affordance when score is empty.

Design requirements:

- Minimum 44px tap targets.
- Controls reachable near bottom half of screen.
- No horizontal scroll in active scoring.
- Works with browser safe areas and mobile address bar changes.
- Strong empty/completed states.

### Scoreboard Screen

- Dense but readable grid.
- Sticky first column and totals.
- Landscape-friendly.
- Color accents for hole-in-one, under par, and over par.
- Tap a score cell to edit.

### Results Screen

The results screen should feel like the reward.

Include:

- Winner/ranking.
- Final score table.
- Awards.
- Share button.
- Save to history confirmation.
- Start rematch with same players.
- Start new round at same course.

## 10. Visual Design Direction

Tone:

- Modern, crisp, energetic, and course-ready.
- More "premium sports utility" than cartoon game.

Palette:

- Use a balanced palette with green as an accent, not a monochrome green app.
- Include high-contrast neutrals, bright winner/accent colors, and accessible status colors.
- Support light mode first for outdoor readability.
- Add dark mode for indoor/evening play.

Typography:

- Clear sans-serif.
- Large numerals for scoring.
- Compact headings inside tool surfaces.
- Avoid viewport-scaled text.

Motion:

- Subtle transitions for hole changes.
- Tiny feedback on score changes.
- Celebration moment on round completion.
- Respect reduced motion.

Accessibility:

- WCAG AA contrast.
- Full keyboard support.
- Screen-reader labels for scoring controls.
- Reduced motion support.
- Color is never the only status indicator.
- Large touch targets.

## 11. Auto Update Strategy

The app should update automatically, but never at the cost of losing an active round.

Recommended behavior:

1. Service worker detects a new version in the background.
2. If no active round is being edited, show a small "Update ready" action.
3. If a round is active, defer the update prompt until the round is complete or the user opens settings.
4. On update, persist all pending state first.
5. Reload into the same route after activation.
6. Include app version in settings for troubleshooting.

Technical notes:

- Use service worker `waiting` and `controllerchange` events.
- Store current app build ID in IndexedDB.
- Keep storage migrations backward-compatible.
- Use Netlify deploy previews to test service worker update flows before production.
- Be careful with aggressive cache invalidation: scoring data must never be stored only in HTTP cache.

## 12. Netlify Plan

### Hosting Setup

- Connect Git repo to Netlify.
- Build command: `npm run build`.
- Publish handled by Netlify Next.js integration.
- Use Next.js App Router with Netlify's OpenNext adapter support.
- Enable deploy previews.
- Enable branch deploys for staging.

### Recommended `netlify.toml`

```toml
[build]
  command = "npm run build"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/icons/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Future Netlify Services

- Netlify Functions for:
  - Shared round links.
  - QR course templates.
  - Result card generation.
  - Operator dashboard APIs.
- Netlify Blobs for:
  - Shared result card assets.
  - Lightweight course template storage.
- Netlify Image CDN for:
  - Course logos.
  - Share card images.

## 13. Testing Strategy

### Unit Tests

Cover:

- Scoring totals.
- Ranking and ties.
- Par deltas.
- Awards.
- Round completion.
- History stats.
- Data migrations.

### Integration Tests

Cover:

- Create round.
- Add players.
- Score multiple holes.
- Edit previous hole.
- Complete round.
- Resume after refresh.
- View history.

### PWA Tests

Cover:

- Manifest validity.
- Service worker registration.
- App shell loads offline.
- Active round persists offline.
- Update prompt appears after new build.
- No data loss during reload.

### Cross-Device Manual QA

Test on:

- iPhone Safari.
- Android Chrome.
- Desktop Chrome.
- Desktop Safari.
- Narrow mobile viewport.
- Landscape mobile scoreboard.
- Bright outdoor/light mode.
- Dark indoor/evening mode.

### Performance Budgets

- First load JS kept small.
- Active scoring route interactive in under 2 seconds on mid-range mobile.
- Score edit feedback under 100ms.
- Lighthouse PWA and accessibility scores 95+ target.
- No layout shift during score updates.

## 14. Security and Privacy

MVP:

- No account required.
- Store data locally.
- Make privacy obvious in settings.
- Let users export/delete data.

Later cloud features:

- Optional login.
- Clear guest vs account sync behavior.
- Do not expose private round links unless explicitly shared.
- Signed course/admin URLs.
- Rate limit public APIs.
- Validate all imported QR/template payloads.

## 15. Analytics

Track product usage without collecting unnecessary personal data.

Useful events:

- Round started.
- Round completed.
- Player count.
- Hole count.
- Course template used.
- History viewed.
- Share tapped.
- PWA installed.
- Offline recovery used.
- Update accepted.

Do not track:

- Player names by default.
- Precise location without explicit consent.
- Private round content beyond aggregate metrics.

## 16. Delivery Roadmap

### Phase 0: Foundation

Goal: Create the technical base.

Deliverables:

- Next.js app scaffold.
- TypeScript strict mode.
- Design tokens.
- Core layout.
- PWA manifest.
- Local IndexedDB wrapper.
- Scoring engine package/module.
- Unit test setup.
- Netlify deploy preview.

### Phase 1: MVP Scoring

Goal: Replace a paper scorecard for a single group.

Deliverables:

- New round setup.
- Variable players.
- Variable holes.
- Default/custom par.
- Add/select user-created golf courses.
- Save course snapshots with completed rounds.
- Active scoring screen.
- Scoreboard.
- Auto-save.
- Resume active round.
- Complete round.
- Local history.
- Basic results screen.

### Phase 2: PWA Polish

Goal: Make it feel like a reliable installed app.

Deliverables:

- Offline app shell.
- Offline active round support.
- Service worker update prompt.
- Install prompt guidance.
- Icons and splash metadata.
- Mobile safe-area polish.
- Lighthouse fixes.
- Cross-device QA.

### Phase 3: History and Stats

Goal: Create return value after the first round.

Deliverables:

- Player profiles.
- Round search/filter.
- Player stats.
- Head-to-head stats.
- Full course management.
- Course stats and course-specific history.
- Rematch flow.
- Export/import data.

### Phase 4: Sharing and Delight

Goal: Make results social and memorable.

Deliverables:

- Shareable text summaries.
- Generated result cards.
- Awards expansion.
- Celebration states.
- Personal best moments.
- Lightweight themes.

### Phase 5: Connected Rounds

Goal: Support group links and course QR codes.

Deliverables:

- Shared round links.
- Optional host mode.
- Real-time sync.
- QR course preset import.
- Public result pages.
- Basic backend API.

### Phase 6: Course Operator Product

Goal: Build a monetizable platform for venues.

Deliverables:

- Course dashboard.
- Branding controls.
- QR code generation.
- Live leaderboard display.
- Analytics.
- Subscription/billing exploration.

## 17. MVP Acceptance Criteria

The MVP is ready when:

- A first-time user can start scoring in under 30 seconds.
- A group can score a full 18-hole round with 2-8 players.
- The app supports custom hole counts.
- The app supports custom pars.
- Users can add, edit, archive, and reuse golf courses.
- Historical rounds preserve the course layout used at the time.
- Scores persist through refresh, tab close, and offline usage.
- Results and history are saved locally.
- The active scoring screen is comfortable one-handed on mobile.
- Scoreboard totals and rankings are always correct.
- The PWA installs on supported devices.
- A new deploy can be detected without losing active round state.
- The app passes core accessibility and PWA checks.

## 18. Key Risks

### Service Worker Complexity

Risk: Bad caching can produce stale UI or broken updates.

Mitigation:

- Keep service worker strategy simple.
- Avoid caching mutable scoring data in HTTP cache.
- Test update flows before launch.
- Add app version visibility.

### IndexedDB Migration Bugs

Risk: History could be lost across releases.

Mitigation:

- Use Dexie migrations.
- Add migration tests.
- Provide export/import.
- Avoid destructive schema changes.

### Overbuilding Multiplayer Too Early

Risk: Real-time sync can dominate the project.

Mitigation:

- MVP local-first.
- Design data structures for sync later.
- Add shared rounds only after core scoring feels excellent.

### Outdoor Usability

Risk: Pretty UI may fail in sunlight or while walking.

Mitigation:

- Light mode first.
- High contrast.
- Large controls.
- Test on real phones outdoors.

## 19. First Build Task List

1. Scaffold Next.js app with TypeScript.
2. Add design tokens and responsive shell.
3. Define domain models.
4. Build pure scoring engine with tests.
5. Add IndexedDB persistence.
6. Build round setup flow.
7. Build add/edit course flow.
8. Build active scoring screen.
9. Build scoreboard.
10. Build results screen.
11. Build local history.
12. Add PWA manifest and icons.
13. Add service worker and offline shell.
14. Add update prompt.
15. Configure Netlify.
16. Run mobile/PWA QA.

## 20. Definition of "World Class"

This app is world class when users choose it not because paper is annoying, but because the app makes the round better.

That means:

- Setup feels instant.
- Scoring feels effortless.
- The current winner is always obvious.
- Mistakes are easy to fix.
- The app survives bad signal.
- The final result is fun to share.
- History creates ongoing rivalries.
- The interface feels polished on every phone.
- The technical foundation can grow into a course/operator platform without a rewrite.
