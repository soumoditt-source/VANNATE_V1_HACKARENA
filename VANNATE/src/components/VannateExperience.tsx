 "use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Activity,
  BadgeCheck,
  Bot,
  Brain,
  Database,
  FileText,
  Globe2,
  HandCoins,
  HeartHandshake,
  Languages,
  MapPinned,
  Mic,
  PackageCheck,
  QrCode,
  Radio,
  Send,
  ShieldCheck,
  Siren,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  activeDonation,
  agents,
  apiNeeds,
  campaigns,
  conceptDeck,
  crisisNeeds,
  type ActorRole,
} from "@/lib/data";
import { computeTrustScore, defaultTrustSignals } from "@/lib/trust";

type AiResponse = {
  answer: string;
  provider: string;
  citations: { title: string; source: string; score: number }[];
};

type SpeechRecognitionResultEventLike = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const roleTabs: {
  id: ActorRole;
  label: string;
  icon: LucideIcon;
  blurb: string;
}[] = [
  {
    id: "donor",
    label: "Donor",
    icon: HeartHandshake,
    blurb: "Track giving, proof, impact, and AI-matched campaigns.",
  },
  {
    id: "ngo",
    label: "NGO Ops",
    icon: Users,
    blurb: "Automate reports, campaigns, volunteers, and verification.",
  },
  {
    id: "emergency",
    label: "Crisis",
    icon: Siren,
    blurb: "Coordinate floods, blood, shelters, and live dispatch.",
  },
  {
    id: "admin",
    label: "Trust",
    icon: ShieldCheck,
    blurb: "Moderate risk, fraud, compliance, and audit signals.",
  },
];

const demoPrompts = [
  "Find nearby O- blood donors urgently",
  "Generate flood relief campaign for Howrah Sector 4",
  "Where did my donation go ",
  "Create NGO impact report with citations",
];

const pillars: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Trust Engine", body: "VTS scoring, fraud flags, compliance review.", icon: ShieldCheck },
  { title: "Donation Intelligence", body: "QR identity, route proof, impact lifecycle.", icon: HandCoins },
  { title: "NGO Copilot", body: "Grant, report, outreach, volunteer automation.", icon: FileText },
  { title: "Crisis Response", body: "Heatmaps, needs ranking, dispatch, shortage forecast.", icon: Siren },
  { title: "Voice + Language", body: "Bengali, Hindi, English, regional voice flows.", icon: Languages },
  { title: "RLHF Loop", body: "Reviewer feedback dataset for model improvement.", icon: Brain },
];

const stackCards: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Web + API", body: "Next.js fullstack, TypeScript, server routes, deployable on Vercel.", icon: Activity },
  { title: "RAG", body: "Local retrieval now; Qdrant + BGE embeddings when API keys are ready.", icon: Database },
  { title: "Voice", body: "Browser speech for demo; Whisper/faster-whisper for production STT.", icon: Mic },
  { title: "Tracking", body: "QR package IDs, route checkpoints, geo/time proofs, audit trail.", icon: PackageCheck },
  { title: "AI Runtime", body: "Local fallback built in; optional Ollama endpoint for free LLM output.", icon: Bot },
  { title: "Global Scale", body: "Kolkata MVP, India multilingual rollout, global NGO infrastructure.", icon: Globe2 },
];

function currency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" aria-label={`Progress ${value}%`}>
      <span style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function QrGlyph() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 1, 1, 1, 0, 1, 1, 0,
    0, 0, 1, 0, 1, 0, 1, 1,
    1, 0, 0, 1, 1, 1, 0, 0,
    0, 1, 1, 0, 0, 1, 1, 1,
    1, 0, 1, 1, 0, 0, 1, 0,
    1, 1, 0, 1, 1, 0, 1, 1,
  ];

  return (
    <div className="qr-glyph" aria-label="Demo QR code">
      {cells.map((cell, index) => (
        <span key={index} className={cell ? "filled" : ""} />
      ))}
    </div>
  );
}

