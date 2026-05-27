import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PromptHistory = {
  id: string;
  session_id: string;
  raw_idea: string;
  target_bot: string;
  optimized_prompt: string;
  prompt_length: string;
  created_at: string;
};
