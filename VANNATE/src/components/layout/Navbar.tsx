"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { appModes } from "@/lib/live";
import { generateUserIdentity, type AccountMode } from "@/lib/id";

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<AccountMode>("citizen");
  const [user, setUser] = useState<{name: string, id: string, qrPayload: string} | null>(null);
  const activeMode = appModes.find((item) => item.id === mode) ?? appModes[0];
  const links = [{ href: "/", label: "Home" }, ...activeMode.links];

  const handleLogin = () => {
    const identity = generateUserIdentity(mode, "Soumoditya Das");
    setUser({ name: "Soumoditya Das", id: identity.accountId, qrPayload: identity.qrPayload });
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <span className="brand-v">V</span>ANNATE
        </Link>
        <div className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "nav-link active" : "nav-link"} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          
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
              <span style={{ color: "var(--text-muted)" }}>{user.id}</span>
              <button onClick={() => setUser(null)} style={{ background: "transparent", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.75rem", marginLeft: 4 }}>Log Out</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn-ghost" style={{ padding: "6px 14px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign In
            </button>
          )}

          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
