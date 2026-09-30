/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CourseCatalog from "./components/CourseCatalog";
import CourseDetails from "./components/CourseDetails";
import RecipeManager from "./components/RecipeManager";
import LiveClasses from "./components/LiveClasses";
import BlogSection from "./components/BlogSection";
import FooterContactForm from "./components/FooterContactForm";
import PaymentModal from "./components/PaymentModal";
import CertificateModal from "./components/CertificateModal";

// New Components for Visitor Experience & Admin Approval Flows
import AuthModal from "./components/AuthModal";
import WelcomeEmailModal from "./components/WelcomeEmailModal";
import VisitorLanding from "./components/VisitorLanding";
import PendingApprovalView from "./components/PendingApprovalView";
import AdminSimulationPanel from "./components/AdminSimulationPanel";
import StudentPortal from "./components/StudentPortal";
import AdminPanel from "./components/AdminPanel";
import CertificateVerification from "./components/CertificateVerification";
import EnrollmentModal from "./components/EnrollmentModal";
import { OurChefs } from "./components/OurChefs";
import Policies from "./components/Policies";
import AboutUs from "./components/AboutUs";
import ChefJobAccommodation from "./components/ChefJobAccommodation";
import Gallery from "./components/Gallery";

// Dedicated Strict Authentication Pages (No guest bypass)
import PortalLoginPage from "./components/PortalLoginPage";
import StudentRegisterPage from "./components/StudentRegisterPage";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminRegisterPage from "./components/AdminRegisterPage";
import SuperAdminSetupPage from "./components/SuperAdminSetupPage";

import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Music, Youtube, Lock, ShieldAlert, AlertTriangle } from "lucide-react";
import { Language, Course, Recipe, StudentProgress, Badge, UserAccount, EnrollmentApplication } from "./types";
import { INITIAL_COURSES, INITIAL_RECIPES, INITIAL_LIVE_CLASSES, BADGES, MOCK_BLOGS } from "./data/mockData";
import { INITIAL_LMS_USERS, MOCK_ENROLLMENT_APPLICATIONS } from "./data/lmsMockData";
import { TRANSLATIONS } from "./data/translations";
import { db, auth, handleFirestoreError, OperationType } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import lodonexLogo from "./assets/images/lodonex_logo_new_1783662734826.jpg";

