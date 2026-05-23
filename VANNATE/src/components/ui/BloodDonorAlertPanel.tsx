"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type BloodRequest = {
  hospital: string;
  address: string;
  group: string;
  units: number;
  urgency: "critical" | "high" | "medium";
  time: string;
  patientName?: string;
  contactName: string;
  contactPhone: string;
  hospitalLat?: number;
  hospitalLng?: number;
};

type Props = {
  request: BloodRequest;
  onClose: () => void;
};

const CHAIN_STEPS = [
  { icon: "🏥", label: "Hospital Request", desc: "Emergency raised by hospital staff" },
  { icon: "🩸", label: "Vannate Blood Bank", desc: "AI matches nearest eligible donors" },
  { icon: "📲", label: "Donor Alerted", desc: "WhatsApp + call sent instantly" },
  { icon: "✅", label: "Donor Confirms", desc: "Location shared upon confirmation" },
  { icon: "🚗", label: "Donor Arrives", desc: "Real-time navigation to hospital" },
];

export default function BloodDonorAlertPanel({ request, onClose }: Props) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<"info" | "contact" | "confirmed">("info");
  const [elapsed, setElapsed] = useState(0);

  // Live urgency timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const urgencyColor = request.urgency === "critical" ? "#ef4444" : request.urgency === "high" ? "#f59e0b" : "#14b8a6";

  const waMessage = encodeURIComponent(
    `🚨 URGENT BLOOD REQUEST — Vannate AI\n\nHospital: ${request.hospital}\nBlood Group: ${request.group}\nUnits Needed: ${request.units}\nUrgency: ${request.urgency.toUpperCase()}\n\nPlease confirm if you can donate. Reply YES to receive hospital navigation.`
  );
  const waLink = `https://wa.me/91${request.contactPhone.replace(/\D/g, "")}?text=${waMessage}`;
  const callLink = `tel:+91${request.contactPhone.replace(/\D/g, "")}`;

  function handleDonateAgree() {
    setAgreed(true);
    setStep("confirmed");
    // Navigate to crisis/map page with hospital coords after 1.5s
    setTimeout(() => {
      const params = new URLSearchParams();
      if (request.hospitalLat) params.set("lat", String(request.hospitalLat));
      if (request.hospitalLng) params.set("lng", String(request.hospitalLng));
      params.set("highlight", request.hospital);
      router.push(`/crisis?${params.toString()}`);
    }, 2000);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
          background: "linear-gradient(160deg, #0f172a 0%, #0a0f1e 100%)",
          border: `1px solid ${urgencyColor}44`,
          borderRadius: 24,
          boxShadow: `0 0 60px ${urgencyColor}22, 0 24px 80px rgba(0,0,0,0.6)`,
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${urgencyColor}18, transparent)`,
          borderBottom: `1px solid ${urgencyColor}33`,
          padding: "1.4rem 1.6rem",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          borderRadius: "24px 24px 0 0",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: urgencyColor,
                animation: "alertPulse 1.2s ease-in-out infinite",
                boxShadow: `0 0 8px ${urgencyColor}`,
              }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.15em", color: urgencyColor, textTransform: "uppercase" }}>
                {request.urgency} · Live Alert
              </span>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>
                +{Math.floor(elapsed / 60)}m {elapsed % 60}s
              </span>
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: 2 }}>
              Blood Emergency: {request.group}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{request.hospital}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "1.4rem 1.6rem" }}>

          {step === "info" && (
            <>
              {/* Request Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Blood Group", value: request.group, color: "#ef4444" },
                  { label: "Units Needed", value: `${request.units} unit${request.units > 1 ? "s" : ""}`, color: "#f59e0b" },
                  { label: "Hospital", value: request.hospital, color: "#14b8a6" },
                  { label: "Time Raised", value: request.time, color: "#94a3b8" },
                ].map(d => (
                  <div key={d.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontWeight: 700, color: d.color, fontSize: "0.95rem" }}>{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div style={{ background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.2rem" }}>📍</span>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Hospital Address</div>
                  <div style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 500 }}>{request.address}</div>
                </div>
              </div>

              {/* Transparency Chain */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                  Transparency Chain
                </div>
                <div style={{ position: "relative", paddingLeft: 14 }}>
                  <div style={{ position: "absolute", left: 18, top: 20, bottom: 20, width: 1, background: "linear-gradient(to bottom, #ef4444, #14b8a6)", opacity: 0.3 }} />
                  {CHAIN_STEPS.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14, position: "relative" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: i <= 2 ? `${urgencyColor}20` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${i <= 2 ? urgencyColor + "55" : "rgba(255,255,255,0.08)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                        boxShadow: i <= 2 ? `0 0 12px ${urgencyColor}22` : "none",
                      }}>
                        {s.icon}
                      </div>
                      <div style={{ paddingTop: 4 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: i <= 2 ? "#fff" : "rgba(255,255,255,0.4)" }}>{s.label}</div>
                        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px 16px", borderRadius: 14,
                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                    color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                    textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,211,102,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.3)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={callLink}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px 16px", borderRadius: 14,
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                    textDecoration: "none", boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call Now
                </a>
              </div>

              <button
                onClick={() => setStep("contact")}
                style={{
                  width: "100%", padding: "14px", borderRadius: 14,
                  background: `linear-gradient(135deg, ${urgencyColor}, ${urgencyColor}bb)`,
                  border: "none", color: "#fff", fontWeight: 800, fontSize: "1rem",
                  cursor: "pointer", boxShadow: `0 6px 24px ${urgencyColor}44`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                🩸 I Want to Donate Blood
              </button>
            </>
          )}

          {step === "contact" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: "3rem", marginBottom: 8 }}>🤝</div>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: 8 }}>Thank you for stepping forward</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  By confirming below, you'll receive the hospital's precise GPS location and the patient's attending contact.
                </p>
              </div>

              {/* Contact card */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.2rem", marginBottom: 20 }}>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Hospital Contact</div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 4 }}>{request.contactName}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: 16 }}>{request.hospital}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 12, background: "#25D36622", border: "1px solid #25D36644", color: "#25D366", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                  <a href={callLink} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 12, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Call Now
                  </a>
                </div>
              </div>

              <button
                onClick={handleDonateAgree}
                style={{
                  width: "100%", padding: "15px", borderRadius: 14,
                  background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                  border: "none", color: "#fff", fontWeight: 800, fontSize: "1.05rem",
                  cursor: "pointer", boxShadow: "0 6px 24px rgba(20,184,166,0.4)",
                  marginBottom: 10, transition: "transform 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                ✅ Yes, I Confirm — Take Me to Hospital
              </button>
              <button onClick={() => setStep("info")} style={{ width: "100%", padding: "10px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.85rem" }}>
                ← Go Back
              </button>
            </>
          )}

          {step === "confirmed" && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🌟</div>
              <h3 style={{ color: "#14b8a6", fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>You&apos;re a Hero</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
                Opening live hospital map navigation.<br />Your location is being shared with the hospital team.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                <div style={{ width: 20, height: 20, border: "2px solid #14b8a6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                Redirecting to crisis map...
              </div>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes alertPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
          @keyframes spin { 100%{transform:rotate(360deg)} }
        ` }} />
      </div>
    </div>
  );
}
