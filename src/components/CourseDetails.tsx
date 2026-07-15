import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Play, Award, Check, FileText, ChevronRight, HelpCircle, Trophy, Star, MessageSquare, Trash2, Send, Compass } from "lucide-react";
import { Language, Course, Lesson, StudentProgress, CourseReview, UserAccount } from "../types";
import { LQF_LEVELS } from "../data/mockData";
import { TRANSLATIONS } from "../data/translations";
import { motion } from "motion/react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

interface CourseDetailsProps {
  lang: Language;
  course: Course;
  progress: StudentProgress;
  onBack: () => void;
  onMarkLessonComplete: (lessonId: string, quizScore?: number) => void;
  onViewCertificate: (course: Course) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  currentUser?: UserAccount | null;
}

const LEVEL_METADATA: Record<number, {
  qualificationEn: string;
  qualificationBn: string;
  durationEn: string;
  durationBn: string;
  hoursEn: string;
  hoursBn: string;
  feeEn: string;
  feeBn: string;
  stageEn: string;
  stageBn: string;
}> = {
  1: {
    qualificationEn: "Lodonex Certified Culinary Foundation",
    qualificationBn: "লোডোনেক্স সার্টিফাইড কালিনারি ফাউন্ডেশন",
    durationEn: "3 Months",
    durationBn: "৩ মাস",
    hoursEn: "360 Training Hours",
    hoursBn: "৩৬০ প্রশিক্ষণ ঘন্টা",
    feeEn: "USD 1,250",
    feeBn: "১,২৫০ মার্কিন ডলার (৳১,৫০,০০০)",
    stageEn: "Commis III",
    stageBn: "কমিস ৩",
  },
  2: {
    qualificationEn: "Lodonex Certified Culinary Professional",
    qualificationBn: "লোডোনেক্স সার্টিফাইড কালিনারি প্রফেশনাল",
    durationEn: "4 Months",
    durationBn: "৪ মাস",
    hoursEn: "480 Training Hours",
    hoursBn: "৪৮০ প্রশিক্ষণ ঘন্টা",
    feeEn: "USD 1,350",
    feeBn: "১,৩৫০ মার্কিন ডলার (৳১,৬২,০০০)",
    stageEn: "Commis II",
    stageBn: "কমিস ২",
  },
  3: {
    qualificationEn: "Lodonex Certified Advanced Culinary Professional",
    qualificationBn: "লোডোনেক্স সার্টিফাইড অ্যাডভান্সড কালিনারি প্রফেশনাল",
    durationEn: "15 Days",
    durationBn: "১৫ দিন",
    hoursEn: "120 Training Hours",
    hoursBn: "১২০ প্রশিক্ষণ ঘন্টা",
    feeEn: "USD 1,000",
    feeBn: "১,০০০ মার্কিন ডলার (৳১,২০,০০০)",
    stageEn: "Advanced Culinary Professional / Commis I",
    stageBn: "অ্যাডভান্সড কালিনারি প্রফেশনাল / কমিস ১",
  },
  4: {
    qualificationEn: "Lodonex Certified Culinary Operations Manager",
    qualificationBn: "লোডোনেক্স সার্টিফাইড কালিনারি অপারেশনস ম্যানেজার",
    durationEn: "1 Month",
    durationBn: "১ মাস",
    hoursEn: "80 Training Hours",
    hoursBn: "৮০ প্রশিক্ষণ ঘন্টা",
    feeEn: "USD 1,800",
    feeBn: "১,৮০০ মার্কিন ডলার (৳২,১৬,০০০)",
    stageEn: "Demi Chef de Partie",
    stageBn: "ডেমি শেফ ডি পার্টি",
  },
  5: {
    qualificationEn: "Lodonex Certified Pasta & Mediterranean Specialist",
    qualificationBn: "লোডোনেক্স সার্টিফাইড পাস্তা ও মেডিটেরেনিয়ান স্পেশালিস্ট",
    durationEn: "1.5 Months",
    durationBn: "১.৫ মাস",
    hoursEn: "120 Training Hours",
    hoursBn: "১২০ প্রশিক্ষণ ঘন্টা",
    feeEn: "USD 2,200",
    feeBn: "২,২০০ মার্কিন ডলার (৳২,৬৪,০০০)",
    stageEn: "Chef de Partie",
    stageBn: "শেফ ডি পার্টি",
  },
  6: {
    qualificationEn: "Lodonex Certified French Pastry Chef",
    qualificationBn: "লোডোনেক্স সার্টিফাইড ফ্রেঞ্চ পেস্ট্রি শেফ",
    durationEn: "2 Months",
    durationBn: "২ মাস",
    hoursEn: "160 Training Hours",
    hoursBn: "১৬০ প্রশিক্ষণ ঘন্টা",
    feeEn: "USD 3,500",
    feeBn: "৩,৫০০ মার্কিন ডলার (৳৪,২০,০০০)",
    stageEn: "Pastry Chef / Sous Chef",
    stageBn: "পেস্ট্রি শেফ / সু শেফ",
  }
};

