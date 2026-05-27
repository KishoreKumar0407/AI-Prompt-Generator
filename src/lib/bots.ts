export type BotId = 'chatgpt' | 'claude' | 'gemini' | 'grok' | 'perplexity' | 'copilot' | 'universal';

export type Bot = {
  id: BotId;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  traits: string[];
};

export const BOTS: Bot[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'Conversational & Detailed',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    icon: '🤖',
    traits: ['Role prompting', 'Step-by-step', 'Structured output'],
  },
  {
    id: 'claude',
    name: 'Claude',
    tagline: 'Analytical & Structured',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.08)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    icon: '🧠',
    traits: ['Long-context', 'XML sections', 'Deep reasoning'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    tagline: 'Creative & Multimodal',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    icon: '✨',
    traits: ['Multimodal', 'Context-rich', 'Creative tasks'],
  },
  {
    id: 'grok',
    name: 'Grok',
    tagline: 'Casual & Internet-Aware',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    icon: '⚡',
    traits: ['Real-time data', 'Casual tone', 'Web-savvy'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    tagline: 'Research & Citations',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.08)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    icon: '🔍',
    traits: ['Research-focused', 'Citations', 'Factual queries'],
  },
  {
    id: 'copilot',
    name: 'Copilot',
    tagline: 'Productivity & Microsoft',
    color: '#0EA5E9',
    bgColor: 'rgba(14, 165, 233, 0.08)',
    borderColor: 'rgba(14, 165, 233, 0.2)',
    icon: '🪁',
    traits: ['Office integration', 'Productivity', 'Web-grounded'],
  },
  {
    id: 'universal',
    name: 'Universal',
    tagline: 'Works with any AI',
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.08)',
    borderColor: 'rgba(124, 58, 237, 0.2)',
    icon: '🌐',
    traits: ['Model-agnostic', 'Best practices', 'Versatile'],
  },
];

export function getBotById(id: BotId): Bot {
  return BOTS.find((b) => b.id === id) ?? BOTS[6];
}
