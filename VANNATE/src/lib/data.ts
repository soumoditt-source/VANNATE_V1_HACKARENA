export type ActorRole = "donor" | "ngo" | "admin" | "emergency";

export type Campaign = {
  id: string;
  title: string;
  ngo: string;
  category: string;
  location: string;
  urgency: "critical" | "high" | "medium";
  goal: number;
  raised: number;
  beneficiaries: number;
  trustScore: number;
  summary: string;
  matchReason: string;
};

export type RouteCheckpoint = {
  label: string;
  time: string;
  status: "complete" | "current" | "pending";
  location: string;
  proof: string;
};

export type DonationRecord = {
  id: string;
  donorId: string;
  beneficiaryId: string;
  ngoCode: string;
  ngo: string;
  category: string;
  amount: number;
  trustToken: string;
  status: "initiated" | "accepted" | "in_transit" | "delivered" | "impact_ready";
  impact: string;
  eta: string;
  route: RouteCheckpoint[];
};

export type KnowledgeDoc = {
  id: string;
  title: string;
  source: string;
  tags: string[];
  body: string;
};

export type FeedbackRecord = {
  id: string;
  message: string;
  rating: 1 | -1;
  correction?: string;
  createdAt: string;
};

export const campaigns: Campaign[] = [
  {
    id: "CMP-108-HOWRAH-FLOOD",
    title: "Howrah Flood Relief Kits",
    ngo: "Kolkata Relief Foundation",
    category: "Emergency Relief Kits",
    location: "Howrah Sector 4",
    urgency: "critical",
    goal: 800000,
    raised: 472820,
    beneficiaries: 1240,
    trustScore: 917,
    summary:
      "Water, ORS, blankets, dry food, and basic medicine kits for families affected by overnight flooding.",
    matchReason:
      "High urgency, verified NGO, 4.1 km from your last donation area, and live route proof available.",
  },
  {
    id: "CMP-108-CHILDREN-MONSOON",
    title: "Monsoon Shelter for Children",
    ngo: "Aashroy Child Trust",
    category: "Shelter",
    location: "Behala, Kolkata",
    urgency: "high",
    goal: 520000,
    raised: 318900,
    beneficiaries: 86,
    trustScore: 884,
    summary:
      "Temporary weatherproof shelter and hygiene kits for children living near flooded low-lying zones.",
    matchReason:
      "Your past shelter donation matches this campaign, and the NGO has 96% beneficiary confirmation.",
  },
  {
    id: "CMP-221-BLOOD-O-NEG",
    title: "Emergency O- Blood Pool",
    ngo: "City Blood Connect",
    category: "Blood",
    location: "Salt Lake Medical Corridor",
    urgency: "critical",
    goal: 120,
    raised: 74,
    beneficiaries: 44,
    trustScore: 932,
    summary:
      "Verified donor activation for rare blood groups with hospital confirmation and eligibility reminders.",
    matchReason:
      "Rare stock is below threshold, and five eligible donors are within 8 km of partner hospitals.",
  },
];

export const activeDonation: DonationRecord = {
  id: "VN-108-10800001-7D3F9",
  donorId: "10800001",
  beneficiaryId: "108-A100000",
  ngoCode: "108",
  ngo: "Kolkata Relief Foundation",
  category: "Emergency Relief Kits",
  amount: 3200,
  trustToken: "VTS-917-GEO-7D3F9",
  status: "in_transit",
  impact: "Supports 8 family relief kits with verified beneficiary handoff.",
  eta: "34 minutes",
  route: [
    {
      label: "Donor scan",
      time: "10:02 AM",
      status: "complete",
      location: "Park Street kiosk",
      proof: "QR signed with donor ID 10800001.",
    },
    {
      label: "NGO accepted",
      time: "10:06 AM",
      status: "complete",
      location: "Kolkata Relief hub",
      proof: "Volunteer badge and geo stamp verified.",
    },
    {
      label: "Route checkpoint",
      time: "10:21 AM",
      status: "current",
      location: "Vidyasagar Setu corridor",
      proof: "Live route heartbeat active.",
    },
    {
      label: "Beneficiary handoff",
      time: "10:56 AM",
      status: "pending",
      location: "Howrah Sector 4 shelter",
      proof: "Beneficiary QR and photo proof pending.",
    },
    {
      label: "Impact report",
      time: "11:04 AM",
      status: "pending",
      location: "Donor dashboard",
      proof: "AI summary generated after confirmation.",
    },
  ],
};

