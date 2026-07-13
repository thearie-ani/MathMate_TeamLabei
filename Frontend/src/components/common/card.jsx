import { Search, AlertTriangle } from 'lucide-react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e8e4f8] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1535]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9 pr-4 py-2 text-sm border border-[#e8e4f8] rounded-xl bg-white
        focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
        transition-all w-full sm:w-64 text-[#1a1535] placeholder-gray-400"
      />
    </div>
  );
}

export function Field({ label, error, children, required, hint }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#1a1535]">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1" role="alert">
          <AlertTriangle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export function StatCard({ label, value, sub, subColor = 'text-gray-400', icon: Icon, accent = 'violet' }) {
  const iconBg = accent === 'pink' ? 'bg-[#ec4899]' : 'bg-[#8b5cf6]';
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-[#1a1535]">{value}</p>
          {sub && <p className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon size={20} className="text-white" />
          </div>
        )}
      </div>
    </Card>
  );
}

export const inputCls = `w-full border border-[#e8e4f8] rounded-xl px-4 py-2.5 text-sm text-[#1a1535]
bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300
focus:border-violet-400 transition-all`;

export const selectCls = `w-full border border-[#e8e4f8] rounded-xl px-4 py-2.5 text-sm text-[#1a1535]
bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all`;
