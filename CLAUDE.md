# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack) at localhost:3000
npm run build    # production build — also type-checks and statically prerenders every route
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit -p .   # type-check only, faster than a full build
```

There is no test runner configured in this repo (no test script, no test files) — don't assume one exists.

After any change, verify with `npx tsc --noEmit` and `npm run lint`, and run `npm run build` for anything touching routing, dynamic `[param]` routes, `next/image`, or `useSearchParams` — dev mode won't catch static-generation errors that `next build` will. If `next build` fails with a phantom type error referencing a route file that no longer exists, delete `.next/` and rebuild (stale generated route types).

## Architecture

This is a Next.js 16 (App Router) + React 19 + TypeScript (strict) frontend for **EVENTRA**, an event-ticketing platform. There is no backend — everything (events, articles, announcements, merchandise, organizers) is generated from `src/lib/mock-data.ts` at build/request time. `EVENTRA_PROJECT_PLAN.md` at the repo root is the full original product spec (roles, DB schema, API design, phased roadmap); the live site has since diverged from it in places (see the `/shop` and `/organizers` notes below), so treat it as background context, not ground truth for what a route currently does.

### UI kit: shadcn CLI on `@base-ui/react`, not Radix

`components.json` pins `"style": "base-nova"`. This project's shadcn setup generates components on top of **`@base-ui/react`** primitives (`@base-ui/react/menu`, `/dialog`, `/select`, `/tabs`, …), not Radix — so component internals (prop names, data-attributes like `data-popup-open`, `data-active`, `data-open`/`data-closed`) differ from typical shadcn/Radix examples you may know. To add a new primitive, use the CLI rather than hand-rolling one:

```bash
npx shadcn@latest add <component>   # writes into src/components/ui/
```

Installed primitives: `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `separator`, `tabs`, `textarea`, plus a hand-written `pagination.tsx` (page-number nav, not from the registry) shared by every paginated list. `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge) used everywhere for conditional class merging.

### Design tokens

All brand colors, radii, and the dark-mode variant live in `src/app/globals.css` as OKLCH CSS custom properties, mapped into Tailwind v4 via `@theme inline`. Radius utilities are scaled off one `--radius` var (`--radius-sm` … `--radius-4xl`). Dark mode is a `.dark` class variant, not `prefers-color-scheme`. Prefer the existing gradient tokens (e.g. `from-indigo-600 to-purple-600`) over inventing new brand colors — nearly every gradient/ghost-icon/dot-pattern placeholder in the app reuses the same handful of combinations.

### i18n is custom, not next-intl

`src/lib/i18n.ts` holds per-locale dictionaries (`th`/`en`/`zh`/`ja`/`ko`) and `src/components/providers/locale-provider.tsx` is a client Context provider (persists choice to `localStorage`, wraps the app in `src/app/layout.tsx`) exposing `useLocale()` → `{ locale, setLocale, t }`. There is no routing per-locale (no `/en/...` paths). Only the navbar consumes `t`; the rest of the site's copy is hardcoded Thai — follow the existing dictionary shape in `i18n.ts` if extending translations rather than introducing a new i18n mechanism.

### Mock data is the only data layer

`src/lib/mock-data.ts` is the single source for all content and is large — read it before assuming a shape. Key entities and derived helpers:
- **Events** (`MockEvent`): optional `image` (cycled from a small photo pool in `public/eventex`), optional `gallery` (3 images per event, also cycled), optional `merchandise`, and a required `organizer` (plain string name — there is no separate organizers table). `EventCard`/detail pages fall back to a CSS gradient + ghost icon when `image` is unset — keep both paths working when touching event rendering. `getEventBySlug()`, `allEvents` (merged popular + upcoming).
- **Organizers** are *derived*, not stored: `getOrganizers()` groups `allEvents` by `slugify(event.organizer)` on every call (no caching) to build `{ slug, name, events, categories }`. `getOrganizerBySlug()` filters that same derived list. To add/rename an organizer, just change the `organizer` string on events — there's nothing else to update.
- **Merchandise** (`MockMerchandise`, optionally `bestSeller`) lives nested inside events. `getAllMerchandise()` flattens every event's merchandise into `MerchandiseListing[]` (adds `eventTitle`/`eventSlug`); `getBestSellerMerchandise()` filters that for the shop's featured slider. Product icons resolve through the shared `merchIcons` map in `src/lib/merch-icons.ts`.
- `src/lib/mock-auth.ts` hardcodes a list of "registered" emails to fake a login/signup branch client-side (see Auth flow below).

### `/shop` and `/organizers` don't mean what their names suggest

Both routes were repurposed mid-project and no longer match a literal reading of their path — check the actual page before assuming:
- **`/shop`** is a merchandise storefront (`getAllMerchandise()`), not a category browser. There is **no `/categories` index page** — only the dynamic `/categories/[id]` detail route survives (event-category listing, linked from the homepage category tiles). Visiting bare `/categories` 404s by design.
- **`/organizers`** is a static marketing/solutions landing page for prospective organizers (`OrganizerSolutions` + `ConsultationForm`), not a directory of organizers. The actual organizer directory only exists per-profile at **`/organizers/[slug]`** (see the derived-data note above), linked from each event's "จัดโดย …" pill, not from `/organizers` itself.

### Auth flow (no backend)

`src/components/auth/login-form.tsx` collects an email, checks it against `mockRegisteredEmails` (`src/lib/mock-auth.ts`), and either advances to a password step or `router.push`es to `/auth/register?email=...`. `register-form.tsx` reads that query param to lock/pre-fill the email instead of asking again. Both forms use `useSearchParams`, so their pages wrap them in `<Suspense>` — required for `next build` to statically prerender those routes without warnings. Any other client component that calls `useSearchParams` needs the same `<Suspense>` wrapper at its page boundary.

### Homepage composition

`src/app/page.tsx` just assembles section components from `src/components/home/*` in order — that's the place to add/remove/reorder homepage sections. Section components generally follow the same shape: a heading + optional "ดูทั้งหมด" link, content sourced from `mock-data.ts`, and brand-consistent gradient/pattern placeholders where no real photo exists.

### Card-with-secondary-action pattern

Several cards (`event-card.tsx`, `product-card.tsx`, the shop/article cards) need the whole card clickable *and* a secondary action button/link that goes somewhere else (e.g. "ซื้อตั๋ว" → checkout). Nesting an `<a>` inside another `<a>`/`<button>` is invalid HTML, so the pattern used throughout is: the card is a plain container, a full-bleed `<Link className="absolute inset-0 z-10" />` (or, for dialogs, a plain non-link wrapper) handles the primary navigation, and the secondary action is a sibling element raised to `z-20`. Reuse this pattern instead of nesting interactive elements.

### List pages: sidebar filters + shared `Pagination`

`/events`, `/shop`, and `/articles` all follow the same explorer shape: a client component with `useState` filters (checkboxes/selects in a `lg:` sidebar, collapsible on mobile behind a "ตัวกรอง" toggle), a `useMemo`'d filtered+sorted list, and `src/components/ui/pagination.tsx` for page controls. When adding a new filterable list, copy this shape (e.g. `src/components/events/events-explorer.tsx`) rather than inventing a new pattern. Horizontal "slider" rows (`event-slider.tsx`, `product-slider.tsx`) are a separate, simpler pattern: a scroll-snap flex row with two fade-in/out chevron buttons that disable at each scroll edge.

### Static assets have had wrong extensions before

At least one file under `public/` was a video muxed into a file named `*.svg` (Next's static file server serves by extension, so it was being served as `image/svg+xml` and would have silently failed as both an image and a video). If an asset in `public/` won't render, check its actual type (`file <path>`) before assuming the code is wrong. Also note: `next/image` refuses to optimize local SVGs by default — use a plain `<img>` for those instead of adding `dangerouslyAllowSVG` to `next.config.ts`.

### Legal pages

`src/components/legal/legal-page.tsx` exports `LegalPage`/`LegalSection` wrappers shared by `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` — use them for any new legal/static content page instead of rebuilding the layout.
