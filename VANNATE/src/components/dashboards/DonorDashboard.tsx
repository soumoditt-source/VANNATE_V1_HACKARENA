"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Shield, ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";
import { usePortalContext } from "@/components/dashboards/PortalContext";

export default function DonorDashboard() {
  const { addDonation } = usePortalContext();
  const [aadhaar, setAadhaar] = useState("");
  const [tier, setTier] = useState<1 | 2>(1);
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [addTip, setAddTip] = useState<boolean>(true);
  const [donated, setDonated] = useState(false);

  const tipAmount = addTip ? donationAmount * 0.05 : 0;
  const totalAmount = donationAmount + tipAmount;

  const handleVerifyAadhaar = () => {
    if (aadhaar.length === 12) {
      setTier(2);
    } else {
      alert("Please enter a valid 12-digit Aadhaar number");
    }
  };

  const handleDonate = () => {
    setDonated(true);
    const donId = "TXN_" + Math.floor(Math.random() * 1000000);
    addDonation({
      id: donId,
      donorName: "Arjun R. Sharma",
      panNumber: tier === 2 ? "ABCDE1234F" : "UNVERIFIED",
      baseAmount: donationAmount,
      tipAmount: tipAmount,
      totalAmount: totalAmount,
      timestamp: new Date().toISOString()
    });
    setTimeout(() => {
      alert(`Donation of ₹${totalAmount} processed successfully! 80G Certificate will be generated for ₹${donationAmount}. (ID: ${donId})`);
    }, 500);
  };

  const qrPayload = JSON.stringify({
    id: "SANGHAM-DNR-2026-9081",
    role: "DONOR",
    tier: tier === 2 ? "SECURED" : "UNVERIFIED"
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
      {/* LEFT COL: Identity Engine */}
      <div style={{ background: "#0f172a", padding: "2rem", borderRadius: "16px", border: "1px solid #1e293b" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield className="text-indigo-400" />
          Citizen Identity Protocol
        </h2>
        
        {/* Render the Exact Card from Prompt */}
        <div style={{ width: "100%", maxWidth: "350px", height: "210px", border: "2px solid #0052CC", borderRadius: "12px", fontFamily: "sans-serif", padding: "15px", background: "linear-gradient(135deg, #FFF, #F4F5F7)", position: "relative", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", margin: "0 auto 2rem" }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#0052CC", textTransform: "uppercase", letterSpacing: "1px" }}>Sangham Network India</div>
          <div style={{ fontSize: "10px", color: "#5E6C84", marginBottom: "15px" }}>Official Citizen Donor ID</div>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ width: "80px", height: "80px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", padding: "4px", border: "1px solid #ccc" }}>
              <QRCode value={qrPayload} size={70} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#172B4D" }}>Arjun R. Sharma</div>
              <div style={{ fontSize: "11px", color: "#344563", fontFamily: "monospace", marginTop: "4px" }}>ID: SANGHAM-DNR-2026-9081</div>
              <div style={{ fontSize: "11px", color: "#344563", marginTop: "4px" }}>☎ +91 98765 43210</div>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "15px", left: "15px", right: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ background: "#E3F2FD", color: "#0D47A1", padding: "3px 8px", borderRadius: "20px", fontSize: "9px", fontWeight: "bold", border: "1px solid #BBDEFB" }}>✓ MOBILE VERIFIED</span>
            {tier === 2 && (
              <span style={{ background: "#E8F5E9", color: "#1B5E20", padding: "3px 8px", borderRadius: "20px", fontSize: "9px", fontWeight: "bold", border: "1px solid #C8E6C9" }}>✓ AADHAAR SECURED</span>
            )}
          </div>
        </div>

        {tier === 1 && (
          <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "1.5rem", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#93c5fd", marginBottom: "1rem" }}>Upgrade to Tier 2 Verification</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                placeholder="Enter 12-digit Aadhaar" 
                maxLength={12}
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#1e293b", color: "#fff" }}
              />
              <button 
                onClick={handleVerifyAadhaar}
                style={{ background: "#3b82f6", color: "#fff", padding: "10px 20px", borderRadius: "8px", fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COL: Donation & Tipping Engine */}
      <div style={{ background: "#0f172a", padding: "2rem", borderRadius: "16px", border: "1px solid #1e293b" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <CreditCard className="text-emerald-400" />
          Transparent Checkout
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Base Donation Amount (₹)</label>
            <input 
              type="number" 
              value={donationAmount}
              onChange={e => setDonationAmount(Number(e.target.value))}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#1e293b", color: "#fff", fontSize: "1.25rem", fontWeight: 600 }}
            />
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(16, 185, 129, 0.05)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={addTip}
              onChange={e => setAddTip(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "#10b981", marginTop: "2px" }}
            />
            <div>
              <div style={{ fontWeight: 600, color: "#fff", fontSize: "1rem" }}>Add a small tip of 5% (₹{tipAmount.toFixed(2)})</div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Help keep this platform 100% free for NGOs. Tips are not tax-deductible.</div>
            </div>
          </label>

          <div style={{ borderTop: "1px solid #334155", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Total Charge</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>₹{totalAmount.toFixed(2)}</div>
              <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px" }}>₹{donationAmount.toFixed(2)} eligible for 80G tax exemption</div>
            </div>
            
            <button 
              onClick={handleDonate}
              disabled={donated}
              style={{ 
                background: donated ? "#10b981" : "#4f46e5", 
                color: "#fff", 
                padding: "16px 32px", 
                borderRadius: "12px", 
                fontWeight: 700, 
                fontSize: "1.1rem",
                border: "none", 
                cursor: donated ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              }}
            >
              {donated ? <><CheckCircle2 /> Processed</> : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
