# VANNATE: The AI-Native Humanitarian Operating System

**Vasudhaiva Kutumbakam** - *The world is one family.*

## 🌟 Our Story: Van + Nate = Vannate

**Van** comes from **Nirvana** — a state of perfect peace, freedom from suffering, and ultimate enlightenment.  
**Nate** comes from **Donate** — the act of giving with compassion, to uplift those in need.

Vannate is where enlightenment meets action. Where technology transcends code and becomes a force for human good. We believe AI should serve humanity, not the other way around.

---

## 🚀 Key Features

### 1. Trust Engine (VTS - Vannate Trust Score)
A live, real-time trust score for NGOs and donors, computed from:
- On-chain signals and immutable records
- AI-powered fraud detection mechanisms
- Verifiable activity and audit trails
- Transparent, tamper-proof history

### 2. End-to-End Donation Verification (Image + OCR + CNN)
- **Live Camera Capture**: Real-time photo capture with GPS stamping
- **OCR Processing**: AI-powered text extraction using OCR.space
- **Indian Currency Detection**: Automatic recognition of ₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000 notes
- **4-Step Verification Flow**:
  1. Donor Initiates
  2. Volunteer Receives
  3. NGO Hub Verification
  4. Beneficiary Confirms
- **Live Audit Trail**: Immutable record of every transaction step

### 3. AI Crisis Response
- Real-time satellite mapping and incident tracking
- Shortage forecasting using local ML models (A* pathfinding + TensorFlow.js)
- Live incident dispatch and resource allocation

### 4. Smart Blood Bank
- Geolocation-matched rare blood donors
- Intelligent hospital alerts and emergency notifications
- AI-driven eligibility checks for zero delays
- Real-time inventory tracking

### 5. NGO CRM & Volunteer Network
- Skill-matched volunteer dispatch
- Real-time reliability and performance tracking
- Comprehensive CRM system with OCR data extraction
- Multi-language support

### 6. Multimodal AI Copilot (Vanna AI)
- Voice-enabled, RAG-powered conversational assistant
- Multi-lingual support (English + regional languages)
- Document translation and compliance guidance
- Speech-to-text (STT) and Text-to-speech (TTS)
- Live voice chat interface

### 7. Community & News
- Real-time news feed integration (NewsAPI + MediaStack)
- Community engagement platform
- Crisis alerts and emergency notifications

---

## 🧠 Technology Stack

### Frontend
- **Next.js 16** - Modern React framework with App Router
- **React 19** - Latest React features
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### AI & ML
- **TensorFlow.js** - Local edge prediction and on-device ML
- **Groq/Mistral** - LLM reasoning and AI responses
- **ElevenLabs/Sarvam** - Text-to-speech (TTS) voice generation
- **OCR.space** - Document digitization and text extraction

### Mapping & Geolocation
- **Leaflet + CARTO** - Open-source mapping with reliable basemaps
- **GPS Location Stamping** - Automatic location tagging

### Backend & APIs
- **Next.js API Routes** - Full-stack API endpoints
- **Firebase** - Authentication and real-time database
- **Supabase** - PostgreSQL database and auth
- **Puter.js** - Keyless decentralized cloud architecture

### Deployment & DevOps
- **Vercel** - Production deployment
- **Docker + Docker Compose** - Containerization
- **GitHub** - Version control and collaboration

---

## 👥 The Team

### Soumoditya Das
**Lead Developer & Visionary**  
Founder of Vannate, architect of the AI-Native Humanitarian Operating System. Driving the vision of using technology to serve humanity, one donation at a time.

