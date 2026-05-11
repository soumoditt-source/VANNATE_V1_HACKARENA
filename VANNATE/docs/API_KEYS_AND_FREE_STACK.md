# API Keys and Free-First Stack

Vannate runs locally with no paid keys. The current build uses internal demo APIs and OpenStreetMap-ready coordinates so judges can test flows immediately. Add the keys below only when you want true live persistence, routing, notifications, OCR, audio, video, or hosted LLMs.

## Required For Current Prototype

None.

## Live API Readiness

| Capability | Free-first provider | Env vars | Why it is needed |
| --- | --- | --- | --- |
| Live map tiles | OpenStreetMap / Leaflet | none | Shows blood-bank and incident-response map layers without a paid key. For production traffic, follow OSM tile policy or self-host tiles. |
| Routing and ETA | OpenRouteService or GraphHopper | `OPENROUTESERVICE_API_KEY` or `GRAPHHOPPER_API_KEY` | Computes donor-to-hospital, volunteer-to-incident, and relief-kit delivery ETAs. |
| Geocoding | Nominatim or LocationIQ | `LOCATIONIQ_API_KEY` optional | Converts incident addresses and hospital names into latitude/longitude. |
| Database and auth | Supabase free tier | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Stores user accounts, unique QR identities, incidents, blood alerts, donations, evidence, and audit logs. |
| Local LLM | Ollama with Mistral/Llama | `OLLAMA_BASE_URL`, `OLLAMA_MODEL` | Free local reasoning for the RAG copilot. Example model: `mistral`, `llama3.1`, or `qwen2.5`. |
| Hosted LLM fallback | Mistral | `MISTRAL_API_KEY` | Optional hosted reasoning and OCR if the demo machine cannot run local models. |
| Vector RAG | Qdrant local or Qdrant Cloud free tier | `QDRANT_URL`, `QDRANT_API_KEY` | Semantic retrieval over NGO docs, SOPs, blood guidelines, incident reports, and compliance records. |
| OCR | Tesseract local or Mistral OCR | `OCR_PROVIDER`, `MISTRAL_API_KEY` optional | Reads prescriptions, hospital blood slips, bills, relief receipts, IDs, and beneficiary proof images. |
| Audio analysis | faster-whisper local | `WHISPER_BASE_URL` optional | Transcribes voice notes, emergency calls, and field reports. |
| MP4 analysis | ffmpeg + local vision model | `VIDEO_ANALYSIS_BASE_URL` optional | Extracts frames/timestamps and visible risk signals from incident videos. |
| Push alerts | Firebase Cloud Messaging | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Sends urgent donor, volunteer, hospital, and NGO dispatch notifications. |
| Email | Resend | `RESEND_API_KEY` | Sends receipts, impact reports, dispatch summaries, and incident closure reports. |
| Payments | Razorpay or Stripe test mode | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY` | Enables donation checkout in test mode until legal and NGO compliance are complete. |

## Current Local API Routes

| Route | Purpose |
| --- | --- |
| `GET /api/map?layer=all|blood|incident` | Live-map marker feed with OSM-ready coordinates and provider connection notes. |
| `POST /api/users` | Generates unique account IDs and QR payloads for Citizen, NGO, or Command mode. |
| `GET/POST /api/blood` | Lists live-ready donors and creates blood alerts with coordinates and ETA placeholder. |
| `GET/POST /api/emergency` | Lists active incident zones and creates new incident response records. |
| `POST /api/analyze` | Accepts image/PDF/audio/video evidence and returns the correct OCR/STT/MP4 pipeline contract. |
| `POST /api/ai` | RAG copilot with citations, 8-step audit checklist, and anti-hallucination guardrails. |

## Anti-Hallucination Rules

1. The copilot cites retrieved sources for every operational answer.
2. OCR/audio/video claims are not invented. The system returns a provider-ready pipeline until a real extractor supplies verified text, transcript, or frame labels.
3. Incident and blood actions state missing data when location, blood group, hospital, units, or evidence is absent.
4. Human feedback is collected for review, prompt evaluation, and future tuning.

## Deployment Checklist

1. Run `npm install`.
2. Add optional keys to `.env.local` only when providers are ready.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Run `npm run start -- -p 3002` locally, or deploy to Vercel as a Next.js app.
6. Test `/dashboard`, `/blood`, `/crisis`, `/copilot`, `/api/map`, `/api/users`, `/api/blood`, `/api/emergency`, `/api/analyze`, and `/api/ai`.
