import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Language, UserAccount } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAuthSuccess: (user: UserAccount) => void;
  existingUsers: UserAccount[];
}

export default function AuthModal({
  isOpen,
  onClose,
  lang,
  onAuthSuccess,
  existingUsers,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !name)) {
      setError(lang === "en" ? "Please fill in all required fields." : "দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const emailLower = email.toLowerCase().trim();

      if (isSignUp) {
        // Check if user already exists
        if (existingUsers.some((u) => u.email.toLowerCase() === emailLower)) {
          setError(
            lang === "en"
              ? "An account with this email already exists."
              : "এই ইমেল অ্যাড্রেস দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট তৈরি করা হয়েছে।"
          );
          return;
        }

        // Create new pending user
        const newUser: UserAccount = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: emailLower,
          status: "pending", // Default to pending as requested: "when admin give him access"
          progress: {
            enrolledCourses: [],
            completedLessons: [],
            quizScores: {},
            customRecipes: [],
            badges: [],
          },
        };

        onAuthSuccess(newUser);
        onClose();
      } else {
        // Log in
        const foundUser = existingUsers.find((u) => u.email.toLowerCase() === emailLower);
        if (!foundUser) {
          setError(
            lang === "en"
              ? "No account found with this email. Please sign up."
              : "এই ইমেলের সাথে কোনো অ্যাকাউন্ট পাওয়া যায়নি। দয়া করে সাইন আপ করুন।"
          );
          return;
        }

        // Simulating login success
        onAuthSuccess(foundUser);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div
        id="auth-modal-content"
        className="relative w-full max-w-md bg-[#FDFCF9] border-2 border-editorial-border p-6 sm:p-8 text-left text-slate-950"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          title="Close / বন্ধ করুন"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-2 bg-[#F7F5F0] border border-editorial-border">
            <Sparkles className="h-5 w-5 text-editorial-accent" />
          </div>
          <h2 className="text-2xl font-serif font-bold italic text-editorial-dark">
            {isSignUp
              ? lang === "en"
                ? "Create Student Account"
                : "শিক্ষার্থী অ্যাকাউন্ট তৈরি করুন"
              : lang === "en"
              ? "Student Log In"
              : "শিক্ষার্থী লগ ইন"}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isSignUp
              ? lang === "en"
                ? "Sign up with your email. Your account will wait for administrative activation."
                : "আপনার ইমেল দিয়ে সাইন আপ করুন। আপনার অ্যাকাউন্টটি অ্যাডমিন সক্রিয়করণের জন্য অপেক্ষা করবে।"
              : lang === "en"
              ? "Access your enrolled courses and culinary certificates."
              : "আপনার কোর্স এবং রন্ধন সার্টিফিকেটসমূহ এক্সেস করুন।"}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                {lang === "en" ? "Full Name" : "সম্পূর্ণ নাম"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tasnim Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:border-editorial-dark"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
              {lang === "en" ? "Email Address" : "ইমেইল অ্যাড্রেস"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="chef@lodonex.edu.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:border-editorial-dark"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
              {lang === "en" ? "Secure Password" : "নিরাপদ পাসওয়ার্ড"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:border-editorial-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-editorial-accent hover:bg-red-800 disabled:bg-neutral-400 text-white font-bold uppercase tracking-widest text-xs transition cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">{lang === "en" ? "Processing..." : "প্রক্রিয়াধীন..."}</span>
            ) : (
              <>
                {isSignUp
                  ? lang === "en"
                    ? "Register & Request Access"
                    : "নিবন্ধন করুন এবং অনুমোদনের অনুরোধ পাঠান"
                  : lang === "en"
                  ? "Sign In"
                  : "লগ ইন করুন"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Form Toggle Footer */}
        <div className="mt-6 pt-4 border-t border-editorial-border/40 text-center text-xs">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-editorial-accent hover:text-red-800 font-bold hover:underline transition cursor-pointer"
          >
            {isSignUp
              ? lang === "en"
                ? "Already have an account? Log In"
                : "ইতিমধ্যেই অ্যাকাউন্ট আছে? লগ ইন করুন"
              : lang === "en"
              ? "New visitor? Create a Student Account"
              : "নতুন ভিজিটর? একটি অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}
