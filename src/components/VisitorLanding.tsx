import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  Compass,
  BookOpen,
  Clock,
  Award,
  Star,
  ArrowRight,
  BookMarked,
  Briefcase,
  Home as HomeIcon,
  Building,
  Plane,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Camera,
  ChevronRight,
} from "lucide-react";
import { Language, Course } from "../types";
import { motion } from "motion/react";
import HomeSlider from "./HomeSlider";
import AboutUs from "./AboutUs";
import StudentTestimonials from "./StudentTestimonials";
import { formatPrice } from "../utils/price";

interface VisitorLandingProps {
  lang: Language;
  onOpenAuth: () => void;
  courses: Course[];
  onSelectTab: (tab: string) => void;
  onSelectCourse: (course: Course) => void;
}

export default function VisitorLanding({
  lang,
  onOpenAuth,
  courses,
  onSelectTab,
  onSelectCourse,
}: VisitorLandingProps) {
  const isEn = lang === "en";

  // State for Career Pathway & Global Salary Calculator
  const [selectedExperience, setSelectedExperience] = useState<"fresher" | "line-cook" | "sous-chef">("fresher");
  const [selectedDestination, setSelectedDestination] = useState<"dubai" | "saudi" | "uk" | "dhaka">("dubai");

  // Salary and career outcome matrix
  const salaryMatrix = {
    fresher: {
      dubai: { salary: "AED 3,800 - 5,500/mo (≈ ৳১,২৫,০০০ - ১,৮০,০০০)", level: "LQF Level 3-4", time: "3 to 6 Months", housing: "Furnished Studio / Shared Luxury Villa", visa: "2-Year Employment Visa" },
      saudi: { salary: "SAR 4,000 - 6,000/mo (≈ ৳১,৩০,০০০ - ১,৯৫,০০০)", level: "LQF Level 3-4", time: "3 to 6 Months", housing: "Hostel Provided + 3 Meals", visa: "Standard Work Visa" },
      uk: { salary: "£1,800 - 2,400/mo (≈ ৳২,৭০,০০০ - ৩,৬০,০০০)", level: "LQF Level 5 Diploma", time: "6 to 12 Months", housing: "Subsidized Staff Accommodation", visa: "Skilled Worker Visa" },
      dhaka: { salary: "৳৩৫,০০০ - ৫০,০০০/mo", level: "LQF Level 2-3", time: "3 Months", housing: "Day Scholar / Banani Hostel", visa: "Domestic Placement" }
    },
    "line-cook": {
      dubai: { salary: "AED 6,000 - 8,500/mo (≈ ৳১,৯৮,০০০ - ২,৮০,০০০)", level: "LQF Level 4-5", time: "4 Months Fast-Track", housing: "Furnished 1-Bed / Staff Residence", visa: "Hospitality Executive Visa" },
      saudi: { salary: "SAR 6,500 - 9,000/mo (≈ ৳২,১০,০০০ - ২,৯০,০০০)", level: "LQF Level 4-5", time: "4 Months Fast-Track", housing: "Private Staff Accommodation", visa: "Standard Work Visa" },
      uk: { salary: "£2,600 - 3,400/mo (≈ ৳৩,৯০,০০০ - ৫,১০,০০০)", level: "LQF Level 6 Advanced", time: "6 Months", housing: "Assisted Housing Allowance", visa: "Tier 2 Hospitality Visa" },
      dhaka: { salary: "৳৫৫,০০০ - ৭৫,০০০/mo", level: "LQF Level 4", time: "3 Months", housing: "Hostel Option", visa: "5-Star Hotel Placement" }
    },
    "sous-chef": {
      dubai: { salary: "AED 10,000 - 16,000/mo (≈ ৳৩,৩০,০০০ - ৫,২৫,০০০)", level: "LQF Level 6-7 Executive", time: "Direct Master Assessment", housing: "Private Luxury Apartment", visa: "Executive Work Permit" },
      saudi: { salary: "SAR 11,000 - 17,500/mo (≈ ৳৩,৬০,০০০ - ৫,৭০,০০০)", level: "LQF Level 6-7 Executive", time: "Direct Master Assessment", housing: "Full Villa Housing + Medical", visa: "Executive Visa" },
      uk: { salary: "£3,800 - 5,200/mo (≈ ৳৫,৭০,০০০ - ৭,৮০,০০০)", level: "LQF Level 7-8 Master", time: "Specialized Trade Test", housing: "Corporate Relocation Pack", visa: "Skilled Sponsor License" },
      dhaka: { salary: "৳৯০,০০০ - ১,৫০,০০০/mo", level: "LQF Level 6", time: "Executive Track", housing: "Executive Allowance", visa: "Executive Chef Role" }
    }
  };

  const currentOutcome = salaryMatrix[selectedExperience][selectedDestination];

  return (
    <div id="visitor-landing" className="space-y-12 py-4 text-left font-sans">
      {/* Interactive Home Slider with Lead Chef Portrait */}
      <HomeSlider lang={lang} onExplore={onOpenAuth} />

      {/* GLOBAL CHEF JOB & ACCOMMODATION SPOTLIGHT BANNER */}
      <div className="bg-[#1A1A1A] border border-stone-800 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-editorial-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-editorial-accent text-white font-mono text-[9px] uppercase tracking-widest font-extrabold flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {isEn ? "Dubai & European Job Relocation" : "দুবাই ও ইউরোপে শেফ নিয়োগ ও আবাসন"}
              </span>
              <span className="px-2.5 py-0.5 bg-stone-800 text-stone-300 font-mono text-[9px] uppercase tracking-wider font-bold">
                {isEn ? "100% Housing Included" : "১০০% ফার্নিশড আবাসন নিশ্চিত"}
              </span>
            </div>

            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-white leading-tight">
              {isEn
                ? "Fast-Track Your Culinary Career in Dubai, UAE & Europe with Furnished Housing"
                : "দুবাই ও ইউরোপের ৫-তারকা রেস্তোরাঁয় চাকরি এবং নিশ্চিত আবাসন সুবিধা"}
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-sans">
              {isEn
                ? "Lodonex partners directly with premier luxury hotel chains across Dubai Marina, Jumeirah, Riyadh, and London. Enroll in our LQF Level 3-5 diploma tracks to secure guaranteed interview slots, verified employment visas, and furnished chef apartments."
                : "লোডোনেক্সের রয়েছে দুবাই মেরিনা, জুমেইরাহ, রিয়াদ ও ইউরোপের শীর্ষ হোটেল চেইনের সাথে সরাসরি সমঝোতা চুক্তি। এলকিউএফ ডিপ্লোমা শেষ করলেই থাকছে নিশ্চিত ইন্টারভিউ এবং আবাসন সহ আন্তর্জাতিক কর্মসংস্থান।"}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-stone-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isEn ? "Dubai Marina Staff Villas" : "দুবাই মেরিনা স্টাফ ভিলা"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isEn ? "Dhaka Central Apprentice Hostel" : "ঢাকা সেন্ট্রাল শিক্ষার্থী হোস্টেল"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isEn ? "Govt. Registered (DNCC/2026)" : "সরকারি নিবন্ধিত একাডেমি"}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <button
              onClick={() => {
                onSelectTab("jobs");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full py-3.5 px-6 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Briefcase className="h-4 w-4" />
              <span>{isEn ? "Explore Job & Accommodation" : "চাকরি ও আবাসন পোর্টাল দেখুন"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                onSelectTab("gallery");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span>{isEn ? "View Culinary Gallery" : "রন্ধন গ্যালারি দেখুন"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CULINARY PATHWAY & SALARY ESTIMATOR CALCULATOR */}
      <div className="bg-[#FDFCF9] border border-editorial-border p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-editorial-accent font-mono block">
            {isEn ? "Interactive Career Forecaster" : "ইন্টারঅ্যাক্টিভ ক্যারিয়ার ও বেতন ক্যালকুলেটর"}
          </span>
          <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
            {isEn ? "Calculate Your Global Chef Salary & Placement Horizon" : "আপনার বৈশ্বিক বেতন ও আন্তর্জাতিক কর্মসংস্থানের পূর্বাভাস জানুন"}
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            {isEn
              ? "Select your current culinary background and dream work destination to see the recommended curriculum tier, expected monthly earnings, and accommodation perks."
              : "আপনার বর্তমান রান্নার অভিজ্ঞতা ও পছন্দের দেশ সিলেক্ট করে আনুমানিক মাসিক বেতন, উপযুক্ত কোর্স লেভেল এবং আবাসন সুবিধা দেখে নিন।"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            {/* Step 1: Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? "1. Your Culinary Experience" : "১. আপনার রান্নার অভিজ্ঞতা"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "fresher", en: "Absolute Beginner", bn: "নতুন / শিক্ষানবিস" },
                  { id: "line-cook", en: "Cook / Assistant", bn: "সহকারী শেফ / কুক" },
                  { id: "sous-chef", en: "Experienced Chef", bn: "অভিজ্ঞ শেফ" },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExperience(exp.id as any)}
                    className={`p-3 text-left border text-xs transition cursor-pointer flex flex-col justify-between ${
                      selectedExperience === exp.id
                        ? "bg-editorial-dark text-white border-editorial-dark font-bold"
                        : "bg-white text-slate-700 border-editorial-border hover:bg-stone-50"
                    }`}
                  >
                    <span className="font-serif text-xs block">{isEn ? exp.en : exp.bn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Target Destination */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {isEn ? "2. Target Relocation Country" : "২. পছন্দের কর্মসংস্থান দেশ"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "dubai", en: "Dubai (UAE)", bn: "দুবাই (ইউএই)" },
                  { id: "saudi", en: "Saudi Arabia", bn: "সৌদি আরব" },
                  { id: "uk", en: "United Kingdom", bn: "যুক্তরাজ্য (UK)" },
                  { id: "dhaka", en: "Dhaka (5-Star)", bn: "ঢাকা (৫-তারকা)" },
                ].map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedDestination(dest.id as any)}
                    className={`p-2.5 text-center border text-xs transition cursor-pointer ${
                      selectedDestination === dest.id
                        ? "bg-editorial-accent text-white border-editorial-accent font-bold"
                        : "bg-white text-slate-700 border-editorial-border hover:bg-stone-50"
                    }`}
                  >
                    <span className="block text-[11px]">{isEn ? dest.en : dest.bn}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Forecast Result Card */}
          <div className="lg:col-span-6 bg-[#F7F5F0] border-2 border-editorial-accent/30 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-editorial-accent">
                {isEn ? "Verified Placement Forecast" : "আনুমানিক ফলাফল ও সুযোগসমূহ"}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5">
                {currentOutcome.visa}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">{isEn ? "Estimated Starting Monthly Salary" : "সম্ভাব্য মাসিক প্রারম্ভিক বেতন"}</span>
              <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-editorial-dark text-emerald-800">
                {currentOutcome.salary}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-editorial-border/40">
              <div className="bg-white p-2.5 border border-editorial-border">
                <span className="block text-[9px] uppercase font-mono text-slate-400 font-bold">{isEn ? "Recommended Track" : "প্রয়োজনীয় কোর্স লেভেল"}</span>
                <span className="font-bold text-slate-800 text-xs">{currentOutcome.level}</span>
              </div>
              <div className="bg-white p-2.5 border border-editorial-border">
                <span className="block text-[9px] uppercase font-mono text-slate-400 font-bold">{isEn ? "Preparation Timeline" : "প্রশিক্ষণ সময়কাল"}</span>
                <span className="font-bold text-slate-800 text-xs">{currentOutcome.time}</span>
              </div>
            </div>

            <div className="bg-white p-3 border border-editorial-border flex items-start gap-2 text-xs">
              <HomeIcon className="h-4 w-4 text-editorial-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[11px]">{isEn ? "Accommodation Package:" : "আবাসন প্যাকেজ:"}</span>
                <span className="text-slate-600 text-[11px]">{currentOutcome.housing}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectTab("jobs");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full py-2.5 bg-editorial-dark hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isEn ? "Apply For This Track & Accommodation" : "এই ট্র্যাকে আবেদন ও আবাসন বুক করুন"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Path Steps Section */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.2em] text-editorial-accent font-extrabold block font-mono">
            {isEn ? "Three-Step Academic Journey" : "৩-ধাপে আপনার সার্টিফিকেট অর্জন"}
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold italic text-editorial-dark mt-1">
            {isEn ? "How the Academy Gateway Works" : "লোডোনেক্স একাডেমি কীভাবে কাজ করে"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-editorial-border space-y-4">
            <div className="h-10 w-10 bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent font-serif font-bold text-lg">
              1
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-sm text-editorial-dark">
                {isEn ? "Create Student Account" : "১. শিক্ষার্থী অ্যাকাউন্ট তৈরি"}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isEn
                  ? "Sign up securely using your personal email address. New registrations are automatically queued for administrative review."
                  : "আপনার ব্যক্তিগত ইমেল অ্যাড্রেস দিয়ে নিবন্ধন সম্পন্ন করুন। নতুন আবেদনসমূহ প্রশাসনিক অনুমোদনের তালিকায় যুক্ত হবে।"}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border border-editorial-border space-y-4">
            <div className="h-10 w-10 bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent font-serif font-bold text-lg">
              2
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-sm text-editorial-dark">
                {isEn ? "Administrative Activation" : "২. প্রশাসনিক অনুমোদন"}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isEn
                  ? "Our administration reviews enrollment requests. (Use our Sandbox Panel at the bottom of the page to simulate instant approval!)"
                  : "আমাদের অ্যাডমিন টিম রন্ধন কোর্সের আবেদনপত্র অনুমোদন করবে। (সহজে প্রিভিউ করতে পেজের নিচের প্যানেল দিয়ে সাথে সাথে অনুমোদন দিন!)"}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border border-editorial-border space-y-4">
            <div className="h-10 w-10 bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent font-serif font-bold text-lg">
              3
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-sm text-editorial-dark">
                {isEn ? "Unlock Learning & Certificates" : "৩. শিক্ষা এবং সার্টিফিকেট অর্জন"}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isEn
                  ? "Gain full access to update your course progress, log custom recipes, complete interactive quizzes, and unlock digital diplomas."
                  : "আপনার ড্যাশবোর্ড থেকে কোর্সের পড়ালেখা শুরু করুন, কুইজ খেলুন, রেসিপি জার্নাল লিখুন এবং ভেরিফাইড রন্ধন সার্টিফিকেট অর্জন করুন।"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Masterclass Tracks */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-editorial-accent font-extrabold block font-mono">
              {isEn ? "Academic Syllabus" : "আমাদের সিলেবাসসমূহ"}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold italic text-editorial-dark mt-1">
              {isEn ? "Explore Prestigious Tracks" : "পেশাদার রন্ধন কোর্সসমূহ"}
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectTab("courses");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-xs font-bold text-editorial-accent hover:text-red-800 uppercase tracking-wider flex items-center gap-1 transition cursor-pointer self-start sm:self-auto"
          >
            <span>{isEn ? "View All Masterclasses" : "সবগুলো মাস্টারক্লাস দেখুন"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-editorial-border bg-[#FDFCF9] overflow-hidden flex flex-col justify-between hover:shadow-xs transition duration-300 h-full min-h-[420px]"
            >
              <div
                onClick={() => onSelectCourse(course)}
                className="aspect-video w-full relative overflow-hidden bg-neutral-100 flex-shrink-0 cursor-pointer"
              >
                <img
                  src={course.image}
                  alt={course.titleEn}
                  className="h-full w-full object-cover hover:scale-102 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 bg-editorial-dark text-white font-bold text-[8px] uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="px-2 py-0.5 bg-editorial-accent text-white font-bold text-[8px] uppercase tracking-wider">
                    {isEn ? `LQF Level ${course.lqfLevel}` : `এলকিউএফ লেভেল ${course.lqfLevel}`}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-editorial-accent" />
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{isEn ? course.levelEn : course.levelBn}</span>
                  </div>
                  <h3
                    onClick={() => onSelectCourse(course)}
                    className="font-serif font-bold text-sm sm:text-base text-editorial-dark leading-snug cursor-pointer hover:text-editorial-accent transition line-clamp-2 min-h-[2.5rem]"
                  >
                    {isEn ? course.titleEn : course.titleBn}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {isEn ? course.descriptionEn : course.descriptionBn}
                  </p>
                </div>

                <div className="pt-2 border-t border-editorial-border/40 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">{isEn ? "Course Price" : "কোর্স মূল্য"}</span>
                    <span className="font-serif font-extrabold text-sm text-editorial-dark">{formatPrice(course.price, lang)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-2.5 py-1.5 bg-white border border-editorial-border text-editorial-dark hover:bg-[#F7F5F0] text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      {isEn ? "Details" : "বিস্তারিত"}
                    </button>
                    <button
                      onClick={onOpenAuth}
                      className="px-2.5 py-1.5 bg-[#F7F5F0] hover:bg-red-600 border border-editorial-border text-editorial-dark hover:text-white hover:border-red-600 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      {isEn ? "Enroll" : "ভর্তি"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial About Us Section */}
      <AboutUs
        lang={lang}
        onNavigateToJobs={() => {
          onSelectTab("jobs");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateToCourses={() => {
          onSelectTab("courses");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Student Testimonials Section */}
      <StudentTestimonials lang={lang} />

      {/* Teaser Quote / Value Proposition */}
      <div className="p-6 sm:p-8 bg-[#F7F5F0] border border-editorial-border flex flex-col sm:flex-row items-center gap-6">
        <div className="h-14 w-14 bg-editorial-accent/10 border border-editorial-accent/20 flex items-center justify-center text-editorial-accent flex-shrink-0">
          <BookMarked className="h-7 w-7" />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h4 className="font-serif font-bold text-sm text-editorial-dark italic">
            {isEn ? "Are you an existing culinary apprentice?" : "আপনি কি একাডেমির নিবন্ধিত শিক্ষার্থী?"}
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isEn
              ? "If you already created your student credentials, click on the Register / Log In button in the top-right menu to log back into your personalized workspace."
              : "আপনার শিক্ষার্থী অ্যাকাউন্ট তৈরি করা থাকলে, পুনরায় সাইন ইন করতে উপরের ডানদিকের 'রেজিস্টার / লগইন' বাটনে ক্লিক করুন।"}
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-4 py-2 bg-editorial-dark hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest transition cursor-pointer flex-shrink-0"
        >
          {isEn ? "Access Dashboard" : "ড্যাশবোর্ড প্রবেশ"}
        </button>
      </div>
    </div>
  );
}
