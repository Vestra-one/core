# Senior Frontend Code Review — Vestra App

**Reviewer:** Senior Frontend Developer  
**Scope:** Architecture, React patterns, styling, a11y, performance, maintainability.

---

## 1. What’s Working Well

- **Stack:** React 19, TypeScript, Vite 7, Tailwind v4, React Router 7, TanStack Query, React Hook Form + Zod — modern and appropriate.
- **Theme system:** CSS variables in `index.css` with light/dark, semantic tokens (`--color-text-primary`, etc.), and consistent radii/shadows. Theme persists via `ThemeContext` + `localStorage`.
- **API client:** `api.ts` is clean: typed `request()`, `ApiError`, no trailing slash, supports MSW base URL. Good foundation for when you wire real endpoints.
- **Forms:** `useFormWithZod` centralizes schema + resolver; Zod schemas in `lib/schemas.ts` with tests.
- **Error boundary:** `RouteErrorFallback` handles route errors and offers “Try again” / “Go home”.
- **Routing:** Single `createBrowserRouter` with shared `DashboardLayout` for app shell; `ROUTES` constants avoid magic strings.
- **E2E / unit:** Playwright and Vitest are set up; landing has tests.

---

## 2. Architecture & Data

### 2.1 Router configuration

- **Issue:** `App.tsx` repeats the same pattern for every route (path, `DashboardLayout`, children with index + element). Repetition and risk of drift.
- **Suggestion:** Define a route config array (path, component) and map over it for dashboard routes so adding a route is one object. Optionally use `createRoutesFromElements` if you prefer JSX.

### 2.2 TanStack Query and API usage

- **Issue:** `QueryClientProvider` wraps the app but **no `useQuery` or `useMutation`** anywhere. No page calls `api.get()` / `api.post()`. All data is hardcoded in components.
- **Impact:** When you add real APIs, you’ll need to refactor each page to use queries/mutations, loading and error states, and cache keys.
- **Suggestion:** Pick 1–2 screens (e.g. Dashboard treasury balance, Contacts list) and wire them to MSW/real API with `useQuery` and loading/error UI so the pattern is established.

### 2.3 Entry point (`main.tsx`)

- **Issue 1:** `prepare()` only returns when `VITE_USE_MSW === "true"`. When MSW is off, it returns `undefined`, so `prepare().then(() => ...)` still runs, but the contract is unclear.
- **Suggestion:** Always return a Promise, e.g. `return Promise.resolve()` when MSW is disabled.
- **Issue 2:** `worker` from `./mocks/browser` is imported unconditionally. When MSW is never used, that code is still in the bundle.
- **Suggestion:** Use dynamic `import()` for the worker inside the `if (VITE_USE_MSW === "true")` branch so non-MSW builds don’t pull in MSW.

---

## 3. Components & UI Patterns

### 3.1 Button vs raw `<button>`

- **Issue:** A shared `Button` component exists with variants (primary, secondary, ghost, danger) and sizes, but **pages mostly use raw `<button>`** with long, duplicated Tailwind strings (e.g. Dashboard “Add Funds”, Treasury “Export Report”, many CTAs).
- **Impact:** Inconsistent behavior (e.g. disabled styles), harder to change primary/secondary styling globally, more code.
- **Suggestion:** Use `<Button variant="primary">` (and optional `leftIcon`) for primary/secondary actions. Reserve raw `<button>` for one-off cases (e.g. icon-only with custom aria).

### 3.2 Page layout wrapper

- **Issue:** The same wrapper appears on many pages:  
  `flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)]` plus inner `p-8 max-w-6xl mx-auto w-full space-y-*`.
- **Suggestion:** Extract a `PageContainer` (or use a layout route) that provides this wrapper and optional breadcrumb so each page focuses on content.

### 3.3 Breadcrumbs

- **Issue:** Breadcrumb pattern is copy-pasted (e.g. “Treasury / Balance”, “Treasury / Contacts”) with similar markup and styles.
- **Suggestion:** Add a small `Breadcrumb` component that takes `items: { label, href? }[]` and render a single consistent pattern.

### 3.4 Settings and non-routed actions

- **Issue:** Sidebar “Settings” is a `<div>` with `cursor-pointer` and no `to` or `href`. It doesn’t navigate. Same for many “View all” / “Manage” buttons that have no handlers.
- **Suggestion:** Either add routes/handlers or make them clearly disabled (e.g. `aria-disabled="true"`, muted style, tooltip “Coming soon”) so behavior is clear.

---

## 4. Styling & Theming

### 4.1 Mixed use of semantic tokens and raw Tailwind

