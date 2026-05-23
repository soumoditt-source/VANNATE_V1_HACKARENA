"use client";

import { useState } from "react";
import { Image as ImageIcon, Video, AlertTriangle, Send } from "lucide-react";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [urgency, setUrgency] = useState(false);
  const [mediaSelected, setMediaSelected] = useState<"image" | "video" | null>(null);

  const handlePost = () => {
    if (!text.trim() && !mediaSelected) return;
    // In a real app, this would push to Supabase or the backend API
    console.log("Posting:", { text, urgency, mediaSelected });
    setText("");
    setUrgency(false);
    setMediaSelected(null);
    alert("Post published successfully!");
  };

  return (
    <div className="create-post">
      <textarea
        placeholder={urgency ? "Describe the urgent situation..." : "Share an update, news, or resource..."}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      {mediaSelected && (
        <div style={{ marginBottom: 12, padding: 12, background: "var(--input-bg)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 10 }}>
          {mediaSelected === "video" ? <Video size={16} /> : <ImageIcon size={16} />}
          <span style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
            Mock {mediaSelected} attachment ready.
          </span>
          <button 
            onClick={() => setMediaSelected(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--red)", fontSize: "0.8rem", cursor: "pointer" }}
          >
            Remove
          </button>
        </div>
      )}

      <div className="composer-actions">
        <div className="composer-tools">
          <button 
            className={`composer-tool-btn ${mediaSelected === "image" ? "active" : ""}`}
            onClick={() => setMediaSelected(mediaSelected === "image" ? null : "image")}
          >
            <ImageIcon size={16} /> Photo
          </button>
          <button 
            className={`composer-tool-btn ${mediaSelected === "video" ? "active" : ""}`}
            onClick={() => setMediaSelected(mediaSelected === "video" ? null : "video")}
          >
            <Video size={16} /> Video
          </button>
          <button 
            className={`composer-tool-btn urgency ${urgency ? "active" : ""}`}
            onClick={() => setUrgency(!urgency)}
          >
            <AlertTriangle size={16} /> Urgent
          </button>
        </div>
        <button 
          className="btn-primary btn-sm" 
          onClick={handlePost}
          disabled={!text.trim() && !mediaSelected}
        >
          <Send size={16} /> Post
        </button>
      </div>
    </div>
  );
}
