import { Lightbulb } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

const EXAMPLES = [
  'make me startup idea for students',
  'write youtube script about ai future',
  'need linkedin post for getting internship',
  'explain machine learning to 10 year old',
  'write cold email to get freelance clients',
];

export default function IdeaInput({ value, onChange, disabled }: Props) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-primary mb-3">
        Your Rough Idea
      </label>
      <div className="relative">
        <textarea
          className="input-field min-h-[120px] pr-4"
          placeholder="Type anything... broken English, short notes, vague ideas — we'll fix it all."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={4}
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-light">
          {value.length} chars
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={13} className="text-accent-purple" />
          <span className="text-xs font-medium text-slate-secondary">Try an example:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => onChange(ex)}
              disabled={disabled}
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150 hover:scale-105 disabled:opacity-50"
              style={{
                background: 'rgba(124, 58, 237, 0.07)',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                color: '#7C3AED',
              }}
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
