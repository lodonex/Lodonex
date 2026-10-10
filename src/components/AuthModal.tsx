import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  MapPin,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  KeyRound,
  ShieldAlert,
  Camera
} from "lucide-react";
import { Language, UserAccount, UserRole } from "../types";
import { auth, db, googleProvider } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { INITIAL_LMS_USERS } from "../data/lmsMockData";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAuthSuccess: (user: UserAccount, isNewSignup?: boolean) => void;
  existingUsers: UserAccount[];
}

export default function AuthModal({
  isOpen,
  onClose,
  lang,
  onAuthSuccess,
  existingUsers,
}: AuthModalProps) {
  const isEn = lang === "en";

  // Auth Modes: "login" | "register" | "forgot"
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  // Registration Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [country, setCountry] = useState("Bangladesh");
  const [city, setCity] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Quick Demo Login Preset
  const handleSelectPreset = (presetUser: UserAccount) => {
    setError("");
    onAuthSuccess(presetUser, false);
    onClose();
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const emailLower = (user.email || "").toLowerCase();
      const displayName = user.displayName || emailLower.split("@")[0] || "Student";

      const matched = INITIAL_LMS_USERS.find((u) => u.email.toLowerCase() === emailLower);
      if (matched) {
        onAuthSuccess(matched, false);
      } else {
        const newUser: UserAccount = {
          id: user.uid,
          name: displayName,
          email: emailLower,
          role: "student",
          status: "approved",
          phone: user.phoneNumber || "",
          photoUrl: user.photoURL || "",
          emailVerified: user.emailVerified,
          createdAt: new Date().toISOString(),
          progress: {
            enrolledCourses: ["course-1"],
            completedLessons: [],
            quizScores: {},
            customRecipes: [],
            badges: [],
          },
        };
        onAuthSuccess(newUser, true);
      }
      onClose();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(isEn ? "Google Sign-In failed. Please try email login." : "গুগল সাইন-ইন ব্যর্থ হয়েছে।");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Submit (Login or Register or Forgot)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const emailClean = email.toLowerCase().trim();

    // 1. FORGOT PASSWORD FLOW
    if (mode === "forgot") {
      if (!emailClean) {
        setError(isEn ? "Please enter your registered email address." : "অনুগ্রহ করে আপনার ইমেল দিন।");
        return;
      }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, emailClean);
        setSuccessMsg(isEn ? "Password reset link sent to your email!" : "পাসওয়ার্ড রিসেট লিংক আপনার ইমেলে পাঠানো হয়েছে!");
      } catch (err) {
        // Fallback simulation notice
        setSuccessMsg(isEn ? "Password reset link sent to your email address (Simulated)." : "পাসওয়ার্ড রিসেট নির্দেশনা আপনার ইমেলে পাঠানো হয়েছে।");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. REGISTRATION FLOW
    if (mode === "register") {
      if (!name.trim() || !emailClean || !password || !phone) {
        setError(isEn ? "Please fill in all required registration fields." : "সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
        return;
      }
      if (password !== confirmPassword) {
        setError(isEn ? "Passwords do not match." : "পাসওয়ার্ড দুটি মিলছে না।");
        return;
      }
      if (password.length < 6) {
        setError(isEn ? "Password must be at least 6 characters." : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        return;
      }

      setLoading(true);

      const newUser: UserAccount = {
        id: `student-${Date.now()}`,
        name: name.trim(),
        email: emailClean,
        phone: phone.trim(),
        dateOfBirth: dob,
        gender,
        country,
        city,
        address,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        role: "student",
        status: "pending", // Per requirement: Registration starts as pending admin approval
        emailVerified: false,
        createdAt: new Date().toISOString(),
        progress: {
          enrolledCourses: [],
          completedLessons: [],
          quizScores: {},
          customRecipes: [],
          badges: [],
        },
      };

      try {
        await createUserWithEmailAndPassword(auth, emailClean, password);
      } catch (e) {
        // Continue with local storage simulation if Firebase auth has domain constraint
      }

      // Also register on Express backend
      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }).catch(() => {});

      onAuthSuccess(newUser, true);
      onClose();
      setLoading(false);
      return;
    }

    // 3. LOGIN FLOW
    if (mode === "login") {
      if (!emailClean || !password) {
        setError(isEn ? "Please enter your email and password." : "ইমেল ও পাসওয়ার্ড দিন।");
        return;
      }

      setLoading(true);

      // Check preset accounts first
      const matchedLocal = INITIAL_LMS_USERS.find(
        (u) => u.email.toLowerCase() === emailClean
      );

      if (matchedLocal) {
        if (matchedLocal.status === "blocked" || matchedLocal.status === "suspended") {
          setError(`Account is ${matchedLocal.status}. Please contact registrar.`);
          setLoading(false);
          return;
        }
        onAuthSuccess(matchedLocal, false);
        onClose();
        setLoading(false);
        return;
      }

      // Check existing users state
      const matchedExisting = existingUsers.find((u) => u.email.toLowerCase() === emailClean);
      if (matchedExisting) {
        onAuthSuccess(matchedExisting, false);
        onClose();
        setLoading(false);
        return;
      }

      // Try Firebase Auth
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailClean, password);
        const fbUser = userCredential.user;
        const loggedInUser: UserAccount = {
          id: fbUser.uid,
          name: fbUser.displayName || emailClean.split("@")[0],
          email: emailClean,
          role: "student",
          status: "approved",
          progress: {
            enrolledCourses: ["course-1"],
            completedLessons: [],
            quizScores: {},
            customRecipes: [],
            badges: [],
          },
        };
        onAuthSuccess(loggedInUser, false);
        onClose();
      } catch (err: any) {
        // If not found in Firebase or mock, prompt registration or error
        setError(isEn ? "Invalid email or password. Or try the Fast Demo Personas below." : "ভুল ইমেল বা পাসওয়ার্ড। নিচের ডেমো পারসোনা ব্যবহার করতে পারেন।");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="bg-[#FDFCF9] border-2 border-editorial-border max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-900">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-editorial-border px-6 py-4 flex items-center justify-between z-10">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-widest font-mono">
              LODONEX CULINARY ACCESS PORTAL
            </span>
            <h2 className="font-serif font-extrabold text-xl text-editorial-dark tracking-tight">
              {mode === "login"
                ? (isEn ? "Student & Staff Login" : "শিক্ষার্থী ও স্টাফ লগইন")
                : mode === "register"
                ? (isEn ? "New Student Registration" : "নতুন শিক্ষার্থী নিবন্ধন")
                : (isEn ? "Reset Account Password" : "পাসওয়ার্ড রিসেট")}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-black transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Demo Persona Switcher Banner (Crucial for Instant Role Testing) */}
          <div className="bg-amber-50/80 border border-amber-300 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-editorial-accent" />
                {isEn ? "Instant Testing: Select Demo Persona" : "তাৎক্ষণিক টেস্ট: ডেমো রোল নির্বাচন"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset(INITIAL_LMS_USERS[0])} // Super Admin
                className="p-2 bg-white hover:bg-slate-100 border border-slate-300 text-left transition cursor-pointer"
              >
                <span className="font-bold text-[11px] block text-editorial-dark">👑 Super Admin</span>
                <span className="text-[9px] text-slate-500 font-mono truncate block">superadmin@lodonex.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(INITIAL_LMS_USERS[1])} // Admin
                className="p-2 bg-white hover:bg-slate-100 border border-slate-300 text-left transition cursor-pointer"
              >
                <span className="font-bold text-[11px] block text-editorial-dark">🛡️ Staff / Registrar</span>
                <span className="text-[9px] text-slate-500 font-mono truncate block">admin@lodonex.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(INITIAL_LMS_USERS[2])} // Trainer
                className="p-2 bg-white hover:bg-slate-100 border border-slate-300 text-left transition cursor-pointer"
              >
                <span className="font-bold text-[11px] block text-editorial-dark">👨‍🍳 Trainer Chef</span>
                <span className="text-[9px] text-slate-500 font-mono truncate block">chef.tawhid@lodonex.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(INITIAL_LMS_USERS[3])} // Student (Approved)
                className="p-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-left transition cursor-pointer"
              >
                <span className="font-bold text-[11px] block text-emerald-800">🎓 Student (Approved)</span>
                <span className="text-[9px] text-slate-500 font-mono truncate block">tasnim@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(INITIAL_LMS_USERS[4])} // Student (Pending)
                className="p-2 bg-white hover:bg-amber-50 border border-amber-300 text-left transition cursor-pointer"
              >
                <span className="font-bold text-[11px] block text-amber-800">⏳ Student (Pending)</span>
                <span className="text-[9px] text-slate-500 font-mono truncate block">student.pending@lodonex.com</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                mode === "login"
                  ? "border-editorial-accent text-editorial-accent"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {isEn ? "Log In" : "লগইন"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                mode === "register"
                  ? "border-editorial-accent text-editorial-accent"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {isEn ? "Register New Account" : "নতুন নিবন্ধন"}
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* REGISTER FIELDS */}
            {mode === "register" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "Full Legal Name *" : "পুরো নাম *"}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tasnim Rahman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "Phone Number *" : "মোবাইল নম্বর *"}
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1712-345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "Date of Birth" : "জন্ম তারিখ"}
                    </span>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "Gender" : "লিঙ্গ"}
                    </span>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                    >
                      <option value="male">{isEn ? "Male" : "পুরুষ"}</option>
                      <option value="female">{isEn ? "Female" : "মহিলা"}</option>
                      <option value="other">{isEn ? "Other" : "অন্যান্য"}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "City" : "শহর"}
                    </span>
                    <input
                      type="text"
                      placeholder="Dhaka"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "Country" : "দেশ"}
                    </span>
                    <input
                      type="text"
                      placeholder="Bangladesh"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <span className="block text-slate-600 font-semibold mb-1">
                    {isEn ? "Residential Address" : "বাসার ঠিকানা"}
                  </span>
                  <input
                    type="text"
                    placeholder="House, Road, Area..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </>
            )}

            {/* EMAIL */}
            <div className="text-xs">
              <span className="block text-slate-600 font-semibold mb-1">
                {isEn ? "Email Address *" : "ইমেল ঠিকানা *"}
              </span>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                />
              </div>
            </div>

            {/* PASSWORD */}
            {mode !== "forgot" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-slate-600 font-semibold mb-1">
                    {isEn ? "Password *" : "পাসওয়ার্ড *"}
                  </span>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                    />
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <span className="block text-slate-600 font-semibold mb-1">
                      {isEn ? "Confirm Password *" : "কনফার্ম পাসওয়ার্ড *"}
                    </span>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Forgot password link */}
            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-editorial-accent hover:underline"
                >
                  {isEn ? "Forgot password?" : "পাসওয়ার্ড ভুলে গেছেন?"}
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs text-slate-500 hover:text-black"
                >
                  ← {isEn ? "Back to Login" : "লগইনে ফেরত যান"}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-widest transition cursor-pointer shadow-xs disabled:bg-stone-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#E7000B] focus:ring-offset-2"
            >
              {loading
                ? (isEn ? "Processing..." : "প্রক্রিয়াধীন...")
                : mode === "login"
                ? (isEn ? "Sign In to Portal" : "লগইন করুন")
                : mode === "register"
                ? (isEn ? "Submit Student Registration" : "নিবন্ধন সম্পন্ন করুন")
                : (isEn ? "Send Reset Email" : "রিসেট ইমেল পাঠান")}
            </button>
          </form>

          {/* Social or Google Login */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.27C.46 8.19 0 10.04 0 12s.46 3.81 1.27 5.43l4.01-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.57l4.01 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>{isEn ? "Continue with Google" : "গুগল দিয়ে প্রবেশ করুন"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
