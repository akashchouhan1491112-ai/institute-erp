import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ddocerqpjuuxetaunxnd.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkb2NlcnFwanV1eGV0YXVueG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNDEzNjUsImV4cCI6MjEwODgxNzM2NX0.30i8vZXYfD8u7iYQQSaIktQwvogKidDtogMpU7WqjsU";

// Standard Supabase client (browser and server-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


