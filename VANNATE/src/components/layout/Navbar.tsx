"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAITTS } from "@/lib/useAITTS";
import { Sun, Moon, Volume2, Square } from "lucide-react";
import { appModes } from "@/lib/live";
import { generateUserIdentity, type AccountMode } from "@/lib/id";

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentLang, setLanguage } = useLanguage();
  const { speak, stop, isPlaying } = useAITTS();
  const [mounted, setMounted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);
  
  useEffect(() => {
    setMounted(true);
    const storedUser = window.localStorage.getItem("vannate-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [mode, setMode] = useState<AccountMode>("citizen");
  const activeMode = appModes.find((item) => item.id === mode) ?? appModes[0];
  const links = [{ href: "/", label: "Home" }, ...activeMode.links];

  const handleLogout = () => {
    window.localStorage.removeItem("vannate-user");
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <span className="brand-v">V</span>ANNATE
        </Link>
        <div className={`nav-links ${open ? "open" : ""}`} suppressHydrationWarning>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "nav-link active" : "nav-link"} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          
          <select 
            className="form-select" 
            style={{ width: "auto", padding: "6px 10px", height: "32px", fontSize: "0.8rem", background: "transparent", borderColor: "var(--border)" }}
            value={currentLang}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "bn")}
            aria-label="Switch language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="bn">বাংলা</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: "auto", padding: "6px 10px", height: "32px", fontSize: "0.8rem", background: "transparent", borderColor: "var(--border)" }}
            value={mode}
            onChange={(e) => setMode(e.target.value as AccountMode)}
            aria-label="Switch Vannate mode"
          >
            {appModes.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem", background: "var(--surface)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 600, color: "var(--teal)" }}>{user.name}</span>
              <span style={{ color: "var(--text-muted)" }}>{user.role}</span>
              <button onClick={() => setShowQR(true)} style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.3)", color: "var(--teal)", cursor: "pointer", fontSize: "0.75rem", padding: "4px 8px", borderRadius: "12px", marginLeft: 4 }}>View ID</button>
              <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.75rem", marginLeft: 4 }}>Log Out</button>
            </div>
          ) : (
            <Link href="/login" className="btn-ghost" style={{ padding: "6px 14px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign In
            </Link>
          )}

          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle Theme"
            suppressHydrationWarning
          >
            {mounted ? (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />) : <div style={{ width: 20, height: 20 }} />}
          </button>

          {mounted && (
            <button
              onClick={() => {
                if (isPlaying) {
                  stop();
                } else {
                  const textToRead = document.querySelector("main")?.innerText.substring(0, 400) || "Welcome to Vannate OS.";
                  speak(textToRead + "... Reading complete.", currentLang);
                }
              }}
              className="theme-toggle"
              style={{ color: isPlaying ? "var(--teal)" : "inherit" }}
              aria-label="Read Page Aloud"
              suppressHydrationWarning
            >
              {isPlaying ? <Square size={20} fill="currentColor" /> : <Volume2 size={20} />}
            </button>
          )}
        </div>
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* QR Code Modal Overlay */}
      {showQR && user && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ background: "var(--bg-main)", padding: "2rem", borderRadius: "24px", textAlign: "center", maxWidth: "400px", width: "100%", border: "1px solid var(--teal)" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--teal)" }}>Vannate Secure Identity</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>Scan this QR code at distribution hubs or beneficiary locations to cryptographically verify your identity.</p>
            
            <div style={{ background: "#fff", padding: "1rem", borderRadius: "16px", display: "inline-block", marginBottom: "2rem" }}>
              {/* Using a free reliable QR API to generate the code instantly without extra dependencies */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VANNATE_AUTH:${user.email}:${user.role}`} alt="Identity QR" width={250} height={250} style={{ display: "block" }} />
            </div>
            
            <div style={{ marginBottom: "2rem", textAlign: "left", background: "var(--surface)", padding: "1rem", borderRadius: "12px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Name</div>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{user.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Email</div>
              <div style={{ fontWeight: 600 }}>{user.email}</div>
            </div>

            <button onClick={() => setShowQR(false)} className="btn-primary" style={{ width: "100%", padding: "12px", borderRadius: "12px" }}>Close ID Card</button>
          </div>
        </div>
      )}
    </nav>
  );
}
