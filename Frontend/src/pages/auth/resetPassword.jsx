import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, CheckCircle2, XCircle } from "lucide-react";
import { authApi } from "../../api/authApi.js";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("form"); // "form" | "success" | "invalidToken"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      // Note: the backend returns a fresh JWT here but not the user object,
      // so we can't call the same login(user, token) flow LoginPage uses
      // without guessing at user data. Sending the person to sign in
      // explicitly with their new password is the safer path — if you'd
      // rather auto-login post-reset, the backend needs to include `user`
      // in this response the same way the login endpoint does.
      setStatus("success");
    } catch (err) {
      const message = err.response?.data?.message || "";
      if (err.response?.status === 400 && message.toLowerCase().includes("token")) {
        setStatus("invalidToken");
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
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
              🔒
            </div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Set A New
              <br />
              Password
            </h2>
            <p className="text-gray-500 mt-5 leading-7">
              Choose something secure that you haven't used before — you'll use it to sign back in
              right after.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {status === "success" && <SuccessState />}
            {status === "invalidToken" && <InvalidTokenState />}
            {status === "form" && (
              <>
                <h1 className="text-4xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-500 mt-2 mb-10">Enter a new password for your account.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition"
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("confirmPassword")}
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function SuccessState() {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={30} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Password reset</h1>
        <p className="text-gray-500 mt-2 leading-7">
          Your password has been changed successfully. Sign in with your new password to continue.
        </p>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="mt-6 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Continue to Sign In
        </button>
      </div>
    );
  }

  function InvalidTokenState() {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <XCircle size={30} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Link expired</h1>
        <p className="text-gray-500 mt-2 leading-7">
          This password reset link is invalid or has expired. Reset links are only valid for 15
          minutes — request a new one to continue.
        </p>
        <Link
          to="/forgot-password"
          className="mt-6 inline-block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Request New Link
        </Link>
      </div>
    );
  }
}