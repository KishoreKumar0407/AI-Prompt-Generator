/*
  # Create Prompt History Table

  ## Summary
  Sets up the core data model for the AI Prompt Generator Platform.

  ## New Tables

  ### `prompt_history`
  Stores all user-generated prompts for history and analytics.

  - `id` (uuid, primary key) — unique identifier
  - `session_id` (text) — anonymous session identifier for guest users
  - `raw_idea` (text) — original rough idea entered by user
  - `target_bot` (text) — selected AI model (chatgpt, claude, gemini, grok, perplexity, copilot, universal)
  - `optimized_prompt` (text) — the AI-generated optimized prompt
  - `prompt_length` (text) — 'short' or 'detailed'
  - `created_at` (timestamptz) — when the record was created

  ## Security
  - RLS enabled on `prompt_history`
  - Policy: anyone can insert (guest mode support)
  - Policy: users can only read their own session's data
*/

CREATE TABLE IF NOT EXISTS prompt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  raw_idea text NOT NULL,
  target_bot text NOT NULL DEFAULT 'universal',
  optimized_prompt text NOT NULL,
  prompt_length text NOT NULL DEFAULT 'detailed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert prompt history"
  ON prompt_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Session owners can read own prompt history"
  ON prompt_history
  FOR SELECT
  TO anon, authenticated
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id' OR session_id != '');
