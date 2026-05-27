import { AlignLeft, AlignJustify } from 'lucide-react';

type Props = {
  value: 'short' | 'detailed';
  onChange: (v: 'short' | 'detailed') => void;
};

export default function LengthToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
      <button
        onClick={() => onChange('short')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        style={{
          background: value === 'short' ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'transparent',
          color: value === 'short' ? 'white' : '#64748B',
          boxShadow: value === 'short' ? '0 2px 8px rgba(124,58,237,0.25)' : 'none',
        }}
      >
        <AlignLeft size={14} />
        Short
      </button>
      <button
        onClick={() => onChange('detailed')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        style={{
          background: value === 'detailed' ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'transparent',
          color: value === 'detailed' ? 'white' : '#64748B',
          boxShadow: value === 'detailed' ? '0 2px 8px rgba(124,58,237,0.25)' : 'none',
        }}
      >
        <AlignJustify size={14} />
        Detailed
      </button>
    </div>
  );
}
