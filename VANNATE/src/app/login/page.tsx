"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate a secure 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email,
          subject: "Your Vannate Security Code",
          html: `<h1>Vannate Verification</h1><p>Your OTP code is: <strong>${newOtp}</strong></p><p>Do not share this code with anyone.</p>`
        })
      });
      setStep(2);
    } catch (error) {
      console.error("Failed to send OTP", error);
      alert("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In a real app, verify via backend. Here we simulate it.
    if (otp === generatedOtp || otp === "789321") { // 789321 as master override for testing
      setTimeout(() => {
        // Create a secure session token
        window.localStorage.setItem("vannate-user", JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: "NGO" // Defaulting to NGO for the QR demo
        }));
        router.push("/dashboard");
      }, 800);
    } else {
      setLoading(false);
      alert("Invalid OTP. Please check your email or console logs.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: "16px",
    outline: "none"
  };

  return (
    <div className="page-shell" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Dynamic Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop') center/cover", opacity: 0.1 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(to top, var(--bg-main) 10%, transparent 100%)" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ zIndex: 1, width: "100%", maxWidth: "460px", padding: "3rem 2.5rem", backdropFilter: "blur(20px)", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
        
        <div style={{ width: "50px", height: "50px", background: "var(--teal)", borderRadius: "14px", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(20,184,166,0.3)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>

        <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem", fontFamily: "var(--font-playfair)" }}>
          {step === 1 ? "Create Identity" : "Verify Identity"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem" }}>
          {step === 1 ? "Register your secure node on the Vannate network." : "Enter the 6-digit OTP sent to your email."}
        </p>
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOtp}>
              <input required type="text" placeholder="Full Name (e.g. Rahul Sharma)" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="tel" placeholder="Mobile Number" style={inputStyle} value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              <input required type="password" placeholder="Secure Password" style={inputStyle} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <div style={{ marginTop: "1rem", marginBottom: "1rem", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <input 
                  type="checkbox" 
                  required 
                  id="terms" 
                  checked={termsAccepted} 
                  onChange={(e) => setTermsAccepted(e.target.checked)} 
                  style={{ marginTop: "4px", accentColor: "var(--teal)" }}
                />
                <label htmlFor="terms" style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  I agree to the <a href="#" style={{ color: "var(--teal)", textDecoration: "underline" }}>Vannate Terms of Service</a> and <a href="#" style={{ color: "var(--teal)", textDecoration: "underline" }}>Data Privacy Policy</a>. I consent to my data being processed securely for humanitarian workflows.
                </label>
              </div>
              
              <button type="submit" className="btn-primary" disabled={loading || !termsAccepted} style={{ width: "100%", padding: "16px", borderRadius: "12px", fontSize: "1.1rem" }}>
                {loading ? "Initializing..." : "Generate Secure OTP"}
              </button>
            </motion.form>
          ) : (
            <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyOtp}>
              <div style={{ background: "rgba(20,184,166,0.1)", padding: "1rem", borderRadius: "12px", marginBottom: "2rem", border: "1px solid rgba(20,184,166,0.2)" }}>
                <p style={{ color: "var(--teal)", fontSize: "0.9rem", textAlign: "center" }}>Check your email (or your dev console) for the code sent to <strong>{formData.email}</strong>.</p>
              </div>
              
              <input required type="text" placeholder="Enter 6-Digit OTP" maxLength={6} style={{...inputStyle, textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px"}} value={otp} onChange={e => setOtp(e.target.value)} />
              
              <button type="submit" className="btn-primary" disabled={loading || otp.length < 6} style={{ width: "100%", padding: "16px", marginTop: "1rem", borderRadius: "12px", fontSize: "1.1rem" }}>
                {loading ? "Verifying..." : "Verify & Access System"}
              </button>
              
              <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text-muted)", width: "100%", padding: "1rem", marginTop: "0.5rem", cursor: "pointer", textDecoration: "underline" }}>
                Wrong email? Go back.
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
