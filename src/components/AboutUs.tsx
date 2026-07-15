import React from "react";
import { Language } from "../types";
import { Award, Shield, BookOpen, Utensils, Users } from "lucide-react";

interface AboutUsProps {
  lang: Language;
}

export default function AboutUs({ lang }: AboutUsProps) {
  const isEn = lang === "en";

  return (
    <div id="about-us-section" className="space-y-8 border-t border-editorial-border/60 pt-10 text-left">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-editorial-accent"></span>
          {isEn ? "About Lodonex" : "লোডোনেক্স সম্পর্কে"}
        </h2>
        <p className="font-serif italic text-xl sm:text-2xl text-editorial-dark">
          {isEn ? "Nurturing Gastronomic Talents & Culinary Mastery Since 2021" : "২০২১ সাল থেকে রন্ধন প্রতিভা এবং রন্ধন শিল্পে দক্ষতা বিকাশ"}
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Story */}
        <div className="lg:col-span-7 space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
          <p>
            {isEn
              ? "Founded by award-winning gastronomy experts and professional culinary creators, Lodonex is Bangladesh's premier accredited gastronomy institution. We bridge the gap between passion and professional expertise, providing structured masterclasses with state-of-the-art virtual workspaces, lesson quizzes, and secure digital certifications."
              : "পুরস্কারপ্রাপ্ত রন্ধন বিশেষজ্ঞ এবং পেশাদার শেফদের দ্বারা প্রতিষ্ঠিত, লোডোনেক্স হলো বাংলাদেশের শীর্ষস্থানীয় অ্যাক্রেডিটেড কালিনারি ইনস্টিটিউট। আমরা রন্ধনপ্রেমীদের আগ্রহকে পেশাদার দক্ষতায় রূপান্তর করতে অনলাইন ভিডিও টিউটোরিয়াল, ইন্টারঅ্যাক্টিভ কুইজ এবং স্বীকৃত সার্টিফিকেটের ব্যবস্থা করেছি।"}
          </p>
          <p>
            {isEn
              ? "Whether you're exploring the delicate spice chemistry of traditional Bengali heritage dishes like Shorshe Ilish, mastering the intricate science of sourdough and bakery pastries, or crafting advanced continental mother sauces and wok techniques, Lodonex gives you direct, lifetime guidance from specialized Michelin-level chefs."
              : "ঐতিহ্যবাহী বাঙালি সর্ষে ইলিশের মশলার রসায়ন অন্বেষণ করা, পেশাদার টকমিষ্টি পাউরুটি ও বেকিংয়ের গোপন সূত্র রপ্ত করা, কিংবা কন্টিনেন্টাল মাদার সস এবং ওক ফ্রাইং টেকনিকের খুঁটিনাটি শেখা—সবক্ষেত্রেই লোডোনেক্স আপনাকে দিচ্ছে আজীবন বিশেষজ্ঞ নির্দেশিকা।"}
          </p>

          {/* Vision & Government Credentials Section */}
          <div id="vision-credentials-block" className="p-4 bg-[#F7F5F0] border-l-4 border-editorial-accent space-y-3 my-4">
            <h3 className="font-serif font-bold text-editorial-dark text-xs sm:text-sm uppercase tracking-wider">
              {isEn ? "Global Vision & Government Credentials" : "আমাদের বৈশ্বিক ভিশন এবং সরকারি স্বীকৃতি"}
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              {isEn
                ? "Lodonex is a government-registered company in Bangladesh. Our vision is to empower culinary talents with professional cooking courses and facilitate elite chef job accommodation in Dubai and European countries."
                : "লোডোনেক্স বাংলাদেশ সরকার কর্তৃক অনুমোদিত ও নিবন্ধিত একটি কালিনারি একাডেমি। আমাদের মূল লক্ষ্য ও ভিশন হলো পেশাদার কুকিং কোর্সের মাধ্যমে দক্ষ জনশক্তি তৈরি করা এবং দুবাই ও ইউরোপের বিভিন্ন দেশে শেফদের উপযুক্ত চাকরির আবাসন ও কর্মসংস্থানের ব্যবস্থা করা।"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-editorial-border/40 font-mono text-[10px] sm:text-[11px] text-editorial-dark">
              <div>
                <span className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider">{isEn ? "Trade Licence" : "ট্রেড লাইসেন্স"}</span>
                <span className="font-bold text-[21px] text-left block leading-snug">Trade Licence No: TRAD/DNCC/001508/2026</span>
              </div>
              <div className="font-bold text-[20px] leading-snug">
                <span className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider">{isEn ? "TIN Certificate" : "টিন সার্টিফিকেট"}</span>
                <span className="font-bold">Taxpayer's Identification Number (TIN) Certificate: TIN : 238820466940</span>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-editorial-dark">
            <div className="flex items-start gap-3 p-3 bg-[#FBF9F5] border border-editorial-border/40">
              <Shield className="h-5 w-5 text-editorial-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-xs">
                  {isEn ? "Accredited Syllabi" : "স্বীকৃত সিলেবাস"}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {isEn ? "Our culinary programs are recognized globally." : "আমাদের রন্ধন প্রোগ্রামসমূহ বিশ্বব্যাপী মানসম্মত ও স্বীকৃত।"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#FBF9F5] border border-editorial-border/40">
              <Award className="h-5 w-5 text-editorial-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-xs">
                  {isEn ? "Certified Diploma" : "নিরাপদ ডিপ্লোমা"}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {isEn ? "Claim professional completion seals upon passing." : "কুইজ ও পাঠ শেষ করে প্রফেশনাল সিলযুক্ত সার্টিফিকেট অর্জন করুন।"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Stats Column */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-editorial-dark text-white p-6 flex flex-col justify-between border border-[#1A1A1A]">
            <Users className="h-6 w-6 text-editorial-accent" />
            <div>
              <span className="block text-3xl font-serif font-extrabold tracking-tight">5,000+</span>
              <span className="text-[10px] uppercase tracking-widest text-[#E5E2D9]/70 block mt-1">
                {isEn ? "Active Alumni" : "সক্রিয় শিক্ষার্থী"}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 border border-editorial-border flex flex-col justify-between">
            <Utensils className="h-6 w-6 text-editorial-dark" />
            <div>
              <span className="block text-3xl font-serif font-extrabold tracking-tight text-editorial-dark">100%</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block mt-1">
                {isEn ? "Hands-on Lessons" : "হাতে-কলমে শিক্ষা"}
              </span>
            </div>
          </div>

          <div className="bg-[#F7F5F0] p-6 border border-editorial-border flex flex-col justify-between col-span-2">
            <div className="flex items-center justify-between">
              <BookOpen className="h-6 w-6 text-editorial-accent" />
              <span className="text-[10px] uppercase tracking-widest text-slate-400">
                {isEn ? "Culinary Academy" : "কালিনারি একাডেমি"}
              </span>
            </div>
            <div className="mt-4">
              <span className="block text-2xl font-serif font-bold italic text-editorial-dark">
                {isEn ? "Professional Standards" : "পেশাদার মানদণ্ড"}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-sans">
                {isEn ? "Taught by certified head chefs and industrial experts." : "সার্টিফাইড হেড শেফ এবং শিল্প বিশেষজ্ঞদের দ্বারা পরিচালিত।"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
