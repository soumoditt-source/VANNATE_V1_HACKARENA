# Vannate Technical Architecture & Strategy

## Core Philosophy: Edge AI & Decentralized Compute
Vannate relies heavily on a hybrid architecture that pushes computation to the edge (the user's browser) while maintaining rigorous data consistency via centralized, specialized microservices. This drastically cuts server costs, enabling the "User-Pays" API model powered by frameworks like `Puter.js`.

## System Components

### 1. Frontend Layer
- **Framework:** Next.js 14 App Router.
- **State Management:** React Hooks (`useState`, `useRef`, `useCallback`) alongside local storage for persistent user states, mitigating SSR hydration mismatches via strict `mounted` lifecycle checks.
- **3D Rendering:** Three.js integrated via `react-three-fiber` and raw canvas rendering for high-performance physics simulations (e.g., `DynamicInteractive3DScroll.tsx`, `FallingIconsPhysics.tsx`).
- **Styling:** CSS Modules and Global CSS using variables for dynamic theming (Dark/Light modes).

### 2. Map & Geolocation Layer
- **Google Maps API:** Utilized via `@react-google-maps/api`.
- **Modes:** Hybrid Satellite & Street View enabled dynamically.
- **Routing:** A* pathfinding algorithm (`src/lib/algorithms/pathfinding.ts`) overlays shortest paths for disaster resource distribution, complemented by real-time Directions API for walking distances.

### 3. AI & Machine Learning Pipeline
- **Edge ML (Client-Side):** TensorFlow.js is pinned to the CPU backend to prevent GPU context loss issues, predicting sector demand and crisis resource depletion.
- **Backend ML:** Pre-trained Python Scikit-Learn models (`demand_model.pkl`) process heavy analytics via API endpoints.
- **Multimodal AI Integration:** 
    - **LLM Reasoning:** Mistral and Groq APIs power the Vanna Copilot for complex multi-language Q&A and RAG logic.
    - **TTS Voice:** Sarvam API for localized Indian language generation and native `SpeechSynthesis` API fallback. Handled by a robust audio queuing system (`useAITTS.ts`).
    - **OCR:** Integrated with `OCR.space` for keyless text extraction from NGO receipts and medical requests.

### 4. CRM & Identity
- **Dynamic Identity Generation:** Unique cryptographic QR code generation via external APIs for instantaneous validation of Donors, NGOs, and Volunteers (`src/lib/id.ts`).
- **Security:** CSRF tokens, strict validation of JSON payloads, and dynamic routing to handle different roles (Citizen, NGO Ops, Emergency Command).

## Deployment & Hosting
- Designed for Vercel/Netlify environments.
- Environmental variables inject secure API endpoints natively without exposing primary tokens to the client.