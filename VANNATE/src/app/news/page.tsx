"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiveNewsFeed from "@/components/ui/LiveNewsFeed";

type Article = {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage: string | null;
};

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeepNews() {
      try {
        // We use an API route to securely use the API Key without exposing it to the client
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.articles) setArticles(data.articles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeepNews();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(20,184,166,0.07),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--teal)" }}>Global Intelligence</div>
          <h1>Humanitarian News Network</h1>
          <p>Real-time deep search across 80,000+ sources for NGOs, disaster relief, and welfare operations.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ marginBottom: "40px" }}>
             <LiveNewsFeed />
          </div>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, background: "var(--purple)", borderRadius: "50%", display: "inline-block" }}></span>
            Deep Search Intel
          </h2>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div className="spinner" style={{ width: 40, height: 40, border: "4px solid var(--purple)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
            </div>
          ) : articles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {articles.map((article, idx) => (
                <motion.a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "0", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(15,23,42,0.6)", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform = "none"}>
                    {article.urlToImage && (
                      <div style={{ width: "100%", height: "160px", background: `url(${article.urlToImage}) center/cover` }} />
                    )}
                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--teal)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "8px" }}>
                        {article.source.name} &middot; {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", lineHeight: 1.4 }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, flex: 1 }}>
                        {article.description?.slice(0, 120)}...
                      </p>
                      <div style={{ marginTop: "16px", color: "var(--purple)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Read full report &rarr;
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ color: "var(--text-muted)" }}>No external news found or API limit reached.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
