import React, { useState } from "react";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Shield
} from "lucide-react";
import { Language } from "../types";
import { auth } from "../utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

interface ForgotPasswordPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
  portalType?: "student" | "admin";
}

export default function ForgotPasswordPage({
  lang,
  onNavigate,
  portalType = "student"
}: ForgotPasswordPageProps) {
  const isEn = lang === "en";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        isEn
          ? "Please provide your registered email address."
          : "অনুগ্রহ করে আপনার নিবন্ধিত ইমেল ঠিকানা প্রদান করুন।"
      );
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setSubmitted(true);
    } catch (err: any) {
      console.warn("Password reset note:", err?.message);
      // For security, even if Firebase throws user-not-found, display success notice so email enumeration is avoided
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="forgot-password-page" className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-[#FDFCF9] border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6 text-slate-900">
          {/* Header */}
          <div className="text-center space-y-2">
            <div
              className="inline-flex items-center justify-center h-14 w-14 bg-white border border-slate-300 p-1 mx-auto cursor-pointer"
              onClick={() => onNavigate("/")}
            >
              <img src={lodonexLogo} alt="Lodonex" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-editorial-accent font-mono block">
                {portalType === "admin" ? "LODONEX FACULTY & ADMIN" : "LODONEX STUDENT PORTAL"}
              </span>
              <h1 className="font-serif font-extrabold text-2xl text-editorial-dark tracking-tight">
                {isEn ? "Reset Your Password" : "পাসওয়ার্ড রিসেট করুন"}
              </h1>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isEn
                  ? "Enter your registered email address to receive secure password recovery instructions."
                  : "আপনার পাসওয়ার্ড রিসেটের নির্দেশাবলী পেতে নিবন্ধিত ইমেল ঠিকানা দিন।"}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="space-y-4 text-center py-2">
              <div className="h-12 w-12 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">
                  {isEn ? "Password Reset Email Sent" : "পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isEn
                    ? `If an account exists for ${email}, a password reset link has been dispatched. Please check your inbox and spam folder.`
                    : `${email} ঠিকানায় পাসওয়ার্ড রিসেট নির্দেশিকা পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।`}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate(portalType === "admin" ? "/admin/login" : "/portal/login")}
                  className="w-full py-2.5 bg-editorial-dark hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{isEn ? "Back to Login" : "লগইনে ফিরে যান"}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Registered Email Address *" : "নিবন্ধিত ইমেল ঠিকানা *"}
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-editorial-accent hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{isEn ? "Sending Link..." : "লিংক পাঠানো হচ্ছে..."}</span>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>{isEn ? "Send Reset Link" : "রিসেট লিংক পাঠান"}</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => onNavigate(portalType === "admin" ? "/admin/login" : "/portal/login")}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{isEn ? "Return to Login" : "লগইনে ফিরে যান"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