export default function App() {
  // Localization state
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("lodonex_lang");
    return (saved as Language) || "en";
  });

  // Save selected language to localStorage
  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("lodonex_lang", newLang);
  };

  // URL and Navigation state
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || "/");
  const [redirectNotice, setRedirectNotice] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Shopping Cart state
  const [cart, setCart] = useState<Course[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Certificate Modal state
  const [selectedCertCourse, setSelectedCertCourse] = useState<Course | null>(null);

  // Course Enrollment Workflow modal state
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState<boolean>(false);
  const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);

  // Certificate Public Verification Query
  const [verifyCertQuery, setVerifyCertQuery] = useState<string>("");

  // Auth modal open state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Welcome Email Modal open state
  const [isWelcomeEmailOpen, setIsWelcomeEmailOpen] = useState<boolean>(false);

  // Stored enrollment applications
  const [enrollmentsList, setEnrollmentsList] = useState<EnrollmentApplication[]>(() => {
    const saved = localStorage.getItem("lodonex_enrollments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return MOCK_ENROLLMENT_APPLICATIONS;
  });

  // Database of Registered Users with Firestore + Local fallback (Seeded with INITIAL_LMS_USERS)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("lodonex_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_LMS_USERS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("lodonex_current_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      } catch (e) {}
    }
    return null;
  });

  // Navigation router function
  const navigate = (path: string, notice?: string) => {
    if (notice) {
      setRedirectNotice(notice);
    } else {
      setRedirectNotice("");
    }
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleEnrollNow = (course: Course) => {
    if (!currentUser) {
      navigate(
        "/portal/login",
        lang === "en"
          ? "Please log in or create a student account to apply for course enrollment."
          : "কোর্সে আবেদন করার জন্য প্রথমে লগইন বা অ্যাকাউন্ট তৈরি করুন।"
      );
      return;
    }
    setEnrollingCourse(course);
    setIsEnrollmentOpen(true);
  };

  // Rule #6: Do NOT grant course access immediately when student submits application.
  // Access must wait until Admin reviews and marks as approved!
  const handleEnrollmentSubmitted = (app: EnrollmentApplication) => {
    const updated = [app, ...enrollmentsList.filter((e) => e.id !== app.id)];
    setEnrollmentsList(updated);
    localStorage.setItem("lodonex_enrollments", JSON.stringify(updated));

    // Show brief feedback and navigate to student dashboard courses
    navigate("/student/courses");
  };

  // Admin approval of an enrollment
  const handleApproveEnrollment = (appId: string) => {
    const targetApp = enrollmentsList.find((e) => e.id === appId);
    if (!targetApp) return;

    const updated = enrollmentsList.map((e) =>
      e.id === appId ? { ...e, status: "approved" as const } : e
    );
    setEnrollmentsList(updated);
    localStorage.setItem("lodonex_enrollments", JSON.stringify(updated));

    if (
      currentUser &&
      (currentUser.id === targetApp.studentId ||
        currentUser.email.toLowerCase() === targetApp.studentEmail.toLowerCase())
    ) {
      const updatedUser: UserAccount = {
        ...currentUser,
        assignedCourseIds: Array.from(
          new Set([...(currentUser.assignedCourseIds || []), targetApp.courseId])
        )
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("lodonex_current_user", JSON.stringify(updatedUser));
    }
  };

  // Load and sync users from Firestore on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let querySnapshot;
        try {
          querySnapshot = await getDocs(collection(db, "users"));
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.LIST, "users");
          return;
        }

        if (querySnapshot.empty) {
          // Seed initial default user
          const defaultUser: UserAccount = {
            id: "default-student-1",
            name: "Tasnim Rahman",
            email: "tasnim@example.com",
            status: "approved",
            progress: {
              enrolledCourses: [],
              completedLessons: [],
              quizScores: {},
              customRecipes: [],
              badges: [],
            },
          };
          try {
            await setDoc(doc(db, "users", defaultUser.id), defaultUser);
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.WRITE, `users/${defaultUser.id}`);
          }
          setUsers([defaultUser]);
        } else {
          const loadedUsers: UserAccount[] = [];
          querySnapshot.forEach((docSnap) => {
            loadedUsers.push(docSnap.data() as UserAccount);
          });
          setUsers(loadedUsers);
        }
      } catch (err) {
        console.error("Error loading users from Firestore, falling back to local storage:", err);
        const saved = localStorage.getItem("lodonex_users");
        if (saved) {
          try {
            setUsers(JSON.parse(saved));
          } catch (e) {
            // fallback to default
          }
        } else {
          // Seed initial default user
          const defaultUser: UserAccount = {
            id: "default-student-1",
            name: "Tasnim Rahman",
            email: "tasnim@example.com",
            status: "approved",
            progress: {
              enrolledCourses: [],
              completedLessons: [],
              quizScores: {},
              customRecipes: [],
              badges: [],
            },
          };
          setUsers([defaultUser]);
        }
      }
    };
    fetchUsers();
  }, []);

  // Listen to Firebase auth state changes to restore session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userDoc;
          try {
            userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.GET, `users/${firebaseUser.uid}`);
            return;
          }

          if (userDoc && userDoc.exists()) {
            setCurrentUser(userDoc.data() as UserAccount);
          }
        } catch (err) {
          console.error("Error restoring user session:", err);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Persist state to local cache for offline/instant availability
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("lodonex_users", JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("lodonex_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("lodonex_current_user");
    }
  }, [currentUser]);

  // Sync user state changes back to the users list and Firestore
  const updateCurrentUserProgress = async (newProgress: StudentProgress) => {
    if (!currentUser) return;
    const updatedUser: UserAccount = { ...currentUser, progress: newProgress };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    try {
      await setDoc(doc(db, "users", currentUser.id), updatedUser);
    } catch (err) {
      console.error("Error updating user progress in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.id}`);
    }
  };

  const t = TRANSLATIONS[lang];

  // Auth success handler
  const handleAuthSuccess = async (user: UserAccount, isNewSignup?: boolean) => {
    if (!users.some((u) => u.id === user.id)) {
      setUsers((prev) => [...prev, user]);
      try {
        await setDoc(doc(db, "users", user.id), user);
      } catch (err) {
        console.error("Error saving user to Firestore in auth success:", err);
        handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
      }
    }
    setCurrentUser(user);
    setIsAuthOpen(false);

    const userRole = user.role || "";
    if (userRole === "trainer") {
      navigate("/trainer/dashboard");
    } else if (["super_admin", "superadmin", "admin", "staff"].includes(userRole)) {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }

    // Trigger Lodonex Welcome & Confirmation Email for visitors/students
    if (isNewSignup || user.email.toLowerCase() !== "lodonexcookingacademy@gmail.com") {
      setIsWelcomeEmailOpen(true);
    }
  };

  // Log Out Handler
  const handleLogOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Error signing out of Firebase:", err);
    }
    setCurrentUser(null);
    localStorage.removeItem("lodonex_current_user");
    setCart([]);
    navigate("/");
  };

  // Cart operations
  const handleAddToCart = (course: Course) => {
    if (!currentUser) {
      // Prompt random visitor to sign up first so we can assign their enrollment properly
      setIsAuthOpen(true);
      return;
    }
    if (cart.some((item) => item.id === course.id)) return;
    setCart([...cart, course]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (courseId: string) => {
    setCart(cart.filter((item) => item.id !== courseId));
  };

  // Lesson Progression Operations
  const handleMarkLessonComplete = (lessonId: string, quizScore?: number) => {
    if (!currentUser) return;
    const prev = currentUser.progress;
    if (prev.completedLessons.includes(lessonId)) return;

    const updatedCompleted = [...prev.completedLessons, lessonId];
    const updatedScores = quizScore !== undefined
      ? { ...prev.quizScores, [lessonId]: quizScore }
      : prev.quizScores;

    const updatedBadges = [...prev.badges];

    // Check if "Culinary Theorist" badge needs to unlock
    if (quizScore === 100 && !updatedBadges.some((b) => b.id === "badge-quiz")) {
      updatedBadges.push(BADGES[1]);
    }

    // Check if "Master Chef Graduate" badge needs to unlock for completing all lessons of any course
    const completedAllOfAnyCourse = INITIAL_COURSES.some((course) => {
      if (!prev.enrolledCourses.includes(course.id)) return false;
      return course.lessons.every((les) => updatedCompleted.includes(les.id));
    });

    if (completedAllOfAnyCourse && !updatedBadges.some((b) => b.id === "badge-graduate")) {
      updatedBadges.push(BADGES[3]);
    }

    updateCurrentUserProgress({
      ...prev,
      completedLessons: updatedCompleted,
      quizScores: updatedScores,
      badges: updatedBadges,
    });
  };

  // Recipe Operations
  const handleAddCustomRecipe = (newRecipe: Recipe) => {
    if (!currentUser) return;
    const prev = currentUser.progress;
    const updatedCustom = [newRecipe, ...prev.customRecipes];
    const updatedBadges = [...prev.badges];

    // Unlock "Creative Alchemist" badge for first recipe
    if (!updatedBadges.some((b) => b.id === "badge-recipe")) {
      updatedBadges.push(BADGES[2]);
    }

    updateCurrentUserProgress({
      ...prev,
      customRecipes: updatedCustom,
      badges: updatedBadges,
    });
  };

  const handleDeleteCustomRecipe = (recipeId: string) => {
    if (!currentUser) return;
    const prev = currentUser.progress;
    updateCurrentUserProgress({
      ...prev,
      customRecipes: prev.customRecipes.filter((r) => r.id !== recipeId),
    });
  };

  // Payment Completion Handler
  const handlePaymentSuccess = (purchasedCourses: Course[]) => {
    if (!currentUser) return;
    const prev = currentUser.progress;
    const newEnrolled = [...prev.enrolledCourses];
    purchasedCourses.forEach((c) => {
      if (!newEnrolled.includes(c.id)) {
        newEnrolled.push(c.id);
      }
    });

    const updatedBadges = [...prev.badges];
    // Ensure Gastronomy Pioneer badge is unlocked
    if (!updatedBadges.some((b) => b.id === "badge-first")) {
      updatedBadges.push(BADGES[0]);
    }

    updateCurrentUserProgress({
      ...prev,
      enrolledCourses: newEnrolled,
      badges: updatedBadges,
    });

    // Clear Cart
    setCart([]);
  };

  const handleSelectCourse = (course: Course) => {
    // Intercept if they are pending admin approval
    if (currentUser && currentUser.status === "pending") {
      setCurrentTab("dashboard");
      return;
    }
    setSelectedCourse(course);
    setCurrentTab("course-detail");
  };

  // Active student progress helper or empty default for visitors
  const activeProgress: StudentProgress = currentUser
    ? currentUser.progress
    : {
        enrolledCourses: [],
        completedLessons: [],
        quizScores: {},
        customRecipes: [],
        badges: [],
      };

  // Sandbox simulation operations
  const handleUpdateUserStatus = async (userId: string, status: "pending" | "approved") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    // If updating currently logged in user, apply state change instantly
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status } : null));
    }

    try {
      const userDocRef = doc(db, "users", userId);
      let docSnap;
      try {
        docSnap = await getDoc(userDocRef);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.GET, `users/${userId}`);
        return;
      }

      if (docSnap && docSnap.exists()) {
        try {
          await setDoc(userDocRef, { ...docSnap.data(), status }, { merge: true });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `users/${userId}`);
        }
      }
    } catch (err) {
      console.error("Error updating user status in Firestore:", err);
    }
  };

  const handleAddSimulatedUser = async () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const simulated: UserAccount = {
      id: `user-sim-${Date.now()}`,
      name: `Chef In-Training ${randomNum}`,
      email: `student${randomNum}@lodonex.edu.bd`,
      status: "pending",
      progress: {
        enrolledCourses: [],
        completedLessons: [],
        quizScores: {},
        customRecipes: [],
        badges: [],
      },
    };
    setUsers((prev) => [...prev, simulated]);

    try {
      await setDoc(doc(db, "users", simulated.id), simulated);
    } catch (err) {
      console.error("Error creating simulated user in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${simulated.id}`);
    }
  };

  const handleResetSimulation = () => {
    localStorage.removeItem("lodonex_users");
    localStorage.removeItem("lodonex_current_user");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-150 transition-colors duration-200">
      {/* Navigation Header */}
      <Header
        currentTab={selectedCourse ? "course-detail" : currentTab}
        setCurrentTab={(tab) => {
          setSelectedCourse(null);
          setCurrentTab(tab);
          if (tab === "courses") navigate("/courses");
          else if (tab === "verify-cert") navigate("/verify-cert");
          else if (tab === "dashboard") navigate(currentUser ? (["superadmin", "admin", "trainer"].includes(currentUser.role || "") ? "/admin/dashboard" : "/student/dashboard") : "/");
        }}
        lang={lang}
        setLang={handleSetLang}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        onOpenAuth={() => navigate("/portal/login")}
        onLogOut={handleLogOut}
        onOpenWelcomeEmail={() => setIsWelcomeEmailOpen(true)}
        onNavigate={navigate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16">
        {/* ========================================================
            DEDICATED ROUTE 1: /portal/login
           ======================================================== */}
        {(currentPath === "/setup/super-admin" || currentPath === "/admin/setup") ? (
          <SuperAdminSetupPage
            lang={lang}
            onSetupSuccess={(user) => {
              setUsers((prev) => [user, ...prev.filter((u) => u.id !== user.id)]);
            }}
            onNavigate={navigate}
          />
        ) : currentPath === "/portal/login" ? (
          <PortalLoginPage
            lang={lang}
            onLoginSuccess={(user) => handleAuthSuccess(user, false)}
            onNavigate={navigate}
            redirectMessage={redirectNotice}
            existingUsers={users}
          />
        ) : /* ========================================================
            DEDICATED ROUTE 2: /portal/register & /portal/signup (STUDENT ONLY)
           ======================================================== */
        (currentPath === "/portal/register" || currentPath === "/portal/signup") ? (
          <StudentRegisterPage
            lang={lang}
            onRegisterSuccess={(user) => handleAuthSuccess(user, true)}
            onNavigate={navigate}
            existingUsers={users}
          />
        ) : /* ========================================================
            DEDICATED ROUTE 3: /team/register & /admin/signup (ROLE SELECTION)
           ======================================================== */
        (currentPath === "/team/register" || currentPath === "/admin/signup") ? (
          <AdminRegisterPage
            lang={lang}
            onNavigate={navigate}
            existingUsers={users}
          />
        ) : /* ========================================================
            DEDICATED ROUTE 4: /team/login & /admin/login
           ======================================================== */
        (currentPath === "/team/login" || currentPath === "/admin/login") ? (
          <AdminLoginPage
            lang={lang}
            onLoginSuccess={(user) => handleAuthSuccess(user, false)}
            onNavigate={navigate}
            redirectMessage={redirectNotice}
            existingUsers={users}
          />
        ) : /* ========================================================
            DEDICATED ROUTE 4: /student/* (STRICT ACCESS CONTROL)
           ======================================================== */
        currentPath.startsWith("/student") ? (
          !currentUser ? (
            /* Redirect unauthenticated visitor to /portal/login */
            <PortalLoginPage
              lang={lang}
              onLoginSuccess={(user) => handleAuthSuccess(user, false)}
              onNavigate={navigate}
              existingUsers={users}
              redirectMessage={
                lang === "en"
                  ? "Please log in to access your student portal."
                  : "শিক্ষার্থী পোর্টালে প্রবেশের জন্য অনুগ্রহ করে লগইন করুন।"
              }
            />
          ) : (
            <StudentPortal
              lang={lang}
              currentUser={currentUser}
              courses={INITIAL_COURSES}
              enrollments={enrollmentsList}
              initialSubTab={currentPath.replace("/student/", "").replace("/student", "") || "dashboard"}
              onSubTabChange={(subTab) => navigate(`/student/${subTab}`)}
              onBrowseCourses={() => navigate("/courses")}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course.id}`);
              }}
              onViewCertificateModal={(course) => setSelectedCertCourse(course)}
              onVerifyCertificatePublic={(certNum) => {
                setVerifyCertQuery(certNum);
                navigate("/verify-cert");
              }}
            />
          )
        ) : /* ========================================================
            DEDICATED ROUTE 5: /admin/* (STRICT RBAC & 403 FORBIDDEN)
           ======================================================== */
        currentPath.startsWith("/admin") ? (
          !currentUser ? (
            /* Redirect unauthenticated user to /admin/login */
            <AdminLoginPage
              lang={lang}
              onLoginSuccess={(user) => handleAuthSuccess(user, false)}
              onNavigate={navigate}
              existingUsers={users}
              redirectMessage={
                lang === "en"
                  ? "Please sign in to access the administration portal."
                  : "অ্যাডমিন পোর্টালে প্রবেশের জন্য অনুগ্রহ করে সাইন ইন করুন।"
              }
            />
          ) : currentUser.role === "student" ? (
            /* Security Rule #9: Students are forbidden from admin dashboard */
            <div className="max-w-xl mx-auto my-12 p-8 bg-red-50 border-2 border-red-300 text-center space-y-4 shadow-sm">
              <div className="h-14 w-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-mono">
                403
              </div>
              <h2 className="font-serif font-extrabold text-2xl text-red-900">
                {lang === "en" ? "403 Forbidden: Access Denied" : "৪০৩ নিষিদ্ধ: অ্যাক্সেস অস্বীকৃত"}
              </h2>
              <p className="text-xs text-red-700 leading-relaxed">
                {lang === "en"
                  ? "Security Policy Rule #9: Student apprentice accounts are strictly prohibited from accessing administrator consoles and faculty dashboards. All unauthorized attempts are logged for security compliance."
                  : "নিরাপত্তা নীতি ৯: শিক্ষার্থীদের প্রশাসনিক পোর্টালে প্রবেশ সম্পূর্ণ নিষিদ্ধ। অননুমোদিত চেষ্টা নিরাপত্তা কারণে লিপিবদ্ধ করা হচ্ছে।"}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition shadow-xs"
                >
                  {lang === "en" ? "Return to Student Dashboard" : "শিক্ষার্থী ড্যাশবোর্ডে ফিরুন"}
                </button>
              </div>
            </div>
          ) : (
            /* Authorized Super Admin, Admin, Trainer */
            <AdminPanel
              lang={lang}
              currentUser={currentUser}
              courses={INITIAL_COURSES}
              initialEnrollments={enrollmentsList}
              onApproveEnrollmentGlobal={handleApproveEnrollment}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course.id}`);
              }}
              onUpdateUserAccount={(u) =>
                setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)))
              }
              initialUsers={users}
            />
          )
        ) : /* ========================================================
            DEDICATED ROUTE 6: /trainer/* (TRAINER FACULTY RBAC)
           ======================================================== */
        currentPath.startsWith("/trainer") ? (
          !currentUser ? (
            <AdminLoginPage
              lang={lang}
              onLoginSuccess={(user) => handleAuthSuccess(user, false)}
              onNavigate={navigate}
              existingUsers={users}
              redirectMessage={
                lang === "en"
                  ? "Please sign in with your trainer credentials to access the faculty dashboard."
                  : "ফ্যাকাল্টি ড্যাশবোর্ডে প্রবেশের জন্য ট্রেইনার আইডি দিয়ে সাইন ইন করুন।"
              }
            />
          ) : currentUser.role === "student" ? (
            <div className="max-w-xl mx-auto my-12 p-8 bg-red-50 border-2 border-red-300 text-center space-y-4 shadow-sm">
              <div className="h-14 w-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-mono">
                403
              </div>
              <h2 className="font-serif font-extrabold text-2xl text-red-900">
                {lang === "en" ? "403 Forbidden: Access Denied" : "৪০৩ নিষিদ্ধ: অ্যাক্সেস অস্বীকৃত"}
              </h2>
              <p className="text-xs text-red-700 leading-relaxed">
                {lang === "en"
                  ? "Student accounts cannot access faculty and trainer dashboards."
                  : "শিক্ষার্থী অ্যাকাউন্ট দিয়ে ট্রেইনার ড্যাশবোর্ডে প্রবেশ নিষিদ্ধ।"}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition shadow-xs"
                >
                  {lang === "en" ? "Return to Student Dashboard" : "শিক্ষার্থী ড্যাশবোর্ডে ফিরুন"}
                </button>
              </div>
            </div>
          ) : (
            <AdminPanel
              lang={lang}
              currentUser={currentUser}
              courses={INITIAL_COURSES}
              initialEnrollments={enrollmentsList}
              onApproveEnrollmentGlobal={handleApproveEnrollment}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course.id}`);
              }}
              onUpdateUserAccount={(u) =>
                setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)))
              }
              initialUsers={users}
            />
          )
        ) : /* ========================================================
            DEDICATED ROUTE 6: /courses/:slug
           ======================================================== */
        currentPath.startsWith("/courses/") ? (
          (() => {
            const slug = currentPath.replace("/courses/", "").trim();
            const matchedCourse =
              INITIAL_COURSES.find(
                (c) =>
                  c.id === slug ||
                  c.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug ||
                  (slug === "level-1-culinary-foundation" && c.id === "course-1") ||
                  (slug === "professional-chef-course" && c.id === "course-2") ||
                  (slug === "master-pastry-baking" && c.id === "course-3") ||
                  (slug === "bengali-culinary-heritage" && c.id === "course-4")
              ) || INITIAL_COURSES[0];

            return (
              <CourseDetails
                lang={lang}
                course={matchedCourse}
                progress={activeProgress}
                onBack={() => navigate("/courses")}
                onMarkLessonComplete={handleMarkLessonComplete}
                onViewCertificate={(course) => setSelectedCertCourse(course)}
                isLoggedIn={!!currentUser}
                onOpenAuth={() => navigate("/portal/login")}
                currentUser={currentUser}
                onEnrollNow={(course) => handleEnrollNow(course)}
              />
            );
          })()
        ) : /* ========================================================
            DEDICATED ROUTE 7: /courses
           ======================================================== */
        currentPath === "/courses" ? (
          <CourseCatalog
            lang={lang}
            courses={INITIAL_COURSES}
            progress={activeProgress}
            cart={cart}
            onAddToCart={handleAddToCart}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              navigate(`/courses/${course.id}`);
            }}
            onEnrollNow={handleEnrollNow}
          />
        ) : /* ========================================================
            DEDICATED ROUTE 8: /verify-cert
           ======================================================== */
        currentPath === "/verify-cert" ? (
          <CertificateVerification
            lang={lang}
            initialCertNumber={verifyCertQuery}
            onNavigateToCourse={(courseId) => {
              const target = INITIAL_COURSES.find((c) => c.id === courseId);
              if (target) {
                setSelectedCourse(target);
                navigate(`/courses/${target.id}`);
              }
            }}
          />
        ) : selectedCourse ? (
          <CourseDetails
            lang={lang}
            course={selectedCourse}
            progress={activeProgress}
            onBack={() => {
              setSelectedCourse(null);
            }}
            onMarkLessonComplete={handleMarkLessonComplete}
            onViewCertificate={(course) => setSelectedCertCourse(course)}
            isLoggedIn={!!currentUser}
            onOpenAuth={() => navigate("/portal/login")}
            currentUser={currentUser}
            onEnrollNow={(course) => handleEnrollNow(course)}
          />
        ) : (
          <>
            {/* Dashboard Rendering based on User Role (Visitor vs Staff Admin vs Pending vs Approved Student) */}
            {currentTab === "dashboard" && (
              <>
                {!currentUser ? (
                  /* Public Visitor Landing Experience */
                  <VisitorLanding
                    lang={lang}
                    onOpenAuth={() => navigate("/portal/login")}
                    courses={INITIAL_COURSES}
                    onSelectTab={(tab) => {
                      if (tab === "courses") navigate("/courses");
                      else if (tab === "verify-cert") navigate("/verify-cert");
                      else setCurrentTab(tab);
                    }}
                    onSelectCourse={(course) => {
                      setSelectedCourse(course);
                      navigate(`/courses/${course.id}`);
                    }}
                  />
                ) : ["superadmin", "admin", "trainer"].includes(currentUser.role || "") ? (
                  /* Admin & Trainer Management Portal */
                  <AdminPanel
                    lang={lang}
                    currentUser={currentUser}
                    courses={INITIAL_COURSES}
                    initialEnrollments={enrollmentsList}
                    onApproveEnrollmentGlobal={handleApproveEnrollment}
                    onSelectCourse={handleSelectCourse}
                    onUpdateUserAccount={(u) =>
                      setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)))
                    }
                    initialUsers={users}
                  />
                ) : currentUser.status === "pending" ? (
                  /* Pending Student Section waiting for Admin Approval */
                  <PendingApprovalView
                    lang={lang}
                    currentUser={currentUser}
                    onSimulateApprove={() => handleUpdateUserStatus(currentUser.id, "approved")}
                  />
                ) : (
                  /* Full Student Panel LMS for Approved & Active Apprentices */
                  <StudentPortal
                    lang={lang}
                    currentUser={currentUser}
                    courses={INITIAL_COURSES}
                    enrollments={enrollmentsList}
                    initialSubTab="dashboard"
                    onSubTabChange={(subTab) => navigate(`/student/${subTab}`)}
                    onBrowseCourses={() => navigate("/courses")}
                    onSelectCourse={(course) => {
                      setSelectedCourse(course);
                      navigate(`/courses/${course.id}`);
                    }}
                    onViewCertificateModal={(course) => setSelectedCertCourse(course)}
                    onVerifyCertificatePublic={(certNum) => {
                      setVerifyCertQuery(certNum);
                      navigate("/verify-cert");
                    }}
                  />
                )}
              </>
            )}

            {/* Direct Admin Portal Tab */}
            {currentTab === "admin" && (
              !currentUser ? (
                <AdminLoginPage
                  lang={lang}
                  onLoginSuccess={(user) => handleAuthSuccess(user, false)}
                  onNavigate={navigate}
                  existingUsers={users}
                  redirectMessage={
                    lang === "en"
                      ? "Please sign in to access the administration portal."
                      : "অ্যাডমিন পোর্টালে প্রবেশের জন্য অনুগ্রহ করে সাইন ইন করুন।"
                  }
                />
              ) : currentUser.role === "student" ? (
                <div className="max-w-xl mx-auto my-12 p-8 bg-red-50 border-2 border-red-300 text-center space-y-4 shadow-sm">
                  <div className="h-14 w-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-mono">
                    403
                  </div>
                  <h2 className="font-serif font-extrabold text-2xl text-red-900">
                    403 Forbidden: Access Denied
                  </h2>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Student accounts are not authorized to access the administration portal.
                  </p>
                  <button
                    onClick={() => navigate("/student/dashboard")}
                    className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Return to Student Dashboard
                  </button>
                </div>
              ) : (
                <AdminPanel
                  lang={lang}
                  currentUser={currentUser}
                  courses={INITIAL_COURSES}
                  initialEnrollments={enrollmentsList}
                  onApproveEnrollmentGlobal={handleApproveEnrollment}
                  onSelectCourse={handleSelectCourse}
                  onUpdateUserAccount={(u) =>
                    setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)))
                  }
                  initialUsers={users}
                />
              )
            )}

            {/* Public Certificate Verification Page */}
            {currentTab === "verify-cert" && (
              <CertificateVerification
                lang={lang}
                initialCertNumber={verifyCertQuery}
                onNavigateToCourse={(courseId) => {
                  const target = INITIAL_COURSES.find((c) => c.id === courseId);
                  if (target) {
                    setSelectedCourse(target);
                    setCurrentTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}

            {currentTab === "courses" && (
              <CourseCatalog
                lang={lang}
                courses={INITIAL_COURSES}
                progress={activeProgress}
                cart={cart}
                onAddToCart={handleAddToCart}
                onSelectCourse={handleSelectCourse}
                onEnrollNow={handleEnrollNow}
              />
            )}

            {currentTab === "recipes" && (
              <>
                {!currentUser ? (
                  /* Visitor Blocked Notice */
                  <div id="recipes-visitor-cta" className="max-w-md mx-auto py-12 px-6 bg-white border border-editorial-border text-center space-y-4">
                    <div className="h-12 w-12 mx-auto bg-[#F7F5F0] border border-editorial-border text-editorial-accent flex items-center justify-center">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif font-bold text-base text-editorial-dark">
                        {lang === "en" ? "Bespoke Recipe Journal" : "ব্যক্তিগত রেসিপি জার্নাল"}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {lang === "en"
                          ? "The interactive recipe catalog and cookbook journal is reserved for active student apprentices. Register or sign in with your email to build your culinary collections."
                          : "ইন্টারেক্টিভ রেসিপি ডায়েরি এবং রান্নার জার্নাল অপশনটি শুধুমাত্র একাডেমির সক্রিয় শিক্ষার্থীদের জন্য। আপনার নিজস্ব রেসিপি সংরক্ষণ করতে সাইন আপ বা লগইন করুন।"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="px-5 py-2.5 bg-editorial-accent hover:bg-red-800 text-white text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      {lang === "en" ? "Sign Up / Log In" : "সাইন আপ / লগইন"}
                    </button>
                  </div>
                ) : currentUser.status === "pending" ? (
                  /* Pending State Block */
                  <PendingApprovalView
                    lang={lang}
                    currentUser={currentUser}
                    onSimulateApprove={() => handleUpdateUserStatus(currentUser.id, "approved")}
                  />
                ) : (
                  /* Full Access Recipe Journal */
                  <RecipeManager
                    lang={lang}
                    progress={activeProgress}
                    onAddCustomRecipe={handleAddCustomRecipe}
                    onDeleteCustomRecipe={handleDeleteCustomRecipe}
                    defaultRecipes={INITIAL_RECIPES}
                  />
                )}
              </>
            )}

            {currentTab === "live" && (
              <LiveClasses
                lang={lang}
                liveClasses={INITIAL_LIVE_CLASSES}
              />
            )}

            {currentTab === "blogs" && (
              <BlogSection
                lang={lang}
                blogs={MOCK_BLOGS}
                onSelectCourse={(courseId) => {
                  const course = INITIAL_COURSES.find((c) => c.id === courseId);
                  if (course) {
                    setSelectedCourse(course);
                    setCurrentTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}

            {currentTab === "chefs" && (
              <OurChefs
                lang={lang}
                onSelectCourse={(courseId) => {
                  const target = INITIAL_COURSES.find((c) => c.id === courseId);
                  if (target) {
                    setSelectedCourse(target);
                    setCurrentTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}

            {["terms", "refund", "privacy"].includes(currentTab) && (
              <Policies
                lang={lang}
                policyType={currentTab as "terms" | "refund" | "privacy"}
                onBackToCourses={() => {
                  setSelectedCourse(null);
                  setCurrentTab("courses");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "jobs" && (
              <ChefJobAccommodation
                lang={lang}
                onSelectCourse={(courseId) => {
                  const target = INITIAL_COURSES.find((c) => c.id === courseId);
                  if (target) {
                    setSelectedCourse(target);
                    setCurrentTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}

            {currentTab === "gallery" && (
              <Gallery
                lang={lang}
                onSelectCourse={(courseId) => {
                  const target = INITIAL_COURSES.find((c) => c.id === courseId);
                  if (target) {
                    setSelectedCourse(target);
                    setCurrentTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}

            {currentTab === "about" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <AboutUs
                  lang={lang}
                  onNavigateToJobs={() => {
                    setCurrentTab("jobs");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onNavigateToCourses={() => {
                    setCurrentTab("courses");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Interactive Mobile Wallet Online Payments Simulator */}
      <PaymentModal
        lang={lang}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Course Enrollment & Admissions Workflow Modal */}
      <EnrollmentModal
        lang={lang}
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        course={enrollingCourse}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onEnrollmentSubmitted={handleEnrollmentSubmitted}
      />

      {/* Credentials Diploma Visualizer */}
      <CertificateModal
        lang={lang}
        isOpen={selectedCertCourse !== null}
        onClose={() => setSelectedCertCourse(null)}
        course={selectedCertCourse}
        studentName={currentUser ? currentUser.name : "Guest Apprentice"}
      />


      {/* Editorial Contact & Brand Footer */}
      <footer id="app-footer" className="border-t border-editorial-border bg-[#1A1A1A] text-[#F5F2EB] py-12 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
            {/* Column 1: About Us & Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-11 w-11 bg-white border border-editorial-border overflow-hidden flex items-center justify-center">
                  <img
                    src={lodonexLogo}
                    alt="Lodonex Logo"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-serif font-extrabold text-base tracking-tight text-white block">
                    Lodonex
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-white font-serif font-bold text-xs italic">
                  {lang === "en" ? "Lodonex Cooking Academy" : "লোডোনেক্স কুকিং একাডেমি"}
                </h4>
                <p className="text-[#E5E2D9]/70 leading-relaxed text-[11px]">
                  {lang === "en"
                    ? "Widely recognized as Bangladesh's best cooking academy, Lodonex is the premier institute for professional culinary education. We deliver Michelin-standard practical mastery in traditional Bengali heritage gastronomy, classical pastry arts, commercial baking, and advanced kitchen management. Our students graduate with globally verified digital certificates and elite career placements."
                    : "বাংলাদেশের সেরা কুকিং একাডেমি হিসেবে দেশজুড়ে স্বীকৃত, লোডোনেক্স হলো প্রফেশনাল রন্ধন শিক্ষার শ্রেষ্ঠ প্রতিষ্ঠান। আমরা ঐতিহ্যবাহী বাঙালি রান্না, ক্লাসিকাল পেস্ট্রি আর্ট, কমার্শিয়াল বেকিং এবং উন্নত কিচেন ম্যানেজমেন্টের ওপর সরাসরি বিশ্বমানের প্রশিক্ষণ প্রদান করি। আমাদের শিক্ষার্থীরা আন্তর্জাতিক মানসম্পন্ন ডিজিটাল সার্টিফিকেট ও নিশ্চিত ক্যারিয়ার গাইডেন্স পেয়ে থাকেন।"}
                </p>
              </div>
              <p className="text-[10px] text-[#E5E2D9]/50 font-mono">
                SECURE CLIENT PORTAL • PLATFORM VERSION 1.4
              </p>
            </div>

            {/* Column 2: Quick Links & Policies */}
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm tracking-wider text-white italic">
                  {lang === "en" ? "Academy Navigation" : "একাডেমি নেভিগেশন"}
                </h4>
                <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-[#E5E2D9]/80 font-medium">
                  {[
                    { id: "dashboard", label: t.studentDashboard },
                    { id: "courses", label: t.ourCourses },
                    { id: "verify-cert", label: lang === "en" ? "Verify Certificate" : "সার্টিফিকেট যাচাই" },
                    { id: "recipes", label: t.myRecipes },
                    { id: "chefs", label: t.ourChefs },
                    { id: "live", label: t.liveMasterclass },
                    { id: "blogs", label: t.blogs },
                    { id: "jobs", label: t.chefJobsAccommodation || (lang === "en" ? "Job & Accommodation" : "চাকরি ও আবাসন") },
                    { id: "gallery", label: t.gallery || (lang === "en" ? "Gallery" : "গ্যালারি") },
                    { id: "about", label: lang === "en" ? "About Us" : "আমাদের সম্পর্কে" },
                  ].map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => {
                          if (link.id === "courses") {
                            navigate("/courses");
                          } else if (link.id === "verify-cert") {
                            navigate("/verify-cert");
                          } else if (link.id === "dashboard") {
                            navigate(
                              currentUser
                                ? ["superadmin", "admin", "trainer"].includes(currentUser.role || "")
                                  ? "/admin/dashboard"
                                  : "/student/dashboard"
                                : "/portal/login"
                            );
                          } else {
                            setSelectedCourse(null);
                            setCurrentTab(link.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="hover:text-editorial-accent transition-colors text-left cursor-pointer"
                      >
                        • {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-editorial-border/30 space-y-2">
                <h4 className="font-serif font-bold text-xs tracking-wider text-white italic">
                  {lang === "en" ? "Policies & Information" : "পলিসি ও নীতিমালা"}
                </h4>
                <ul className="space-y-1.5 text-[11px] text-[#E5E2D9]/70 font-medium">
                  {[
                    { id: "terms", label: lang === "en" ? "Terms & Conditions" : "শর্তাবলী ও নিয়মাবলি" },
                    { id: "refund", label: lang === "en" ? "Refund & Return Policy" : "রিফান্ড ও রিটার্ন পলিসি" },
                    { id: "privacy", label: lang === "en" ? "Privacy Policy" : "গোপনীয়তা নীতিমালা" },
                  ].map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => {
                          setSelectedCourse(null);
                          setCurrentTab(link.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-editorial-accent text-left transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span className="text-editorial-accent font-mono text-[10px]">§</span>
                        <span>{link.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: Contact Us Details */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm tracking-wider text-white italic">
                  {lang === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                </h4>
                <div className="space-y-2 text-[11px] text-[#E5E2D9]/80 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-editorial-accent flex-shrink-0" />
                    <span>
                      {lang === "en"
                        ? "1288/1 Senpara Parbata, Mirpur-10, Dhaka-1215"
                        : "১২৮৮/১ সেনপাড়া পর্বতা, মিরপুর-১০, ঢাকা-১২১৫"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-editorial-accent flex-shrink-0" />
                    <span>+88 01711-924269</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-editorial-accent flex-shrink-0" />
                    <span className="underline">lodonexcookingacademy@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Social Media Row with Brand Colors on Hover */}
              <div id="footer-social-section" className="pt-3.5 border-t border-editorial-border/30 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#E5E2D9]/50 font-bold block font-sans">
                  {lang === "en" ? "Follow Our Journey" : "আমাদের সোশ্যাল মিডিয়া"}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    id="social-instagram"
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-neutral-800 border border-neutral-700 text-[#E5E2D9]/70 hover:bg-[#E1306C]/10 hover:border-[#E1306C] hover:text-[#E1306C] transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    id="social-facebook"
                    href="https://www.facebook.com/lodonex2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-neutral-800 border border-neutral-700 text-[#E5E2D9]/70 hover:bg-[#1877F2]/10 hover:border-[#1877F2] hover:text-[#1877F2] transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    id="social-linkedin"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-neutral-800 border border-neutral-700 text-[#E5E2D9]/70 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    id="social-tiktok"
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    className="p-1.5 bg-neutral-800 border border-neutral-700 text-[#E5E2D9]/70 hover:bg-[#FE2C55]/10 hover:border-[#FE2C55] hover:text-[#FE2C55] transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <Music className="h-4 w-4" />
                  </a>
                  <a
                    id="social-youtube"
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-neutral-800 border border-neutral-700 text-[#E5E2D9]/70 hover:bg-[#FF0000]/10 hover:border-[#FF0000] hover:text-[#FF0000] transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Contact Form */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm tracking-wider text-white italic">
                {lang === "en" ? "Instant Inquiry" : "তাৎক্ষণিক অনুসন্ধান"}
              </h4>
              <FooterContactForm lang={lang} />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-editorial-border/30 text-center text-[#E5E2D9]/50 text-[10px]">
            <p>© 2026 {t.academyName}. All Rights Reserved. Aligned with Professional Culinary standards.</p>
          </div>
        </div>
      </footer>

      {/* Registration & Authentication Portal */}
      <AuthModal
        lang={lang}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        existingUsers={users}
      />

      {/* Official Lodonex Welcome & Confirmation Email Modal */}
      <WelcomeEmailModal
        isOpen={isWelcomeEmailOpen}
        onClose={() => setIsWelcomeEmailOpen(false)}
        user={currentUser}
        lang={lang}
      />

      {/* Floating Sandbox Administration Panel - ONLY accessible by lodonexcookingacademy@gmail.com */}
      {currentUser && currentUser.email.toLowerCase() === "lodonexcookingacademy@gmail.com" && (
        <AdminSimulationPanel
          lang={lang}
          users={users}
          currentUser={currentUser}
          onUpdateUserStatus={handleUpdateUserStatus}
          onAddSimulatedUser={handleAddSimulatedUser}
          onResetSimulation={handleResetSimulation}
        />
      )}
    </div>
  );
}

