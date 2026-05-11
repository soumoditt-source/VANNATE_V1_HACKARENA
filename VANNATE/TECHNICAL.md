# Technical Architecture & Development Log

## Architecture Overview
Vannate uses a multi-page routing structure with Next.js App Router for optimal SEO and separate chunk boundaries for heavy components.
* `/app/page.tsx`: Animated hero with `ParticleCanvas` and platform pillars.
* `/app/dashboard/page.tsx`: Donor interface and active donation route tracking.
* `/app/crisis/page.tsx`: Crisis command center with custom SVG heatmaps.
* `/app/blood/page.tsx`: Inventory tracking and AI donor finder.
* `/app/ngo/page.tsx`: Operations hub with RAG AI drafting tools.
* `/app/volunteer/page.tsx`: Live skill dispatch network.
* `/app/copilot/page.tsx`: The "Vanna" AI assistant with `SpeechRecognition` implementation.
* `/app/analytics/page.tsx`: HTML5 Canvas rendering for live data charts and SDG progress.

## Backend APIs
Microservice-ready API endpoints (`/app/api/...`) simulate database interaction:
* `/api/ai`: RAG retrieval and synthesis.
* `/api/blood`: Donor matching and hospital alerting.
* `/api/volunteers`: Dispatch logic.
* `/api/emergency`: Crisis zone activation.
* `/api/analytics`: Impact KPI aggregation.

## Theming & UI
* No external UI libraries were used (no Tailwind). All styling is driven by `src/app/globals.css`.
* Heavy use of CSS variables, `backdrop-filter` for glassmorphism, and keyframe animations (`blink`, `float`).

## Build Verification
* Successfully passes `npm run build` with `0` type errors.
* Dynamic routes (`/track/[id]`) correctly typed.
* TypeScript configured strictly for all components.