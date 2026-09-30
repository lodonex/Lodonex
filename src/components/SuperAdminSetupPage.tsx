import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Shield,
  Terminal,
  AlertTriangle
} from "lucide-react";
import { Language, UserAccount } from "../types";
import { auth, db, handleFirestoreError, OperationType } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from "firebase/firestore";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

interface SuperAdminSetupPageProps {
  lang: Language;
  onSetupSuccess: (user: UserAccount) => void;
  onNavigate: (path: string) => void;
}

export default function SuperAdminSetupPage({
  lang,
  onSetupSuccess,
  onNavigate
}: SuperAdminSetupPageProps) {
  const isEn = lang === "en";

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyInitialized, setAlreadyInitialized] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupSecret, setSetupSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<UserAccount | null>(null);

  // STEP 2: Check whether Super Admin already exists
  useEffect(() => {
    let isMounted = true;

    async function checkSuperAdminStatus() {
      setCheckingStatus(true);
      try {
        // 1. Check server backend
        const res = await fetch("/api/setup/status");
        if (res.ok) {
          const data = await res.json();
          if (data.initialized || data.superAdminExists) {
            if (isMounted) setAlreadyInitialized(true);
            setCheckingStatus(false);
            return;
          }
        }

        // 2. Check Firestore for existing super_admin
        try {
          const q = query(
            collection(db, "users"),
            where("role", "in", ["super_admin", "superadmin"])
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            if (isMounted) setAlreadyInitialized(true);
            setCheckingStatus(false);
            return;
          }
        } catch (dbErr) {
          // If firestore read error or offline, fallback to server status
          console.warn("Firestore check skipped:", dbErr);
        }

        if (isMounted) setAlreadyInitialized(false);
      } catch (err) {
        console.error("Error checking setup status:", err);
      } finally {
        if (isMounted) setCheckingStatus(false);
      }
    }

    checkSuperAdminStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (alreadyInitialized) {
      setError(
        isEn
          ? "Super Admin has already been initialized. Please use the Admin Login."
          : "সুপার অ্যাডমিন অ্যাকাউন্ট ইতিমধ্যে তৈরি করা হয়েছে। অ্যাডমিন লগইন ব্যবহার করুন।"
      );
      return;
    }

    // Active Firestore check before allowing creation
    try {
      const q = query(
        collection(db, "users"),
        where("role", "in", ["super_admin", "superadmin"])
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setAlreadyInitialized(true);
        setError(
          isEn
            ? "Super Admin has already been initialized in Firestore. Duplicate creation is blocked."
            : "সুপার অ্যাডমিন ইতিমধ্যে ফায়ারস্টোরে বিদ্যমান। অতিরিক্ত সুপার অ্যাডমিন তৈরি ব্লক করা হয়েছে।"
        );
        return;
      }
    } catch (dbErr) {
      console.warn("Firestore pre-submit check note:", dbErr);
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanConfirm = confirmPassword;
    const cleanSecret = setupSecret.trim();

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanSecret) {
      setError(
        isEn
          ? "All fields including the Setup Secret are required."
          : "অনুগ্রহ করে সব তথ্য এবং সেটআপ সিক্রেট পূরণ করুন।"
      );
      return;
    }

    if (cleanPassword.length < 6) {
      setError(
        isEn
          ? "Password must be at least 6 characters long."
          : "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।"
      );
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setError(
        isEn
          ? "Passwords do not match. Please verify your entries."
          : "পাসওয়ার্ড মিলছে না। পুনরায় যাচাই করুন।"
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Authorize and initialize on backend server
      const backendRes = await fetch("/api/setup/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          setupSecret: cleanSecret
        })
      });

      const backendData = await backendRes.json();

      if (!backendRes.ok || !backendData.success) {
        throw new Error(backendData.error || "Super Admin initialization failed on server.");
      }

      const serverSuperAdmin = backendData.user;

      // 2. Initialize in Firebase Authentication & Firestore
      let firebaseUid = serverSuperAdmin.id;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        if (userCredential.user) {
          firebaseUid = userCredential.user.uid;
        }
      } catch (authErr: any) {
        // If email already in use or network warning, proceed with server uid
        console.warn("Firebase Auth setup note:", authErr?.message || authErr);
      }

      // 3. Create Firestore user document (users/{uid})
      // STEP 3: Do NOT store the password in Firestore!
      const firestoreUser: UserAccount = {
        id: firebaseUid,
        name: cleanName,
        email: cleanEmail,
        role: "super_admin",
        status: "active",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        progress: {
          enrolledCourses: ["course-1", "course-2"],
          completedLessons: [],
          quizScores: {},
          customRecipes: [],
          badges: []
        }
      };

      try {
        await setDoc(doc(db, "users", firebaseUid), firestoreUser);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, `users/${firebaseUid}`);
      }

      // 4. Record Audit Log in Firestore
      try {
        const auditDocId = `audit-${Date.now()}`;
        await setDoc(doc(db, "audit_logs", auditDocId), {
          id: auditDocId,
          actorUid: firebaseUid,
          actorName: cleanName,
          actorRole: "super_admin",
          action: "SUPER_ADMIN_INITIALIZED",
          targetUid: firebaseUid,
          targetResource: "users",
          details: "First Master Super Admin initialized via secure one-time setup.",
          timestamp: new Date().toISOString()
        });
      } catch (auditErr) {
        console.warn("Audit log creation note:", auditErr);
      }

      // Success
      setSuccessData(firestoreUser);
      setAlreadyInitialized(true);
      onSetupSuccess(firestoreUser);
    } catch (err: any) {
      console.error("Super Admin setup error:", err);
      setError(err?.message || "Failed to initialize Super Admin account.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-mono tracking-widest text-slate-500">
            {isEn ? "Verifying System Security Status..." : "সিস্টেম নিরাপত্তা যাচাই করা হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  // STEP 2 & 15: If Super Admin already exists, DISABLE INITIAL SETUP
  if (alreadyInitialized && !successData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[11px] font-mono tracking-wider font-bold uppercase px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
              {isEn ? "Setup Locked & Completed" : "সেটআপ সম্পন্ন ও লক করা"}
            </span>
            <h2 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">
              {isEn ? "Super Admin Already Initialized" : "সুপার অ্যাডমিন ইতিমধ্যে ইনিশিয়ালাইজড"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              {isEn
                ? "The master Super Admin account for Lodonex Academy has already been securely created. One-time setup is disabled to protect system integrity."
                : "লোডনেক্স একাডেমির প্রথম সুপার অ্যাডমিন অ্যাকাউন্ট ইতিমধ্যে তৈরি হয়ে গেছে। নিরাপত্তা বজায় রাখতে সেটআপ বন্ধ রয়েছে।"}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? "Security Policy Step #2" : "নিরাপত্তা নীতি ধাপ ২"}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              {isEn
                ? "Once the first Super Admin exists, duplicate Super Admin creation is blocked by server-side authorization and database security rules. Please use the Admin Login."
                : "প্রথম সুপার অ্যাডমিন তৈরির পর অতিরিক্ত অ্যাকাউন্ট তৈরির সুযোগ সার্ভার স্তরে ব্লক করা থাকে। অ্যাডমিন লগইন ব্যবহার করুন।"}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("/admin/login")}
              className="w-full sm:w-auto px-6 py-3 bg-slate-950 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
            >
              <span>{isEn ? "Proceed to Admin Login" : "অ্যাডমিন লগইনে যান"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("/")}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition"
            >
              {isEn ? "Return to Website" : "মূল ওয়েবসাইটে ফিরুন"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Setup Success Screen
  if (successData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border-2 border-emerald-400 shadow-2xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[11px] font-mono tracking-wider font-bold uppercase px-3 py-1 bg-emerald-100 text-emerald-900">
              {isEn ? "ROLE = SUPER_ADMIN" : "পদবী = সুপার অ্যাডমিন"}
            </span>
            <h2 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">
              {isEn ? "Super Admin Account Initialized!" : "সুপার অ্যাডমিন অ্যাকাউন্ট তৈরি সফল!"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? `Master administrator credentials created for ${successData.name} (${successData.email}). You now have full system access to all administrative modules.`
                : `${successData.name} এর জন্য মাস্টার অ্যাডমিন ক্রেডেনশিয়াল তৈরি হয়েছে। আপনি এখন সম্পূর্ণ সিস্টেম পরিচালনা করতে পারবেন।`}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded text-left space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              {isEn ? "Account Details" : "অ্যাকাউন্ট বিবরণ"}
            </div>
            <div className="text-xs text-slate-800 dark:text-slate-200">
              <div><span className="font-semibold">{isEn ? "Name:" : "নাম:"}</span> {successData.name}</div>
              <div><span className="font-semibold">{isEn ? "Email:" : "ইমেল:"}</span> {successData.email}</div>
              <div><span className="font-semibold">{isEn ? "Role:" : "রোল:"}</span> super_admin</div>
              <div><span className="font-semibold">{isEn ? "Status:" : "স্ট্যাটাস:"}</span> active</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate("/admin/login")}
              className="w-full py-3 px-6 bg-slate-950 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
            >
              <span>{isEn ? "Log In as Super Admin" : "সুপার অ্যাডমিন হিসেবে লগইন করুন"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: Initialization Form
  return (
    <div id="super-admin-setup-page" className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-lg w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative inline-block">
              <img
                src={lodonexLogo}
                alt="Lodonex Culinary Academy"
                className="h-16 w-auto object-contain mx-auto rounded shadow-xs"
              />
              <span className="absolute -bottom-2 -right-2 bg-amber-600 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow">
                INIT
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-red-100 text-red-800 text-[10px] font-mono font-bold tracking-wider uppercase border border-red-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isEn ? "One-Time Security Gateway" : "এককালীন নিরাপত্তা গেটওয়ে"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
              {isEn ? "First Super Admin Setup" : "প্রথম সুপার অ্যাডমিন সেটআপ"}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {isEn
                ? "Establish the master administrative authority for Lodonex Academy. Once configured, this page is permanently disabled."
                : "লোডনেক্স একাডেমির প্রধান প্রশাসনিক অ্যাকাউন্ট তৈরি করুন। এটি প্রস্তুত হলে এই পাতাটি স্থায়ীভাবে বন্ধ হয়ে যাবে।"}
            </p>
          </div>
        </div>

        {/* Security Warning Callout */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-600 text-xs text-amber-900 dark:text-amber-200 space-y-1 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{isEn ? "Master Authorization Notice" : "মাস্টার অনুমোদন নোটিশ"}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
            {isEn
              ? "Super Admin holds full access to all students, courses, financial ledgers, staff privileges, and settings. A valid Setup Secret is verified by the backend server."
              : "সুপার অ্যাডমিন সমস্ত শিক্ষার্থী, কোর্স, আর্থিক তথ্য ও কর্মীদের উপর সম্পূর্ণ নিয়ন্ত্রণ রাখেন। সার্ভারে সেটআপ সিক্রেট যাচাই করা হয়।"}
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 rounded">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? "Full Name *" : "পুরো নাম *"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? "e.g., Chef Dewan (Director)" : "যেমন: শেফ দেওয়ান"}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? "Official Admin Email *" : "অফিসিয়াল অ্যাডমিন ইমেল *"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? "superadmin@lodonex.com" : "admin@lodonex.com"}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? "Password (min 6 chars) *" : "পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? "Confirm Password *" : "পাসওয়ার্ড নিশ্চিত করুন *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Setup Secret */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {isEn ? "Setup Secret (Server Authorization) *" : "সেটআপ সিক্রেট (সার্ভার অথরাইজেশন) *"}
                </label>
                <button
                  type="button"
                  onClick={() => setSetupSecret("LodonexSuperAdminInit@2026")}
                  className="text-[10px] text-amber-600 hover:underline cursor-pointer font-mono"
                >
                  {isEn ? "Use Default Secret" : "ডিফল্ট সিক্রেট ব্যবহার"}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={setupSecret}
                  onChange={(e) => setSetupSecret(e.target.value)}
                  placeholder={isEn ? "Enter master setup secret" : "মাস্টার সেটআপ সিক্রেট দিন"}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-mono">
                {isEn
                  ? "Configured secret: LodonexSuperAdminInit@2026"
                  : "কনফিগার করা সিক্রেট: LodonexSuperAdminInit@2026"}
              </p>
            </div>

            {/* Role indicator */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {isEn ? "Account Type to be Created:" : "তৈরি হতে যাওয়া অ্যাকাউন্ট ধরন:"}
              </span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400 uppercase bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded">
                super_admin
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-950 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{isEn ? "Initialize Super Admin Account" : "সুপার অ্যাডমিন অ্যাকাউন্ট প্রস্তুত করুন"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => onNavigate("/admin/login")}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium cursor-pointer transition inline-flex items-center gap-1"
          >
            <span>{isEn ? "Already have an account? Go to Admin Login" : "অ্যাকাউন্ট আছে? অ্যাডমিন লগইনে যান"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
