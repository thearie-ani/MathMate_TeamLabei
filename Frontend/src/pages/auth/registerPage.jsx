import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi.js";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const registerData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      };

      console.log("FINAL DATA:", registerData);

      const response = await authApi.register(registerData);

      toast.success(response.data.message);

      navigate("/verify-email", {
        state:{
          email: formData.email
        }
      });

    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex bg-violet-50 p-14 flex-col justify-center">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="w-14 h-14 bg-violet-600 text-white rounded-xl flex items-center justify-center text-2xl mb-6">
              ✨
            </div>

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Start Your
              <br />
              Math Journey
            </h1>

            <p className="text-gray-500 mt-5 leading-7">
              Join MathMateAI and learn mathematics with AI-powered lessons,
              quizzes, and personalized support.
            </p>

            <img
              src="https://static.vecteezy.com/system/resources/previews/024/057/326/non_2x/human-in-spooky-ghosts-costume-flying-inside-the-old-house-or-forest-at-night-spooky-halloween-background-with-ghost-ghost-on-halloween-celebration-concept-by-ai-generated-free-photo.jpg"
              alt="Spooky ghost flying through a haunted forest at night"
              className="mt-8 w-full max-w-lg rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 lg:p-14">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2 mb-8">
              Create your account to start learning smarter.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>

                <input
                  {...register("name")}
                  placeholder="Your username"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  {...register("email")}
                  type="email"
                  placeholder="example@gmail.com"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                />

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
                />

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-violet-50 border border-violet-100 p-4">
              <p className="text-sm text-violet-700">
                After registration, we'll send a 5 digit verification code to your email. Enter the code to activate your account.
              </p>
            </div>

            <p className="text-center text-gray-500 mt-8">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 text-violet-600 font-semibold hover:text-violet-700"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}