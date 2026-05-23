import { Metadata } from "next";
import CreatePost from "@/components/community/CreatePost";
import FeedPost, { type PostData } from "@/components/community/FeedPost";

export const metadata: Metadata = {
  title: "Community Feed",
  description: "Live updates, humanitarian news, and urgency reports from the Vannate network.",
};

const mockPosts: PostData[] = [
  {
    id: "post-1",
    author: "Kolkata Red Cross",
    role: "Verified NGO",
    avatar: "KR",
    time: "12m ago",
    content: "Urgent: We need 50 volunteers for the food distribution drive in North Kolkata tonight. We've secured 500 meals but logistics are running thin. Anyone with a vehicle please reach out!",
    urgency: true,
    verified: true,
    likes: 124,
    comments: 18,
  },
  {
    id: "post-2",
    author: "Dr. Ananya Sharma",
    role: "Medical Officer",
    avatar: "AS",
    time: "45m ago",
    content: "Just completed a successful blood donation camp at Sector V. Thanks to the 200+ donors who showed up! Here is a quick glimpse of the energy today.",
    verified: true,
    media: {
      type: "video",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
    },
    likes: 342,
    comments: 45,
  },
  {
    id: "post-3",
    author: "Rahul Dev",
    role: "Citizen Donor",
    avatar: "RD",
    time: "2h ago",
    content: "Does anyone know if the relief shelter near Howrah station is still accepting blankets? I have about 20 fresh blankets to drop off.",
    likes: 12,
    comments: 4,
  },
  {
    id: "post-4",
    author: "Disaster Response Force",
    role: "Command Center",
    avatar: "DR",
    time: "5h ago",
    content: "Water levels receding in South 24 Parganas, but hygiene kits are still the #1 priority. Please coordinate with local hubs before dispatching materials.",
    verified: true,
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    },
    likes: 890,
    comments: 112,
  }
];

export default function CommunityPage() {
  return (
    <div className="page-shell">
      <div className="section" style={{ paddingTop: 40 }}>
        <div className="community-layout">
          
          {/* Left Sidebar (Desktop Only) */}
          <div className="side-column left-sidebar">
            <div className="side-module">
              <h3>Navigation</h3>
              <div className="trending-item"><strong>Feed</strong><span className="meta">Latest Updates</span></div>
              <div className="trending-item"><strong>Urgencies</strong><span className="meta">Critical Needs Near You</span></div>
              <div className="trending-item"><strong>My Posts</strong><span className="meta">History & Impact</span></div>
              <div className="trending-item"><strong>Local NGOs</strong><span className="meta">Directory</span></div>
            </div>
            <div className="side-module" style={{ marginTop: 16 }}>
              <h3>Your Impact</h3>
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <strong style={{ fontSize: "2rem", color: "var(--teal)", fontFamily: "var(--font-playfair)" }}>4</strong>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Lives Touched</div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="feed-column">
            <CreatePost />
            
            {mockPosts.map((post) => (
              <FeedPost key={post.id} post={post} />
            ))}
            
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              You caught up with all local updates!
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="side-column right-sidebar">
            <div className="side-module">
              <h3>Trending Urgencies</h3>
              <div className="trending-item">
                <span className="badge badge-critical" style={{ marginBottom: 4, display: "inline-block" }}>O- Blood Needed</span>
                <strong>CMRI Hospital</strong>
                <span className="meta">12 mins away • 3 Units</span>
              </div>
              <div className="trending-item">
                <span className="badge badge-high" style={{ marginBottom: 4, display: "inline-block" }}>Flood Relief</span>
                <strong>Howrah Station Camp</strong>
                <span className="meta">Volunteers Needed</span>
              </div>
              <div className="trending-item">
                <span className="badge badge-medium" style={{ marginBottom: 4, display: "inline-block" }}>Food Drive</span>
                <strong>Park Street Hub</strong>
                <span className="meta">Sorting & Packing</span>
              </div>
            </div>

            <div className="side-module" style={{ marginTop: 16 }}>
              <h3>Suggested Connections</h3>
              <div className="trending-item" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div className="author-avatar" style={{ width: 32, height: 32, fontSize: "0.8rem" }}>SJ</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block" }}>St. John Ambulance</strong>
                  <span className="meta">NGO Partner</span>
                </div>
                <button className="btn-outline" style={{ padding: "4px 8px", fontSize: "0.7rem" }}>Follow</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