- **Issue:** Many components use `text-slate-900 dark:text-white` or `text-slate-500` instead of `text-[var(--color-text-primary)]` / `text-[var(--color-text-muted)]`. You’ve already introduced semantic tokens and used them in some places; others still use raw slate.
- **Impact:** Theming or contrast tweaks require hunting both tokens and Tailwind classes.
- **Suggestion:** Standardize on semantic tokens for text and, where it helps, for backgrounds. Replace remaining `text-slate-*` / `dark:text-*` with `var(--color-text-*)` (or a small set of utility classes that map to those vars).

### 4.2 RouteErrorFallback

- **Issue:** Uses `text-slate-900 dark:text-slate-100` and `text-slate-500` instead of the same semantic tokens as the rest of the app.
- **Suggestion:** Use `var(--color-text-primary)` and `var(--color-text-muted)` so the error page respects the design system and any future token changes.

---

## 5. Accessibility

### 5.1 Strengths

- Theme toggle and a few icon buttons have `aria-label`.
- Toggle in TreasuryPage: checkbox is `sr-only`, label wraps the control — good for screen readers.
- Landmark structure is reasonable (header, main, nav, aside).

### 5.2 Gaps

- **Tables:** `<th>` cells have no `scope="col"` (or `scope="row"` for row headers). Adding scope improves table navigation and announcements.
- **Icon-only buttons:** Many icon buttons (e.g. filter, more, copy, send) have no `aria-label`. Relying only on `title` or nothing hurts keyboard and screen reader users.
- **Focus:** No visible focus ring policy (e.g. `focus-visible:ring-2`) on interactive elements. Custom toggles and buttons should have a consistent focus style.
- **Skip link:** No “Skip to main content” link; keyboard users must tab through the full header/sidebar every time.
- **Headings:** Some pages have more than one `<h1>` in a single view; prefer a single logical `<h1>` per route and then `<h2>`/`<h3>` for sections.

**Suggestions:** Add `scope="col"` to table headers; give every icon-only control an `aria-label`; define a global focus ring (e.g. in `index.css` or Tailwind) and apply it to buttons/links/inputs; add a skip link at the top of the layout.

---

## 6. TypeScript & Types

- **useFormWithZod:** Uses `as any` for Zod 4 vs zodResolver typing; the escape hatch is documented and localized. Acceptable short term; longer term, align resolver types or use a typed adapter.
- **Icon:** `name` is `string`; Material Symbol names are not type-checked. Low risk; optional improvement is `type IconName = "dashboard" | "send" | ...` (or generated from a list).
- **API:** `request<T>` and method wrappers are typed; `body as T` is a simple assertion. Fine until you add stricter API contracts (e.g. runtime validation or codegen).

---

## 7. Performance & Bundle

- **Code splitting:** No `React.lazy()` or route-based splitting. The whole app loads up front. For an app of this size it may be acceptable; as it grows, lazy-loading dashboard/treasury/payments routes will help.
- **QueryClient:** Provided but unused. When you add `useQuery`, you’ll get request deduping and caching; no change needed until then.
- **MSW:** As above, consider dynamic import so production builds without MSW don’t include it.

---

## 8. Security (brief)

- No obvious XSS: React escapes by default; no `dangerouslySetInnerHTML` in the reviewed code.
- No auth or sensitive tokens in client code; when you add them, keep tokens out of repo and use env or secure storage.

---

## 9. Suggested Priorities

| Priority | Item | Effort |
|----------|------|--------|
| **P0** | Wire at least one screen to API + `useQuery` (e.g. dashboard balance or contacts) and add loading/error states. | Medium |
| **P1** | Use shared `Button` for primary/secondary CTAs; reduce raw `<button>` duplication. | Low |
| **P1** | Fix `main.tsx`: return `Promise.resolve()` when MSW off; optional dynamic import for worker. | Low |
| **P2** | Extract `PageContainer` and optional `Breadcrumb`; standardize page layout. | Low |
| **P2** | Add `scope` to table headers; add `aria-label` to all icon-only buttons; add skip link and focus ring. | Low–Medium |
| **P2** | Standardize error fallback and remaining pages on semantic text tokens. | Low |
| **P3** | Refactor router to a route config array (or JSX) to avoid repetition. | Low |
| **P3** | Consider route-level code splitting with `React.lazy()` for heavy routes. | Low |

---

## 10. Summary

The codebase is structured clearly, uses a solid stack and theme system, and has a good base (API client, form hook, error boundary, tests). The main gaps are: **no real data layer yet** (Query + API), **inconsistent use of shared components and design tokens**, and **missing a11y polish** (tables, icon buttons, focus, skip link). Addressing P0 and P1 will give the biggest benefit for future feature work and production readiness.
