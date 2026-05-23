import type { AccountMode } from "@/lib/id";

export type AppMode = {
  id: AccountMode;
  label: string;
  home: string;
  summary: string;
  links: { href: string; label: string }[];
};

export type LiveMarker = {
  id: string;
  kind: "incident" | "blood" | "hospital" | "donor" | "shelter" | "volunteer" | "route";
  label: string;
  zone: string;
  lat: number;
  lng: number;
  severity: "critical" | "high" | "medium" | "normal";
  status: string;
  eta?: string;
  metadata: Record<string, string | number | boolean>;
};

export const appModes: AppMode[] = [
  {
    id: "citizen",
    label: "Citizen / Donor",
    home: "/dashboard",
    summary: "Donation QR, blood requests, personal impact, and Vanna copilot.",
    links: [
      { href: "/dashboard", label: "Donor Home" },
      { href: "/blood", label: "Blood Help" },
      { href: "/verify", label: "Verify Donation" },
      { href: "/track", label: "Track Donation" },
      { href: "/community", label: "Community" },
      { href: "/copilot", label: "Ask Vanna" },
      { href: "/analytics", label: "Impact" },
    ],
  },
  {
    id: "ngo",
    label: "NGO Ops",
    home: "/ngo",
    summary: "NGO automation, volunteers, reports, grants, and trust operations.",
    links: [
      { href: "/ngo", label: "NGO Desk" },
      { href: "/trust", label: "Trust Engine" },
      { href: "/verify", label: "Verification Flow" },
      { href: "/volunteer", label: "Volunteers" },
      { href: "/community", label: "Community" },
      { href: "/analytics", label: "Reports" },
      { href: "/copilot", label: "NGO Copilot" },
    ],
  },
  {
    id: "command",
    label: "Emergency Command",
    home: "/crisis",
    summary: "Live incidents, blood-bank surge, dispatch, maps, and resource routing.",
    links: [
      { href: "/crisis", label: "Incidents" },
      { href: "/blood", label: "Blood Bank" },
      { href: "/trust", label: "Trust Engine" },
      { href: "/verify", label: "Verification Flow" },
      { href: "/track", label: "Live Tracking" },
      { href: "/community", label: "Feed" },
      { href: "/volunteer", label: "Dispatch" },
      { href: "/analytics", label: "Live KPIs" },
      { href: "/copilot", label: "Command AI" },
    ],
  },
];

export const liveMarkers: LiveMarker[] = [
  {
    id: "INC-HOWRAH-FLOOD",
    kind: "incident",
    label: "Howrah flood cluster",
    zone: "Howrah Sector 4",
    lat: 22.5958,
    lng: 88.2636,
    severity: "critical",
    status: "active incident",
    eta: "18 min response ETA",
    metadata: { affected: 1240, waterLitresNeeded: 8000, priority: "P1" },
  },
  {
    id: "HSP-CMC-O-NEG",
    kind: "hospital",
    label: "Calcutta Medical College",
    zone: "Medical College",
    lat: 22.5745,
    lng: 88.3639,
    severity: "critical",
    status: "O- request open",
    eta: "12 min donor ETA",
    metadata: { bloodGroup: "O-", unitsNeeded: 2, verifiedHospital: true },
  },
  {
    id: "DON-O-1",
    kind: "donor",
    label: "Eligible O- donor pool",
    zone: "Bowbazar",
    lat: 22.5687,
    lng: 88.3568,
    severity: "high",
    status: "3 donors reachable",
    eta: "10-20 min",
    metadata: { group: "O-", eligible: 3, coolingPeriodBlocked: 1 },
  },
  {
    id: "SHEL-HOWRAH-1",
    kind: "shelter",
    label: "Howrah school shelter",
    zone: "Howrah Sector 4",
    lat: 22.5891,
    lng: 88.2773,
    severity: "medium",
    status: "capacity available",
    metadata: { capacity: 220, occupied: 143 },
  },
  {
    id: "VOL-DISPATCH-7",
    kind: "volunteer",
    label: "Volunteer team Alpha",
    zone: "Vidyasagar Setu",
    lat: 22.5579,
    lng: 88.3168,
    severity: "normal",
    status: "en route",
    eta: "14 min",
    metadata: { volunteers: 7, skill: "first aid" },
  },
];

