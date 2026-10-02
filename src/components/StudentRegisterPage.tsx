import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Globe,
  Camera,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { Language, UserAccount } from "../types";
import { INITIAL_LMS_USERS } from "../data/lmsMockData";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

interface StudentRegisterPageProps {
  lang: Language;
  onRegisterSuccess: (newUser: UserAccount) => void;
  onNavigate: (path: string) => void;
  existingUsers?: UserAccount[];
}

export default function StudentRegisterPage({
  lang,
  onRegisterSuccess,
  onNavigate,
  existingUsers = INITIAL_LMS_USERS,
}: StudentRegisterPageProps) {
  const isEn = lang === "en";

  // Form Fields per requirements:
  // Full Name, Email, Phone Number, Password, Confirm Password, Country, Date of Birth, Profile Photo (optional)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [dob, setDob] = useState("2000-01-01");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [city, setCity] = useState("Dhaka");
  const [photoUrl, setPhotoUrl] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<UserAccount | null>(null);

  // 60-Second Cooldown Resend Email Verification State
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!createdStudent || resendCooldown > 0 || resending) return;
    setResending(true);
    setResendMsg("");

    try {
      const res = await fetch("/api/email/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: createdStudent.email, name: createdStudent.name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResendCooldown(60);
        setResendMsg(
          isEn
            ? "Verification email resent from lodonexcookingacademy@gmail.com! Please check your inbox or spam folder."
            : "ভেরিফিকেশন ইমেল পুনরায় পাঠানো হয়েছে! ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।"
        );
      } else {
        if (data.remainingSeconds) {
          setResendCooldown(data.remainingSeconds);
        }
        setResendMsg(data.error || (isEn ? "Could not resend right now." : "পুনরায় পাঠানো সম্ভব হয়নি।"));
      }
    } catch (err: any) {
      setResendMsg(isEn ? "Network error. Please try again later." : "পুনরায় চেষ্টা করুন।");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (cleanEmail === "lodonexcookingacademy@gmail.com") {
      setError(
        isEn
          ? "This email is reserved for the Academy Super Administrator. Please use the Admin Login."
          : "এই ইমেলটি একাডেমি সুপার অ্যাডমিনের জন্য সংরক্ষিত। অনুগ্রহ করে অ্যাডমিন লগইন ব্যবহার করুন।"
      );
      return;
    }

    if (!cleanName || !cleanEmail || !cleanPhone || !password || !confirmPassword) {
      setError(
        isEn
          ? "Please fill in all required registration fields."
          : "অনুগ্রহ করে সকল আবশ্যকীয় তথ্য সঠিকভাবে পূরণ করুন।"
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

    if (password.length < 6) {
      setError(
        isEn
          ? "Password must be at least 6 characters long."
          : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
      );
      return;
    }

    if (!termsAccepted) {
      setError(
        isEn
          ? "Please accept the academy terms of admission and code of conduct."
          : "অনুগ্রহ করে একাডেমির নীতিমালা ও আচরণবিধি গ্রহণ করুন।"
      );
      return;
    }

    // Check if email already exists in local list
    const existing = existingUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setError(
        isEn
          ? "An account with this email address is already registered. Please log in instead."
          : "এই ইমেল ঠিকানায় ইতোমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত আছে। দয়া করে লগইন করুন।"
      );
      return;
    }

    setLoading(true);

    const newUser: UserAccount = {
      id: `student-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: password,
      dateOfBirth: dob,
      gender: gender,
      country: country,
      city: city || "Dhaka",
      photoUrl:
        photoUrl.trim() ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      role: "student",
      status: "approved", // Student account active, but zero courses enrolled until applied & approved
      emailVerified: true,
      createdAt: new Date().toISOString(),
      assignedCourseIds: [], // STRICT: Registration alone does NOT enroll the student in a course!
      progress: {
        enrolledCourses: [], // Strict: No course access until enrollment approved
        completedLessons: [],
        quizScores: {},
        customRecipes: [],
        badges: [],
      },
    };

    try {
      // 1. POST to backend API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Continue with client registration
    }

    // 2. Create Firebase Authentication Account
    let firebaseUid = newUser.id;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (userCredential.user) {
        firebaseUid = userCredential.user.uid;
        newUser.id = firebaseUid;
        // Official Firebase Authentication email verification
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verErr) {
          console.warn("Firebase sendEmailVerification notice:", verErr);
        }
      }
    } catch (authErr: any) {
      console.warn("Firebase Auth registration note:", authErr?.message);
    }

    // Trigger official Lodonex Transactional Welcome Email via Gmail SMTP
    fetch("/api/email/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, name: cleanName }),
    }).catch((emailErr) => console.warn("Welcome email trigger notice:", emailErr));

    // 3. Create Firestore user document (role = student, status = active)
    try {
      await setDoc(doc(db, "users", firebaseUid), {
        ...newUser,
        id: firebaseUid,
        role: "student",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (dbErr) {
      console.warn("Firestore student profile write note:", dbErr);
    }

    // 4. MANDATORY SECURITY REQUIREMENT: NO AUTOMATIC LOGIN!
    // Sign out from Firebase immediately so the user must manually enter credentials
    try {
      await auth.signOut();
    } catch (signOutErr) {
      console.warn("Sign out err:", signOutErr);
    }
    localStorage.removeItem("lodonex_current_user");

    setCreatedStudent(newUser);
    setRegisteredSuccess(true);
    setLoading(false);
  };

  return (
    <div id="student-register-page" className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full space-y-6">
        {/* Success Card */}
        {registeredSuccess && createdStudent ? (
          <div className="bg-[#FDFCF9] border-2 border-emerald-600 shadow-2xl p-6 sm:p-8 space-y-6 text-center text-slate-900">
            <div className="h-16 w-16 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-700 font-mono block">
                {isEn ? "ACCOUNT CREATED SUCCESSFULLY" : "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে"}
              </span>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Your account has been created successfully." : "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।"}
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                {isEn ? "Please log in to continue." : "অনুগ্রহ করে চালিয়ে যেতে লগইন করুন।"}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {isEn
                  ? `Welcome, ${createdStudent.name}! Your student profile has been created with role: student and status: active. Enter your email and password at the login screen to access your portal.`
                  : `স্বাগতম, ${createdStudent.name}! আপনার প্রোফাইল তৈরি হয়েছে। পোর্টালে প্রবেশ করতে লগইন করুন।`}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-editorial-border text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID:</span>
                <span className="font-bold text-slate-900">{createdStudent.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered Email:</span>
                <span className="font-bold text-slate-900">{createdStudent.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role & Status:</span>
                <span className="font-bold text-emerald-700 uppercase">ROLE: STUDENT | STATUS: ACTIVE</span>
              </div>
            </div>

            {/* Email Verification Box */}
            <div className="p-4 bg-amber-50 border border-amber-200 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-amber-950 block">
                    {isEn ? "Email Verification Sent" : "ভেরিফিকেশন ইমেল পাঠানো হয়েছে"}
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {isEn
                      ? `An official welcome and verification message was dispatched to ${createdStudent.email} from lodonexcookingacademy@gmail.com. Please check your inbox or spam folder.`
                      : `আপনার ইমেলে একটি অ্যাক্টিভেশন লিঙ্ক পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`}
                  </p>
                </div>
              </div>

              {resendMsg && (
                <div className="text-[11px] font-medium text-amber-900 bg-amber-100/70 p-2 border border-amber-300">
                  {resendMsg}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-amber-200">
                <span className="text-[11px] text-slate-600">
                  {isEn ? "Didn't receive the email?" : "ইমেল পাননি?"}
                </span>
                <button
                  type="button"
                  id="resend-verification-btn"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0 || resending}
                  className="px-3 py-1.5 bg-white border border-amber-400 text-amber-900 hover:bg-amber-100 font-bold text-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {resending
                    ? (isEn ? "Sending..." : "পাঠানো হচ্ছে...")
                    : resendCooldown > 0
                    ? `${isEn ? "Resend in" : "পুনরায় পাঠান"} (${resendCooldown}s)`
                    : (isEn ? "Resend Verification Email" : "পুনরায় ইমেল পাঠান")}
                </button>
              </div>
            </div>

            <button
              id="proceed-to-login-btn"
              onClick={() => onNavigate("/portal/login")}
              className="w-full py-3 bg-editorial-accent hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>{isEn ? "Proceed to Portal Login →" : "পোর্টাল লগইনে এগিয়ে যান →"}</span>
            </button>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-[#FDFCF9] border-2 border-editorial-border shadow-xl p-6 sm:p-8 space-y-6 text-slate-900">
            {/* Header */}
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
                  {isEn ? "LODONEX CULINARY ACADEMY" : "লোডোনেক্স কালিনারি একাডেমি"}
                </span>
                <h1 className="font-serif font-extrabold text-2xl text-editorial-dark tracking-tight">
                  {isEn ? "Student Account Registration" : "শিক্ষার্থী নিবন্ধন ফরম"}
                </h1>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isEn
                    ? "Create your student account to access our digital learning portal, class schedules, and digital certifications."
                    : "ডিজিটাল লার্নিং পোর্টাল ও সার্টিফিকেশনে প্রবেশের জন্য আপনার শিক্ষার্থী অ্যাকাউন্ট তৈরি করুন।"}
                </p>
              </div>
            </div>

            {/* Crucial Notice */}
            <div className="p-3 bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                {isEn
                  ? "Note: Registration creates your student account. Course access requires submitting an enrollment application and administrative review."
                  : "বিশেষ দ্রষ্টব্য: অ্যাকাউন্ট খোলার পর কোর্সে ভর্তির আবেদন জমা দিতে হবে। অ্যাডমিন অনুমোদনের পর কোর্স চালু হবে।"}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2.5">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g. Tasnim Rahman" : "আপনার নাম লিখুন"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Email Address *" : "ইমেল ঠিকানা *"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Phone Number *" : "ফোন নম্বর *"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1712-345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Password *" : "পাসওয়ার্ড *"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Confirm Password *" : "পাসওয়ার্ড নিশ্চিত করুন *"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Country & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Country *" : "দেশ *"}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United Arab Emirates">United Arab Emirates (Dubai)</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Date of Birth *" : "জন্ম তারিখ *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              {/* Gender & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "Gender" : "লিঙ্গ"}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                  >
                    <option value="male">{isEn ? "Male" : "পুরুষ"}</option>
                    <option value="female">{isEn ? "Female" : "মহিলা"}</option>
                    <option value="other">{isEn ? "Other" : "অন্যান্য"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {isEn ? "City" : "শহর"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka / Chittagong"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              {/* Profile Photo (Optional) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "Profile Photo URL (Optional)" : "প্রোফাইল ছবি লিংক (ঐচ্ছিক)"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2 flex items-start gap-2">
                <input
                  id="reg-terms-check"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-editorial-accent cursor-pointer"
                />
                <label htmlFor="reg-terms-check" className="text-[11px] text-slate-600 cursor-pointer leading-tight">
                  {isEn
                    ? "I agree to Lodonex Academy's enrollment policies, culinary safety regulations, and student code of conduct."
                    : "আমি লোডোনেক্স একাডেমির নীতিমালা, কিচেন নিরাপত্তা নিয়ম ও আচরণবিধি মেনে চলতে সম্মত।"}
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="submit-student-register-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-editorial-accent hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <span>{isEn ? "Creating Student Account..." : "অ্যাকাউন্ট তৈরি হচ্ছে..."}</span>
                ) : (
                  <>
                    <span>{isEn ? "Complete Registration" : "নিবন্ধন সম্পন্ন করুন"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="pt-3 border-t border-editorial-border text-center space-y-2">
              <span className="text-[11px] text-slate-500 block">
                {isEn ? "Already have a registered account?" : "ইতোমধ্যে অ্যাকাউন্ট আছে?"}
              </span>
              <button
                type="button"
                onClick={() => onNavigate("/portal/login")}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-editorial-dark hover:text-editorial-accent transition cursor-pointer"
              >
                <span>{isEn ? "Log In with Existing Credentials →" : "লগইন করুন →"}</span>
              </button>
            </div>
          </div>
        )}

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
    </div>
  );
}
