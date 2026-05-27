import { Wand2, Loader2 } from 'lucide-react';

type Props = {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
};

export default function GenerateButton({ onClick, loading, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary flex items-center gap-2.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      style={{ minWidth: '180px', justifyContent: 'center' }}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin relative z-10" />
          <span className="relative z-10">Crafting...</span>
        </>
      ) : (
        <>
          <Wand2 size={18} className="relative z-10" />
          <span className="relative z-10">Generate Prompt</span>
        </>
      )}
    </button>
  );
}
