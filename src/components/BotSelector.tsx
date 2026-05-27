import { BOTS, type BotId, type Bot } from '../lib/bots';

type Props = {
  selected: BotId;
  onChange: (id: BotId) => void;
};

function BotCard({ bot, selected, onClick }: { bot: Bot; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 text-center group"
      style={{
        background: selected ? bot.bgColor : 'rgba(255,255,255,0.5)',
        border: selected ? `2px solid ${bot.color}` : '2px solid rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
        boxShadow: selected ? `0 4px 20px ${bot.color}30` : '0 2px 8px rgba(0,0,0,0.04)',
        transform: selected ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {selected && (
        <div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: bot.color }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <span className="text-2xl">{bot.icon}</span>
      <div>
        <p className="text-sm font-600 text-slate-primary font-semibold leading-tight">{bot.name}</p>
        <p className="text-xs text-slate-secondary mt-0.5 leading-tight">{bot.tagline}</p>
      </div>
    </button>
  );
}

export default function BotSelector({ selected, onChange }: Props) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-primary mb-3">
        Select Target AI Model
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {BOTS.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            selected={selected === bot.id}
            onClick={() => onChange(bot.id)}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {BOTS.find((b) => b.id === selected)?.traits.map((trait) => (
          <span
            key={trait}
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${BOTS.find((b) => b.id === selected)?.color}15`,
              color: BOTS.find((b) => b.id === selected)?.color,
              border: `1px solid ${BOTS.find((b) => b.id === selected)?.color}30`,
            }}
          >
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}
