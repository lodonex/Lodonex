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
import VisitorLanding from "./components/VisitorLanding";
import PendingApprovalView from "./components/PendingApprovalView";
import AdminSimulationPanel from "./components/AdminSimulationPanel";

import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Music, Youtube, Lock } from "lucide-react";
import { Language, Course, Recipe, StudentProgress, Badge, UserAccount } from "./types";
import { INITIAL_COURSES, INITIAL_RECIPES, INITIAL_LIVE_CLASSES, BADGES, MOCK_BLOGS } from "./data/mockData";
import { TRANSLATIONS } from "./data/translations";

const lodonexLogo = "/src/assets/images/lodonex_logo_1783226863502.jpg";

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

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Shopping Cart state
  const [cart, setCart] = useState<Course[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Certificate Modal state
  const [selectedCertCourse, setSelectedCertCourse] = useState<Course | null>(null);

  // Auth modal open state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Database of Registered Users in LocalStorage
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("lodonex_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    // Default initial user: Tasnim Rahman as an approved user
    return [
      {
        id: "default-student-1",
        name: "Tasnim Rahman",
        email: "tasnim@example.com",
        status: "approved",
        progress: {
          enrolledCourses: ["course-1"],
          completedLessons: ["c1-l1"],
          quizScores: { "c1-l1": 100 },
          customRecipes: [],
          badges: [BADGES[0]], // Gastronomy Pioneer initially unlocked
        },
      },
    ];
  });

  // Current logged in user (starts NULL to give default random visitor experience!)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("lodonex_current_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      } catch (e) {
        // ignore fallback
      }
    }
    return null; // Always load as null for a fresh visitor on initial checkout/page load
  });

  // Persist users & active account state to LocalStorage
  useEffect(() => {
    localStorage.setItem("lodonex_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("lodonex_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("lodonex_current_user");
    }
  }, [currentUser]);

  // Sync user state changes back to the users list
  const updateCurrentUserProgress = (newProgress: StudentProgress) => {
    if (!currentUser) return;
    const updatedUser: UserAccount = { ...currentUser, progress: newProgress };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const t = TRANSLATIONS[lang];

  // Auth success handler (either logged in or signed up)
  const handleAuthSuccess = (user: UserAccount) => {
    // Check if user is newly created or existing
    if (!users.some((u) => u.id === user.id)) {
      setUsers((prev) => [...prev, user]);
    }
    setCurrentUser(user);
    
    // Redirect to active section
    if (user.status === "approved") {
      setCurrentTab("dashboard");
    } else {
      setCurrentTab("dashboard"); // Pending approval notice is displayed inside Dashboard
    }
  };

  // Log Out Handler
  const handleLogOut = () => {
    setCurrentUser(null);
    setCart([]);
    setCurrentTab("dashboard"); // Return back to random visitor welcome layout
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
  const handleUpdateUserStatus = (userId: string, status: "pending" | "approved") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    // If updating currently logged in user, apply state change instantly
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleAddSimulatedUser = () => {
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
        }}
        lang={lang}
        setLang={handleSetLang}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogOut={handleLogOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16">
        {selectedCourse ? (
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
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : (
          <>
            {/* Dashboard Rendering based on User Role (Visitor vs Pending vs Approved Student) */}
            {currentTab === "dashboard" && (
              <>
                {!currentUser ? (
                  /* Random Visitor Landing Section */
                  <VisitorLanding
                    lang={lang}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    courses={INITIAL_COURSES}
                    onSelectTab={(tab) => setCurrentTab(tab)}
                    onSelectCourse={handleSelectCourse}
                  />
                ) : currentUser.status === "pending" ? (
                  /* Pending Student Section waiting for Admin Approval */
                  <PendingApprovalView
                    lang={lang}
                    currentUser={currentUser}
                    onSimulateApprove={() => handleUpdateUserStatus(currentUser.id, "approved")}
                  />
                ) : (
                  /* Approved Student Dashboard */
                  <Dashboard
                    lang={lang}
                    progress={activeProgress}
                    courses={INITIAL_COURSES}
                    onSelectCourse={handleSelectCourse}
                    setCurrentTab={setCurrentTab}
                    onViewCertificate={(course) => setSelectedCertCourse(course)}
                  />
                )}
              </>
            )}

            {currentTab === "courses" && (
              <CourseCatalog
                lang={lang}
                courses={INITIAL_COURSES}
                progress={activeProgress}
                cart={cart}
                onAddToCart={handleAddToCart}
                onSelectCourse={handleSelectCourse}
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
              />
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
                  <span className="text-[9px] uppercase tracking-widest text-[#E5E2D9]/60">
                    {lang === "en" ? "Cooking Academy" : "কুকিং একাডেমি"}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-white font-serif font-bold text-xs italic">
                  {lang === "en" ? "About Us" : "আমাদের সম্পর্কে"}
                </h4>
                <p className="text-[#E5E2D9]/70 leading-relaxed text-[11px]">
                  {lang === "en"
                    ? "Founded by award-winning gastronomy experts, Lodonex is Bangladesh's premier culinary institute. We deliver world-class training in traditional Bengali heritage, commercial baking, continental cuisine, and professional kitchen management, empowering students with verified certifications."
                    : "পুরস্কারপ্রাপ্ত রন্ধন বিশেষজ্ঞদের দ্বারা প্রতিষ্ঠিত, লোডোনেক্স হলো বাংলাদেশের শীর্ষস্থানীয় রন্ধন শিক্ষা কেন্দ্র। আমরা ঐতিহ্যবাহী বাঙালি রান্না, বাণিজ্যিক বেকিং, কন্টিনেন্টাল খাবার এবং রন্ধনপ্রণালীতে বিশ্বমানের শিক্ষা প্রদান করি।"}
                </p>
              </div>
              <p className="text-[10px] text-[#E5E2D9]/50 font-mono">
                SECURE CLIENT PORTAL • PLATFORM VERSION 1.4
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm tracking-wider text-white italic">
                {lang === "en" ? "Academy Navigation" : "একাডেমি নেভিগেশন"}
              </h4>
              <ul className="space-y-2 text-[11px] text-[#E5E2D9]/80 font-medium">
                {[
                  { id: "dashboard", label: t.studentDashboard },
                  { id: "courses", label: t.ourCourses },
                  { id: "recipes", label: t.myRecipes },
                  { id: "live", label: t.liveMasterclass },
                  { id: "blogs", label: t.blogs },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setSelectedCourse(null);
                        setCurrentTab(link.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-editorial-accent transition-colors text-left cursor-pointer"
                    >
                      • {link.label}
                    </button>
                  </li>
                ))}
              </ul>
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
                        ? "Plot 12, Road 11, Banani, Dhaka 1213, Bangladesh"
                        : "প্লট ১২, রোড ১১, বনানী, ঢাকা ১২১৩, বাংলাদেশ"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-editorial-accent flex-shrink-0" />
                    <span>+880 2-8812345, +880 1712-345678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-editorial-accent flex-shrink-0" />
                    <span className="underline">info@lodonex.edu.bd</span>
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
                    href="https://facebook.com"
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

      {/* Floating Sandbox Administration Panel */}
      <AdminSimulationPanel
        lang={lang}
        users={users}
        currentUser={currentUser}
        onUpdateUserStatus={handleUpdateUserStatus}
        onAddSimulatedUser={handleAddSimulatedUser}
        onResetSimulation={handleResetSimulation}
      />
    </div>
  );
}

