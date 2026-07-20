// import { Link } from "react-router-dom";
// import Navbar from "../../components/home/navbar.jsx";
// import Hero from "../../components/home/hero.jsx";
// import Features from "../../components/home/features.jsx";
// import CourseCatalog from "../../components/home/courseCatalog.jsx";
// import Footer from "../../components/home/footer.jsx";

// export default function HomePage() {
     
//   return (
//     <div className="bg-white text-[#1a1535] min-h-screen">
//       <Navbar />
//       <Hero />
//       <Features />
//       <CourseCatalog />

//       {/* CTA band */}
//       <section className="px-6 py-20">
//         <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] px-8 py-14 text-center text-white">
//           <h2 className="text-2xl md:text-3xl font-bold">Stop re-reading the whole chapter.</h2>
//           <p className="mt-3 text-sm text-white/85">
//             Ask MathMate instead — it already knows which page you need.
//           </p>
//           <Link
//             to="/login"
//             className="mt-8 inline-block rounded-xl px-6 py-3 text-sm font-semibold text-[#1a1535] bg-white hover:bg-white/90 transition-colors"
//           >
//             Start your first session
//           </Link>
          

//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }


import { Link } from "react-router-dom";
import Navbar from "../../components/home/navbar.jsx";
import Hero from "../../components/home/hero.jsx";
import Features from "../../components/home/features.jsx";
import CourseCatalog from "../../components/home/courseCatalog.jsx";
import Footer from "../../components/home/footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth();

  // While the token is still being verified, don't guess a destination yet
  const getCtaTarget = () => {
    if (loading) {
      return "/login";
    }

    if (!isAuthenticated) {
      return "/login";
    }

    if (user.role === "admin") {
      return "/admin";
    }

    if (user.role === "student") {
      return "/courses";
    }

    // token valid but role unrecognized -> fall back to login
    return "/login";
  };

  const getCtaLabel = () => {
    if (loading) {
      return "Loading...";
    }

    if (!isAuthenticated) {
      return "Start your first session";
    }

    if (user.role === "admin") {
      return "Go to Admin Dashboard";
    }

    if (user.role === "student") {
      return "Continue Learning";
    }

    return "Start your first session";
  };

  const ctaTarget = getCtaTarget();
  const ctaLabel = getCtaLabel();

  return (
    <div className="bg-white text-[#1a1535] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <CourseCatalog />

      {/* CTA band */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] px-8 py-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Stop re-reading the whole chapter.</h2>
          <p className="mt-3 text-sm text-white/85">
            Ask MathMate instead — it already knows which page you need.
          </p>
          <Link
            to={ctaTarget}
            className="mt-8 inline-block rounded-xl px-6 py-3 text-sm font-semibold text-[#1a1535] bg-white hover:bg-white/90 transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}