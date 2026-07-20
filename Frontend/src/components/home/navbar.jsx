import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getAuthTarget = () => {
    if (isLoading || !isAuthenticated) {
      return "/login";
    }

    if (user.role === "admin") {
      return "/admin";
    }

    if (user.role === "student") {
      return "/courses";
    }

    return "/login";
  };

  const getAuthLabel = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (!isAuthenticated) {
      return "Login";
    }

    return user.role === "admin" ? "Dashboard" : "My Courses";
  };

  const getCtaLabel = () => {
    if (isLoading) {
      return "Loading...";
    }

    return isAuthenticated ? "Go to Dashboard" : "Get started";
  };

  const authTarget = getAuthTarget();

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? "bg-white/90 backdrop-blur border-b border-[#e8e4f8]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[#1a1535]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 text-white text-sm font-bold">
            ∑
          </span>
          MathMate
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#how" className="hover:text-[#1a1535] transition-colors">
            How it works
          </a>
          <a href="#subjects" className="hover:text-[#1a1535] transition-colors">
            Subjects
          </a>
          <Link to={authTarget} className="hover:text-[#1a1535] transition-colors">
            {getAuthLabel()}
          </Link>
        </div>

        <Link
          to={authTarget}
          className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white
          bg-[#ec4899] hover:bg-[#db2777] transition-colors"
        >
          {getCtaLabel()}
        </Link>
      </nav>
    </header>
  );
}