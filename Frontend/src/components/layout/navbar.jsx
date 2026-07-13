import { Settings } from 'lucide-react';

/**
 * Deliberately slim: each page renders its own <PageHeader title=.../>
 * inline with its content (matches the reference screenshot), so Navbar's
 * only job is the persistent top-right settings action.
 */
export default function Navbar() {
  return (
    <div className="flex items-center justify-end px-6 py-4 bg-[#f8f7ff]">
      <button
        aria-label="Settings"
        className="w-9 h-9 rounded-full bg-[#ec4899] text-white flex items-center justify-center
        hover:bg-[#db2777] transition-colors"
      >
        <Settings size={16} />
      </button>
    </div>
  );
}
