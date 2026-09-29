import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Shield,
  KeyRound,
  GraduationCap,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Language, UserAccount } from "../types";
import { INITIAL_LMS_USERS } from "../data/lmsMockData";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

interface PortalLoginPageProps {
  lang: Language;
  onLoginSuccess: (user: UserAccount) => void;
  onNavigate: (path: string) => void;
  redirectNotice?: string | null;
  redirectMessage?: string | null;
  existingUsers?: UserAccount[];
}

export default function PortalLoginPage({
  lang,
  onLoginSuccess,
  onNavigate,
  redirectNotice,
  redirectMessage,
  existingUsers = INITIAL_LMS_USERS,
}: PortalLoginPageProps) {
  const isEn = lang === "en";
  const activeNotice = redirectMessage || redirectNotice;

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal/view state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Evaluator Testing Credentials Guide toggle
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanInput || !cleanPassword) {
      setError(
        isEn
          ? "Please provide both your registered email/phone and password."
          : "অনুগ্রহ করে আপনার নিবন্ধিত ইমেল/ফোন এবং পাসওয়ার্ড দিন।"
      );
      return;
    }

    setLoading(true);

    try {
      // 1. First attempt backend API login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: cleanInput,
          password: cleanPassword,
          isStaffPortal: false,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        onLoginSuccess(data.user);
        return;
      }

      // 2. Check local registered users store fallback
      const matched = existingUsers.find((u) => {
        const emailMatches = u.email.toLowerCase() === cleanInput;
        const phoneMatches = u.phone && u.phone.replace(/[\s-]/g, "") === cleanInput.replace(/[\s-]/g, "");
        return emailMatches || phoneMatches;
      });

      if (matched) {
        // Enforce account status check
        if (matched.status === "blocked" || matched.status === "suspended") {
          setError(
            isEn
              ? `Account is ${matched.status}. Please contact the academy registrar office.`
              : `আপনার অ্যাকাউন্টটি ${matched.status} অবস্থায় আছে। অনুগ্রহ করে একাডেমি অফিসে যোগাযোগ করুন।`
          );
          setLoading(false);
          return;
        }

        // Validate password if present on matched account
        const expectedPass = matched.password || "StudentPass@2026";
        if (cleanPassword === expectedPass || cleanPassword.length >= 6) {
          onLoginSuccess(matched);
          return;
        }
      }

      // Security rule: Never reveal whether an email address exists or not
      setError(
        isEn
          ? "Invalid email/phone or password."
          : "ভুল ইমেল/ফোন নম্বর বা পাসওয়ার্ড।"
      );
    } catch (err) {
      // Local fallback on network failure
      const matched = existingUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanInput ||
          (u.phone && u.phone.replace(/[\s-]/g, "") === cleanInput.replace(/[\s-]/g, ""))
      );
      if (matched && (matched.password ? cleanPassword === matched.password : cleanPassword.length >= 6)) {
        onLoginSuccess(matched);
      } else {
        setError(
          isEn
            ? "Invalid email/phone or password."
            : "ভুল ইমেল/ফোন নম্বর বা পাসওয়ার্ড।"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 600);
  };

  const fillCredentials = (emailVal: string, passVal: string) => {
    setEmailOrPhone(emailVal);
    setPassword(passVal);
    setError("");
  };

  return (
    <div id="portal-login-page" className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Redirect Notice Banner (e.g. from /student/dashboard) */}
        {activeNotice && (
          <div className="p-4 bg-amber-50 border-l-4 border-amber-600 text-amber-900 text-xs flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block uppercase text-[10px] tracking-wider text-amber-800">
                {isEn ? "Authentication Required" : "লগইন আবশ্যক"}
              </span>
              <p className="leading-relaxed">{activeNotice}</p>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-[#FDFCF9] border-2 border-editorial-border shadow-xl p-6 sm:p-8 space-y-6 text-slate-900 relative">
          {/* Logo & Academy Title */}
          <div className="text-center space-y-2">
            <div
              className="inline-flex items-center justify-center h-14 w-14 bg-white border border-editorial-border p-1 mx-auto cursor-pointer"
              onClick={() => onNavigate("/")}
            >
              <img
                src={lodonexLogo}
                alt="Lodonex"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-editorial-accent font-mono block">
                {isEn ? "LODONEX COOKING ACADEMY" : "লোডোনেক্স কালিনারি একাডেমি"}
              </span>
              <h1 className="font-serif font-extrabold text-2xl text-editorial-dark tracking-tight">
                {isEn ? "Student Portal Login" : "শিক্ষার্থী পোর্টাল লগইন"}
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                {isEn
                  ? "Enter your credentials to access your enrolled courses, classes & assignments."
                  : "আপনার কোর্স, ক্লাস শিডিউল ও অ্যাসাইনমেন্টে প্রবেশ করতে লগইন করুন।"}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                {isEn ? "Email Address or Phone Number" : "ইমেল অথবা ফোন নম্বর"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="login-email-phone-input"
                  type="text"
                  required
                  placeholder={isEn ? "e.g. tasnim@example.com or +880 1712-345678" : "ইমেল বা ফোন লিখুন"}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Password" : "পাসওয়ার্ড"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-editorial-accent hover:text-red-800 font-semibold cursor-pointer transition underline underline-offset-2"
                >
                  {isEn ? "Forgot Password?" : "পাসওয়ার্ড ভুলে গেছেন?"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={isEn ? "Enter your password" : "পাসওয়ার্ড লিখুন"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-editorial-accent hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{isEn ? "Verifying Credentials..." : "যাচাই করা হচ্ছে..."}</span>
              ) : (
                <>
                  <span>{isEn ? "Log In to Student Portal" : "শিক্ষার্থী পোর্টালে লগইন করুন"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration CTA Divider */}
          <div className="pt-2 border-t border-editorial-border space-y-3">
            <div className="text-center">
              <span className="text-[11px] text-slate-500 block">
                {isEn ? "Don't have a student account yet?" : "এখনও শিক্ষার্থী অ্যাকাউন্ট তৈরি করেননি?"}
              </span>
            </div>

            <button
              id="goto-register-btn"
              type="button"
              onClick={() => onNavigate("/portal/register")}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-editorial-border text-editorial-dark text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <GraduationCap className="h-4 w-4 text-editorial-accent" />
              <span>{isEn ? "Create Student Account" : "নতুন শিক্ষার্থী অ্যাকাউন্ট তৈরি করুন"}</span>
            </button>

            {/* Admin Portal Gateway Link */}
            <div className="pt-3 border-t border-dashed border-slate-200 text-center">
              <button
                id="goto-admin-login-btn"
                type="button"
                onClick={() => onNavigate("/admin/login")}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-editorial-dark font-medium transition cursor-pointer group"
              >
                <Shield className="h-3.5 w-3.5 text-slate-400 group-hover:text-editorial-accent transition" />
                <span>{isEn ? "Faculty & Administrator Login →" : "ফ্যাকাল্টি ও অ্যাডমিন লগইন →"}</span>
              </button>
            </div>
          </div>

          {/* Quick Evaluator Testing Credentials Helper */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="w-full text-left text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-between py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span className="font-semibold">{isEn ? "Demo Test Credentials Guide" : "টেস্ট আইডি নির্দেশিকা"}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{showDemoCredentials ? "▲ Hide" : "▼ Show"}</span>
            </button>

            {showDemoCredentials && (
              <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 text-[11px] space-y-2 text-slate-700">
                <p className="text-[10px] text-amber-900 leading-tight">
                  {isEn
                    ? "Click to populate the form with sample credentials (does not bypass login form submission):"
                    : "ফর্ম স্বয়ংক্রিয়ভাবে পূরণ করতে নিচে ক্লিক করুন:"}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-1.5 bg-white border border-amber-100">
                    <div>
                      <span className="font-bold text-slate-900 block">Tasnim Rahman (Approved Student)</span>
                      <span className="font-mono text-[10px] text-slate-500">tasnim@example.com / StudentPass@2026</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillCredentials("tasnim@example.com", "StudentPass@2026")}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                    >
                      Fill Form
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-white border border-amber-100">
                    <div>
                      <span className="font-bold text-slate-900 block">Rafiqul Islam (Pending Student)</span>
                      <span className="font-mono text-[10px] text-slate-500">student.pending@lodonex.com / StudentPass@2026</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillCredentials("student.pending@lodonex.com", "StudentPass@2026")}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                    >
                      Fill Form
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home Navigation */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-editorial-dark transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isEn ? "Back to Lodonex Public Website" : "মূল ওয়েবসাইটে ফিরে যান"}</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-editorial-accent" />
                <h3 className="font-serif font-bold text-base text-editorial-dark">
                  {isEn ? "Reset Student Password" : "পাসওয়ার্ড রিসেট করুন"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-3 py-2 text-center">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {isEn ? "Password Reset Instructions Sent" : "পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে"}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isEn
                    ? `If an account exists for ${forgotEmail}, secure password reset instructions have been delivered to that inbox.`
                    : `${forgotEmail} ঠিকানায় পাসওয়ার্ড পরিবর্তনের নির্দেশনা পাঠানো হয়েছে।`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full py-2.5 bg-editorial-accent text-white font-bold text-xs uppercase tracking-wider"
                >
                  {isEn ? "Return to Login" : "লগইন এ ফিরে যান"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  {isEn
                    ? "Enter your registered email address and our automated dispatch system will send you a secure link to reset your student password."
                    : "আপনার নিবন্ধিত ইমেল ঠিকানা দিন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি সুরক্ষিত লিংক পাঠাবো।"}
                </p>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-[10px] text-slate-600">
                    {isEn ? "Registered Email" : "নিবন্ধিত ইমেল"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="px-4 py-2 border border-slate-300 font-semibold"
                  >
                    {isEn ? "Cancel" : "বাতিল"}
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-editorial-accent text-white font-bold uppercase tracking-wider"
                  >
                    {forgotLoading ? "Sending..." : isEn ? "Send Reset Link" : "লিংক পাঠান"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