export const crisisNeeds = [
  { label: "Drinking water", value: 8000, unit: "L", priority: "P1", status: "critical" },
  { label: "Medical doctors", value: 4, unit: "teams", priority: "P1", status: "critical" },
  { label: "Food kits", value: 1240, unit: "kits", priority: "P2", status: "high" },
  { label: "Tarpaulin", value: 600, unit: "sheets", priority: "P2", status: "high" },
  { label: "Volunteers", value: 50, unit: "needed", priority: "P3", status: "open" },
];

export const agents = [
  {
    name: "Donation Intelligence",
    signal: "Matches donor intent with urgency, location, verified need, and impact history.",
  },
  {
    name: "NGO Copilot",
    signal: "Generates grant drafts, donor outreach, volunteer plans, and impact reports.",
  },
  {
    name: "Emergency Response",
    signal: "Prioritizes crisis needs, dispatches volunteers, and forecasts shortages.",
  },
  {
    name: "Fraud Detection",
    signal: "Scores campaign language, activity graphs, identity consistency, and route anomalies.",
  },
  {
    name: "Volunteer Scheduler",
    signal: "Matches skills, availability, location, attendance reliability, and task urgency.",
  },
  {
    name: "Logistics Optimization",
    signal: "Plans pickup paths, cold-chain constraints, proof checkpoints, and handoffs.",
  },
  {
    name: "Impact Analytics",
    signal: "Turns donation data into live KPIs, SDG mapping, and emotional donor stories.",
  },
  {
    name: "Translation",
    signal: "Keeps Bengali, Hindi, English, Tamil, Telugu, Marathi, Assamese, and Odia fluent.",
  },
  {
    name: "Voice Assistant",
    signal: "Routes spoken requests to donation, blood, emergency, report, and volunteer workflows.",
  },
];

export const conceptDeck = [
  "Screenshot_20260511_011346.jpg",
  "Screenshot_20260511_011354.jpg",
  "Screenshot_20260511_011408.jpg",
  "Screenshot_20260511_011418.jpg",
  "Screenshot_20260511_011432.jpg",
  "Screenshot_20260511_011441.jpg",
  "Screenshot_20260511_011445.jpg",
  "Screenshot_20260511_011449.jpg",
  "Screenshot_20260511_011500.jpg",
  "Screenshot_20260511_011504.jpg",
  "Screenshot_20260511_011508.jpg",
  "Screenshot_20260511_011525.jpg",
  "Screenshot_20260511_011537.jpg",
  "Screenshot_20260511_011540.jpg",
  "Screenshot_20260511_011546.jpg",
];

