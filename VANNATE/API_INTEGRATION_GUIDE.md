# Vannate Platform API Integration Guide (Production Readiness)

To transition Vannate from the current UI/UX prototype to a live-data production environment, the frontend is built to connect seamlessly with real backend services. Below is the comprehensive list of APIs required for the next phase.

Since you specified no mock data and real-time operations, these APIs should ideally be low-latency. Support for WebSockets or Server-Sent Events (SSE) is highly recommended for the live tracking features.

## 1. Trust Engine & Donation Telemetry (`/api/donations`, `/api/analytics`)
These endpoints replace the static mock data in the Dashboard and Analytics pages.
* **`GET /api/donations/live`**: 
  * **Purpose**: Stream of real-time donations for the scrolling feed and map points.
  * **Response Spec**: Array of objects `{ id, donorHash, amountINR, destinationId, status: "pending" | "completed", timestamp, lat, lng }`
* **`GET /api/analytics/ngo-trust`**: 
  * **Purpose**: Fetch the computed Vannate Trust Score (VTS) for registered NGOs.
  * **Response Spec**: `{ ngoId, trustScore: number, metrics: { transparency, speed, impact } }`
* **`POST /api/donations/verify`**: 
  * **Purpose**: Endpoint to handle QR scans from field volunteers, marking a donation "delivered".
  * **Payload Spec**: `{ qrToken: string, volunteerId: string, timestamp: ISO8601 }`

## 2. Crisis Response & Logistics (`/api/emergency`)
These feed the Crisis Response module with live heatmap data.
* **`GET /api/emergency/active`**: 
  * **Purpose**: Fetch active disaster zones.
  * **Response Spec**: `[{ id, type: "Flood" | "Earthquake", severity: 1-10, lat, lng, radiusKm, activeSince }]`
  * **Free API Suggestion**: **ReliefWeb API** or **GDACS (Global Disaster Alert and Coordination System)**.
* **`GET /api/emergency/needs`**: 
  * **Purpose**: AI-predicted shortages per zone.
  * **Response Spec**: `[{ zoneId, requiredItems: { medicalKits: 500, blankets: 200 } }]`

## 3. Smart Blood Bank (`/api/blood`)
Endpoints for live inventory and donor alerting.
* **`GET /api/blood/inventory`**: 
  * **Purpose**: Aggregated blood group availability across hospitals.
  * **Response Spec**: `{ O_Pos: 124, O_Neg: 12, A_Pos: 310, ... }`
* **`POST /api/blood/dispatch`**: 
  * **Purpose**: Dispatch algorithm to notify nearby eligible donors.
  * **Payload Spec**: `{ hospitalId, bloodGroup, unitsNeeded, priority: "High" | "Critical" }`

## 4. Volunteer Dispatch (`/api/volunteers`)
* **`GET /api/volunteers/heatmap`**: 
  * **Purpose**: Live locations of active volunteers for the operations map.
  * **Response Spec**: `[{ volunteerId, lat, lng, status: "Available" | "On Mission" }]`
* **`POST /api/volunteers/assign`**: 
  * **Purpose**: Assigns tasks.

## 5. AI Copilot (RAG Engine) (`/api/ai`)
This powers the "Vanna AI" Copilot page.
* **`POST /api/ai/chat`**: 
  * **Purpose**: Core LLM endpoint. It takes the prompt, retrieves context from a vector DB (NGO rules, compliance docs), and streams back the response.
  * **Payload Spec**: `{ messages: [{ role: "user", content: "..." }] }`
  * **Free API Suggestion**: **Groq API** (very fast, free tier) + **Pinecone** for vector DB.
* **`POST /api/ai/voice`** (Optional): 
  * **Purpose**: Dedicated TTS/STT if browser-native APIs fail.

## 6. NGO Operations Hub (`/api/ngo`)
* **`GET /api/ngo/reports`**: Fetch auto-generated compliance reports.
* **`POST /api/ngo/register`**: KYC/KYB flow for new NGOs.

---

### Readiness Checklist for Next Phase:
1. Provide the Base URLs for any existing backend systems you have.
2. Provide Authentication Keys (JWT tokens, API keys) required for connection.
3. If connecting to free data APIs (like GDACS or Groq), I will set up the proxy endpoints in the Next.js `/src/app/api` folder to securely call them and format the data.
