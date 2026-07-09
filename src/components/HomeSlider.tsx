import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Clock, Star } from "lucide-react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HomeSliderProps {
  lang: Language;
  onExplore: () => void;
}

export default function HomeSlider({ lang, onExplore }: HomeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: "chef-tawhid",
      titleEn: "Master Culinary Arts with Bangladesh's Premier Gastronomy Mentors",
      titleBn: "বাংলাদেশের শীর্ষস্থানীয় রন্ধন বিশেষজ্ঞদের সাথে রান্নার শিল্পে পারদর্শী হয়ে উঠুন",
      subtitleEn: "Featuring our senior chef instructor, specialized in classical heritage, commercial baking, and advanced plating. Complete certified masterclasses with hands-on assessments.",
      subtitleBn: "আমাদের সিনিয়র শেফ ইন্সট্রাক্টরদের অধীনে ঐতিহ্যবাহী রান্না, বাণিজ্যিক বেকিং এবং আধুনিক পরিবেশন শৈলী শিখুন। সফলভাবে কোর্স সম্পন্ন করে অর্জন করুন পেশাদার সার্টিফিকেট।",
      badgeEn: "Lead Academic Mentor",
      badgeBn: "প্রধান একাডেমি মেন্টর",
      // Reference our generated high quality chef image
      image: "/src/assets/images/chef_instructor_1783228989569.jpg",
      ctaEn: "Browse Masterclasses",
      ctaBn: "মাস্টারক্লাস দেখুন"
    },
    {
      id: "baking-secrets",
      titleEn: "Unlock the Secrets of Professional Baking & Pastry",
      titleBn: "পেশাদার বেকিং এবং পেস্ট্রির গোপন রহস্য উন্মোচন করুন",
      subtitleEn: "From sourdough chemistry to flawless French macarons and beautiful multi-layered cakes. Learn commercial baking secrets with Chef Robert Gomes.",
      subtitleBn: "টকমিষ্টি পাউরুটির রসায়ন থেকে শুরু করে নিখুঁত ফরাসি ম্যাক্যারন এবং চমৎকার পেস্ট্রি তৈরি। শেফ রবার্ট গোমেজের সাথে বেকিংয়ের গোপন সূত্র শিখুন।",
      badgeEn: "Baking & Desserts",
      badgeBn: "বেকিং ও ডেজার্ট",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      ctaEn: "Explore Baking",
      ctaBn: "বেকিং কোর্স দেখুন"
    },
    {
      id: "continental-arts",
      titleEn: "Master Western Sauces & Fine Dining Plating",
      titleBn: "ওয়েস্টার্ন সস এবং ফাইন ডাইনিং প্লেটিং থিওরি শিখুন",
      subtitleEn: "Elevate your dishes with mother sauces (Béchamel, Velouté) and pan-searing methods under Chef Tanvir Ahmed.",
      subtitleBn: "মাদার সস (বেশামেল, ভেলুটে) এবং প্যান-সিয়ারিং পদ্ধতিতে খাবার তৈরির মাধ্যমে আপনার দক্ষতাকে নতুন মাত্রায় নিয়ে যান।",
      badgeEn: "Continental Cuisine",
      badgeBn: "মহাদেশীয় রান্না",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      ctaEn: "Learn Continental",
      ctaBn: "কন্টিনেন্টাল শিখুন"
    }
  ];

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const isEn = lang === "en";

  return (
    <div className="relative overflow-hidden border border-editorial-border bg-[#F7F5F0] min-h-[380px] sm:min-h-[440px] flex items-center">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-radial from-editorial-accent/10 to-transparent pointer-events-none"></div>
      
      {/* Slide Container */}
      <div className="w-full h-full px-4 sm:px-10 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {slides.map((slide, idx) => {
            if (idx !== currentIndex) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                {/* Left Side: Content */}
                <div className="md:col-span-7 text-left space-y-4 sm:space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 text-xs font-bold uppercase tracking-widest rounded-none">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    {isEn ? slide.badgeEn : slide.badgeBn}
                  </span>
                  
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light leading-[1.1] text-editorial-dark tracking-tight">
                    {isEn ? slide.titleEn : slide.titleBn}
                  </h1>
                  
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
                    {isEn ? slide.subtitleEn : slide.subtitleBn}
                  </p>
                  
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={onExplore}
                      className="bg-editorial-dark text-white px-5 sm:px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      {isEn ? slide.ctaEn : slide.ctaBn}
                    </button>
                    {slide.id === "chef-tawhid" && (
                      <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest">
                        ⭐ 4.9 {isEn ? "Instructor Rating" : "প্রশিক্ষক রেটিং"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Chef Portrait or Course Showcase */}
                <div className="md:col-span-5 flex justify-center md:justify-end">
                  <div className="relative group max-w-[280px] sm:max-w-[320px]">
                    {/* Editorial double borders */}
                    <div className="absolute -inset-2 border border-dashed border-editorial-accent/30 pointer-events-none translate-x-1 translate-y-1"></div>
                    <div className="border border-editorial-border p-1 bg-white">
                      <img
                        src={slide.image}
                        alt="Culinary Instructor"
                        className="w-full aspect-square object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-500 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 p-1.5 sm:p-2 bg-white/90 hover:bg-editorial-dark hover:text-white border border-editorial-border text-editorial-dark transition rounded-none z-20 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 p-1.5 sm:p-2 bg-white/90 hover:bg-editorial-dark hover:text-white border border-editorial-border text-editorial-dark transition rounded-none z-20 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 transition-all rounded-none ${
              idx === currentIndex
                ? "bg-editorial-dark w-6"
                : "bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
