# Vannate Product Requirements Document

## One-Line Product

Vannate is the AI operating system for humanitarian work: it makes every donation, emergency request, volunteer task, blood-bank request, and NGO workflow trustworthy, traceable, intelligent, and measurable.

## Target Users

- Donors who want proof that help reached the right person.
- NGOs that need automation for reports, grants, donor communication, compliance, and volunteer coordination.
- Volunteers who need reliable task assignment and verified certificates.
- Blood banks and hospitals that need urgent donor matching.
- Emergency coordinators who need live crisis maps and resource routing.
- Platform admins who need fraud detection, audit logs, and trust moderation.

## MVP Goal

For the hackathon, prove one complete story:

1. A donor scans or generates a QR-backed donation.
2. Vannate creates an NGO-linked donor ID and beneficiary ID.
3. The package receives a trust token and route checkpoints.
4. The NGO dashboard updates.
5. The AI copilot generates a grounded response with citations.
6. Emergency mode shows live needs and routing.
7. Feedback is captured to improve the AI loop.

## Core Features

### 1. QR Humanitarian Identity

Each organization gets a code, such as `108`. Donors get IDs such as `10800001`. Beneficiaries get pseudonymous IDs such as `108-A100000`. Every package gets a `VN-...` ID and trust token. This gives each act of giving a traceable name.

Acceptance criteria:

- Donation creation returns donor ID, beneficiary ID, package ID, and trust token.
- UI shows the ID clearly.
- Tracking endpoint can retrieve the journey.

### 2. Donation Tracking

Donations have checkpoints: donor scan, NGO acceptance, route movement, beneficiary handoff, and impact report.

Acceptance criteria:

- UI shows status timeline.
- UI shows current route and ETA.
- API returns live status.

### 3. AI NGO Copilot

The copilot helps NGOs write reports, create campaigns, answer donor questions, and handle compliance carefully.

Acceptance criteria:

- User can submit text query.
- API retrieves relevant context.
- Response includes citations.
- No compliance claim is made without source grounding.

### 4. RLHF Feedback

Users and reviewers can rate AI answers.

Acceptance criteria:

- Useful and needs-review buttons call `/api/feedback`.
- API stores a feedback record.
- Aggregate can be fetched for demo.

### 5. Disaster Command Center

Emergency mode visualizes priority needs and resource pressure.

Acceptance criteria:

- Crisis heatmap is visible.
- Needs list includes priority, quantity, and status.
- AI can answer flood/disaster prompts.

### 6. Smart Blood Bank

Blood-bank intelligence supports urgent donor matching, eligibility reminders, hospital requests, and rare blood prioritization.

Acceptance criteria:

- AI prompt for blood returns correct workflow.
- UI/pitch clearly shows blood as a first-class module.

### 7. Trust Score

The Vannate Trust Score makes NGO and campaign trust explainable.

Acceptance criteria:

- UI shows a score out of 1000.
- Component signals are visible.
- Score can be recomputed from weighted signals.

## Roadmap

### Kolkata MVP

- Bengali, Hindi, English voice.
- 50 NGOs.
- 5K donors.
- 500 volunteers.
- Food redistribution, blood bank, flood/cyclone workflows.

### India Scale

- Multi-state onboarding.
- Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Odia.
- CSR dashboards.
- National blood-bank integrations.
- State disaster-management partnerships.

### Global Platform

- International NGO coordination.
- UN SDG reporting.
- Cross-border donation compliance.
- Satellite/crisis analytics.
- Refugee and disaster response workflows.

## Success Metrics

- NGO time saved per week.
- Donation confirmation rate.
- Beneficiary proof completion rate.
- Volunteer attendance reliability.
- Emergency response time reduction.
- Fraud flag precision.
- Donor repeat rate.
- AI answer helpfulness score.

