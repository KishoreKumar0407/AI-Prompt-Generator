import { getBotById, type BotId } from '../lib/bots';

type Props = {
  botId: BotId;
};

const STEPS = [
  'Analyzing your idea...',
  'Detecting intent & context...',
  'Applying prompt engineering...',
  'Optimizing for your AI model...',
  'Finalizing structure...',
];

export default function LoadingState({ botId }: Props) {
  const bot = getBotById(botId);

  return (
    <div className="glass-card p-8 text-center animate-fade-in">
      <div className="relative w-16 h-16 mx-auto mb-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: `${bot.color}15`, border: `1px solid ${bot.color}20` }}
        >
          {bot.icon}
        </div>
        <div
          className="absolute -inset-1 rounded-2xl animate-ping opacity-30"
          style={{ background: `${bot.color}20`, border: `1px solid ${bot.color}` }}
        />
      </div>

      <p className="text-sm font-semibold text-slate-primary mb-1">Crafting your prompt</p>
      <p className="text-xs text-slate-secondary mb-5">Optimizing for {bot.name}</p>

      <div className="space-y-2.5 max-w-xs mx-auto">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-slow"
              style={{
                background: bot.color,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6 + i * 0.08,
              }}
            />
            <div
              className="h-2 rounded-full shimmer-bg flex-1"
              style={{ width: `${70 + i * 5}%`, maxWidth: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
