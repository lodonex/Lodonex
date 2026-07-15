import React from "react";
import { Sparkles, Shield, Compass, BookOpen, Clock, Award, Star, ArrowRight, BookMarked } from "lucide-react";
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

  return (
    <div id="visitor-landing" className="space-y-12 py-4 text-left font-sans">
      {/* Interactive Home Slider with Lead Chef Portrait */}
      <HomeSlider lang={lang} onExplore={onOpenAuth} />

      {/* Structured Path Steps Section */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.2em] text-editorial-accent font-extrabold block">
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-editorial-accent font-extrabold block">
              {isEn ? "Academic Syllabus" : "আমাদের সিলেবাসসমূহ"}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold italic text-editorial-dark mt-1">
              {isEn ? "Explore Prestigious Tracks" : "পেশাদার রন্ধন কোর্সসমূহ"}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab("courses")}
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
      <AboutUs lang={lang} />

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
