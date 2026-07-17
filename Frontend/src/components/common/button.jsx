import { Loader2 } from 'lucide-react';

const VARIANTS = {
  pink: 'bg-[#ec4899] text-white hover:bg-[#db2777] focus-visible:ring-pink-300',
  violet: 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] focus-visible:ring-violet-300',
  ghost: 'border border-[#e8e4f8] text-[#4b5563] bg-white hover:bg-[#f8f7ff] hover:border-violet-200 focus-visible:ring-violet-200',
  danger: 'border border-red-200 text-red-500 bg-white hover:bg-red-50 hover:border-red-300 focus-visible:ring-red-200',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
};

/**
 * Single reusable button. `variant="pink"` is the primary create/save
 * action; `variant="violet"` is for secondary emphasis (e.g. "Preview");
 * `ghost`/`danger` cover cancel and destructive actions. Deliberately no
 * gradient — the brief asked for one solid accent per button.
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center gap-2 font-semibold rounded-xl transition-all
      active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
      ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
// Gradient button
export const GradientBtn = ({ children, onClick, type = "button", disabled, size = "md", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 
    text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all
    disabled:opacity-50 disabled:cursor-not-allowed shadow-sm
    ${size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"}
    ${className}`}
  >
    {disabled ? <Loader2 size={14} className="animate-spin" /> : null}
    {children}
  </button>
);

// Ghost button
export const GhostBtn = ({ children, onClick, type = "button", danger, size = "md" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center gap-2 font-medium rounded-xl border transition-all
    ${danger
      ? "border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
      : "border-[#e8e4f8] text-gray-600 hover:bg-[#f8f7ff] hover:border-violet-200"
    }
    ${size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
  >
    {children}
  </button>
);