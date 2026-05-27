import { useState } from 'react';
import { History, ChevronDown, ChevronUp, Copy, Check, Clock } from 'lucide-react';
import { type PromptHistory } from '../lib/supabase';
import { getBotById, type BotId } from '../lib/bots';

type Props = {
  history: PromptHistory[];
  onSelect: (item: PromptHistory) => void;
};

function HistoryItem({ item, onSelect }: { item: PromptHistory; onSelect: () => void }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bot = getBotById(item.target_bot as BotId);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(item.optimized_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.7)',
      }}
      onClick={() => { setExpanded(!expanded); onSelect(); }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg flex-shrink-0">{bot.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-primary truncate">
              {item.raw_idea}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium" style={{ color: bot.color }}>{bot.name}</span>
              <span className="text-xs text-slate-light">·</span>
              <div className="flex items-center gap-1 text-xs text-slate-light">
                <Clock size={10} />
                {timeAgo(item.created_at)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150"
            style={{ background: `${bot.color}10`, color: bot.color }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          {expanded ? <ChevronUp size={14} className="text-slate-light" /> : <ChevronDown size={14} className="text-slate-light" />}
        </div>
      </div>

      {expanded && (
        <div
          className="mt-3 p-3 rounded-lg text-xs font-mono text-slate-primary leading-relaxed whitespace-pre-wrap animate-fade-in"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)' }}
        >
          {item.optimized_prompt}
        </div>
      )}
    </div>
  );
}

export default function HistoryPanel({ history, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="glass-card p-5 animate-slide-up">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <History size={15} className="text-accent-purple" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-primary">Prompt History</p>
            <p className="text-xs text-slate-secondary">{history.length} saved prompt{history.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-secondary" /> : <ChevronDown size={16} className="text-slate-secondary" />}
      </button>

      {open && (
        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1 animate-fade-in">
          {[...history].reverse().map((item) => (
            <HistoryItem key={item.id} item={item} onSelect={() => onSelect(item)} />
          ))}
        </div>
      )}
    </div>
  );
}
