import { createClient } from "@supabase/supabase-js";

// ============================================================================
// [TRAE.AI DIRECTIVE: FREE SUPABASE TIER & CRM DATABASE BACKING]
// 
// Architect Note:
// This is the primary initialization for Supabase, utilizing their generous 
// free tier for the humanitarian CRM backend. 
//
// Your tasks for Phase 4:
// 1. In the Supabase Dashboard, create tables: 'donors', 'ngos', 'donations', 'crises'.
// 2. Configure Row Level Security (RLS) policies so citizens can only see their own data, 
//    but 'NGO' roles can query the CRM.
// 3. Connect this `supabase` instance inside `/api/donations` and the dashboard fetches.
// 4. Do not alter the NEXT_PUBLIC environment variable names; they are bound to Vercel.
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export const supabase = createClient(supabaseUrl, supabaseKey);
