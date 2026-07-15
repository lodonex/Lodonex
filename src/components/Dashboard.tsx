import React from "react";
import { BookOpen, Clock, Trophy, GraduationCap, Compass, Award, Sparkles, ChevronRight, Play, Star } from "lucide-react";
import { Language, Course, StudentProgress, Badge } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion } from "motion/react";
import HomeSlider from "./HomeSlider";
import AboutUs from "./AboutUs";
import StudentTestimonials from "./StudentTestimonials";
import { formatPrice } from "../utils/price";

interface DashboardProps {
  lang: Language;
  progress: StudentProgress;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  setCurrentTab: (tab: string) => void;
  onViewCertificate: (course: Course) => void;
}

// Icon Helper
const BadgeIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case "Compass":
      return <Compass className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    default:
      return <Trophy className={className} />;
  }
};

export default function Dashboard({
  lang,
  progress,
  courses,
  onSelectCourse,
  setCurrentTab,
  onViewCertificate,
}: DashboardProps) {
  const t = TRANSLATIONS[lang];

  // Filter courses that are enrolled
  const enrolledCourses = courses.filter((c) => progress.enrolledCourses.includes(c.id));

  // Calculate stats
  const totalEnrolled = enrolledCourses.length;
  const completedLessonsCount = progress.completedLessons.length;
  const hoursStudied = (completedLessonsCount * 0.4).toFixed(1); // 24 mins per lesson average

  // Helper to calculate course completion %
  const getCourseProgress = (course: Course) => {
    if (course.lessons.length === 0) return 0;
    const completedInThisCourse = course.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    return Math.round((completedInThisCourse / course.lessons.length) * 100);
  };

  return (
    <div id="student-dashboard" className="space-y-10 py-6">
      {/* Interactive Home Slider with Lead Chef Portrait */}
      <HomeSlider lang={lang} onExplore={() => setCurrentTab("courses")} />

      {/* Analytics Statistics Bento Cards */}
      <div id="dashboard-statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: "stat-courses",
            title: t.ourCourses,
            value: totalEnrolled,
            sub: lang === "en" ? "Enrolled Academics" : "ভর্তি হওয়া কোর্স",
            icon: <BookOpen className="h-5 w-5 text-editorial-accent" />,
            bgColor: "bg-white border-editorial-border"
          },
          {
            id: "stat-lessons",
            title: t.completedLessons,
            value: completedLessonsCount,
            sub: lang === "en" ? "Tutorial Modules" : "টিউটোরিয়াল মডিউল",
            icon: <GraduationCap className="h-5 w-5 text-editorial-accent" />,
            bgColor: "bg-white border-editorial-border"
          },
          {
            id: "stat-hours",
            title: t.totalHours,
            value: `${hoursStudied}h`,
            sub: lang === "en" ? "Culinary Practice" : "অনুশীলনের সময়",
            icon: <Clock className="h-5 w-5 text-editorial-accent" />,
            bgColor: "bg-white border-editorial-border"
          },
          {
            id: "stat-achievements",
            title: lang === "en" ? "Trophies" : "অর্জিত পদক",
            value: progress.badges.length,
            sub: lang === "en" ? "Out of 4 Milestones" : "৪টি মাইলফলকের মধ্যে",
            icon: <Trophy className="h-5 w-5 text-editorial-accent" />,
            bgColor: "bg-white border-editorial-border"
          }
        ].map((card, i) => (
          <motion.div
            key={card.id}
            id={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-none border flex flex-col justify-between ${card.bgColor} shadow-xs text-left`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">{card.title}</span>
              <div className="p-1.5 bg-[#F7F5F0] border border-editorial-border">{card.icon}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-editorial-dark leading-none mb-1">
                {card.value}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div id="dashboard-main-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Active Course Progression */}
        <div id="dashboard-progress-section" className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-editorial-border">
            <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-editorial-accent"></span>
              {t.myEnrolledCourses}
            </h2>
            <button
              id="browse-more-courses-btn"
              onClick={() => setCurrentTab("courses")}
              className="text-editorial-accent hover:text-red-800 text-xs font-bold uppercase tracking-wider underline transition"
            >
              {lang === "en" ? "Explore Store" : "কোর্স স্টোর"}
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div
              id="no-enrolled-courses-card"
              className="rounded-none border border-dashed border-editorial-border p-10 text-center bg-white"
            >
              <div className="mx-auto w-12 h-12 bg-editorial-accent/5 rounded-none border border-editorial-accent/20 flex items-center justify-center text-editorial-accent mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-editorial-dark mb-2">
                {lang === "en" ? "No Active Culinary Enrollments" : "কোনো অ্যাক্টিভ কোর্স নেই"}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 max-w-sm mx-auto leading-relaxed font-sans">
                {lang === "en"
                  ? "Enroll in professional masterclasses to unlock video lectures, interactive quizzes, and claim verified certificates!"
                  : "পেশাদার রন্ধন ক্লাসে ভর্তি হোন এবং ভিডিও লেকচার, কুইজ এবং ভেরিফাইড সার্টিফিকেট আনলক করুন!"}
              </p>
              <button
                id="dashboard-enroll-first-btn"
                onClick={() => setCurrentTab("courses")}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-[#1A1A1A] hover:bg-red-600 border border-transparent hover:border-red-600 text-white uppercase tracking-widest rounded-none shadow transition"
              >
                {t.enrollNow}
              </button>
            </div>
          ) : (
            <div id="enrolled-courses-list" className="space-y-4">
              {enrolledCourses.map((course) => {
                const completionPct = getCourseProgress(course);
                const isCompleted = completionPct === 100;

                return (
                  <motion.div
                    key={course.id}
                    id={`progress-card-${course.id}`}
                    whileHover={{ y: -1 }}
                    className="p-5 rounded-none border border-editorial-border bg-white shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-left"
                  >
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <img
                        src={course.image}
                        alt={course.titleEn}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-none border border-editorial-border object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-sans tracking-wider px-2 py-0.5 bg-[#F7F5F0] border border-editorial-border text-slate-500 font-bold mb-2 inline-block">
                          {lang === "en" ? course.category.toUpperCase() : t[course.category]}
                        </span>
                        <h3 className="font-serif font-bold text-editorial-dark text-base sm:text-lg leading-tight">
                          {lang === "en" ? course.titleEn : course.titleBn}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium font-sans">
                          {t.tutor}: <span className="font-bold text-[#1A1A1A]">{course.tutor}</span> • {course.lessons.length} {t.lessonsCount}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="w-24 sm:w-40 bg-[#E5E2D9] rounded-none h-1 overflow-hidden">
                            <div
                              className="bg-editorial-accent h-1 rounded-none transition-all duration-500"
                              style={{ width: `${completionPct}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-editorial-accent">
                            {completionPct}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col gap-2 items-end">
                      {isCompleted ? (
                        <button
                          id={`claim-cert-btn-${course.id}`}
                          onClick={() => onViewCertificate(course)}
                          className="w-full sm:w-auto text-center px-4 py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-none hover:bg-emerald-700 uppercase tracking-wider shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <GraduationCap className="h-4 w-4" />
                          {t.viewCertificate}
                        </button>
                      ) : (
                        <button
                          id={`start-learning-btn-${course.id}`}
                          onClick={() => onSelectCourse(course)}
                          className="w-full sm:w-auto text-center px-4 py-2.5 text-xs font-bold bg-[#1A1A1A] hover:bg-slate-800 text-white rounded-none transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
                        >
                          <Play className="h-3 w-3 fill-white" />
                          {completionPct > 0 ? (lang === "en" ? "Continue" : "চালিয়ে যান") : t.startLearning}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Achievements & Badges Wall */}
        <div id="dashboard-achievements-sidebar" className="space-y-6 text-left">
          <div className="flex items-center space-x-2 pb-3 border-b border-editorial-border">
            <Trophy className="h-5 w-5 text-editorial-accent" />
            <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400">
              {t.badgesAchievements}
            </h2>
          </div>

          <div
            id="badges-grid-container"
            className="p-5 rounded-none bg-white border border-editorial-border space-y-5 shadow-xs"
          >
            {progress.badges.map((badge) => {
              return (
                <div
                  key={badge.id}
                  id={`badge-item-${badge.id}`}
                  className="flex items-start gap-3.5 p-1 transition duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="h-11 w-11 rounded-none bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent shadow-xs">
                      <BadgeIcon iconName={badge.iconName} className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-editorial-dark text-sm">
                      {lang === "en" ? badge.titleEn : badge.titleBn}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">
                      {lang === "en" ? badge.descriptionEn : badge.descriptionBn}
                    </p>
                    <span className="text-[9px] uppercase tracking-wider text-editorial-accent font-bold bg-editorial-accent/5 px-2 py-0.5 border border-editorial-accent/10 mt-2 inline-block">
                      {lang === "en" ? "Unlocked Accomplishment" : "অর্জিত কৃতিত্ব"}
                    </span>
                  </div>
                </div>
              );
            })}

            {progress.badges.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 font-sans">
                {lang === "en" ? "Complete your first lesson to earn badges!" : "ব্যাজ পেতে আপনার প্রথম পাঠটি সম্পন্ন করুন!"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Featured / Our Courses Section */}
      <div id="dashboard-featured-courses" className="space-y-6 pt-10 border-t border-editorial-border">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-editorial-accent"></span>
            {t.ourCourses}
          </h2>
          <button
            onClick={() => setCurrentTab("courses")}
            className="text-editorial-accent hover:text-red-800 text-xs font-bold uppercase tracking-wider underline transition cursor-pointer"
          >
            {lang === "en" ? "View Full Catalog" : "সম্পূর্ণ ক্যাটালগ দেখুন"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {courses.map((course) => {
            const isEnrolled = progress.enrolledCourses.includes(course.id);
            return (
              <div
                key={course.id}
                id={`featured-course-card-${course.id}`}
                onClick={() => onSelectCourse(course)}
                className="group flex flex-col justify-between overflow-hidden rounded-none border border-editorial-border bg-white shadow-xs hover:border-[#1A1A1A] transition duration-200 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-editorial-border">
                  <img
                    src={course.image}
                    alt={course.titleEn}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#FDFCF9]/95 backdrop-blur-xs border border-editorial-border px-3 py-1 text-[9px] font-sans font-bold text-editorial-dark uppercase tracking-widest">
                    {lang === "en" ? course.category.toUpperCase() : t[course.category]}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white border border-editorial-border px-2 py-0.5 text-xs font-bold text-editorial-dark flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-editorial-accent text-editorial-accent" />
                    {course.rating.toFixed(1)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-editorial-dark text-base leading-snug group-hover:text-editorial-accent transition line-clamp-2">
                      {lang === "en" ? course.titleEn : course.titleBn}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans">
                      {t.tutor}: <span className="font-bold text-[#1A1A1A]">{course.tutor}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-editorial-border flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">
                      {course.lessons.length} {t.lessonsCount}
                    </span>
                    {isEnrolled ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                        {t.enrolled}
                      </span>
                    ) : (
                      <span className="text-editorial-accent font-bold">
                        {formatPrice(course.price, lang)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial About Us Section */}
      <AboutUs lang={lang} />

      {/* Student Testimonials Section */}
      <StudentTestimonials lang={lang} />
    </div>
  );
}

