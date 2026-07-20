import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-[#e8e4f8]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1a1535]">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-violet-600 text-white text-xs font-bold">
            ∑
          </span>
          MathMate
        </div>
        <span className="text-xs text-gray-400">
          © {new Date().getFullYear()} MathMate. Built for Cambodian university students.
        </span>
        <div className="flex gap-6 text-xs font-medium text-gray-500">
          <Link to="/login" className="hover:text-[#1a1535] transition-colors">
            Login
          </Link>
          <Link to="/register" className="hover:text-[#1a1535] transition-colors">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
