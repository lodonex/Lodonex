import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import chefInstructorImage from "../assets/images/chef_instructor_1783228989569.jpg";
import ebookMockupImage from "../assets/images/regenerated_image_1791355418210.png";

interface HomeSliderProps {
  lang: Language;
  onExplore: () => void;
  onNavigate?: (path: string) => void;
}

export default function HomeSlider({ lang, onExplore, onNavigate }: HomeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: "culinary-ebook",
      productName: "Lodonex Culinary E-Book for Students",
      titleEn: "MASTER YOUR CULINARY SKILLS",
      titleBn: "আপনার রন্ধনশিল্প দক্ষতা অনন্য উচ্চতায় নিন",
      subtitleEn: "Explore 131+ Recipes, 22 Cuisine & Recipe Categories, and practical culinary knowledge in the Lodonex Culinary E-Book for Students.",
      subtitleBn: "লোডোনেক্স কালিনারি ই-বুকে ১৩১+ রেসিপি, ২২টি ক্যাটাগরি এবং বাস্তবমুখী রন্ধন জ্ঞান অন্বেষণ করুন।",
      badgeEn: "Lodonex Culinary E-Book for Students",
      badgeBn: "লোডোনেক্স কালিনারি ই-বুক ফর স্টুডেন্টস",
      metaEn: "official digital textbook",
      metaBn: "অফিসিয়াল ডিজিটাল টেক্সটবুক",
      price: "USD $1,099",
      image: ebookMockupImage,
      ctaEn: "VIEW DETAILS",
      ctaBn: "বিস্তারিত দেখুন",
      targetUrl: "/culinary-ebook",
      isEbook: true,
    },
    {
      id: "chef-tawhid",
      titleEn: "Master Culinary Arts with Bangladesh's Premier Gastronomy Mentors",
      titleBn: "বাংলাদেশের শীর্ষস্থানীয় রন্ধন বিশেষজ্ঞদের সাথে রান্নার শিল্পে পারদর্শী হয়ে উঠুন",
      subtitleEn: "Featuring our senior chef instructor, specialized in classical heritage, commercial baking, and advanced plating. Complete certified masterclasses with hands-on assessments.",
      subtitleBn: "আমাদের সিনিয়র শেফ ইন্সট্রাক্টরদের অধীনে ঐতিহ্যবাহী রান্না, বাণিজ্যিক বেকিং এবং আধুনিক পরিবেশন শৈলী শিখুন। সফলভাবে কোর্স সম্পন্ন করে অর্জন করুন পেশাদার সার্টিফিকেট।",
      badgeEn: "Lead Academic Mentor",
      badgeBn: "প্রধান একাডেমি মেন্টর",
      metaEn: "international certification",
      metaBn: "আন্তর্জাতিক সার্টিফিকেশন",
      // Reference our generated high quality chef image
      image: chefInstructorImage,
      ctaEn: "Browse Masterclasses",
      ctaBn: "মাস্টারক্লাস দেখুন",
      isEbook: false,
    },
    {
      id: "baking-secrets",
      titleEn: "Unlock the Secrets of Professional Baking & Pastry",
      titleBn: "পেশাদার বেকিং এবং পেস্ট্রির গোপন রহস্য উন্মোচন করুন",
      subtitleEn: "From sourdough chemistry to flawless French macarons and beautiful multi-layered cakes. Learn commercial baking secrets with Chef Robert Gomes.",
      subtitleBn: "টকমিষ্টি পাউরুটির রসায়ন থেকে শুরু করে নিখুঁত ফরাসি ম্যাক্যারন এবং চমৎকার পেস্ট্রি তৈরি। শেফ রবার্ট গোমেজের সাথে বেকিংয়ের গোপন সূত্র শিখুন।",
      badgeEn: "Baking & Desserts",
      badgeBn: "বেকিং ও ডেজার্ট",
      metaEn: "international certification",
      metaBn: "আন্তর্জাতিক সার্টিফিকেশন",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      ctaEn: "Explore Baking",
      ctaBn: "বেকিং কোর্স দেখুন",
      isEbook: false,
    },
    {
      id: "continental-arts",
      titleEn: "Master Western Sauces & Fine Dining Plating",
      titleBn: "ওয়েস্টার্ন সস এবং ফাইন ডাইনিং প্লেটিং থিওরি শিখুন",
      subtitleEn: "Elevate your dishes with mother sauces (Béchamel, Velouté) and pan-searing methods under Chef Tanvir Ahmed.",
      subtitleBn: "মাদার সস (বেশামেল, ভেলুটে) এবং প্যান-সিয়ারিং পদ্ধতিতে খাবার তৈরির মাধ্যমে আপনার দক্ষতাকে নতুন মাত্রায় নিয়ে যান।",
      badgeEn: "Continental Cuisine",
      badgeBn: "মহাদেশীয় রান্না",
      metaEn: "international certification",
      metaBn: "আন্তর্জাতিক সার্টিফিকেশন",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      ctaEn: "Learn Continental",
      ctaBn: "কন্টিনেন্টাল শিখুন",
      isEbook: false,
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

  const handleSlideAction = (slide: (typeof slides)[0]) => {
    if (slide.id === "culinary-ebook") {
      if (onNavigate) {
        onNavigate("/culinary-ebook");
      } else {
        window.history.pushState({}, "", "/culinary-ebook");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    } else {
      onExplore();
    }
  };

  const isEn = lang === "en";
  const isCurrentEbook = slides[currentIndex]?.id === "culinary-ebook";

  return (
    <div
      className={`relative overflow-hidden border border-stone-800 text-stone-100 min-h-[440px] sm:min-h-[470px] flex items-center shadow-2xl transition-colors duration-700 ${
        isCurrentEbook
          ? "bg-gradient-to-r from-[#071912] via-[#0B251B] to-[#121212]"
          : "bg-[#121212]"
      }`}
    >
      {/* Background Subtle Gradient & Champagne / Forest Green Accents */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 pointer-events-none blur-3xl transition-opacity duration-700 ${
          isCurrentEbook
            ? "bg-gradient-to-bl from-emerald-600/20 via-amber-500/15 to-transparent"
            : "bg-gradient-to-bl from-amber-500/10 via-red-950/20 to-transparent"
        }`}
      ></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-stone-900/80 to-transparent pointer-events-none"></div>

      {/* Slide Container */}
      <div className="w-full h-full px-6 sm:px-12 py-10 relative z-10">
        <AnimatePresence mode="wait">
          {slides.map((slide, idx) => {
            if (idx !== currentIndex) return null;
            const isEbookSlide = slide.id === "culinary-ebook";

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
                    <span className="text-stone-600" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-stone-400 font-sans font-medium lowercase">
                      {isEn ? slide.metaEn : slide.metaBn}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold leading-[1.15] text-stone-50 tracking-tight">
                    {isEn ? slide.titleEn : slide.titleBn}
                  </h1>

                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
                    {isEn ? slide.subtitleEn : slide.subtitleBn}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    {isEbookSlide ? (
                      <a
                        href="/culinary-ebook"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSlideAction(slide);
                        }}
                        className="bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white px-6 sm:px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-red-600/30 border border-red-500/40 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#E7000B] focus:ring-offset-2 focus:ring-offset-stone-950"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{isEn ? slide.ctaEn : slide.ctaBn}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleSlideAction(slide)}
                        className="bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white px-6 sm:px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg border border-red-500/30 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#E7000B] focus:ring-offset-2 focus:ring-offset-stone-900"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{isEn ? slide.ctaEn : slide.ctaBn}</span>
                      </button>
                    )}

                    {isEbookSlide ? (
                      <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/60 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold rounded-xs backdrop-blur-xs">
                        <span className="text-stone-400 text-[10px] uppercase tracking-wider">
                          {isEn ? "Price:" : "মূল্য:"}
                        </span>
                        <span className="text-amber-300 font-serif font-black text-sm sm:text-base">
                          {slide.price}
                        </span>
                      </div>
                    ) : slide.id === "chef-tawhid" ? (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400 tracking-wider">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9
                        </span>
                        <span>{isEn ? "Instructor Rating" : "প্রশিক্ষক রেটিং"}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Right Side: Chef Portrait or E-Book Showcase */}
                <div className="md:col-span-5 flex justify-center md:justify-end">
                  <div className="relative group max-w-[280px] sm:max-w-[320px] w-full">
                    {/* Double Luxury Accent Border */}
                    <div
                      className={`absolute -inset-2 border pointer-events-none translate-x-1.5 translate-y-1.5 ${
                        isEbookSlide ? "border-amber-500/50" : "border-amber-500/30"
                      }`}
                    ></div>
                    <div
                      className={`border p-1.5 shadow-2xl relative ${
                        isEbookSlide
                          ? "border-emerald-800/80 bg-[#081C14]"
                          : "border-stone-700 bg-stone-900"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={isEbookSlide ? "Lodonex Culinary E-Book for Students" : "Culinary Instructor"}
                        className={`w-full ${
                          isEbookSlide
                            ? "aspect-[4/5] object-contain bg-stone-950 group-hover:scale-102"
                            : "aspect-square object-cover grayscale-10 group-hover:grayscale-0"
                        } transition-all duration-500`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-left">
                        <span className="text-[10px] font-mono text-amber-300 font-semibold tracking-wider uppercase block">
                          {isEbookSlide
                            ? isEn
                              ? "Official Digital Product"
                              : "অফিসিয়াল ডিজিটাল পণ্য"
                            : isEn
                            ? "Lodonex Faculty"
                            : "লোডোনেক্স ফ্যাকাল্টি"}
                        </span>
                        <span className="text-xs font-bold text-white block">
                          {isEbookSlide
                            ? isEn
                              ? "131+ Recipes • 22 Cuisines • $1,099"
                              : "১৩১+ রেসিপি • ২২ ক্যাটাগরি • $১,০৯৯"
                            : slide.id === "chef-tawhid"
                            ? "Executive Chef Tawhid Shekh"
                            : slide.id === "baking-secrets"
                            ? "Pastry Chef Robert Gomes"
                            : "Sous Chef Tanvir Ahmed"}
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
