import { useState } from 'react';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { getBotById, type BotId } from '../lib/bots';

type Props = {
  prompt: string;
  botId: BotId;
  onRegenerate: () => void;
  loading: boolean;
};

export default function OutputPanel({ prompt, botId, onRegenerate, loading }: Props) {
  const [copied, setCopied] = useState(false);
  const bot = getBotById(botId);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-slide-up glass-card-mint p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: `${bot.color}15`, border: `1px solid ${bot.color}30` }}
          >
            {bot.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} style={{ color: bot.color }} />
              <span className="text-sm font-semibold" style={{ color: bot.color }}>
                Optimized for {bot.name}
              </span>
            </div>
            <p className="text-xs text-slate-secondary">{bot.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: `1px solid ${bot.color}30`,
              color: bot.color,
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:scale-105"
            style={{
              background: copied ? `${bot.color}20` : 'rgba(255,255,255,0.6)',
              border: `1px solid ${copied ? bot.color : bot.color + '30'}`,
              color: bot.color,
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div
        className="relative rounded-xl p-5 font-mono text-sm leading-relaxed text-slate-primary whitespace-pre-wrap"
        style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.8)',
          minHeight: '120px',
        }}
      >
        {prompt}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-secondary">
        <span>{prompt.split(' ').filter(Boolean).length} words</span>
        <span>{prompt.length} characters</span>
      </div>
    </div>
  );
}
