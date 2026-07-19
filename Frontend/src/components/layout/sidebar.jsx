import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, ClipboardList, Users, LogOut, SaveIcon } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/import', label: 'Import', icon: SaveIcon },

];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#e8e4f8] flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#e8e4f8]">
        <div className="w-9 h-9 rounded-xl bg-[#ec4899] flex items-center justify-center text-white font-bold text-sm">
          M
        </div>
        <span className="font-bold text-[#1a1535] text-base">
          MathMate<span className="text-[#8b5cf6]">AI</span>
        </span>
      </div>

      {/* Admin identity */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8e4f8]">
        <div className="w-9 h-9 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white">
          <Users size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1535] leading-tight">Admin</p>
          <p className="text-xs text-gray-400 leading-tight">Administrator</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#f3effe] text-[#8b5cf6]'
                  : 'text-gray-500 hover:bg-[#f8f7ff] hover:text-[#1a1535]'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#e8e4f8]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm
          font-medium text-[#8b5cf6] border border-[#e8e4f8] hover:bg-[#f8f7ff] transition-colors"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
}
