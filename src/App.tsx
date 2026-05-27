import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BotSelector from './components/BotSelector';
import IdeaInput from './components/IdeaInput';
import LengthToggle from './components/LengthToggle';
import GenerateButton from './components/GenerateButton';
import OutputPanel from './components/OutputPanel';
import HistoryPanel from './components/HistoryPanel';
import LoadingState from './components/LoadingState';
import { type BotId } from './lib/bots';
import { supabase, type PromptHistory } from './lib/supabase';
import { getSessionId } from './lib/session';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export default function App() {
  const [idea, setIdea] = useState('');
  const [bot, setBot] = useState<BotId>('chatgpt');
  const [length, setLength] = useState<'short' | 'detailed'>('detailed');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PromptHistory[]>([]);

  const sessionId = getSessionId();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
        <div className="max-w-xl w-full rounded-3xl bg-white/90 p-8 shadow-2xl ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold mb-4">Deployment configuration missing</h1>
          <p className="text-slate-700 leading-7">
            The app needs the environment variables <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.
          </p>
          <p className="mt-4 text-slate-500">
            Set them in your Vercel project settings and redeploy the site.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const { data } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setHistory(data as PromptHistory[]);
  }

  const generate = useCallback(async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ idea, bot, length, sessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error ?? 'Failed to generate prompt');
      }

      const data = await response.json();
      setResult(data.optimizedPrompt);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [idea, bot, length, sessionId]);

  function handleHistorySelect(item: PromptHistory) {
    setIdea(item.raw_idea);
    setBot(item.target_bot as BotId);
    setResult(item.optimized_prompt);
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7C3AED40, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06B6D440, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22C55E30, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-20">
        <Header />

        <div className="space-y-5">
          {/* Main Input Card */}
          <div className="glass-card p-6">
            <IdeaInput value={idea} onChange={setIdea} disabled={loading} />
          </div>

          {/* Bot Selector Card */}
          <div className="glass-card-blue p-6">
            <BotSelector selected={bot} onChange={setBot} />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-primary mb-2">
                Prompt Length
              </label>
              <LengthToggle value={length} onChange={setLength} />
            </div>
            <div className="sm:mt-6">
              <GenerateButton
                onClick={generate}
                loading={loading}
                disabled={!idea.trim()}
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div
              className="rounded-xl px-5 py-4 text-sm animate-fade-in"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#EF4444',
              }}
            >
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingState botId={bot} />}

          {/* Output */}
          {result && !loading && (
            <OutputPanel
              prompt={result}
              botId={bot}
              onRegenerate={generate}
              loading={loading}
            />
          )}

          {/* History */}
          <HistoryPanel history={history} onSelect={handleHistorySelect} />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-light">
          <p>PromptCraft — Powered by AI Prompt Engineering</p>
        </footer>
      </div>
    </div>
  );
}