function RouteMap() {
  return (
    <div className="route-map" aria-label="Live Kolkata donation route">
      <div className="map-grid" />
      <svg viewBox="0 0 560 280" role="img" aria-label="Donation route from donor to beneficiary">
        <path className="river" d="M20 210 C150 110, 240 250, 370 110 S500 100, 540 42" />
        <path
          className="route-line"
          d="M82 202 C145 176, 176 126, 235 134 C298 142, 306 84, 374 76 C428 68, 456 102, 500 70"
        />
        <circle className="pulse donor" cx="82" cy="202" r="11" />
        <circle className="pulse hub" cx="235" cy="134" r="11" />
        <circle className="pulse live" cx="374" cy="76" r="14" />
        <circle className="pulse beneficiary" cx="500" cy="70" r="11" />
        <text x="62" y="232">Park Street</text>
        <text x="200" y="164">NGO hub</text>
        <text x="326" y="54">Live van</text>
        <text x="446" y="102">Howrah S4</text>
      </svg>
      <div className="map-stat">
        <span>Route proof</span>
        <strong>58%</strong>
      </div>
    </div>
  );
}

export function VannateExperience() {
  const [role, setRole] = useState<ActorRole>("donor");
  const [query, setQuery] = useState("Generate a flood relief campaign for Howrah Sector 4");
  const [ai, setAi] = useState<AiResponse | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceState, setVoiceState] = useState("Ready");
  const [createdId, setCreatedId] = useState(activeDonation.id);
  const trustScore = useMemo(() => computeTrustScore(defaultTrustSignals), []);
  const activeRole = roleTabs.find((tab) => tab.id === role) || roleTabs[0];
  const ActiveRoleIcon = activeRole.icon;

  async function askAi(event : FormEvent<HTMLFormElement>) {
    event .preventDefault();
    if (!query.trim()) {
      return;
    }

    setIsThinking(true);
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, role, language: "English + Bengali fallback" }),
    });
    const data = (await response.json()) as AiResponse;
    setAi(data);
    setIsThinking(false);
  }

  async function createDonation() {
    const response = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "Emergency Relief Kits",
        amount: 3200,
        ngo: "Kolkata Relief Foundation",
        ngoCode: "108",
      }),
    });
    const data = (await response.json()) as { donation: { id: string } };
    setCreatedId(data.donation.id);
  }

  async function saveFeedback(rating: 1 | -1) {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: ai?.answer || query,
        rating,
        correction: rating === -1 ? "Needs human reviewer correction in demo." : undefined,
      }),
    });
  }

  function startVoice() {
    const w = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceState("Speech recognition unavailable; type the command.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript || "";
      setQuery(transcript);
      setVoiceState("Captured voice command");
    };
    recognition.onend = () => setVoiceState("Ready");
    setVoiceState("Listening...");
    recognition.start();
  }

  function speakAnswer() {
    if (!ai?.answer || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(ai.answer);
    utterance.lang = "en-IN";
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main>
      <section className="hero-shell">
        <nav className="topbar" aria-label="Primary">
          <div>
            <span className="eyebrow">Hackathon Edition 2026</span>
            <h1>VANNATE</h1>
          </div>
          <div className="nav-actions">
            <a href="#dashboard">Command Center</a>
            <a href="#architecture">Architecture</a>
            <a href="#deck">Pitch Assets</a>
          </div>
        </nav>

        <div className="hero-grid">
          <motion.div
            className="mission-panel"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
          >
            <span className="section-kicker">AI-Powered Humanitarian Intelligence Infrastructure</span>
            <h2>The operating system for human compassion.</h2>
            <p>
              QR-verified donation identity, live logistics proof, NGO automation,
              multilingual RAG copilot, RLHF feedback, smart blood bank, fraud scoring,
              disaster heatmaps, and impact analytics in one deploy-ready prototype.
            </p>
            <div className="hero-actions">
              <button onClick={createDonation} className="primary-action">
                <QrCode size={18} />
                Generate donation QR
              </button>
              <a className="ghost-action" href="#ai-copilot">
                <Bot size={18} />
                Open AI copilot
              </a>
            </div>
            <div className="sanskrit">
              <strong>                       </strong>
              <span>A good person gives without being asked.</span>
            </div>
          </motion.div>

          <motion.div
            className="identity-card"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <div className="card-head">
              <BadgeCheck size={22} />
              <span>Live Humanitarian Identity</span>
            </div>
            <div className="identity-layout">
              <QrGlyph />
              <div>
                <span>Donation package</span>
                <strong>{createdId}</strong>
                <small>Donor {activeDonation.donorId} to beneficiary {activeDonation.beneficiaryId}</small>
              </div>
            </div>
            <div className="token-row">
              <span>Trust token</span>
              <strong>{activeDonation.trustToken}</strong>
            </div>
            <div className="token-row">
              <span>ETA</span>
              <strong>{activeDonation.eta}</strong>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="dashboard" className="workspace">
        <div className="role-tabs" aria-label="Dashboard roles">
          {roleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={role === tab.id ? "active" : ""}
                onClick={() => setRole(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="workspace-grid">
          <section className="panel role-panel">
            <div className="panel-title">
              <ActiveRoleIcon size={22} />
              <div>
                <span>{activeRole.label} dashboard</span>
                <p>{activeRole.blurb}</p>
              </div>
            </div>

            <div className="metric-grid">
              <div>
                <span>Total impact</span>
                <strong>{currency(47820)}</strong>
              </div>
              <div>
                <span>Verified NGOs</span>
                <strong>89</strong>
              </div>
              <div>
                <span>Lives reached</span>
                <strong>4,321</strong>
              </div>
            </div>

            <div className="campaign-list">
              {campaigns.map((campaign) => {
                const progress = Math.round((campaign.raised / campaign.goal) * 100);
                return (
                  <article key={campaign.id} className="campaign-card">
                    <div>
                      <span className={`urgency ${campaign.urgency}`}>{campaign.urgency}</span>
                      <h3>{campaign.title}</h3>
                      <p>{campaign.summary}</p>
                    </div>
                    <div className="campaign-meta">
                      <span>{campaign.location}</span>
                      <span>VTS {campaign.trustScore}</span>
                    </div>
                    <ProgressBar value={progress} />
                    <small>{currency(campaign.raised)} raised   {campaign.beneficiaries} people</small>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="panel map-panel">
            <div className="panel-title">
              <MapPinned size={22} />
              <div>
                <span>Live route verification</span>
                <p>Geo-stamped package journey from donor to beneficiary.</p>
              </div>
            </div>
            <RouteMap />
            <div className="timeline">
              {activeDonation.route.map((step) => (
                <div key={step.label} className={`timeline-row ${step.status}`}>
                  <span />
                  <div>
                    <strong>{step.label}</strong>
                    <p>{step.time}   {step.location}</p>
                    <small>{step.proof}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="ai-copilot" className="panel copilot-panel">
            <div className="panel-title">
              <Bot size={22} />
              <div>
                <span>Vannate-Humanity-1 copilot</span>
                <p>Local RAG now, optional Ollama when you add a free local endpoint.</p>
              </div>
            </div>

            <div className="prompt-chips">
              {demoPrompts.map((prompt) => (
                <button key={prompt} onClick={() => setQuery(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <form className="ask-form" onSubmit={askAi}>
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Ask Vannate AI"
              />
              <div className="ask-actions">
                <button type="button" onClick={startVoice} className="icon-action">
                  <Mic size={18} />
                  {voiceState}
                </button>
                <button type="submit" className="primary-action" disabled={isThinking}>
                  <Send size={18} />
                  {isThinking ? "Thinking" : "Ask AI"}
                </button>
              </div>
            </form>

            <div className="ai-answer">
              {ai ? (
                <>
                  <div className="answer-head">
                    <span>{ai.provider}</span>
                    <button onClick={speakAnswer}>
                      <Radio size={16} />
                      Speak
                    </button>
                  </div>
                  <p>{ai.answer}</p>
                  <div className="citation-list">
                    {ai.citations.map((citation) => (
                      <span key={`${citation.title}-${citation.score}`}>
                        {citation.title}
                      </span>
                    ))}
                  </div>
                  <div className="feedback-row">
                    <button onClick={() => saveFeedback(1)}>
                      <ThumbsUp size={16} />
                      Useful
                    </button>
                    <button onClick={() => saveFeedback(-1)}>
                      <ThumbsDown size={16} />
                      Needs review
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-answer">
                  <Sparkles size={22} />
                  Ask about blood, disaster response, fraud scoring, APIs, reports, or tracking.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="intelligence-band">
        <div className="section-heading">
          <span className="section-kicker">Six pillars, one mission</span>
          <h2>Built from the uploaded deck into a working product surface.</h2>
        </div>
        <div className="pillar-grid">
          {pillars.map(({ title, body, icon: PillarIcon }) => {
            return (
              <article key={title} className="pillar-card">
                <PillarIcon size={22} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="operations-grid">
        <div className="panel trust-panel">
          <div className="panel-title">
            <ShieldCheck size={22} />
            <div>
              <span>AI trust score</span>
              <p>Live credit score for human compassion.</p>
            </div>
          </div>
          <div className="trust-meter">
            <div>
              <strong>{trustScore}</strong>
              <span>/1000</span>
            </div>
          </div>
          <div className="signal-list">
            {defaultTrustSignals.map((signal) => (
              <div key={signal.label}>
                <span>{signal.label}</span>
                <ProgressBar value={Math.round(signal.score / 10)} />
              </div>
            ))}
          </div>
        </div>

        <div className="panel crisis-panel">
          <div className="panel-title">
            <Siren size={22} />
            <div>
              <span>Emergency command center</span>
              <p>Howrah cyclone/flood simulation for the 60-second demo.</p>
            </div>
          </div>
          <div className="heatmap">
            <span className="hotspot red" />
            <span className="hotspot gold" />
            <span className="hotspot teal" />
            <span className="hotspot mint" />
          </div>
          <div className="need-list">
            {crisisNeeds.map((need) => (
              <div key={need.label}>
                <strong>{need.priority}</strong>
                <span>{need.label}</span>
                <em>{need.value.toLocaleString("en-IN")} {need.unit}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel agent-panel">
          <div className="panel-title">
            <Brain size={22} />
            <div>
              <span>Nine specialized agents</span>
              <p>One coordinated mission with LangGraph-ready boundaries.</p>
            </div>
          </div>
          <div className="agent-grid">
            {agents.map((agent) => (
              <article key={agent.name}>
                <strong>{agent.name}</strong>
                <p>{agent.signal}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="architecture-section">
        <div className="section-heading">
          <span className="section-kicker">Architecture</span>
          <h2>Free-first prototype today, production path tomorrow.</h2>
        </div>
        <div className="architecture-grid">
          {stackCards.map(({ title, body, icon: StackIcon }) => {
            return (
              <article key={title}>
                <StackIcon size={24} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            );
          })}
        </div>
        <div className="api-table">
          {apiNeeds.map((api) => (
            <div key={api.name}>
              <strong>{api.name}</strong>
              <span>{api.env}</span>
              <p>{api.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="deck" className="deck-section">
        <div className="section-heading">
          <span className="section-kicker">Uploaded concept deck</span>
          <h2>All images were read and converted into product modules.</h2>
        </div>
        <div className="deck-strip" aria-label="Concept deck screenshots">
          {conceptDeck.map((image) => (
            <Image
              key={image}
              src={`/concept/${image}`}
              alt={`Vannate concept deck ${image}`}
              width={420}
              height={236}
              sizes="(max-width: 760px) 280px, 420px"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
