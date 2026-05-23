import { NextRequest, NextResponse } from "next/server";

/**
 * Vannate Community Feed API
 * In-memory store (upgrade to Supabase for production).
 * Supports cursor-based pagination for infinite scroll.
 */

export type CommunityPost = {
  id: string;
  author: string;
  role: string; // "donor" | "ngo" | "volunteer" | "citizen"
  avatar: string;
  content: string;
  urgency: "normal" | "high" | "critical";
  tags: string[];
  location?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  verified: boolean;
};

// Seed data
const seedPosts: CommunityPost[] = [
  {
    id: "p1",
    author: "Kolkata Relief Org",
    role: "ngo",
    avatar: "KR",
    content: "🚨 URGENT: North Kolkata floods affecting 2,000+ families. We need 500 food packets, clean water, and blankets. Any donors or volunteers in the area — please respond now.",
    urgency: "critical",
    tags: ["#FloodRelief", "#KolkataHelps", "#Urgent"],
    location: "North Kolkata, WB",
    likes: 847,
    comments: 213,
    shares: 654,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    verified: true,
  },
  {
    id: "p2",
    author: "Priya Sharma",
    role: "donor",
    avatar: "PS",
    content: "I just donated ₹5,000 worth of medicines through Vannate. The QR verification made me confident my donation reached the right hands. My Donor ID: VN-10800042. Proud to be part of this mission! 🙏",
    urgency: "normal",
    tags: ["#VannateVerified", "#DonorStory", "#TransparentGiving"],
    likes: 342,
    comments: 67,
    shares: 128,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    verified: false,
  },
  {
    id: "p3",
    author: "Blood Bank Network India",
    role: "ngo",
    avatar: "BB",
    content: "⚡ BLOOD ALERT: B+ blood urgently needed at SSKM Hospital, Kolkata. Patient is critical. If you can donate, reach the hospital or use Vannate Smart Blood Bank to register. Lives depend on speed.",
    urgency: "critical",
    tags: ["#BloodDonation", "#SaveLife", "#BPlus"],
    location: "SSKM Hospital, Kolkata",
    likes: 1204,
    comments: 389,
    shares: 1876,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    verified: true,
  },
  {
    id: "p4",
    author: "Rahul Das",
    role: "volunteer",
    avatar: "RD",
    content: "Day 3 of flood relief operations in Sundarbans. We've reached 14 villages so far. The AI routing on Vannate saved us 4 hours of navigation today. Technology serving humanity — this is the future.",
    urgency: "high",
    tags: ["#VolunteerReport", "#Sundarbans", "#AIForGood"],
    location: "Sundarbans, WB",
    likes: 589,
    comments: 112,
    shares: 234,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    verified: false,
  },
  {
    id: "p5",
    author: "Vannate OS",
    role: "ngo",
    avatar: "VO",
    content: "📊 Weekly Impact Report: 12,847 donations verified • 347 crisis alerts resolved • 2,109 volunteers deployed • 98.7% on-time delivery rate. Every number is a life touched. वसुधैव कुटुम्बकम्",
    urgency: "normal",
    tags: ["#WeeklyImpact", "#TransparencyReport", "#Vannate"],
    likes: 3201,
    comments: 456,
    shares: 2109,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    verified: true,
  },
];

// In-memory store
let posts: CommunityPost[] = [...seedPosts];
let nextId = seedPosts.length + 1;

// GET — paginated feed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // post ID to start after
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 20);
  const filter = searchParams.get("filter"); // "critical" | "high" | "normal"

  let filtered = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (filter) filtered = filtered.filter((p) => p.urgency === filter);

  const startIdx = cursor ? filtered.findIndex((p) => p.id === cursor) + 1 : 0;
  const page = filtered.slice(startIdx, startIdx + limit);
  const nextCursor = page.length === limit ? page[page.length - 1].id : null;

  return NextResponse.json({
    posts: page,
    nextCursor,
    total: filtered.length,
  });
}

// POST — create new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
    }
    if (body.content.length > 1000) {
      return NextResponse.json({ error: "Content too long (max 1000 chars)" }, { status: 400 });
    }

    const newPost: CommunityPost = {
      id: `p${nextId++}`,
      author: body.author ?? "Anonymous",
      role: body.role ?? "citizen",
      avatar: (body.author ?? "AN").slice(0, 2).toUpperCase(),
      content: body.content.trim(),
      urgency: ["normal", "high", "critical"].includes(body.urgency) ? body.urgency : "normal",
      tags: Array.isArray(body.tags) ? body.tags.slice(0, 5) : [],
      location: body.location,
      mediaUrl: body.mediaUrl,
      mediaType: body.mediaType,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      verified: false,
    };

    posts.unshift(newPost);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// PATCH — like / share interactions
export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    const post = posts.find((p) => p.id === id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (action === "like")  post.likes++;
    if (action === "share") post.shares++;

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