### Sounak Kumar Mondal
**Full-Stack Developer (Shinobi)**  
Full-stack ninja building the core platform, APIs, and user interfaces. Turning complex ideas into working, deployable code.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or newer
- NPM or Yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soumoditt-source/VANNATE_V1_HACKARENA.git
   cd VANNATE_V1_HACKARENA
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.local.example` to `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_GOOGLMAPS_KEY=your_key
   MISTRAL_API_KEY=your_key
   GROQ_API_KEY=your_key
   ELEVENLABS_API_KEY=your_key
   NEWS_API_KEY=your_key
   MEDIASTACK_API_KEY=your_key
   OCR_SPACE_API_KEY=K84303707788957
   ```

4. **Universal Fullstack Launch (One-Click Start):**
   We have provided a universal launcher that automatically clears stale caches, finds an available port, and boots the entire fullstack system (Frontend UI, API Routes, DB Proxies).
   
   Run this single command:
   ```bash
   npm run launch
   ```

5. **The script will output the dynamically chosen port** (usually `http://localhost:3000` or the next available one). Open this in your browser.

---

## 🌐 Our Vision

Our mission is simple but profound: **build a business that prioritizes humanity.**

By leveraging free, deployed, scalable API strategies like Puter.js and edge AI models, Vannate dramatically reduces infrastructure costs. This means more resources go directly to those in need — not to servers, not to middlemen, not to overhead.

Every donation tracked. Every rupee accounted for. Every life touched.

---

## 📄 Documentation

- [Technical Architecture (TECHNICAL.md)](./TECHNICAL.md)
- [Pitch Deck Script (PPT.md)](./ppt.md)
- [Full Story & Vision (VISION.md)](./VISION.md)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VANNATE PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   User UI    │  │  Admin UI    │  │  NGO Portal  │         │
│  │ (Web + PWA)  │  │   (CRM)      │  │   (Hub)      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                   │                   │                  │
│  ┌──────▼───────────────────▼───────────────────▼──────────────┐ │
│  │                    Next.js Frontend Layer                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐ │ │
│  │  │ Verify Page  │  │  Copilot     │  │  Blood Bank/Crisis│ │ │
│  │  │ (Camera+OCR) │  │  (Voice AI)  │  │  Response Modules │ │ │
│  │  └──────────────┘  └──────────────┘  └───────────────────┘ │ │
│  └───────────────────────────────┬───────────────────────────────┘ │
│                                  │                                   │
│  ┌───────────────────────────────▼───────────────────────────────┐ │
│  │                  Next.js API Routes Layer                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐ │ │
│  │  │ /api/upload  │  │ /api/analyze │  │ /api/ai, /api/chat│ │ │
│  │  │ /api/news    │  │ /api/tts     │  │ /api/donations    │ │ │
│  │  └──────────────┘  └──────────────┘  └───────────────────┘ │ │
│  └───────────────────────────────┬───────────────────────────────┘ │
│                                  │                                   │
│  ┌───────────────────────────────▼───────────────────────────────┐ │
│  │                   AI & ML Services Layer                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐ │ │
│  │  │ OCR.space    │  │ Groq/Mistral │  │ ElevenLabs/Sarvam │ │ │
│  │  │ (Text Ext.)  │  │    (LLM)     │  │    (TTS)          │ │ │
│  │  └──────────────┘  └──────────────┘  └───────────────────┘ │ │
│  └───────────────────────────────┬───────────────────────────────┘ │
│                                  │                                   │
│  ┌───────────────────────────────▼───────────────────────────────┐ │
│  │                   Data & Storage Layer                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐ │ │
│  │  │  Firebase    │  │  Supabase    │  │  Puter.js (Cloud) │ │ │
│  │  │    (Auth)    │  │    (DB)      │  │                   │ │ │
│  │  └──────────────┘  └──────────────┘  └───────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

We welcome contributions from everyone who believes in our mission! Whether you're a developer, designer, or just someone who wants to help, there's a place for you in the Vannate family.

---

## 📜 License

Built for humanity. Powered by AI.

---

*Van (Nirvana) + Nate (Donate) = Vannate*  
*Where enlightenment meets action.*  
*Vasudhaiva Kutumbakam — The world is one family.*
