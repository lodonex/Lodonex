import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Clock, Star } from "lucide-react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import chefInstructorImage from "../assets/images/chef_instructor_1783228989569.jpg";

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
      image: chefInstructorImage,
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
    <div className="relative overflow-hidden border border-stone-800 bg-[#121212] text-stone-100 min-h-[420px] sm:min-h-[460px] flex items-center shadow-xl">
      {/* Background Subtle Gradient & Champagne Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-red-950/20 to-transparent pointer-events-none blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-stone-900 to-transparent pointer-events-none"></div>
      
      {/* Slide Container */}
      <div className="w-full h-full px-6 sm:px-12 py-10 relative z-10">
        <AnimatePresence mode="wait">
          {slides.map((slide, idx) => {
            if (idx !== currentIndex) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Side: Content */}
                <div className="md:col-span-7 text-left space-y-4 sm:space-y-6">
                  {/* Clean unboxed metadata with dot separators (Zero-Pill Discipline) */}
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-amber-400">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      {isEn ? slide.badgeEn : slide.badgeBn}
                    </span>
                    <span className="text-stone-600" aria-hidden="true">·</span>
                    <span className="text-stone-400 font-sans font-medium lowercase">
                      {isEn ? "international certification" : "আন্তর্জাতিক সার্টিফিকেশন"}
                    </span>
                  </div>
                  
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold leading-[1.15] text-stone-50 tracking-tight">
                    {isEn ? slide.titleEn : slide.titleBn}
                  </h1>
                  
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
                    {isEn ? slide.subtitleEn : slide.subtitleBn}
                  </p>
                  
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={onExplore}
                      className="bg-editorial-accent hover:bg-red-800 text-white px-6 sm:px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg border border-red-500/30 cursor-pointer flex items-center gap-2"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{isEn ? slide.ctaEn : slide.ctaBn}</span>
                    </button>
                    {slide.id === "chef-tawhid" && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400 tracking-wider">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9
                        </span>
                        <span>{isEn ? "Instructor Rating" : "প্রশিক্ষক রেটিং"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Chef Portrait or Course Showcase */}
                <div className="md:col-span-5 flex justify-center md:justify-end">
                  <div className="relative group max-w-[280px] sm:max-w-[320px]">
                    {/* Double Luxury Accent Border */}
                    <div className="absolute -inset-2 border border-amber-500/30 pointer-events-none translate-x-1.5 translate-y-1.5"></div>
                    <div className="border border-stone-700 bg-stone-900 p-1.5 shadow-2xl relative">
                      <img
                        src={slide.image}
                        alt="Culinary Instructor"
                        className="w-full aspect-square object-cover grayscale-10 group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-left">
                        <span className="text-[10px] font-mono text-amber-300 font-semibold tracking-wider uppercase block">
                          {isEn ? "Lodonex Faculty" : "লোডোনেক্স ফ্যাকাল্টি"}
                        </span>
                        <span className="text-xs font-bold text-white block">
                          {slide.id === "chef-tawhid" ? "Executive Chef Tawhid Shekh" : slide.id === "baking-secrets" ? "Pastry Chef Robert Gomes" : "Sous Chef Tanvir Ahmed"}
                        </span>
                      </div>
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
        className="absolute left-3 sm:left-5 p-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 transition z-20 cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-5 p-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 transition z-20 cursor-pointer shadow-md"
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
            className={`h-1.5 transition-all duration-300 ${
              idx === currentIndex
                ? "bg-amber-400 w-8"
                : "bg-stone-600 hover:bg-stone-500 w-2.5"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