export const liveApiCatalog = [
  {
    need: "Free live map tiles",
    freeOption: "OpenStreetMap raster tiles or self-hosted Leaflet",
    env: "none for prototype",
    reason: "Shows real map context without a paid key. Respect OSM tile usage policy for production traffic.",
  },
  {
    need: "Production routing and distance matrix",
    freeOption: "OpenRouteService free tier or GraphHopper free tier",
    env: "OPENROUTESERVICE_API_KEY or GRAPHHOPPER_API_KEY",
    reason: "Computes ambulance, volunteer, blood donor, and relief-kit ETAs from coordinates.",
  },
  {
    need: "Geocoding and reverse geocoding",
    freeOption: "Nominatim or LocationIQ free tier",
    env: "LOCATIONIQ_API_KEY optional",
    reason: "Turns addresses into latitude/longitude and makes incident reports map-searchable.",
  },
  {
    need: "Live database and auth",
    freeOption: "Supabase free tier",
    env: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY",
    reason: "Stores users, QR identities, incidents, blood requests, dispatch logs, and evidence safely.",
  },
  {
    need: "Push notifications",
    freeOption: "Firebase Cloud Messaging",
    env: "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY",
    reason: "Alerts nearby donors, volunteers, hospitals, and NGO operators during incidents.",
  },
  {
    need: "RAG vector search",
    freeOption: "Qdrant local Docker or Qdrant Cloud free tier",
    env: "QDRANT_URL, QDRANT_API_KEY",
    reason: "Retrieves verified SOPs, NGO docs, blood rules, and incident history before the AI answers.",
  },
  {
    need: "Local or hosted reasoning LLM",
    freeOption: "Ollama with Mistral/Llama locally; Mistral free credits when available",
    env: "OLLAMA_BASE_URL, OLLAMA_MODEL, MISTRAL_API_KEY optional",
    reason: "Generates cited, constrained answers after retrieval. Local Ollama keeps the demo free.",
  },
  {
    need: "OCR",
    freeOption: "Tesseract OCR locally or Mistral OCR when key is available",
    env: "OCR_PROVIDER, MISTRAL_API_KEY optional",
    reason: "Reads prescription slips, hospital blood requests, bills, relief receipts, and beneficiary proof images.",
  },
  {
    need: "Audio transcription",
    freeOption: "faster-whisper locally",
    env: "WHISPER_BASE_URL optional",
    reason: "Turns field voice notes and distress calls into incident evidence for RAG.",
  },
  {
    need: "MP4 incident analysis",
    freeOption: "ffmpeg frame extraction plus local vision model",
    env: "VIDEO_ANALYSIS_BASE_URL optional",
    reason: "Extracts frames, timestamps, scene labels, and visible risk signals from uploaded videos.",
  },
  {
    need: "Email receipts and reports",
    freeOption: "Resend free tier",
    env: "RESEND_API_KEY",
    reason: "Sends donation receipts, NGO reports, volunteer dispatch summaries, and incident closure reports.",
  },
  {
    need: "Payments",
    freeOption: "Razorpay or Stripe test mode",
    env: "RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, STRIPE_SECRET_KEY",
    reason: "Lets the demo accept real-looking donations while staying in test mode until compliance is ready.",
  },
];

export const copilotReasoningSteps = [
  "Identify actor mode and urgency.",
  "Extract location, blood group, resource, or document intent.",
  "Retrieve verified Vannate context and SOPs.",
  "Check evidence source quality before answering.",
  "Rank actions by safety, distance, urgency, and trust score.",
  "State assumptions and missing data.",
  "Return cited next actions, not unsupported claims.",
  "Collect human feedback for review and future tuning.",
];
