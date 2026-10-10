# Virtual Liberation War Museum — frontend

A bilingual (Bangla / English) web museum of the 1971 Liberation War of Bangladesh:
a 3D walk-through museum, an interactive timeline, a map of 1971 and scrollytelling stories.

**This is a frontend-only demo build.** All content is local demo data in `content/`.
Images are symbolic SVG illustrations (not archival photos) and both stories are
clearly-labelled fictional composites. Verify every fact before publishing.

The full brief this was built from is in [`docs/SYSTEM_PROMPT.md`](docs/SYSTEM_PROMPT.md).

## Run

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /bn)
npm test           # content validation + museum geometry + formatting
npm run build      # runs the tests first (prebuild), then builds
npm run typecheck
npm run lint
```

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 ·
next-intl (`/bn` default, `/en`) · three.js via @react-three/fiber + drei · zustand · zod ·
d3-geo + world-atlas (projected on the server; the browser only receives SVG paths).

## Pages

| Route | What it is |
|---|---|
| `/[locale]` | Landing |
| `/[locale]/museum`, `/museum/[gallery]` | 3D museum (six galleries) with a full 2D gallery fallback |
| `/[locale]/exhibits/[slug]` | Shareable exhibit page, works without WebGL |
| `/[locale]/timeline`, `/timeline/[slug]` | 1947–1972 timeline with category filters |
| `/[locale]/map` | Bangladesh map: events, 11 sectors, refugee routes, month slider |
| `/[locale]/stories`, `/stories/[slug]` | Scrollytelling stories |
| `/[locale]/heroes` | Bir Sreshtho and wartime leadership |
| `/[locale]/sources`, `/about` | Bibliography; method and content-warning policy |

## Where things live

```
content/            Demo data (sources, places, people, events, galleries + exhibits, stories)
types/content.ts    zod schemas — every item is validated, every reference must resolve
lib/content/        The only API components use to read content (swap for a CMS later)
lib/museum/layout.ts  Pure museum geometry: rooms, collision, exhibit slots, view points
lib/art.ts          SVG illustration motifs (shared by DOM and 3D textures)
lib/map/geo.ts      Server-side map projection
components/museum/  Canvas scene, player controller, HUD, exhibit panel, warning dialog, 2D view
messages/{bn,en}.json  UI strings
```

## The 3D museum

- Six rooms in walking order: Roots → March 1971 → The Struggle → Genocide and Loss → Victory → Hall of Memory.
- Desktop: W A S D / arrows to walk, drag to look, click an exhibit. Touch: joystick + drag.
- Guided tour, mini-map (click a room to go there), "exhibits in this room" list for keyboard users.
- Exhibit details open in a DOM side panel, never as 3D text.
- The genocide gallery is a quiet room: a content warning at the threshold with a "skip" option,
  no light strips, sensitive exhibits blurred until the visitor chooses to see them.
- Hall of Memory: light a candle (stored only in this browser's localStorage).
- Performance: three.js loads only after "Enter the 3D museum"; only the current room and its
  neighbours are mounted; quality tiers (low/medium/high) plus automatic downgrade.
- No WebGL, a save-data connection or ≤ 2 GB device memory → the 2D gallery view is offered first.

## Adding content

Edit the files in `content/`, then run `npm test`. A broken reference (unknown source, place,
event…), a duplicate id, two exhibits on one wall slot or out-of-order events fail the build.
Each gallery room has four wall slots (0/1 left wall, 2/3 right wall).
