import React, { useState } from "react";
import { Language } from "../types";
import {
  Award,
  Shield,
  BookOpen,
  Utensils,
  Users,
  Building2,
  Globe2,
  CheckCircle2,
  FileDown,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  ChefHat,
  ArrowRight,
} from "lucide-react";

interface AboutUsProps {
  lang: Language;
  onNavigateToJobs?: () => void;
  onNavigateToCourses?: () => void;
}

export default function AboutUs({ lang, onNavigateToJobs, onNavigateToCourses }: AboutUsProps) {
  const isEn = lang === "en";
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadProspectus = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div id="about-us-section" className="space-y-12 py-6 text-left font-sans">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-editorial-accent"></span>
          <h2 className="text-xs sm:text-sm uppercase tracking-[0.25em] font-extrabold text-slate-400 font-mono">
            {isEn ? "Institutional Profile" : "প্রাতিষ্ঠানিক প্রোফাইল"}
          </h2>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-editorial-dark tracking-tight leading-tight">
          {isEn ? "Lodonex Culinary Academy & International Gastronomy Hub" : "লোডোনেক্স কালিনারি একাডেমি ও আন্তর্জাতিক গ্যাস্ট্রোনমি হাব"}
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-slate-600 max-w-3xl">
          {isEn
            ? "Nurturing Gastronomic Talents & Powering Chef Placement Across Dubai & Europe Since 2021"
            : "২০২১ সাল থেকে রন্ধনশিল্পের বিকাশ এবং দুবাই ও ইউরোপের শীর্ষ রেস্তোরাঁয় আন্তর্জাতিক কর্মসংস্থান সৃষ্টি"}
        </p>
      </div>

      {/* Grid Content: Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Story Narrative */}
        <div className="lg:col-span-7 space-y-5 text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
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

          {/* Government Credentials & Trade License Verified Box */}
          <div id="vision-credentials-block" className="p-5 bg-[#F7F5F0] border-l-4 border-editorial-accent space-y-3 my-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-editorial-dark text-xs sm:text-sm uppercase tracking-wider">
                {isEn ? "Official Government Credentials & Trade Licensing" : "সরকারি স্বীকৃতি ও ভেরিফাইড ট্রেড লাইসেন্স"}
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {isEn ? "Govt. Verified" : "সরকার অনুমোদিত"}
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed text-xs">
              {isEn
                ? "Lodonex is a government-registered culinary academy under the Government of Bangladesh. Our mission is to empower culinary talents with world-class curriculum standards and facilitate guaranteed chef job accommodation in Dubai, Saudi Arabia, the UK, and European hospitality destinations."
                : "লোডোনেক্স বাংলাদেশ সরকার কর্তৃক অনুমোদিত ও নিবন্ধিত একটি স্বনামধন্য কালিনারি একাডেমি। আমাদের মূল লক্ষ্য হলো বিশ্বমানের রন্ধন সিলেবাসের মাধ্যমে দক্ষ শেফ তৈরি করা এবং দুবাই, সৌদি আরব ও ইউরোপের শীর্ষ ৫-তারকা হোটেলসমূহে নিশ্চিত কর্মসংস্থান ও আবাসন প্রদান করা।"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-editorial-border/60 font-mono text-[10px] sm:text-[11px] text-editorial-dark">
              <div className="bg-white p-3 border border-editorial-border">
                <span className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider mb-1">
                  {isEn ? "Trade Licence (DNCC)" : "ট্রেড লাইসেন্স (ডিএনসিসি)"}
                </span>
                <span className="font-bold text-xs sm:text-sm text-editorial-dark block">
                  TRAD/DNCC/001508/2026
                </span>
              </div>
              <div className="bg-white p-3 border border-editorial-border">
                <span className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider mb-1">
                  {isEn ? "Taxpayer Identification (TIN)" : "টিন সার্টিফিকেট (এনবিআর)"}
                </span>
                <span className="font-bold text-xs sm:text-sm text-editorial-dark block">
                  TIN : 238820466940
                </span>
              </div>
            </div>
          </div>

          {/* Academic Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-editorial-dark">
            <div className="flex items-start gap-3 p-4 bg-[#FBF9F5] border border-editorial-border">
              <Shield className="h-5 w-5 text-editorial-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-xs">
                  {isEn ? "Accredited Syllabi (LQF 1-8)" : "স্বীকৃত সিলেবাস (এলকিউএফ ১-৮)"}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  {isEn ? "Our 8-level structured framework meets international hotel guild standards." : "আমাদের ৮-স্তরের সুবিন্যস্ত সিলেবাস আন্তর্জাতিক হোটেল চেইনের মানদণ্ড অনুযায়ী প্রস্তুত।"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#FBF9F5] border border-editorial-border">
              <Globe2 className="h-5 w-5 text-editorial-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-xs">
                  {isEn ? "Dubai & Europe Placement" : "দুবাই ও ইউরোপ প্লেসমেন্ট"}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  {isEn ? "Direct recruitment with 100% furnished housing and work visas." : "১০০% ফার্নিশড আবাসন ও ওয়ার্ক পারমিট ভিসা সহ সরাসরি নিয়োগ সহায়তা।"}
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
              <span className="block text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">5,000+</span>
              <span className="text-[10px] uppercase tracking-widest text-[#E5E2D9]/70 block mt-1 font-mono">
                {isEn ? "Active Alumni Worldwide" : "সক্রিয় গ্র্যাজুয়েট ও শিক্ষার্থী"}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 border border-editorial-border flex flex-col justify-between">
            <Building2 className="h-6 w-6 text-editorial-dark" />
            <div>
              <span className="block text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-editorial-dark">450+</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block mt-1 font-mono">
                {isEn ? "Placed in Dubai & EU" : "দুবাই ও ইউরোপে কর্মরত"}
              </span>
            </div>
          </div>

          <div className="bg-[#F7F5F0] p-6 border border-editorial-border flex flex-col justify-between col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <BookOpen className="h-6 w-6 text-editorial-accent" />
              <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400 font-bold">
                {isEn ? "Premier Gastronomy Hub" : "শীর্ষ কালিনারি একাডেমি"}
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold italic text-editorial-dark">
                {isEn ? "Guaranteed Job & Housing Network" : "নিশ্চিত চাকরি ও আবাসন নেটওয়ার্ক"}
              </span>
              <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">
                {isEn
                  ? "Collaborating directly with Jumeirah, Ritz-Carlton, and European luxury hospitality groups to ensure student success."
                  : "জুমেইরাহ, রিৎজ-কার্লটন ও শীর্ষ ইউরোপীয় হোটেল গ্রুপের সাথে যৌথ উদ্যোগে পরিচালিত একাডেমি।"}
              </p>
            </div>
            <div className="pt-2 border-t border-editorial-border/60 flex items-center justify-between">
              <button
                onClick={handleDownloadProspectus}
                className="px-4 py-2 bg-editorial-dark hover:bg-stone-800 text-white font-bold text-[11px] uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>{downloadSuccess ? (isEn ? "Prospectus Downloaded!" : "প্রস্পেক্টাস ডাউনলোড হয়েছে!") : (isEn ? "Download 2026 Prospectus" : "একাডেমি প্রস্পেক্টাস ডাউনলোড")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* World-Class Infrastructure Section */}
      <div className="p-6 sm:p-8 bg-white border border-editorial-border space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-editorial-accent font-mono block">
            {isEn ? "Campus Infrastructure" : "ক্যাম্পাস ও আধুনিক সুযোগ-সুবিধা"}
          </span>
          <h3 className="font-serif font-extrabold text-2xl text-editorial-dark">
            {isEn ? "State-of-the-Art Commercial Kitchen Studios & Hostels" : "আন্তর্জাতিক মানের কমার্শিয়াল কিচেন স্টুডিও ও হোস্টেল"}
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl">
            {isEn
              ? "Our physical campuses in Gulshan and Banani are equipped with identical commercial systems used in luxury 5-star hotel kitchens globally."
              : "আমাদের গুলশান ও বনানী ক্যাম্পাসে রয়েছে বিশ্বমানের ৫-তারকা হোটেলের কিচেনে ব্যবহৃত সর্বাধুনিক যন্ত্রপাতি।"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FDFCF9] border border-editorial-border space-y-2">
            <span className="text-[10px] font-mono font-bold text-editorial-accent block">01 / EQUIPMENT</span>
            <h4 className="font-serif font-bold text-sm text-editorial-dark">
              {isEn ? "Rational Combi Steamers" : "র্যাশনাল কম্বি স্টিমার"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isEn ? "German smart cooking systems for precision steaming, roasting, and thermal convection." : "নিখুঁত তাপমাত্রা নিয়ন্ত্রণ ও রোস্টিংয়ের জন্য সর্বাধুনিক জার্মান কম্বি ওভেন।"}
            </p>
          </div>

          <div className="p-4 bg-[#FDFCF9] border border-editorial-border space-y-2">
            <span className="text-[10px] font-mono font-bold text-editorial-accent block">02 / HYGIENE</span>
            <h4 className="font-serif font-bold text-sm text-editorial-dark">
              {isEn ? "HACCP Cleanrooms" : "এইচএসিসিপি স্টেরাইল ল্যাব"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isEn ? "Sterile staging zones, color-coded cutting boards, and food hygiene compliance protocols." : "আন্তর্জাতিক ফুড সেফটি এবং ক্রস-কন্টামিনেশনমুক্ত পরিবেশ।"}
            </p>
          </div>

          <div className="p-4 bg-[#FDFCF9] border border-editorial-border space-y-2">
            <span className="text-[10px] font-mono font-bold text-editorial-accent block">03 / PASTRY</span>
            <h4 className="font-serif font-bold text-sm text-editorial-dark">
              {isEn ? "Marble Pastry Tables" : "মার্বেল পেস্ট্রি ও বেকিং ল্যাব"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isEn ? "Temperature-controlled marble workbenches for French lamination and chocolate tempering." : "ক্রোসাঁ বাটার লেয়ারিং এবং চকোলেট টেম্পারিংয়ের জন্য বিশেষ মার্বেল কাউন্টার।"}
            </p>
          </div>

          <div className="p-4 bg-[#FDFCF9] border border-editorial-border space-y-2">
            <span className="text-[10px] font-mono font-bold text-editorial-accent block">04 / HOUSING</span>
            <h4 className="font-serif font-bold text-sm text-editorial-dark">
              {isEn ? "Apprentice Hostels" : "শিক্ষার্থীদের এসি হোস্টেল"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isEn ? "Air-conditioned rooms with 3 daily meals, study desks, and 24/7 practice kitchens." : "৩ বেলা খাবার, ওয়াইফাই ও ২৪/৭ প্র্যাকটিস কিচেন সহ নিজস্ব হোস্টেল সুবিধা।"}
            </p>
          </div>
        </div>
      </div>

      {/* Vision 2030 & Strategic Roadmap */}
      <div className="p-6 sm:p-8 bg-editorial-dark text-white border border-[#1A1A1A] space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-editorial-accent font-mono block">
            {isEn ? "Strategic Roadmap" : "স্ট্র্যাটেজিক রোডম্যাপ"}
          </span>
          <h3 className="font-serif font-extrabold text-2xl text-white">
            {isEn ? "Vision 2030: Elevating 10,000+ Bangladeshi Chefs to Global Prominence" : "ভিশন ২০৩০: ১০,০০০+ বাংলাদেশি শেফকে বিশ্বমঞ্চে প্রতিষ্ঠিত করা"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 bg-stone-900 border border-stone-800 space-y-1.5">
            <span className="font-mono text-editorial-accent font-bold text-xs">GOAL 1</span>
            <h4 className="font-serif font-bold text-sm text-white">
              {isEn ? "Dubai & GCC Expansion" : "দুবাই ও জিসিসি ক্যারিয়ার সম্প্রসারণ"}
            </h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              {isEn ? "Placing 1,000+ chefs annually into luxury UAE and Saudi Arabia resorts with full housing." : "প্রতি বছর ১,০০০+ শেফকে আবাসন সহ দুবাই ও মধ্যপ্রাচ্যের বিলাসবহুল রিসোর্টে নিয়োগ প্রদান।"}
            </p>
          </div>

          <div className="p-4 bg-stone-900 border border-stone-800 space-y-1.5">
            <span className="font-mono text-editorial-accent font-bold text-xs">GOAL 2</span>
            <h4 className="font-serif font-bold text-sm text-white">
              {isEn ? "European Hospitality Pass" : "ইউরোপীয় হসপিটালিটি নেটওয়ার্ক"}
            </h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              {isEn ? "Establishing direct skilled worker visas to Germany, UK, and Italy for senior diploma holders." : "জার্মানি ও যুক্তরাজ্যে স্কিল্ড শেফ ভিসার মাধ্যমে আন্তর্জাতিক কর্মসংস্থানের ব্যবস্থা।"}
            </p>
          </div>

          <div className="p-4 bg-stone-900 border border-stone-800 space-y-1.5">
            <span className="font-mono text-editorial-accent font-bold text-xs">GOAL 3</span>
            <h4 className="font-serif font-bold text-sm text-white">
              {isEn ? "Heritage Culinary Preservation" : "ঐতিহ্যবাহী রন্ধনশিল্পের বিশ্বায়ন"}
            </h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              {isEn ? "Documenting 500+ heirloom Bangladeshi recipes in our digital recipe archive." : "৫০০+ ঐতিহ্যবাহী বাংলাদেশি রেসিপির প্রামাণ্য ডিজিটালাইজেশন ও আন্তর্জাতিকায়ন।"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
