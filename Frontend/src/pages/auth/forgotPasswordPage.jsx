import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authApi } from "../../api/authApi.js";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      // Backend intentionally returns the same generic message whether or
      // not the email exists (prevents leaking which emails are
      // registered), so the frontend can always show the success state on
      // a 200 — there's no "email not found" branch to handle here.
      await authApi.forgotPassword(email);
      setSubmittedEmail(email);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
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
              🔑
            </div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Forgot Your
              <br />
              Password?
              <br />
              No Problem.
            </h2>
            <p className="text-gray-500 mt-5 leading-7">
              Enter the email you signed up with and we'll send you a secure link to get back into
              your account.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {submittedEmail ? (
              <SuccessState email={submittedEmail} onResend={() => onSubmit({ email: submittedEmail })} loading={loading} />
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-500 mt-2 mb-10">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="name@example.com"
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100 transition"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                  >
                    {loading ? "Sending link..." : "Send Reset Link"}
                  </button>
                </form>
              </>
            )}

            <Link
              to="/login"
              className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              <ArrowLeft size={15} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessState({ email, onResend, loading }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={30} className="text-emerald-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
      <p className="text-gray-500 mt-2 leading-7">
        If an account exists for <span className="font-semibold text-gray-700">{email}</span>, a
        password reset link is on its way. The link expires in 15 minutes.
      </p>
      <button
        onClick={onResend}
        disabled={loading}
        className="mt-6 text-sm font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-60"
      >
        {loading ? "Resending..." : "Didn't get it? Send again"}
      </button>
    </div>
  );
}