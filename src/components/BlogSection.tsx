import React, { useState } from "react";
import { BookOpen, Search, Clock, ArrowLeft, User, Calendar, Sparkles } from "lucide-react";
import { Language, BlogPost } from "../types";
import { motion } from "motion/react";

interface BlogSectionProps {
  lang: Language;
  blogs: BlogPost[];
  onSelectCourse?: (courseId: string) => void;
}

export default function BlogSection({ lang, blogs, onSelectCourse }: BlogSectionProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", labelEn: "All Articles", labelBn: "সকল আর্টিকেল" },
    { id: "Academy Courses", labelEn: "Academy Courses", labelBn: "একাডেমি কোর্স" },
    { id: "Baking", labelEn: "Baking Secrets", labelBn: "বেকিংয়ের গোপন তথ্য" },
    { id: "Continental", labelEn: "Continental Cuisines", labelBn: "মহাদেশীয় রান্না" },
    { id: "Traditional Bengali", labelEn: "Traditional Bengali", labelBn: "ঐতিহ্যবাহী বাঙালি" },
  ];

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory === "all" || blog.categoryEn === selectedCategory;
    const matchesSearch =
      blog.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.titleBn.includes(searchQuery) ||
      blog.excerptEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerptBn.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (selectedBlog) {
    // Reading mode
    return (
      <div id="blog-reading-view" className="space-y-6 py-6 max-w-3xl mx-auto text-left font-sans">
        {/* Back navigation */}
        <button
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-editorial-dark text-xs font-bold uppercase tracking-widest transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === "en" ? "Back to Articles" : "আর্টিকেলসমূহে ফিরে যান"}
        </button>

        {/* Article header image */}
        <div className="relative w-full aspect-video overflow-hidden border border-editorial-border bg-slate-100">
          <img
            src={selectedBlog.image}
            alt={selectedBlog.titleEn}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-[#FDFCF9]/95 backdrop-blur-xs border border-editorial-border px-3 py-1 text-[9px] font-bold text-editorial-dark uppercase tracking-widest">
            {lang === "en" ? selectedBlog.categoryEn : selectedBlog.categoryBn}
          </div>
        </div>

        {/* Article title & meta details */}
        <div className="space-y-4 border-b border-editorial-border pb-6">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-editorial-dark leading-tight italic">
            {lang === "en" ? selectedBlog.titleEn : selectedBlog.titleBn}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500 items-center">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4 text-editorial-accent" />
              <span className="font-bold text-slate-700">
                {lang === "en" ? selectedBlog.authorEn : selectedBlog.authorBn}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {selectedBlog.date}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="h-4 w-4 text-editorial-accent" />
              {lang === "en" ? selectedBlog.readTimeEn : selectedBlog.readTimeBn}
            </span>
          </div>
        </div>

        {/* Course Direct Back-Link Header Banner if applicable */}
        {selectedBlog.courseId && onSelectCourse && (
          <div className="p-4 bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                {lang === "en" ? "Associated Course Certification" : "সংশ্লিষ্ট কোর্স সার্টিফিকেট"}
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                {lang === "en" ? selectedBlog.titleEn : selectedBlog.titleBn}
              </p>
            </div>
            <button
              onClick={() => onSelectCourse(selectedBlog.courseId!)}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-red-900 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap"
            >
              {lang === "en" ? "Go to Course Page →" : "কোর্স পেজে যান →"}
            </button>
          </div>
        )}

        {/* Article content */}
        <article className="prose prose-slate max-w-none text-[#1A1A1A] leading-relaxed text-sm sm:text-base space-y-4 pt-2 font-serif font-light">
          <p className="text-lg italic text-slate-600 font-sans border-l-4 border-editorial-accent pl-4 py-1 leading-relaxed">
            {lang === "en" ? selectedBlog.excerptEn : selectedBlog.excerptBn}
          </p>
          <div className="space-y-2">
            {(lang === "en" ? selectedBlog.contentEn : selectedBlog.contentBn).split("\n").map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={idx} className="h-1" />;

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-bold font-serif text-editorial-dark mt-6 mb-2">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("#### ")) {
                return (
                  <h4 key={idx} className="text-sm sm:text-base font-bold font-sans text-editorial-dark mt-5 mb-2 border-b border-editorial-border/60 pb-1 uppercase tracking-wider">
                    {trimmed.replace("#### ", "")}
                  </h4>
                );
              }

              if (trimmed.startsWith("[BACKLINK:")) {
                const match = trimmed.match(/\[BACKLINK:(.*?)\]\s*(.*)/);
                const targetCourseId = match ? match[1] : "course-1";
                const backlinkText = match ? match[2] : trimmed;
                
                return (
                  <div key={idx} className="my-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1 font-sans">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 inline-block">
                        {lang === "en" ? "Course Back-Link" : "কোর্স ব্যাক-লিংক"}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                        {backlinkText.replace(/\*\*/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1")}
                      </p>
                    </div>
                    {onSelectCourse && (
                      <button
                        onClick={() => onSelectCourse(targetCourseId)}
                        className="px-5 py-2.5 bg-red-900 hover:bg-red-950 text-white text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer shadow-xs flex-shrink-0"
                      >
                        {lang === "en" ? "Enroll / View Course →" : "কোর্স এনরোল / বিস্তারিত দেখুন →"}
                      </button>
                    )}
                  </div>
                );
              }

              if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
                const bulletText = trimmed.substring(2);
                const parts = bulletText.split(/(\*\*.*?\*\*)/g);
                return (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 font-sans pl-2 my-1">
                    <span className="text-editorial-accent font-bold">•</span>
                    <span>
                      {parts.map((p, i) =>
                        p.startsWith("**") && p.endsWith("**") ? (
                          <strong key={i} className="font-bold text-slate-950">{p.slice(2, -2)}</strong>
                        ) : (
                          p
                        )
                      )}
                    </span>
                  </div>
                );
              }

              if (trimmed === "---") {
                return <hr key={idx} className="border-editorial-border my-6" />;
              }

              const parts = trimmed.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={idx} className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed my-1.5">
                  {parts.map((p, i) =>
                    p.startsWith("**") && p.endsWith("**") ? (
                      <strong key={i} className="font-bold text-slate-950">{p.slice(2, -2)}</strong>
                    ) : (
                      p
                    )
                  )}
                </p>
              );
            })}
          </div>
        </article>

        {/* Reading completion footer card */}
        <div className="mt-10 p-6 bg-[#F7F5F0] border border-editorial-border text-center space-y-3">
          <Sparkles className="h-6 w-6 text-editorial-accent mx-auto" />
          <h4 className="font-serif font-bold text-editorial-dark text-lg italic">
            {lang === "en" ? "Ready to Cook Like a Pro?" : "আপনি কি পেশাদারদের মতো রান্না করতে প্রস্তুত?"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === "en"
              ? "Join our premium certified masterclasses and learn step-by-step techniques directly from professional chefs."
              : "আমাদের প্রিমিয়াম সার্টিফাইড মাস্টারক্লাসে যোগ দিন এবং সরাসরি অভিজ্ঞ শেফদের থেকে ধাপে ধাপে রন্ধনশৈলী শিখুন।"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="blog-catalog-section" className="space-y-8 py-6">
      {/* Blog Hero Banner */}
      <div
        id="blog-hero-banner"
        className="rounded-none bg-[#F7F5F0] p-6 sm:p-10 text-[#1A1A1A] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-editorial-border"
      >
        <div className="space-y-2 text-left">
          <span className="inline-flex items-center gap-1 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
            <BookOpen className="h-3 w-3 text-editorial-accent" />
            {lang === "en" ? "Culinary Chronicles" : "রন্ধন ডায়েরি"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold italic text-editorial-dark mt-2">
            {lang === "en" ? "Lodonex Gastronomy Blog" : "লোডোনেক্স রন্ধনশিল্পের ব্লগ"}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl font-sans">
            {lang === "en"
              ? "Expert tutorials, culinary science insights, and the rich history behind regional ingredients."
              : "অভিজ্ঞদের রন্ধন কৌশল, রান্নার বিজ্ঞান এবং বিভিন্ন উপাদানের সমৃদ্ধ ইতিহাসের গল্প।"}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div
        id="blog-filters-bar"
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-none border border-editorial-border"
      >
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="blog-search-input"
            type="text"
            placeholder={lang === "en" ? "Search articles..." : "আর্টিকেল খুঁজুন..."}
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
              id={`blog-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-none text-xs font-bold transition duration-200 uppercase tracking-wider border whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#1A1A1A] text-white border-editorial-dark"
                  : "bg-white text-slate-500 border-editorial-border hover:bg-[#F7F5F0] hover:text-editorial-dark"
              }`}
            >
              {lang === "en" ? cat.labelEn : cat.labelBn}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div id="blog-empty-state" className="text-center py-12 text-slate-400 font-sans">
          <p>{lang === "en" ? "No articles found matching your query." : "আপনার অনুসন্ধানের সাথে কোনো আর্টিকেল মেলেনি।"}</p>
        </div>
      ) : (
        <div id="blog-posts-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              id={`blog-card-${blog.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col justify-between overflow-hidden rounded-none border border-editorial-border bg-white shadow-xs hover:border-[#1A1A1A] transition duration-200 text-left cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              {/* Blog Header Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-editorial-border">
                <img
                  src={blog.image}
                  alt={blog.titleEn}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#FDFCF9]/95 backdrop-blur-xs border border-editorial-border px-3 py-1 text-[9px] font-sans font-bold text-editorial-dark uppercase tracking-widest">
                  {lang === "en" ? blog.categoryEn : blog.categoryBn}
                </div>
              </div>

              {/* Blog Body details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                    <span>{lang === "en" ? blog.authorEn : blog.authorBn}</span>
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-editorial-dark leading-snug group-hover:text-editorial-accent transition line-clamp-2">
                    {lang === "en" ? blog.titleEn : blog.titleBn}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                    {lang === "en" ? blog.excerptEn : blog.excerptBn}
                  </p>
                </div>

                <div className="pt-3 border-t border-editorial-border flex items-center justify-between text-xs text-editorial-accent font-bold uppercase tracking-widest group-hover:text-red-800 transition">
                  <span>{lang === "en" ? "Read Article" : "আর্টিকেলটি পড়ুন"}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {lang === "en" ? blog.readTimeEn : blog.readTimeBn}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