export const knowledgeBase: KnowledgeDoc[] = [
  {
    id: "vision",
    title: "Vannate Core Vision",
    source: "Uploaded concept deck, slides 1-6",
    tags: ["vision", "ngo", "humanitarian", "operating system"],
    body:
      "Vannate is an AI-native humanitarian operating system for donors, NGOs, volunteers, blood banks, beneficiaries, and emergency responders. It is not only a donation app; it is a trust engine, crisis network, NGO copilot, donation intelligence infrastructure, and impact analytics layer.",
  },
  {
    id: "identity",
    title: "QR Humanitarian Identity",
    source: "Uploaded concept deck, slide 7",
    tags: ["qr", "identity", "tracking", "verification"],
    body:
      "Every NGO receives a code such as 108. Donors receive sequential IDs such as 10800001. Beneficiaries receive IDs such as 108-A100000. Donation packages receive a signed journey ID with timestamp, geolocation, trust token, route log, and delivery proof.",
  },
  {
    id: "trust",
    title: "Vannate Trust Score",
    source: "Uploaded concept deck, slide 9",
    tags: ["trust", "fraud", "verification", "vts"],
    body:
      "The Vannate Trust Score is a live 0-1000 score computed from government registration, activity consistency, beneficiary confirmations, media proof quality, community reviews, and anomaly flags. Scores below 600 trigger review and below 400 trigger suspension pending a moderator.",
  },
  {
    id: "rag",
    title: "RAG NGO Copilot",
    source: "Uploaded concept deck, slide 14",
    tags: ["rag", "llm", "copilot", "compliance", "reports"],
    body:
      "The NGO copilot uses retrieval augmented generation. Queries are embedded, matched against verified NGO documents, compliance rules, disaster SOPs, blood donation guidelines, CSR policies, and grant templates. Responses cite sources and avoid unsourced compliance claims.",
  },
  {
    id: "voice",
    title: "Multilingual Voice AI",
    source: "Uploaded concept deck, slide 13",
    tags: ["voice", "bengali", "hindi", "whisper", "translation"],
    body:
      "The voice AI must support Bengali, Hindi, English, Tamil, Telugu, Marathi, Assamese, and Odia. The open stack is Whisper or faster-whisper for speech recognition, NLLB for translation, a local LLM such as Llama or Mistral through Ollama, and XTTS or browser speech synthesis for voice output.",
  },
  {
    id: "blood",
    title: "Smart Blood Bank",
    source: "Uploaded concept deck, slide 10",
    tags: ["blood", "hospital", "emergency", "donor matching"],
    body:
      "The blood bank ecosystem tracks inventory, eligibility, rare blood priority, emergency alerts, hospital requests, and geo-prioritized donor matching. It is designed for urgent commands like finding nearby O negative donors.",
  },
  {
    id: "disaster",
    title: "Disaster Response Intelligence",
    source: "Uploaded concept deck, slide 11",
    tags: ["disaster", "heatmap", "flood", "routing", "forecasting"],
    body:
      "During floods, fires, cyclones, earthquakes, or pandemics, the crisis layer activates heatmaps, prioritizes needs, dispatches volunteers, tracks supplies, identifies shelter capacity, and predicts resource shortages such as insulin or drinking water running out.",
  },
  {
    id: "redistribution",
    title: "Resource Redistribution Marketplace",
    source: "Uploaded concept deck, slide 12",
    tags: ["food", "waste", "redistribution", "marketplace", "route"],
    body:
      "Restaurants, hotels, marriage halls, corporates, households, pharmacies, and hospitals can list surplus resources. AI matches surplus to nearby orphanages, old age homes, crisis shelters, schools, and vulnerable households while optimizing pickup and delivery routes.",
  },
  {
    id: "rlhf",
    title: "Human Feedback Loop",
    source: "Product architecture requirement",
    tags: ["rlhf", "feedback", "evaluation", "model improvement"],
    body:
      "The MVP should collect thumbs up, thumbs down, corrections, reviewer notes, donor satisfaction, volunteer corrections, and NGO validation. This creates a feedback dataset for prompt evaluation, retrieval tuning, reward modeling, and future QLoRA fine-tuning of Vannate-Humanity-1.",
  },
  {
    id: "deployment",
    title: "Free Deployment Stack",
    source: "Hackathon implementation plan",
    tags: ["free", "api", "deployment", "vercel", "supabase", "ollama"],
    body:
      "The prototype can run without paid AI APIs using Next.js, local lexical RAG, optional Ollama, browser speech recognition, browser speech synthesis, OpenStreetMap style map visuals, and in-memory demo APIs. Production can add Supabase Postgres, Qdrant, Resend, Firebase, Razorpay test mode, and Mapbox or Google Maps when keys are available.",
  },
];

export const apiNeeds = [
  {
    name: "Ollama local endpoint",
    required: false,
    env: "OLLAMA_BASE_URL, OLLAMA_MODEL",
    purpose: "Free local LLM generation for the RAG copilot.",
  },
  {
    name: "Supabase or Neon Postgres",
    required: false,
    env: "DATABASE_URL",
    purpose: "Persistent users, NGOs, donations, feedback, and audit logs.",
  },
  {
    name: "Qdrant",
    required: false,
    env: "QDRANT_URL, QDRANT_API_KEY",
    purpose: "Production semantic vector search for RAG.",
  },
  {
    name: "Firebase Cloud Messaging",
    required: false,
    env: "FIREBASE_*",
    purpose: "Emergency donor and volunteer push notifications.",
  },
  {
    name: "Razorpay or Stripe test keys",
    required: false,
    env: "RAZORPAY_KEY_ID, STRIPE_SECRET_KEY",
    purpose: "Payment demo and later real donation processing.",
  },
  {
    name: "Mapbox or Google Maps",
    required: false,
    env: "NEXT_PUBLIC_MAPBOX_TOKEN, NEXT_PUBLIC_GOOGLE_MAPS_KEY",
    purpose: "Production-grade routing and street-level logistics.",
  },
];
