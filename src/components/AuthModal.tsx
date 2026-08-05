import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Language, UserAccount } from "../types";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAuthSuccess: (user: UserAccount, isNewSignup?: boolean) => void;
  existingUsers: UserAccount[];
}

const ADMIN_EMAIL = "lodonexcookingacademy@gmail.com";

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

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userId = user.uid;
      const emailLower = (user.email || "").toLowerCase();
      const displayName = user.displayName || emailLower.split("@")[0] || "Student";
      const isAdmin = emailLower === ADMIN_EMAIL;

      let docSnap;
      try {
        docSnap = await getDoc(doc(db, "users", userId));
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.GET, `users/${userId}`);
      }

      if (docSnap && docSnap.exists()) {
        const existingData = docSnap.data() as UserAccount;
        const updatedUser: UserAccount = {
          ...existingData,
          role: isAdmin ? "admin" : "student",
          status: isAdmin ? "approved" : existingData.status,
        };
        onAuthSuccess(updatedUser, false);
      } else {
        const newUser: UserAccount = {
          id: userId,
          name: displayName,
          email: emailLower,
          status: "approved",
          role: isAdmin ? "admin" : "student",
          progress: {
            enrolledCourses: isAdmin ? ["course-1", "course-2", "course-3", "course-4", "course-5", "course-6"] : [],
            completedLessons: [],
            quizScores: {},
            customRecipes: [],
            badges: [],
          },
        };
        try {
          await setDoc(doc(db, "users", userId), newUser);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `users/${userId}`);
        }
        onAuthSuccess(newUser, true);
      }
      onClose();
    } catch (err: any) {
      console.error("Google auth error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(
          lang === "en"
            ? "Google Sign-In failed. Please try again."
            : "গুগল সাইন-ইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !name)) {
      setError(lang === "en" ? "Please fill in all required fields." : "দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    setLoading(true);

    try {
      const emailLower = email.toLowerCase().trim();
      const isAdmin = emailLower === ADMIN_EMAIL;

      if (isSignUp) {
        // Sign up with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password);
        const userId = userCredential.user.uid;

        // Create new user profile in Firestore
        const newUser: UserAccount = {
          id: userId,
          name: name.trim(),
          email: emailLower,
          status: isAdmin ? "approved" : "approved", // Visitor signs up and gets access, but NO admin access
          role: isAdmin ? "admin" : "student",
          progress: {
            enrolledCourses: isAdmin ? ["course-1", "course-2", "course-3", "course-4", "course-5", "course-6"] : [],
            completedLessons: [],
            quizScores: {},
            customRecipes: [],
            badges: [],
          },
        };

        try {
          await setDoc(doc(db, "users", userId), newUser);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `users/${userId}`);
        }
        onAuthSuccess(newUser, true);
        onClose();
      } else {
        // Log in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, password);
        const userId = userCredential.user.uid;

        // Fetch user from Firestore
        let docSnap;
        try {
          docSnap = await getDoc(doc(db, "users", userId));
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.GET, `users/${userId}`);
        }

        if (docSnap && docSnap.exists()) {
          const userData = docSnap.data() as UserAccount;
          const updatedUser: UserAccount = {
            ...userData,
            role: isAdmin ? "admin" : "student",
            status: isAdmin ? "approved" : userData.status,
          };
          onAuthSuccess(updatedUser, false);
        } else {
          // Check if user exists in pre-existing LocalStorage list and migrate them
          const emailUser = existingUsers.find((u) => u.email.toLowerCase() === emailLower);
          if (emailUser) {
            const migratedUser: UserAccount = {
              ...emailUser,
              id: userId,
              role: isAdmin ? "admin" : "student",
              status: isAdmin ? "approved" : emailUser.status,
            };
            try {
              await setDoc(doc(db, "users", userId), migratedUser);
            } catch (dbErr) {
              handleFirestoreError(dbErr, OperationType.WRITE, `users/${userId}`);
            }
            onAuthSuccess(migratedUser, false);
          } else {
            // Create a default student profile
            const newUser: UserAccount = {
              id: userId,
              name: emailLower.split("@")[0],
              email: emailLower,
              status: "approved",
              role: isAdmin ? "admin" : "student",
              progress: {
                enrolledCourses: isAdmin ? ["course-1", "course-2", "course-3", "course-4", "course-5", "course-6"] : [],
                completedLessons: [],
                quizScores: {},
                customRecipes: [],
                badges: [],
              },
            };
            try {
              await setDoc(doc(db, "users", userId), newUser);
            } catch (dbErr) {
              handleFirestoreError(dbErr, OperationType.WRITE, `users/${userId}`);
            }
            onAuthSuccess(newUser, false);
          }
        }
        onClose();
      }
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      let errMsg = lang === "en" ? "Authentication failed. Please check your credentials." : "অনুমোদন ব্যর্থ হয়েছে। দয়া করে সঠিক তথ্য দিন।";
      if (err.code === "auth/weak-password") {
        errMsg = lang === "en" ? "Password must be at least 6 characters." : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
      } else if (err.code === "auth/email-already-in-use") {
        errMsg = lang === "en" ? "An account with this email already exists." : "এই ইমেল অ্যাড্রেস দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট তৈরি করা হয়েছে।";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errMsg = lang === "en" ? "Invalid email or password." : "ভুল ইমেল অথবা পাসওয়ার্ড।";
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
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

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 flex items-center justify-center gap-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs text-slate-800 font-medium text-xs transition cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {lang === "en" ? "Continue with Google" : "গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করুন"}
          </span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-[#FDFCF9] px-2 text-[10px] uppercase font-bold text-slate-400">
            {lang === "en" ? "or continue with email" : "অথবা ইমেইল দিয়ে প্রবেশ করুন"}
          </span>
        </div>

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
