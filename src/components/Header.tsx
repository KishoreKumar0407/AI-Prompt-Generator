import { Sparkles, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-10 pt-10 pb-8 text-center px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
        style={{
          background: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          color: '#7C3AED',
        }}>
        <Zap size={12} className="fill-current" />
        AI-Powered Prompt Engineering
      </div>

      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
        <span className="gradient-text">PromptCraft</span>
        <br />
        <span className="text-slate-primary text-4xl md:text-5xl font-semibold">
          AI Prompt Generator
        </span>
      </h1>

      <p className="text-slate-secondary text-lg max-w-xl mx-auto leading-relaxed">
        Transform your rough ideas into perfectly crafted prompts,
        <br className="hidden sm:block" />
        optimized for every major AI model.
      </p>

      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-secondary">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-accent-purple" />
          <span>Fixes grammar & intent</span>
        </div>
        <div className="w-px h-4 bg-slate-lighter" />
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-accent-cyan" />
          <span>Model-specific optimization</span>
        </div>
        <div className="w-px h-4 bg-slate-lighter hidden sm:block" />
        <div className="items-center gap-1.5 hidden sm:flex">
          <Sparkles size={14} className="text-success" />
          <span>Instant results</span>
        </div>
      </div>
    </header>
  );
}
