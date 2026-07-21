import {
  Home,
  BookOpen,
  Brain,
  ClipboardList,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { NavLink, Link } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Quiz", path: "/quizzes", icon: ClipboardList },
  { name: "AI Tutor", path: "/ai-tutor", icon: Brain },
];

export default function StudentSidebar({ onLogout }) {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-purple-100 px-4 py-5 hidden md:flex flex-col">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-6">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm">
          ∑
        </div>

        <div>
          <h1 className="text-base font-bold text-[#1a1535]">
            MathMate
          </h1>
          <p className="text-[11px] text-gray-400">
            Learn smarter
          </p>
        </div>
      </Link>


      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-purple-50 text-purple-600 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-purple-600"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{item.name}</span>
              </div>

              <ChevronRight
                size={14}
                className="opacity-0 group-hover:opacity-60 transition"
              />
            </NavLink>
          );
        })}
      </nav>


      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
      >
        <LogOut size={18} />
        Logout
      </button>

    </aside>
  );
}