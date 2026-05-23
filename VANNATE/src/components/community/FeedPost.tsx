"use client";

import { useState, useRef } from "react";
import { Share2, MessageSquare, Heart, ShieldCheck, Play } from "lucide-react";

export type PostData = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  content: string;
  urgency?: boolean;
  verified?: boolean;
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  };
  likes: number;
  comments: number;
};

export default function FeedPost({ post }: { post: PostData }) {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="feed-post">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">{post.avatar}</div>
          <div className="author-meta">
            <strong>
              {post.author}
              {post.verified && <ShieldCheck size={14} color="var(--teal)" />}
              {post.urgency && <span className="badge badge-critical">URGENT</span>}
            </strong>
            <span>{post.role} • {post.time}</span>
          </div>
        </div>
      </div>
      
      <div className="post-content">
        {post.content}
      </div>

      {post.media && (
        <div className="post-media" onClick={post.media.type === "video" ? handlePlayVideo : undefined} style={{ cursor: post.media.type === "video" ? "pointer" : "default" }}>
          {post.media.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.media.url} alt="Post attachment" loading="lazy" />
          ) : (
            <>
              <video 
                ref={videoRef}
                src={post.media.url} 
                poster={post.media.thumbnail}
                loop 
                playsInline
                onEnded={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <div className="video-overlay">
                  <div className="play-btn">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="post-actions">
        <button 
          className={`action-btn support ${liked ? "active" : ""}`} 
          onClick={() => setLiked(!liked)}
          style={{ color: liked ? "var(--red)" : "" }}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} /> {post.likes + (liked ? 1 : 0)} Support
        </button>
        <button className="action-btn">
          <MessageSquare size={18} /> {post.comments} Comment
        </button>
        <button className="action-btn share">
          <Share2 size={18} /> Share
        </button>
      </div>
    </div>
  );
}
