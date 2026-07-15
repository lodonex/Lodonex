import React, { useState } from "react";
import { Star, Clock, BookOpen, ChefHat, Search, Filter, ShoppingCart, Check } from "lucide-react";
import { Language, Course, StudentProgress } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion } from "motion/react";
import { formatPrice } from "../utils/price";

interface CourseCatalogProps {
  lang: Language;
  courses: Course[];
  progress: StudentProgress;
  cart: Course[];
  onAddToCart: (course: Course) => void;
  onSelectCourse: (course: Course) => void;
}

export default function CourseCatalog({
  lang,
  courses,
  progress,
  cart,
  onAddToCart,
  onSelectCourse,
}: CourseCatalogProps) {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: t.allCategories },
    { id: "traditional", label: t.traditional },
    { id: "baking", label: t.baking },
    { id: "continental", label: t.continental },
    { id: "chinese", label: t.chinese },
  ];

  // Filter courses based on category & search
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const lowerQuery = searchQuery.toLowerCase().trim();
    if (!lowerQuery) return matchesCategory;

    const matchesSearch =
      course.titleEn.toLowerCase().includes(lowerQuery) ||
      course.titleBn.toLowerCase().includes(lowerQuery) ||
      course.descriptionEn.toLowerCase().includes(lowerQuery) ||
      course.descriptionBn.toLowerCase().includes(lowerQuery) ||
      course.tutor.toLowerCase().includes(lowerQuery) ||
      course.lessons.some((lesson) =>
        lesson.titleEn.toLowerCase().includes(lowerQuery) ||
        lesson.titleBn.toLowerCase().includes(lowerQuery) ||
        lesson.descriptionEn.toLowerCase().includes(lowerQuery) ||
        lesson.descriptionBn.toLowerCase().includes(lowerQuery)
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="course-catalog-section" className="space-y-8 py-6">
      {/* Catalog Banner in Editorial Aesthetic */}
      <div
        id="catalog-hero-banner"
        className="rounded-none bg-[#F7F5F0] p-6 sm:p-10 text-[#1A1A1A] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-editorial-border"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold italic text-editorial-dark">
            {lang === "en" ? "Academy Culinary Courses" : "একাডেমি রন্ধনশিল্পের বিশ্ব"}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl font-sans">
            {lang === "en"
              ? "Gain professional culinary certificates and credentials accepted across national hospitality sectors."
              : "জাতীয় আতিথেয়তা খাতে গ্রহণযোগ্য পেশাদার রন্ধনসম্পর্কীয় সার্টিফিকেট ও অভিজ্ঞতা অর্জন করুন।"}
          </p>
        </div>
        <div className="flex-shrink-0 bg-white px-5 py-3 rounded-none border border-editorial-border text-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-sans font-bold">
            {t.pricingInfo}
          </span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent mt-1 block">
            {lang === "en" ? "$12 - $29" : "৳১,৫০০ - ৳৩,৫০০"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div
        id="catalog-filters-bar"
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-none border border-editorial-border"
      >
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="course-search-input"
            type="text"
            placeholder={
              lang === "en"
                ? "Search title, chef, curriculum topics, lessons..."
                : "কোর্সের নাম, শেফ, পাঠ্যক্রম বা পাঠসূচি খুঁজুন..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:border-editorial-dark text-slate-950 font-sans"
          />
        </div>

        {/* Category Toggles */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-none text-xs font-bold transition duration-200 uppercase tracking-wider border whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#1A1A1A] text-white border-editorial-dark"
                  : "bg-white text-slate-500 border-editorial-border hover:bg-[#F7F5F0] hover:text-editorial-dark"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div id="catalog-empty-state" className="text-center py-12 text-slate-400 font-sans">
          <p>{lang === "en" ? "No courses matched your query." : "আপনার অনুসন্ধানের সাথে কোনো কোর্স মেলেনি।"}</p>
        </div>
      ) : (
        <div id="catalog-courses-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course, i) => {
            const isEnrolled = progress.enrolledCourses.includes(course.id);
            const isInCart = cart.some((item) => item.id === course.id);

            return (
              <motion.div
                key={course.id}
                id={`catalog-card-${course.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col justify-between overflow-hidden rounded-none border border-editorial-border bg-white shadow-xs hover:border-[#1A1A1A] transition duration-200 text-left"
              >
                {/* Course Header Image */}
                <div
                  onClick={() => onSelectCourse(course)}
                  className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-editorial-border cursor-pointer"
                >
                  <img
                    src={course.image}
                    alt={course.titleEn}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <div className="bg-[#FDFCF9]/95 backdrop-blur-xs border border-editorial-border px-3 py-1 rounded-none text-[9px] font-sans font-bold text-editorial-dark uppercase tracking-widest">
                      {lang === "en" ? course.category : t[course.category]}
                    </div>
                    <div className="bg-editorial-accent text-white px-2 py-0.5 rounded-none text-[8px] font-sans font-extrabold uppercase tracking-widest">
                      {lang === "en" ? `LQF Level ${course.lqfLevel}` : `এলকিউএফ লেভেল ${course.lqfLevel}`}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 border border-editorial-border px-2 py-0.5 rounded-none text-xs font-bold text-editorial-dark flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-editorial-accent text-editorial-accent" />
                    {course.rating.toFixed(1)}
                  </div>
                </div>

                {/* Course Body details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-wider font-sans font-medium">
                      <span>{course.tutor}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-editorial-accent" />
                        {course.duration}
                      </span>
                    </div>
                    <h3
                      onClick={() => onSelectCourse(course)}
                      className="text-lg sm:text-xl font-serif font-bold text-editorial-dark leading-tight group-hover:text-editorial-accent transition cursor-pointer"
                    >
                      {lang === "en" ? course.titleEn : course.titleBn}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-sans">
                      {lang === "en" ? course.descriptionEn : course.descriptionBn}
                    </p>

                    {/* Matched in Curriculum Indicator */}
                    {searchQuery.trim() && course.lessons.some(l => 
                      l.titleEn.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                      l.titleBn.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                      l.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                      l.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase().trim())
                    ) && (
                      <div className="mt-2 bg-[#F7F5F0] border-l-2 border-editorial-accent p-2 text-[11px] text-slate-600 font-sans text-left">
                        <span className="font-bold uppercase tracking-wider text-[9px] text-editorial-accent block mb-1">
                          {lang === "en" ? "Matched in Curriculum / Lesson:" : "পাঠ্যসূচি / পাঠে মিলেছে:"}
                        </span>
                        <ul className="list-disc pl-3.5 space-y-1">
                          {course.lessons
                            .filter(l => 
                              l.titleEn.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                              l.titleBn.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                              l.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                              l.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase().trim())
                            )
                            .slice(0, 2)
                            .map(l => (
                              <li key={l.id} className="text-slate-700 leading-tight">
                                <span className="font-medium text-editorial-dark">{lang === "en" ? l.titleEn : l.titleBn}</span>
                                <span className="block text-[10px] text-slate-400 line-clamp-1 italic">
                                  {lang === "en" ? l.descriptionEn : l.descriptionBn}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-editorial-border flex items-center justify-between gap-4">
                    {/* Price Tag */}
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-sans font-bold">
                        {lang === "en" ? "Course Fees" : "কোর্সের মূল্য"}
                      </span>
                      <span className="text-lg font-serif font-extrabold text-editorial-dark">
                        {formatPrice(course.price, lang)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest bg-white border border-editorial-border text-editorial-dark hover:bg-[#F7F5F0] transition rounded-none cursor-pointer"
                      >
                        {lang === "en" ? "Details" : "বিস্তারিত"}
                      </button>

                      {isEnrolled ? (
                        <button
                          id={`action-goto-${course.id}`}
                          onClick={() => onSelectCourse(course)}
                          className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#F7F5F0] border border-editorial-border text-editorial-dark rounded-none hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="h-4 w-4 text-editorial-accent" />
                          {t.startLearning}
                        </button>
                      ) : isInCart ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-none">
                          <Check className="h-4 w-4" />
                          {lang === "en" ? "In Cart" : "কার্টে আছে"}
                        </span>
                      ) : (
                        <button
                          id={`action-buy-${course.id}`}
                          onClick={() => onAddToCart(course)}
                          className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#1A1A1A] text-white rounded-none hover:bg-slate-800 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {t.buyCourse}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

