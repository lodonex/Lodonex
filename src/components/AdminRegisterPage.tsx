import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
  Clock,
  ArrowLeft,
  Briefcase,
  Award
} from "lucide-react";
import { Language, UserAccount, UserRole } from "../types";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

// Approved Team Roles for Public Team Registration
// Super Admin is strictly reserved and MUST NOT be publicly selectable
export type SelectableTeamRole = "admin" | "trainer" | "staff";

interface AdminRegisterPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
  existingUsers?: UserAccount[];
}

export default function AdminRegisterPage({
  lang,
  onNavigate,
  existingUsers = [],
}: AdminRegisterPageProps) {
  const isEn = lang === "en";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Mandatory Role / Account Type Selection for Team Registration:
  // Approved Options: ADMIN, TRAINER, STAFF (Super Admin is NEVER publicly selectable)
  const [role, setRole] = useState<SelectableTeamRole | "">("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [createdMember, setCreatedMember] = useState<UserAccount | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password || !confirmPassword) {
      setError(
        isEn
          ? "Please fill in all required registration fields."
          : "অনুগ্রহ করে সকল আবশ্যকীয় তথ্য সঠিকভাবে পূরণ করুন।"
      );
      return;
    }

    if (!role || !["admin", "trainer", "staff"].includes(role)) {
      setError(
        isEn
          ? "Please select an approved Role / Account Type (Admin, Trainer, or Staff)."
          : "অনুগ্রহ করে একটি অনুমোদিত রোল / অ্যাকাউন্ট টাইপ নির্বাচন করুন (অ্যাডমিন, ট্রেইনার অথবা স্টাফ)।"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        isEn
          ? "Password must be at least 6 characters long."
          : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        isEn
          ? "Passwords do not match. Please re-enter identical passwords."
          : "পাসওয়ার্ড দুটি মিলছে না। অনুগ্রহ করে একই পাসওয়ার্ড পুনরায় লিখুন।"
      );
      return;
    }

    if (cleanEmail === "lodonexcookingacademy@gmail.com") {
      setError(
        isEn
          ? "This email is the permanent Academy Super Administrator. Please log in directly via the Admin Login page."
          : "এই ইমেলটি স্থায়ী একাডেমি সুপার অ্যাডমিনিস্ট্রেটর। অনুগ্রহ করে সরাসরি অ্যাডমিন লগইন পেজে লগইন করুন।"
      );
      return;
    }

    // Check if email already registered locally
    const existing = existingUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setError(
        isEn
          ? "An account with this email address already exists. Please log in."
          : "এই ইমেল ঠিকানায় ইতোমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত আছে। দয়া করে লগইন করুন।"
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Register with backend API using robust, safe JSON error handling
      let res: Response;
      try {
        res = await fetch("/api/auth/team-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            password: password,
            role: role
          }),
        });
      } catch (fetchErr) {
        console.error("Team registration network failure:", fetchErr);
        throw new Error(
          isEn
            ? "Registration service is temporarily unavailable. Please try again."
            : "নিবন্ধন পরিষেবা সাময়িকভাবে অনুপলব্ধ। অনুগ্রহ করে আবার চেষ্টা করুন।"
        );
      }

      // Safe JSON response checking: Never blindly call response.json()
      let data: any = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          console.error("JSON parsing error on team register response:", jsonErr);
        }
      }

      if (!res.ok || !data || !data.success) {
        if (!data) {
          console.error("Unexpected non-JSON response from registration service:", res.status, res.statusText);
          throw new Error(
            isEn
              ? "Registration service is temporarily unavailable. Please try again."
              : "নিবন্ধন পরিষেবা সাময়িকভাবে অনুপলব্ধ। অনুগ্রহ করে আবার চেষ্টা করুন।"
          );
        }
        throw new Error(
          data.message ||
          data.error ||
          (isEn ? "Failed to create team member account." : "টিম মেম্বার অ্যাকাউন্ট তৈরি সম্ভব হয়নি।")
        );
      }

      // 2. Create in Firebase Authentication
      let firebaseUid = data.data?.user?.id || data.user?.id || `${role}-${Date.now()}`;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (userCredential.user) {
          firebaseUid = userCredential.user.uid;
        }
      } catch (authErr: any) {
        console.warn("Firebase Auth team member create note:", authErr?.message);
      }

      // 3. Create Firestore user document with selected approved role and active status
      const firestoreUser: UserAccount = {
        id: firebaseUid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: role as UserRole,
        status: "active",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        progress: {
          enrolledCourses: [],
          completedLessons: [],
          quizScores: {},
          customRecipes: [],
          badges: []
        }
      };

      try {
        await setDoc(doc(db, "users", firebaseUid), {
          ...firestoreUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (dbErr) {
        console.warn("Firestore team member profile write note:", dbErr);
      }

      // 4. IMPORTANT MANDATORY RULE: NO AUTOMATIC LOGIN!
      // Immediately sign out from Firebase client SDK to ensure NO session is kept!
      try {
        await auth.signOut();
      } catch (signOutErr) {
        console.warn("Sign out err:", signOutErr);
      }
      localStorage.removeItem("lodonex_current_user");

      setCreatedMember(firestoreUser);
      setRegisteredSuccess(true);
    } catch (err: any) {
      console.error("Team registration submission error:", err);
      // User-friendly message, no sensitive stack traces exposed
      setError(err?.message || (isEn ? "Registration service is temporarily unavailable. Please try again." : "নিবন্ধন পরিষেবা সাময়িকভাবে অনুপলব্ধ। অনুগ্রহ করে আবার চেষ্টা করুন।"));
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (r: string) => {
    switch (r) {
      case "super_admin":
      case "superadmin":
        return "SUPER ADMIN";
      case "admin":
        return "ADMIN";
      case "staff":
        return "STAFF";
      case "trainer":
        return "TRAINER";
      default:
        return r.toUpperCase();
    }
  };

  return (
    <div id="team-register-page" className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Success / Created Notice Card */}
        {registeredSuccess && createdMember ? (
          <div className="bg-[#FDFCF9] border-2 border-emerald-600 shadow-2xl p-6 sm:p-8 space-y-6 text-center text-slate-900">
            <div className="h-16 w-16 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-700 font-mono block">
                {isEn ? "STATUS = ACTIVE" : "স্ট্যাটাস = সক্রিয়"}
              </span>
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">
                {isEn ? "Team Account Created" : "টিম অ্যাকাউন্ট তৈরি সম্পন্ন"}
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {isEn
                  ? "Your Lodonex Team Account has been created successfully. Please log in with your credentials to access your role-based dashboard."
                  : "আপনার টিম অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-900">{createdMember.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-900">{createdMember.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-editorial-accent uppercase">
                  {getRoleDisplayName(createdMember.role || "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dashboard:</span>
                <span className="font-bold text-slate-700">
                  {createdMember.role === "trainer" ? "/trainer/dashboard" : "/admin/dashboard"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700 uppercase">ACTIVE</span>
              </div>
            </div>

            {/* Email Notification Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-[11px] text-amber-950 uppercase tracking-wider">
                <Mail className="h-3.5 w-3.5 text-amber-700" />
                {isEn ? "Email Notification Dispatched" : "ইমেল বিজ্ঞপ্তি পাঠানো হয়েছে"}
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {isEn
                  ? `An official registration confirmation email was sent to ${createdMember.email} from lodonexcookingacademy@gmail.com.`
                  : `আপনার ইমেলে একটি কনফার্মেশন পাঠানো হয়েছে।`}
              </p>
            </div>

            <button
              id="proceed-team-login-btn"
              onClick={() => onNavigate("/team/login")}
              className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>{isEn ? "Proceed to Team Login →" : "টিম লগইনে এগিয়ে যান →"}</span>
            </button>
          </div>
        ) : (
          /* Team Registration Form */
          <div className="bg-[#FDFCF9] border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6 text-slate-900">
            {/* Header */}
            <div className="text-center space-y-2">
              <div
                className="inline-flex items-center justify-center h-14 w-14 bg-white border border-slate-300 p-1 mx-auto cursor-pointer"
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
                  {isEn ? "LODONEX TEAM PORTAL" : "লোডোনেক্স টিম পোর্টাল"}
                </span>
                <h1 className="font-serif font-extrabold text-2xl text-slate-900 tracking-tight">
                  {isEn ? "Team Registration" : "টিম মেম্বার নিবন্ধন"}
                </h1>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isEn
                    ? "Register as an authorized faculty, trainer, staff, or administration team member."
                    : "অনুমোদিত ফ্যাকাল্টি, ট্রেইনার, স্টাফ অথবা অ্যাডমিনিস্ট্রেশন হিসেবে নিবন্ধন করুন।"}
                </p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Full Name *" : "পুরো নাম *"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="team-fullname-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isEn ? "e.g. Chef Tanvir Ahmed" : "যেমন: শেফ তানভীর আহমেদ"}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Official Email *" : "অফিসিয়াল ইমেল *"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="team-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? "team@lodonex.com" : "team@lodonex.com"}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Phone Number *" : "ফোন নম্বর *"}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="team-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711-000000"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
                  />
                </div>
              </div>

              {/* Role / Account Type Selector (MANDATORY REQUIREMENT) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Role / Account Type *" : "রোল / অ্যাকাউন্ট টাইপ *"}
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    id="team-role-select"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value as SelectableTeamRole)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border-2 border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent cursor-pointer"
                  >
                    <option value="" disabled>
                      {isEn ? "[ Select Approved Role ]" : "[ অনুমোদিত রোল নির্বাচন করুন ]"}
                    </option>
                    <option value="admin">
                      * ADMIN (Academic & Operations Coordinator)
                    </option>
                    <option value="trainer">
                      * TRAINER (Culinary Faculty / Instructor)
                    </option>
                    <option value="staff">
                      * STAFF (Admissions & Operations Support)
                    </option>
                  </select>
                </div>

                {/* Role Description Banner */}
                {role === "trainer" && (
                  <div className="p-2.5 bg-blue-50 border border-blue-300 text-[11px] text-blue-900 space-y-0.5 mt-1.5">
                    <span className="font-bold flex items-center gap-1 text-blue-800">
                      <Award className="w-3.5 h-3.5" />
                      TRAINER FACULTY PRIVILEGES
                    </span>
                    <p className="text-[10px] text-blue-800 leading-tight">
                      Access to batches, class schedules, apprentice attendance, assignments, and practical gradebooks.
                    </p>
                  </div>
                )}
                {role === "admin" && (
                  <div className="p-2.5 bg-slate-100 border border-slate-300 text-[11px] text-slate-800 space-y-0.5 mt-1.5">
                    <span className="font-bold flex items-center gap-1 text-slate-900">
                      <Shield className="w-3.5 h-3.5 text-slate-700" />
                      ADMINISTRATOR PRIVILEGES
                    </span>
                    <p className="text-[10px] text-slate-700 leading-tight">
                      Management of student rosters, course catalogs, enrollment reviews, batches, and certificates.
                    </p>
                  </div>
                )}
                {role === "staff" && (
                  <div className="p-2.5 bg-stone-100 border border-stone-300 text-[11px] text-stone-800 space-y-0.5 mt-1.5">
                    <span className="font-bold flex items-center gap-1 text-stone-900">
                      <Briefcase className="w-3.5 h-3.5 text-stone-700" />
                      STAFF PRIVILEGES
                    </span>
                    <p className="text-[10px] text-stone-700 leading-tight">
                      Operational access for enrollment handling, student queries, course materials, and notices.
                    </p>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Password (min 6 chars) *" : "পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="team-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
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
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Confirm Password *" : "পাসওয়ার্ড নিশ্চিত করুন *"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="team-confirmpassword-input"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
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

              {/* Submit */}
              <button
                id="team-register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-editorial-accent hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
              >
                {loading ? (
                  <span>{isEn ? "Creating Team Account..." : "অ্যাকাউন্ট তৈরি হচ্ছে..."}</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{isEn ? "Submit Registration" : "নিবন্ধন সম্পন্ন করুন"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => onNavigate("/team/login")}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <span>{isEn ? "Already have a team account? Team Member Login →" : "টিম অ্যাকাউন্ট আছে? টিম লগইন →"}</span>
              </button>
              <div>
                <button
                  onClick={() => onNavigate("/portal/login")}
                  className="text-[11px] text-editorial-accent hover:underline cursor-pointer"
                >
                  {isEn ? "← Return to Portal Login" : "← পোর্টাল লগইনে ফিরুন"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