export default function CourseDetails({
  lang,
  course,
  progress,
  onBack,
  onMarkLessonComplete,
  onViewCertificate,
  isLoggedIn = false,
  onOpenAuth,
  currentUser = null,
}: CourseDetailsProps) {
  const t = TRANSLATIONS[lang];
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.lessons[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "materials">("about");
  const [showLqfLadder, setShowLqfLadder] = useState<boolean>(false);

  // Reviews integration states
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [userRating, setUserRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>("");
  const [reviewSuccess, setReviewSuccess] = useState<string>("");

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setReviewError("");
      setReviewSuccess("");
      try {
        const q = query(
          collection(db, "reviews"),
          where("courseId", "==", course.id)
        );
        const querySnapshot = await getDocs(q);
        if (!active) return;

        const loadedReviews: CourseReview[] = [];
        querySnapshot.forEach((docSnap) => {
          loadedReviews.push(docSnap.data() as CourseReview);
        });

        // Sort reviews by createdAt descending
        loadedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setReviews(loadedReviews);
        localStorage.setItem(`lodonex_reviews_${course.id}`, JSON.stringify(loadedReviews));
      } catch (err) {
        console.error("Error loading reviews from Firestore:", err);
        // Fallback to local storage cache
        const cached = localStorage.getItem(`lodonex_reviews_${course.id}`);
        if (cached && active) {
          try {
            setReviews(JSON.parse(cached));
          } catch (e) {
            setReviews([]);
          }
        }
      } finally {
        if (active) setLoadingReviews(false);
      }
    };

    fetchReviews();
    return () => {
      active = false;
    };
  }, [course.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (feedback.trim().length === 0) {
      setReviewError(lang === "en" ? "Please write some feedback." : "অনুগ্রহ করে আপনার ফিডব্যাক লিখুন।");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    const newReview: CourseReview = {
      id: `review-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      courseId: course.id,
      studentId: currentUser.id,
      studentName: currentUser.name || currentUser.email.split("@")[0],
      studentEmail: currentUser.email,
      rating: userRating,
      feedback: feedback.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to Firestore
      await setDoc(doc(db, "reviews", newReview.id), newReview);
      
      setReviews((prev) => [newReview, ...prev]);
      setFeedback("");
      setUserRating(5);
      setReviewSuccess(lang === "en" ? "Thank you for your feedback!" : "আপনার মূল্যবান ফিডব্যাকের জন্য ধন্যবাদ!");

      // Update local storage cache
      const updatedReviews = [newReview, ...reviews];
      localStorage.setItem(`lodonex_reviews_${course.id}`, JSON.stringify(updatedReviews));
    } catch (err) {
      console.error("Error saving review to Firestore:", err);
      // Fallback: save locally
      setReviews((prev) => [newReview, ...prev]);
      setFeedback("");
      setUserRating(5);
      setReviewSuccess(lang === "en" ? "Review saved (Local Mode)." : "রিভিউ সেভ করা হয়েছে (লোকাল মোড)।");

      const updatedReviews = [newReview, ...reviews];
      localStorage.setItem(`lodonex_reviews_${course.id}`, JSON.stringify(updatedReviews));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (!currentUser) return;
    if (!window.confirm(lang === "en" ? "Are you sure you want to delete this review?" : "আপনি কি নিশ্চিত যে আপনি এই রিভিউটি ডিলিট করতে চান?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      const updated = reviews.filter((r) => r.id !== reviewId);
      setReviews(updated);
      localStorage.setItem(`lodonex_reviews_${course.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error("Error deleting review:", err);
      // Fallback
      const updated = reviews.filter((r) => r.id !== reviewId);
      setReviews(updated);
      localStorage.setItem(`lodonex_reviews_${course.id}`, JSON.stringify(updated));
    }
  };

  const isLessonCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);

  // Calculate course completion %
  const completedCount = course.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const completionPct = Math.round((completedCount / course.lessons.length) * 100);
  const isCourseComplete = completionPct === 100;

  const handleQuizSubmit = () => {
    if (selectedAnswer === null || !activeLesson.quiz) return;

    const isCorrect = selectedAnswer === activeLesson.quiz.answerIndex;
    setQuizCorrect(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect) {
      // Mark lesson completed
      onMarkLessonComplete(activeLesson.id, 100);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizCorrect(null);
  };

  const courseLqf = LQF_LEVELS.find((l) => l.level === course.lqfLevel);

  return (
    <div id="course-details-section" className="space-y-6 py-6">
      {/* Back Header with Editorial Touch */}
      <div id="course-details-header" className="flex items-center justify-between pb-3 border-b border-editorial-border">
        <button
          id="back-to-dashboard-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#1A1A1A] hover:text-editorial-accent font-bold uppercase tracking-widest text-xs transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToDashboard}
        </button>
        <div className="text-right">
          <span className="text-[10px] uppercase font-sans text-slate-400 block font-bold tracking-wider">
            {t.courseProgression}
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-editorial-accent">
            {completedCount}/{course.lessons.length} {lang === "en" ? "Modules Done" : "টি সমাপ্ত"} ({completionPct}%)
          </span>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="bg-[#F7F5F0] border border-editorial-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-sm text-editorial-dark">
              {lang === "en" ? "✨ Academic Guest Preview" : "✨ একাডেমিক গেস্ট প্রিভিউ"}
            </h4>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              {lang === "en"
                ? "You are viewing this masterclass as a guest. Sign up or log in to track your lessons, submit theory quizzes, and unlock your physical certificate."
                : "আপনি একজন অতিথি হিসেবে এই মাস্টারক্লাসটি দেখছেন। আপনার লেকচার ট্র্যাকিং, কুইজ সাবমিট করা এবং সার্টিফিকেট আনলক করতে সাইন আপ বা লগইন করুন।"}
            </p>
          </div>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex-shrink-0"
            >
              {lang === "en" ? "Sign Up / Log In" : "সাইন আপ / লগইন"}
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Player vs. Sidebar */}
      <div id="course-details-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Video Player & Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Embedded YouTube Player */}
          <div
            id="video-player-container"
            className="relative w-full rounded-none bg-black border border-editorial-dark aspect-video shadow-xs"
          >
            <iframe
              id="chef-video-frame"
              src={activeLesson.videoUrl}
              title={lang === "en" ? activeLesson.titleEn : activeLesson.titleBn}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Active Lesson Text Header */}
          <div id="lesson-info-box" className="bg-white p-5 sm:p-6 rounded-none border border-editorial-border space-y-3 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-editorial-dark leading-snug">
                {lang === "en" ? activeLesson.titleEn : activeLesson.titleBn}
              </h2>
              {isLessonCompleted(activeLesson.id) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {t.completed}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {lang === "en" ? activeLesson.descriptionEn : activeLesson.descriptionBn}
            </p>

            <div className="flex border-b border-editorial-border mt-6">
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-widest border-b-2 mr-6 transition cursor-pointer ${
                  activeTab === "about" ? "border-editorial-accent text-editorial-accent" : "border-transparent text-slate-400 hover:text-editorial-dark"
                }`}
              >
                {lang === "en" ? "About This Module" : "এই মডিউল সম্পর্কে"}
              </button>
              <button
                onClick={() => setActiveTab("materials")}
                className={`pb-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition cursor-pointer ${
                  activeTab === "materials" ? "border-editorial-accent text-editorial-accent" : "border-transparent text-slate-400 hover:text-editorial-dark"
                }`}
              >
                {lang === "en" ? "Resource Materials" : "প্রয়োজনীয় রিসোর্স ও বই"}
              </button>
            </div>

            <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[60px] font-sans">
              {activeTab === "about" ? (
                <div className="space-y-6">
                  {/* Academy Directives */}
                  <div className="space-y-2">
                    <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px]">
                      {lang === "en" ? "Academy Directives:" : "একাডেমির নির্দেশনাবলী:"}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>{lang === "en" ? "Watch the complete step-by-step video lecture." : "সম্পূর্ণ ভিডিও লেকচারটি মনোযোগ সহকারে দেখুন।"}</li>
                      <li>{lang === "en" ? "Take note of key temperatures, mixing speed and secret spices." : "तापমাত্রা, মিশ্রণ এবং মশলার অনুপাত খাতায় নোট করে রাখুন।"}</li>
                      <li>{lang === "en" ? "Pass the multiple choice theory quiz down below." : "নিচের বহুনির্বাচনী তত্ত্ব কুইজে উত্তীর্ণ হোন।"}</li>
                    </ul>
                  </div>

                  {/* Course Duration & Fees */}
                  <div className="border border-editorial-border bg-[#F7F5F0] p-4 space-y-3">
                    <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5">
                      {lang === "en" ? "Course Duration & Fees" : "কোর্সের সময়কাল ও ফি"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-dashed border-slate-200 py-1 sm:border-0">
                        <span className="text-slate-400 w-24 flex-shrink-0">{lang === "en" ? "Qualification:" : "যোগ্যতা:"}</span>
                        <span className="font-semibold text-editorial-dark text-left">
                          {lang === "en" 
                            ? (LEVEL_METADATA[course.lqfLevel]?.qualificationEn || course.titleEn) 
                            : (LEVEL_METADATA[course.lqfLevel]?.qualificationBn || course.titleBn)}
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-dashed border-slate-200 py-1 sm:border-0">
                        <span className="text-slate-400 w-24 flex-shrink-0">{lang === "en" ? "Duration:" : "সময়কাল:"}</span>
                        <span className="font-semibold text-editorial-dark text-left">
                          {lang === "en" 
                            ? (LEVEL_METADATA[course.lqfLevel]?.durationEn || course.duration) 
                            : (LEVEL_METADATA[course.lqfLevel]?.durationBn || "নির্ধারিত সময়")}
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-dashed border-slate-200 py-1 sm:border-0">
                        <span className="text-slate-400 w-24 flex-shrink-0">{lang === "en" ? "Training Hours:" : "প্রশিক্ষণ ঘন্টা:"}</span>
                        <span className="font-semibold text-editorial-dark text-left">
                          {lang === "en" 
                            ? (LEVEL_METADATA[course.lqfLevel]?.hoursEn || "120 Training Hours") 
                            : (LEVEL_METADATA[course.lqfLevel]?.hoursBn || "১২০ প্রশিক্ষণ ঘন্টা")}
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-dashed border-slate-200 py-1 sm:border-0">
                        <span className="text-slate-400 w-24 flex-shrink-0">{lang === "en" ? "Course Fee:" : "কোর্স ফি:"}</span>
                        <span className="font-bold text-editorial-accent text-left">
                          {lang === "en" 
                            ? (LEVEL_METADATA[course.lqfLevel]?.feeEn || "USD 1,000") 
                            : (LEVEL_METADATA[course.lqfLevel]?.feeBn || "১,০০০ মার্কিন ডলার")}
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-4 py-1 sm:border-0 col-span-1 sm:col-span-2">
                        <span className="text-slate-400 w-24 flex-shrink-0">{lang === "en" ? "Career Stage:" : "ক্যারিয়ার ধাপ:"}</span>
                        <span className="font-semibold text-editorial-dark text-left">
                          {lang === "en" 
                            ? (LEVEL_METADATA[course.lqfLevel]?.stageEn || "Professional") 
                            : (LEVEL_METADATA[course.lqfLevel]?.stageBn || "পেশাদার")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level-specific Curriculum */}
                  {course.lqfLevel >= 3 ? (
                    <div className="space-y-6">
                      {/* Professional Development Focus Header */}
                      <div className="border border-amber-200 bg-[#FCFAF5] p-4 text-center space-y-1">
                        <p className="font-bold text-amber-800 text-[11px] uppercase tracking-wider">
                          {lang === "en" ? "Higher LQF Level Curriculum" : "উচ্চতর এলকিউএফ লেভেল কারিকুলাম"}
                        </p>
                        <p className="text-xs text-amber-950 leading-relaxed font-serif font-bold italic">
                          {lang === "en" 
                            ? "Every higher level focuses on professional development and career excellence." 
                            : "প্রতিটি উচ্চতর লেভেল পেশাদার উন্নয়ন এবং কর্মক্ষেত্রে শ্রেষ্ঠত্ব অর্জনের ওপর আলোকপাত করে।"}
                        </p>
                      </div>

                      {/* Professional Development Modules */}
                      <div className="border border-editorial-border p-4 space-y-3 bg-white">
                        <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5 text-left">
                          {lang === "en" 
                            ? `Level ${course.lqfLevel} Curriculum - Advanced Development Modules` 
                            : `লেভেল ${course.lqfLevel} কারিকুলাম - অ্যাডভান্সড ডেভেলপমেন্ট মডিউল`}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-left">
                          {[
                            { en: "Advanced Theory", bn: "অ্যাডভান্সড থিওরি (উন্নত তত্ত্ব)" },
                            { en: "Practical Examination", bn: "ব্যবহারিক পরীক্ষা (প্র্যাক্টিক্যাল)" },
                            { en: "Live Kitchen Assessment", bn: "লাইভ কিচেন অ্যাসেসমেন্ট" },
                            { en: "Leadership", bn: "নেতৃত্ব ও লিডারশিপ" },
                            { en: "Kitchen Management", bn: "রান্নাঘর ব্যবস্থাপনা" },
                            { en: "Cost Control", bn: "ব্যয় নিয়ন্ত্রণ ও কস্ট কন্ট্রোল" },
                            { en: "Menu Development", bn: "মেনু উন্নয়ন ও মেনু ডেভেলপমেন্ট" },
                            { en: "Food Cost", bn: "খাদ্য খরচ ও ফুড কস্ট হিসাব" },
                            { en: "Yield Test", bn: "ইয়াল্ড টেস্ট ও উৎপাদনশীলতা" },
                            { en: "Quality Assurance", bn: "মান নিশ্চিতকরণ ও কোয়ালিটি অ্যাসুরেন্স" },
                            { en: "Business Case Study", bn: "ব্যবসায়িক কেস স্টাডি" },
                            { en: "Presentation", bn: "উপস্থাপনা ও প্রেজেন্টেশন" },
                            { en: "Portfolio", bn: "পোর্টফোলিও তৈরি" },
                            { en: "Panel Interview", bn: "প্যানেল ইন্টারভিউ" }
                          ].map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1 border-b border-slate-100 last:border-0 sm:even:border-b sm:border-slate-100">
                              <span className="h-1.5 w-1.5 bg-amber-600 rounded-full flex-shrink-0" />
                              <span className="text-slate-700 font-medium">{lang === "en" ? mod.en : mod.bn}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assessment Weight & Graduation Requirements Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        {/* Assessment Weight */}
                        <div className="border border-editorial-border p-4 space-y-3 bg-white">
                          <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5">
                            {lang === "en" ? "Assessment Weight" : "মূল্যায়ন পদ্ধতি ও নম্বর বিভাজন"}
                          </p>
                          <div className="space-y-2 text-xs">
                            {[
                              { en: "Written Theory – 20%", bn: "লিখিত থিওরি পরীক্ষা – ২০%" },
                              { en: "Practical Examination – 40%", bn: "ব্যবহারিক পরীক্ষা – ৪০%" },
                              { en: "Workplace Evidence – 20%", bn: "कर्मক্ষেত্রের প্রমাণাদি (Workplace Evidence) – ২০%" },
                              { en: "Portfolio – 10%", bn: "পোর্টফোলিও – ১০%" },
                              { en: "Professional Behaviour – 10%", bn: "পেশাদার আচরণ ও শৃঙ্খলা – ১০%" }
                            ].map((weight, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-dashed border-slate-100 pb-1.5 last:border-0">
                                <span className="text-slate-600">{lang === "en" ? weight.en.split(" – ")[0] : weight.bn.split(" – ")[0]}</span>
                                <span className="font-bold text-editorial-accent">{lang === "en" ? weight.en.split(" – ")[1] : weight.bn.split(" – ")[1]}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Graduation Requirements */}
                        <div className="border border-editorial-border p-4 space-y-3 bg-white">
                          <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5">
                            {lang === "en" ? "Graduation Requirements" : "স্নাতক/উত্তীর্ণ হওয়ার শর্তাবলী"}
                          </p>
                          <div className="space-y-1.5 text-xs">
                            {[
                              { en: "Theory Examination", bn: "তত্ত্বীয় পরীক্ষা (Theory Examination)" },
                              { en: "Practical Examination", bn: "ব্যবহারিক পরীক্ষা (Practical Examination)" },
                              { en: "Workplace Log Book", bn: "কর্মক্ষেত্রের লগ বুক (Workplace Log Book)" },
                              { en: "Experience Letter", bn: "অভিজ্ঞতার সনদ (Experience Letter)" },
                              { en: "Portfolio", bn: "পোর্টফোলিও" },
                              { en: "Supervisor Evaluation", bn: "সুপারভাইজার মূল্যায়ন" },
                              { en: "Viva Board Panel Interview", bn: "ভাইভা বোর্ড (মৌখিক পরীক্ষা)" }
                            ].map((req, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                                <span className="text-slate-700">{lang === "en" ? req.en : req.bn}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : course.lqfLevel === 2 ? (
                    <div className="space-y-4">
                      {/* Intermediate Culinary Skills */}
                      <div className="border border-editorial-border p-4 space-y-3 bg-white">
                        <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5 text-left">
                          {lang === "en" ? "Level 2 Curriculum - Intermediate Culinary Skills" : "লেভেল ২ কারিকুলাম - ইন্টারমিডিয়েট কালিনারি স্কিলস"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-left">
                          {[
                            { en: "Advanced Knife Skills", bn: "উন্নত নাইফ স্কিলস" },
                            { en: "Meat Preparation", bn: "মাংসের প্রস্তুতি ও প্রিপারেশন" },
                            { en: "Poultry Preparation", bn: "পোল্ট্রি প্রিপারেশন" },
                            { en: "Seafood Preparation", bn: "সি-ফুড প্রিপারেশন" },
                            { en: "Sauce Production", bn: "সস তৈরি ও উৎপাদন" },
                            { en: "Soup Production", bn: "স্যুপ তৈরি ও উৎপাদন" },
                            { en: "Breakfast Production", bn: "নাস্তা ও ব্রেকফাস্ট প্রিপারেশন" },
                            { en: "Cost Awareness", bn: "ব্যয় সচেতনতা ও বাজেট" },
                            { en: "Waste Control", bn: "অপচয় নিয়ন্ত্রণ ও ওয়েস্ট ম্যানেজমেন্ট" },
                            { en: "Kitchen Communication", bn: "রান্নাঘরে পেশাদার যোগাযোগ" },
                            { en: "Kitchen Workflow", bn: "কিচেন ওয়ার্কফ্লো ও সমন্বয়" },
                            { en: "Speed Training", bn: "গতি ও স্পিড ট্রেনিং" },
                          ].map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1 border-b border-slate-100 last:border-0 sm:even:border-b sm:border-slate-100">
                              <span className="h-1.5 w-1.5 bg-editorial-accent rounded-full flex-shrink-0" />
                              <span className="text-slate-700">{lang === "en" ? mod.en : mod.bn}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* International Cuisine */}
                      <div className="border border-editorial-border p-4 space-y-3 bg-white">
                        <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5 text-left">
                          {lang === "en" ? "International Cuisine" : "আন্তর্জাতিক রন্ধনপ্রণালী ও কুইজিন"}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-left">
                          {[
                            { en: "Japanese Teriyaki", bn: "জাপানিজ তেরিয়াকি" },
                            { en: "French Cuisine", bn: "ফ্রেঞ্চ কুইজিন" },
                            { en: "Korean BBQ", bn: "কোরিয়ান বার্বিকিউ" },
                            { en: "Turkish Kebab", bn: "তুর্কি কাবাব" },
                            { en: "Greek Cuisine", bn: "গ্রীক কুইজিন" },
                            { en: "Spanish Paella", bn: "স্প্যানিশ পায়েল্লা" },
                            { en: "Malaysian Cuisine", bn: "মালয়েশিয়ান কুইজিন" },
                            { en: "Indonesian Cuisine", bn: "ইন্দোনেশিয়ান কুইজিন" },
                            { en: "British Cuisine", bn: "ব্রিটিশ কুইজিন" },
                            { en: "Italian Risotto", bn: "ইতালিয়ান রিসোতো" },
                          ].map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-[#F7F5F0] border border-editorial-border/40">
                              <span className="h-1 w-1 bg-editorial-dark rounded-full flex-shrink-0" />
                              <span className="text-slate-800 font-medium">{lang === "en" ? mod.en : mod.bn}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Value Added Classes */}
                      <div className="border border-editorial-border p-4 space-y-3 bg-[#FCFAF5]">
                        <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5 text-left">
                          {lang === "en" ? "Value Added Classes" : "ভ্যালু অ্যাডেড স্পেশাল ক্লাস"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-left">
                          {[
                            { en: "Advanced Bakery", bn: "অ্যাডভান্সড বেকারি ও পেস্ট্রি" },
                            { en: "Artisan Bread", bn: "আর্টিসান ব্রেড মেকিং" },
                            { en: "Coffee Brewing", bn: "পেশাদার কফি ব্রিউইং" },
                            { en: "Milk Steaming", bn: "মিল্ক স্টিমিং ও ফোমিং" },
                            { en: "Latte Basics", bn: "ল্যাটে আর্ট ও বেসিকস" },
                            { en: "Coffee Service", bn: "কফি সার্ভিস ও শিষ্টাচার" },
                            { en: "Intermediate Carving", bn: "ইন্টারমিডিয়েট কার্ভিং (ফল ও সবজি)" },
                          ].map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1 border-b border-slate-100 last:border-0">
                              <span className="h-1.5 w-1.5 bg-amber-600 rounded-full flex-shrink-0" />
                              <span className="text-slate-700">{lang === "en" ? mod.en : mod.bn}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Level 1 Curriculum */
                    <div className="border border-editorial-border p-4 space-y-3 bg-white">
                      <p className="font-bold text-editorial-dark uppercase tracking-wider text-[10px] border-b border-editorial-border/40 pb-1.5 text-left">
                        {lang === "en" ? "Level 1 Curriculum - Foundation Modules" : "লেভেল ১ কারিকুলাম - ফাউন্ডেশন মডিউল"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-left">
                        {[
                          { en: "Food Safety", bn: "খাদ্য নিরাপত্তা" },
                          { en: "HACCP", bn: "এইচএসিপিপি (HACCP)" },
                          { en: "Kitchen Hygiene", bn: "কিচেন হাইজিন" },
                          { en: "Personal Hygiene", bn: "ব্যক্তিগত পরিচ্ছন্নতা" },
                          { en: "Kitchen Equipment", bn: "কিচেন সামগ্রী ও যন্ত্রপাতি" },
                          { en: "Knife Theory", bn: "নাইফ থিওরি" },
                          { en: "Knife Skills", bn: "নাইফ স্কিলস" },
                          { en: "Vegetable Cuts", bn: "সবজি কাটার ধরন ও সাইজ" },
                          { en: "Stocks", bn: "স্টক তৈরি" },
                          { en: "Egg Cookery", bn: "ডিমের রকমারি রান্না" },
                          { en: "Rice Cookery", bn: "ভাত ও রাইস প্রিপারেশন" },
                          { en: "Basic Sauces", bn: "বেসিক সস ও গ্রেভি" },
                          { en: "Culinary Terminology", bn: "কালিনারি টার্মিনোলজি" },
                          { en: "Kitchen Mathematics", bn: "কিচেন গণিত ও হিসাব" },
                          { en: "Professional Behaviour", bn: "পেশাদার আচরণ ও শিষ্টাচার" },
                          { en: "Time Management", bn: "সময় ব্যবস্থাপনা" },
                        ].map((mod, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-1 border-b border-slate-100 last:border-0 sm:even:border-b sm:border-slate-100">
                            <span className="h-1.5 w-1.5 bg-editorial-accent rounded-full flex-shrink-0" />
                            <span className="text-slate-700">{lang === "en" ? mod.en : mod.bn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-none bg-[#F7F5F0] border border-editorial-border">
                    <FileText className="h-5 w-5 text-editorial-accent" />
                    <div>
                      <p className="font-bold text-editorial-dark text-xs font-sans uppercase tracking-wider">
                        {lang === "en" ? `${activeLesson.titleEn} - Formulation Guide.pdf` : `${activeLesson.titleBn} - রেসিপি গাইড.pdf`}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">PDF DOCUMENT • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-none bg-[#F7F5F0] border border-editorial-border">
                    <FileText className="h-5 w-5 text-editorial-accent" />
                    <div>
                      <p className="font-bold text-editorial-dark text-xs font-sans uppercase tracking-wider">
                        {lang === "en" ? "Commercial Culinary Safety Guidelines.pdf" : "বাণিজ্যিক রান্নাঘর নিরাপত্তা নির্দেশিকা.pdf"}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">PDF DOCUMENT • 1.1 MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Lesson Quiz */}
          {activeLesson.quiz && (
            <div
              id={`quiz-container-${activeLesson.id}`}
              className="bg-[#F7F5F0] p-5 sm:p-6 rounded-none border border-editorial-border space-y-4 text-left"
            >
              <div className="flex items-center gap-2 text-editorial-accent pb-2 border-b border-editorial-border/65">
                <HelpCircle className="h-5 w-5" />
                <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base italic">
                  {t.quizUnlocked}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-sans font-medium">
                {t.quizInstruction}
              </p>

              <div className="pt-2">
                <h4 className="font-serif font-bold text-editorial-dark text-base sm:text-lg leading-snug mb-4 italic">
                  {lang === "en" ? activeLesson.quiz.questionEn : activeLesson.quiz.questionBn}
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {(lang === "en" ? activeLesson.quiz.optionsEn : activeLesson.quiz.optionsBn).map((option, index) => (
                    <button
                      key={index}
                      id={`quiz-option-${index}`}
                      disabled={quizSubmitted && quizCorrect === true}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full text-left p-3.5 text-xs sm:text-sm rounded-none border font-sans font-semibold transition flex items-center justify-between cursor-pointer ${
                        selectedAnswer === index
                          ? "border-editorial-dark bg-white text-editorial-accent font-bold"
                          : "border-editorial-border bg-white hover:bg-[#F7F5F0] text-[#1A1A1A]"
                      }`}
                    >
                      <span>{option}</span>
                      {selectedAnswer === index && <Check className="h-4 w-4 text-editorial-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              {quizSubmitted && (
                <div
                  id="quiz-result-banner"
                  className={`p-3.5 rounded-none border text-xs sm:text-sm font-bold flex items-center gap-2 font-sans ${
                    quizCorrect
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {quizCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <span>{t.quizPassed} 100%! {lang === "en" ? "Lesson marked as complete." : "মডিউলটি সফলভাবে শেষ হয়েছে।"}</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                      <span>{t.quizFailed} 0%. {t.wrongAnswer}</span>
                    </>
                  )}
                </div>
              )}

              {!(quizSubmitted && quizCorrect === true) && (
                <div className="pt-2 flex justify-end">
                  <button
                    id="submit-quiz-btn"
                    disabled={selectedAnswer === null}
                    onClick={handleQuizSubmit}
                    className="px-6 py-3 bg-[#1A1A1A] text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-widest rounded-none transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {t.submitQuiz}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick manual mark as complete bypass if lesson has no quiz */}
          {!activeLesson.quiz && (
            <div className="flex justify-end pt-2">
              <button
                id="manual-complete-btn"
                onClick={() => onMarkLessonComplete(activeLesson.id)}
                disabled={isLessonCompleted(activeLesson.id)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-none transition flex items-center gap-1.5 cursor-pointer border ${
                  isLessonCompleted(activeLesson.id)
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                    : "bg-[#1A1A1A] hover:bg-slate-800 text-white border-editorial-dark"
                }`}
              >
                <Check className="h-4 w-4" />
                {isLessonCompleted(activeLesson.id) ? t.completed : t.markComplete}
              </button>
            </div>
          )}

          {/* LQF Level Details Card */}
          {courseLqf && (
            <div id="lqf-level-details-card" className="bg-[#F7F5F0] border border-editorial-border p-5 sm:p-6 space-y-4 text-left mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#1A1A1A] text-white rounded-none flex items-center justify-center font-bold text-lg font-mono flex-shrink-0">
                    {courseLqf.level}
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-editorial-accent font-bold block">
                      {lang === "en" ? "LQF National Qualification Framework" : "এলকিউএফ জাতীয় রন্ধনশিল্প যোগ্যতা কাঠামো"}
                    </span>
                    <h3 className="font-serif font-bold text-[#1A1A1A] text-base sm:text-lg leading-tight">
                      {lang === "en" ? courseLqf.titleEn : courseLqf.titleBn}
                    </h3>
                  </div>
                </div>

                <button
                  id="toggle-lqf-ladder-btn"
                  onClick={() => setShowLqfLadder(!showLqfLadder)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-none transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <Compass className="h-4 w-4" />
                  {showLqfLadder
                    ? (lang === "en" ? "Hide Ladder" : "ল্যাডার লুকান")
                    : (lang === "en" ? "View Full LQF Framework" : "সম্পূর্ণ এলকিউএফ কাঠামো")}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs sm:text-sm">
                {/* Career Path */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {lang === "en" ? "Career Path" : "ক্যারিয়ার পাথ"}
                  </span>
                  <p className="font-serif font-bold text-editorial-dark text-sm sm:text-base italic">
                    {lang === "en" ? courseLqf.careerPathEn : courseLqf.careerPathBn}
                  </p>
                </div>

                {/* Suitable For / Eligibility */}
                {courseLqf.suitableForEn && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Suitable For" : "যার জন্য উপযোগী"}
                    </span>
                    <p className="font-sans font-semibold text-slate-700">
                      {lang === "en" ? courseLqf.suitableForEn : courseLqf.suitableForBn}
                    </p>
                  </div>
                )}

                {courseLqf.eligibilityEn && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Eligibility" : "যোগ্যতা"}
                    </span>
                    <p className="font-sans font-semibold text-slate-700">
                      {lang === "en" ? courseLqf.eligibilityEn : courseLqf.eligibilityBn}
                    </p>
                  </div>
                )}

                {/* Experience Required */}
                {courseLqf.experienceRequiredEn && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Experience Required" : "প্রয়োজনীয় অভিজ্ঞতা"}
                    </span>
                    <p className="font-sans font-semibold text-slate-700">
                      {lang === "en" ? courseLqf.experienceRequiredEn : courseLqf.experienceRequiredBn}
                    </p>
                  </div>
                )}

                {/* Workshop */}
                {courseLqf.workshopEn && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Required Workshop" : "প্রয়োজনীয় ওয়ার্কশপ"}
                    </span>
                    <p className="font-sans font-semibold text-slate-700">
                      {lang === "en" ? courseLqf.workshopEn : courseLqf.workshopBn}
                    </p>
                  </div>
                )}

                {/* Specializations */}
                {courseLqf.specializationsEn && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Available Specializations" : "উপলব্ধ স্পেশালাইজেশনসমূহ"}
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(lang === "en" ? courseLqf.specializationsEn : courseLqf.specializationsBn).map((spec, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-editorial-border text-[10px] font-bold text-[#1A1A1A] font-sans uppercase">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assessment */}
                {courseLqf.assessmentEn && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Assessment Details" : "মূল্যায়ন বিবরণী"}
                    </span>
                    <div className="text-slate-700 bg-white border border-editorial-border p-3 text-xs leading-relaxed whitespace-pre-line rounded-none font-sans">
                      {lang === "en" ? courseLqf.assessmentEn : courseLqf.assessmentBn}
                    </div>
                  </div>
                )}

                {/* Pass Mark */}
                {courseLqf.passMarkEn && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {lang === "en" ? "Passing Mark" : "পাস মার্ক"}
                    </span>
                    <p className="font-serif font-bold text-editorial-accent text-sm italic">
                      {lang === "en" ? courseLqf.passMarkEn : courseLqf.passMarkBn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expanded Career Ladder */}
          {showLqfLadder && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              id="lqf-ladder-visualizer"
              className="bg-white border border-editorial-border p-5 sm:p-6 space-y-6 text-left mt-4"
            >
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <h4 className="font-serif font-bold text-editorial-dark text-base italic">
                  {lang === "en" ? "Lodonex Qualification Framework (LQF) Career Ladder" : "লোডোনেক্স কোয়ালিফিকেশন ফ্রেমওয়ার্ক (LQF) ক্যারিয়ার ল্যাডার"}
                </h4>
                <button
                  onClick={() => setShowLqfLadder(false)}
                  className="text-xs font-bold uppercase tracking-wider text-editorial-accent hover:underline cursor-pointer"
                >
                  {lang === "en" ? "Close" : "বন্ধ করুন"}
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {LQF_LEVELS.map((lvl) => {
                  const isCurrent = lvl.level === course.lqfLevel;
                  return (
                    <div
                      key={lvl.level}
                      id={`lqf-ladder-level-${lvl.level}`}
                      className={`p-4 border ${
                        isCurrent ? "border-editorial-accent bg-[#FDFCF9] shadow-xs" : "border-editorial-border bg-[#F7F5F0]/40"
                      } flex gap-4 items-start relative`}
                    >
                      {isCurrent && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-editorial-accent text-white font-sans text-[8px] font-bold uppercase tracking-widest">
                          {lang === "en" ? "This Course" : "এই কোর্স"}
                        </span>
                      )}
                      <div className={`h-8 w-8 rounded-none flex items-center justify-center font-bold text-sm font-mono flex-shrink-0 ${
                        isCurrent ? "bg-editorial-accent text-white" : "bg-[#1A1A1A] text-white"
                      }`}>
                        L{lvl.level}
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <div>
                          <h5 className="font-serif font-bold text-[#1A1A1A] text-sm sm:text-base leading-tight">
                            {lang === "en" ? lvl.titleEn : lvl.titleBn}
                          </h5>
                          <p className="text-xs text-editorial-accent font-sans font-bold uppercase tracking-wider mt-0.5">
                            {lang === "en" ? `Career Path: ${lvl.careerPathEn}` : `ক্যারিয়ার পাথ: ${lvl.careerPathBn}`}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-600 font-sans border-t border-editorial-border/40 pt-2">
                          {lvl.suitableForEn && (
                            <div>
                              <span className="font-bold text-slate-400 block uppercase text-[9px]">{lang === "en" ? "Suitable For" : "যার জন্য উপযোগী"}</span>
                              <span>{lang === "en" ? lvl.suitableForEn : lvl.suitableForBn}</span>
                            </div>
                          )}
                          {lvl.eligibilityEn && (
                            <div>
                              <span className="font-bold text-slate-400 block uppercase text-[9px]">{lang === "en" ? "Eligibility" : "যোগ্যতা"}</span>
                              <span>{lang === "en" ? lvl.eligibilityEn : lvl.eligibilityBn}</span>
                            </div>
                          )}
                          {lvl.experienceRequiredEn && (
                            <div>
                              <span className="font-bold text-slate-400 block uppercase text-[9px]">{lang === "en" ? "Experience" : "অভিজ্ঞতা"}</span>
                              <span>{lang === "en" ? lvl.experienceRequiredEn : lvl.experienceRequiredBn}</span>
                            </div>
                          )}
                          {lvl.workshopEn && (
                            <div>
                              <span className="font-bold text-slate-400 block uppercase text-[9px]">{lang === "en" ? "Workshop" : "ওয়ার্কশপ"}</span>
                              <span>{lang === "en" ? lvl.workshopEn : lvl.workshopBn}</span>
                            </div>
                          )}
                          {lvl.recognitionEn && (
                            <div className="sm:col-span-2">
                              <span className="font-bold text-slate-400 block uppercase text-[9px]">{lang === "en" ? "Recognition" : "স্বীকৃতি"}</span>
                              <span className="text-editorial-accent font-bold">{lang === "en" ? lvl.recognitionEn : lvl.recognitionBn}</span>
                            </div>
                          )}
                          {lvl.specializationsEn && (
                            <div className="sm:col-span-2">
                              <span className="font-bold text-slate-400 block uppercase text-[9px]">{lang === "en" ? "Available Specializations" : "উপলব্ধ স্পেশালাইজেশন"}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(lang === "en" ? lvl.specializationsEn : lvl.specializationsBn).map((spec, sidx) => (
                                  <span key={sidx} className="px-2 py-0.5 bg-white border border-editorial-border text-[9px] font-semibold text-[#1A1A1A] font-sans">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Reviews Section */}
          <div id="course-reviews-section" className="bg-white border border-editorial-border p-5 sm:p-6 space-y-6 text-left mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border">
              <div>
                <h3 className="font-serif font-bold text-editorial-dark text-lg sm:text-xl">
                  {lang === "en" ? `Reviews for ${course.tutor}` : `${course.tutor}-এর জন্য রিভিউ`}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  {lang === "en" 
                    ? "Direct feedback from verified students enrolled in this course" 
                    : "এই কোর্সে এনরোল করা শিক্ষার্থীদের সরাসরি মতামত ও ফিডব্যাক"}
                </p>
              </div>

              {/* Summary Rating */}
              <div className="flex items-center gap-2.5 bg-[#F7F5F0] border border-editorial-border px-3.5 py-2">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const avg = reviews.length > 0 
                      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
                      : course.rating || 5;
                    return (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(avg) ? "fill-current text-amber-500" : "text-slate-300"
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="text-xs font-mono font-bold text-editorial-dark">
                  {reviews.length > 0 
                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                    : (course.rating || 4.8).toFixed(1)}{" "}
                  / 5.0 ({reviews.length} {lang === "en" ? "reviews" : "টি রিভিউ"})
                </div>
              </div>
            </div>

            {/* Leave a review block */}
            <div className="bg-[#F7F5F0] border border-editorial-border p-4 sm:p-5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-editorial-dark flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-editorial-accent" />
                {lang === "en" ? "Share Your Experience" : "আপনার অভিজ্ঞতা শেয়ার করুন"}
              </h4>

              {!isLoggedIn ? (
                <div className="text-xs text-slate-600 font-sans space-y-3">
                  <p>
                    {lang === "en" 
                      ? `Sign up or log in to rate and leave feedback for ${course.tutor}.` 
                      : `প্রশিক্ষক ${course.tutor}-কে রেটিং ও ফিডব্যাক দিতে দয়া করে লগইন বা সাইন আপ করুন।`}
                  </p>
                  {onOpenAuth && (
                    <button
                      onClick={onOpenAuth}
                      className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      {lang === "en" ? "Sign Up / Log In" : "সাইন আপ / লগইন"}
                    </button>
                  )}
                </div>
              ) : !progress.enrolledCourses.includes(course.id) ? (
                <p className="text-xs text-slate-500 font-sans italic">
                  {lang === "en"
                    ? "Only students enrolled in this masterclass can submit reviews for the instructor."
                    : "শুধুমাত্র এই মাস্টারক্লাসে ভর্তি হওয়া শিক্ষার্থীরাই প্রশিক্ষককে রিভিউ দিতে পারবেন।"}
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {lang === "en" ? "Your Rating:" : "আপনার রেটিং:"}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="text-amber-500 hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= userRating ? "fill-current text-amber-500" : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-1">
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={
                        lang === "en"
                          ? `Write your feedback for ${course.tutor} here...`
                          : `প্রশিক্ষক ${course.tutor}-এর জন্য আপনার মতামত এখানে লিখুন...`
                      }
                      className="w-full p-3 text-xs sm:text-sm bg-white border border-editorial-border focus:outline-hidden focus:border-editorial-dark font-sans"
                    ></textarea>
                  </div>

                  {reviewError && (
                    <p className="text-xs text-red-600 font-sans font-bold flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      {reviewError}
                    </p>
                  )}

                  {reviewSuccess && (
                    <p className="text-xs text-emerald-700 font-sans font-bold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {reviewSuccess}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {submittingReview ? (
                        <span>{lang === "en" ? "Submitting..." : "সাবমিট হচ্ছে..."}</span>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>{lang === "en" ? "Submit Review" : "রিভিউ সাবমিট করুন"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* List of reviews */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-sm text-editorial-dark border-b border-editorial-border pb-2">
                {lang === "en" ? "Student Feedback Feed" : "শিক্ষার্থীদের রিভিউ ও ফিডব্যাক সমূহ"}
              </h4>

              {loadingReviews ? (
                <div className="text-center py-6 text-xs text-slate-400 font-mono">
                  {lang === "en" ? "Loading reviews..." : "রিভিউ লোড হচ্ছে..."}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-sans italic">
                  {lang === "en" 
                    ? `No reviews submitted yet for ${course.tutor}. Be the first to leave a feedback!` 
                    : `প্রশিক্ষক ${course.tutor}-এর জন্য এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!`}
                </div>
              ) : (
                <div className="divide-y divide-editorial-border">
                  {reviews.map((review) => {
                    const isMyReview = currentUser && review.studentId === currentUser.id;
                    const initials = review.studentName
                      ? review.studentName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                      : "S";

                    return (
                      <div key={review.id} className="py-4 flex gap-4 items-start">
                        {/* Student Avatar Icon */}
                        <div className="h-8 w-8 bg-editorial-accent text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider flex-shrink-0">
                          {initials}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                            <span className="font-sans font-bold text-xs text-editorial-dark">
                              {review.studentName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(review.createdAt).toLocaleDateString(
                                lang === "en" ? "en-US" : "bn-BD",
                                { year: "numeric", month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>

                          {/* Star rating for this review */}
                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating ? "fill-current text-amber-500" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed whitespace-pre-wrap break-words">
                            {review.feedback}
                          </p>
                        </div>

                        {/* Actions (Delete if owner) */}
                        {isMyReview && (
                          <button
                            onClick={() => handleReviewDelete(review.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer flex-shrink-0"
                            title={lang === "en" ? "Delete review" : "রিভিউ ডিলিট করুন"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Lessons List Sidebar */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-editorial-border">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-400 font-sans">
              {lang === "en" ? "Course Syllabus" : "কোর্সের পাঠ্যসূচী"}
            </h3>
            <span className="text-xs text-[#1A1A1A] font-bold font-mono">
              {course.lessons.length} {t.lessonsCount}
            </span>
          </div>

          <div
            id="lessons-sidebar-list"
            className="rounded-none border border-editorial-border bg-white p-3 space-y-2.5 max-h-[360px] sm:max-h-[460px] overflow-y-auto"
          >
            {course.lessons.map((lesson, idx) => {
              const isCurrent = lesson.id === activeLesson.id;
              const isCompleted = isLessonCompleted(lesson.id);

              return (
                <button
                  key={lesson.id}
                  id={`syllabus-item-${lesson.id}`}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left p-3.5 rounded-none transition duration-150 flex items-center justify-between border cursor-pointer ${
                    isCurrent
                      ? "bg-[#F7F5F0] border-editorial-dark text-editorial-accent font-bold"
                      : "bg-white hover:bg-[#F7F5F0] border-editorial-border text-slate-700"
                  }`}
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <span className="text-xs font-serif font-bold text-editorial-dark bg-[#F7F5F0] h-6 w-6 rounded-none border border-editorial-border flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-xs sm:text-sm truncate leading-tight">
                        {lang === "en" ? lesson.titleEn : lesson.titleBn}
                      </h4>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono uppercase">{lesson.duration}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Play className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Certificate Award Banner if complete */}
          {isCourseComplete && (
            <div
              id="course-complete-award-banner"
              className="p-5 rounded-none bg-[#1A1A1A] text-white space-y-4 text-center border-2 border-editorial-accent shadow-lg"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 bg-white/10 rounded-none border border-white/20 mb-1">
                <Trophy className="h-6 w-6 text-editorial-accent" />
              </div>
              <h4 className="font-serif font-bold text-base sm:text-lg leading-snug italic">
                {lang === "en" ? "Curriculum Completed!" : "পাঠ্যসূচী সম্পন্ন হয়েছে!"}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans px-2">
                {t.courseCompletedText}
              </p>
              <button
                id="claim-certificate-bottom-btn"
                onClick={() => onViewCertificate(course)}
                className="w-full py-3 bg-white text-[#1A1A1A] hover:bg-slate-100 rounded-none text-xs font-bold uppercase tracking-widest shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="h-4 w-4 text-editorial-accent" />
                {t.claimCertificate}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
