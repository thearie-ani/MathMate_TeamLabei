import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const { data } = await authApi.login(formData);

      const { user, token } = data.data;

      login(user, token);

      toast.success(`Welcome back ${user.role}!`);

      navigate(
        from ||
          (user.role === "admin"
            ? "/admin/dashboard"
            : "/dashboard"),
        { replace: true }
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6fc] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">

        {/* LEFT PANEL */}

        <div className="hidden lg:flex bg-violet-50 p-14 flex-col justify-center relative">


          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md">

            <div className="w-14 h-14 rounded-xl bg-violet-600 text-white flex items-center justify-center text-2xl mb-6">
              🎓
            </div>

            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Unlock Your
              <br />
              Mathematical
              <br />
              Potential
            </h2>

            <p className="text-gray-500 mt-5 leading-7">
              Experience AI-powered learning designed for
              Cambodian students. Learn calculus,
              statistics and much more with personalized
              guidance.
            </p>

            <img
              src="/images/robot.png"
              alt="Robot"
              className="mt-8 rounded-2xl bg-gray-100"
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center p-8 lg:p-16">

          <div className="w-full max-w-md">

            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-2 mb-10">
              Sign in to continue your learning journey.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition"
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* PASSWORD */}

              <div>

                <div className="flex justify-between mb-2">

                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-violet-600 hover:text-violet-700"
                  >
                    Forgot password?
                  </Link>

                </div>

                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition"
                />

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* REMEMBER */}

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-gray-600">

                  <input
                    type="checkbox"
                    className="accent-violet-600"
                  />

                  Remember me

                </label>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <p className="text-center text-gray-500 mt-8">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-semibold text-violet-600 hover:text-violet-700"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}