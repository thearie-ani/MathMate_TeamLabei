import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  LogOut,
  SaveIcon
} from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    to: "/admin/quizzes",
    label: "Quizzes",
    icon: ClipboardList,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  { to: '/admin/import', label: 'Import', icon: SaveIcon },

];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-[#eee8ff] flex flex-col">

      {/* Brand */}
      <div className="px-5 py-4 border-b border-[#eee8ff]">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-[#1a1535]"
        >
          <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 text-white text-sm">
            ∑
          </span>
          MathMate
        </Link>
      </div>


      {/* Admin Profile */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-violet-500 flex items-center justify-center text-white">
          <Users size={16} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1a1535]">
            Admin
          </p>
          <p className="text-xs text-gray-400">
            Administrator
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">

        {NAV_ITEMS.map(
          ({ to, label, icon: Icon, end }) => (

          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-[#f3edff] text-[#8b5cf6]"
                  : "text-gray-500 hover:bg-[#faf8ff] hover:text-[#1a1535]"
              }
              `
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>

        ))}

      </nav>
      {/* Logout */}
      <div className="p-3 border-t border-[#eee8ff]">

        <button
          onClick={onLogout}
          className=" w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition " >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
