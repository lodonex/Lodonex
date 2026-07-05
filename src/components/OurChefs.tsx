import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, ChefHat, BookOpen, Sparkles, Clock, ArrowRight, Heart, X, Check } from "lucide-react";
import { Language } from "../types";

interface Chef {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  image: string;
  experienceEn: string;
  experienceBn: string;
  speciality: "traditional" | "baking" | "continental" | "chinese";
  specialityEn: string;
  specialityBn: string;
  bgEn: string;
  bgBn: string;
  bioEn: string;
  bioBn: string;
  philosophyEn: string;
  philosophyBn: string;
  achievementsEn: string[];
  achievementsBn: string[];
  signatureDishesEn: string[];
  signatureDishesBn: string[];
  courseId: string;
  courseTitleEn: string;
  courseTitleBn: string;
}

const CHEFS: Chef[] = [
  {
    id: "chef-1",
    nameEn: "Chef Afroza Rahman",
    nameBn: "শেফ আফরোজা রহমান",
    roleEn: "Executive Head of Heritage Bengali Gastronomy",
    roleBn: "প্রধান নির্বাহী, ঐতিহ্যবাহী বাঙালি রন্ধনশিল্প",
    image: "/src/assets/images/regenerated_image_1783236070688.jpg",
    experienceEn: "18+ Years",
    experienceBn: "১৮+ বছর",
    speciality: "traditional",
    specialityEn: "Traditional Bengali & Mughal",
    specialityBn: "ঐতিহ্যবাহী বাঙালি এবং মোগলাই রান্না",
    bgEn: "Former culinary consultant for top-tier heritage resorts in Dhaka & Kolkata. Winner of Bangladesh Culinary Heritage Preservation Award (2021).",
    bgBn: "ঢাকা ও কলকাতার শীর্ষস্থানীয় হেরিটেজ রিসোর্টসমূহের প্রাক্তন কালিনারি কনসালট্যান্ট। বাংলাদেশ কালিনারি হেরিটেজ প্রিজারভেশন অ্যাওয়ার্ড (২০২১) বিজয়ী।",
    bioEn: "Chef Afroza has spent nearly two decades traveling into rural Bengal to document and preserve ancient heirloom recipes. She is renowned for translating forgotten grandmothers' spice-blending techniques into standard professional academy training.",
    bioBn: "শেফ আফরোজা প্রায় দুই দশক ধরে বাংলার প্রত্যন্ত অঞ্চলে ভ্রমণ করে প্রাচীন রেসিপিগুলো নথিভুক্ত ও সংরক্ষণ করেছেন। ঠাকুমা-দিদিমাদের হারিয়ে যাওয়া মশলার অনুপাত ও মিশ্রণকে আধুনিক একাডেমিক নিয়মে রূপান্তর করার জন্য তিনি দেশজুড়ে সমাদৃত।",
    philosophyEn: "Traditional food is a living tapestry of history, earth, and patience. True gastronomy doesn't rush the slow koshano process.",
    philosophyBn: "ঐতিহ্যবাহী খাবার হলো ইতিহাস, মাটির টান আর ধৈর্যের এক জীবন্ত রূপ। নিখুঁত রন্ধনশৈলী কখনো ধীর আঁচে কষানোর প্রক্রিয়াকে তাড়াহুড়ো করে না।",
    achievementsEn: [
      "Author of 'The Heirloom Spice Maps of Bengal'",
      "First Bangladeshi speaker at the Asian Gastronomy Summit (2022)",
      "Curator of the Presidential Banquet for Bengali Heritage Cuisines"
    ],
    achievementsBn: [
      "কালজয়ী বই 'দ্য হেরিটেজ স্পাইস ম্যাপস অব বেঙ্গল' এর লেখিকা",
      "এশিয়ান গ্যাস্ট্রোনমি সামিট (২০২২)-এ প্রথম বাংলাদেশী বক্তা",
      "রাষ্ট্রপতির বিশেষ রাষ্ট্রীয় ভোজের বাঙালি খাবারের প্রধান কিউরেটর"
    ],
    signatureDishesEn: ["Classic Shorshe Ilish with Mustard emulsion", "Slow-Braised Royal Beef Bhuna", "Traditional Clay-Pot Bogura Mishti Doi"],
    signatureDishesBn: ["সরিষার ঝাঁঝালো মিশ্রণে সর্ষে ইলিশ", "ধীর আঁচে সেদ্ধ রাজকীয় গরুর মাংস ভুনা", "মাটির পাত্রে জমানো বগুড়ার ঐতিহ্যবাহী মিষ্টি দই"],
    courseId: "course-1",
    courseTitleEn: "Bengali Cuisine Heritage Masterclass",
    courseTitleBn: "বাঙালি ঐতিহ্যবাহী রান্না মাস্টারক্লাস"
  },
  {
    id: "chef-2",
    nameEn: "Chef Robert Gomes",
    nameBn: "শেফ রবার্ট গোমেজ",
    roleEn: "Master Artisan Baker & Confectionery Director",
    roleBn: "মাস্টার আর্টিসান বেকার এবং পেস্ট্রি পরিচালক",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
    experienceEn: "15+ Years",
    experienceBn: "১৫+ বছর",
    speciality: "baking",
    specialityEn: "Artisan Sourdough & European Baking",
    specialityBn: "আর্টিসান টকমিষ্টি পাউরুটি এবং ইউরোপীয় বেকিং",
    bgEn: "Certified Master Baker by the European Guild. Former Head of Viennoiserie for premium luxury cruise lines in Singapore & Hong Kong.",
    bgBn: "ইউরোপীয় গিল্ডের একজন প্রত্যয়িত মাস্টার বেকার। সিঙ্গাপুর এবং হংকংয়ের একাধিক লাক্সারি ক্রুজ লাইনের ভিয়েনোইসেরি (Viennoiserie) বিভাগের প্রাক্তন প্রধান।",
    bioEn: "Robert has introduced advanced dough-chemistry and hydration science to the Bangladeshi culinary scene. He is passionate about making technical French techniques like macaron foldings and wild-yeast sourdough starters accessible to every home kitchen.",
    bioBn: "রবার্ট বাংলাদেশী রন্ধন জগতে ডফ-কেমিস্ট্রি (ময়দার আঠালো গঠন) এবং হাইড্রেশন সায়েন্সের আধুনিক ধারা নিয়ে এসেছেন। ফ্রেঞ্চ ম্যাক্যারন ফোল্ডিং বা বুনো ঈস্টের তৈরি টকমিষ্টি পাউরুটির জটিল কৌশলগুলো প্রতিটি সাধারণের রান্নাঘরে সহজভাবে পৌঁছে দেওয়া তাঁর অন্যতম লক্ষ্য।",
    philosophyEn: "Baking is not a guess; it is an exact dialogue between water, flour, temperature, and time.",
    philosophyBn: "বেকিং কোনো আন্দাজের বিষয় নয়; এটি পানি, ময়দা, তাপমাত্রা এবং সময়ের মধ্যকার একটি নিখুঁত বৈজ্ঞানিক কথোপকথন।",
    achievementsEn: [
      "Designed the 15-foot State Wedding Cake for national dignitaries",
      "Founder of Dhaka Artisan Bread Association",
      "Awarded 'Best Pastry Artist' at the South Asian Pastry Cup"
    ],
    achievementsBn: [
      "জাতীয় বিশিষ্ট ব্যক্তিবর্গের জন্য ১৫ ফুট লম্বা রাষ্ট্রীয় বিয়ের কেক ডিজাইন করেছেন",
      "ঢাকা আর্টিসান ব্রেড অ্যাসোসিয়েশনের প্রতিষ্ঠাতা",
      "সাউথ এশিয়ান পেস্ট্রি কাপে 'সেরা পেস্ট্রি শিল্পী' হিসেবে পুরস্কৃত"
    ],
    signatureDishesEn: ["High-Hydration Wild-Yeast Sourdough Bread", "French Raspberry Macarons", "Airy Bakery-Style Vanilla Sponge Cake"],
    signatureDishesBn: ["উচ্চ-আর্দ্রতাসম্পন্ন ওয়াইল্ড-ঈস্ট টকমিষ্টি পাউরুটি", "ফ্রেঞ্চ রাস্পবেরি ম্যাক্যারন", "অত্যন্ত নরম ও হালকা ভ্যানিলা স্পঞ্জ কেক"],
    courseId: "course-2",
    courseTitleEn: "Professional Baking Secrets",
    courseTitleBn: "পেশাদার বেকিংয়ের গোপন রহস্য"
  },
  {
    id: "chef-3",
    nameEn: "Chef Tanvir Ahmed",
    nameBn: "শেফ তানভীর আহমেদ",
    roleEn: "Chief Instructor of Modern Continental Gastronomy",
    roleBn: "প্রধান প্রশিক্ষক, আধুনিক মহাদেশীয় রন্ধনশিল্প",
    image: "https://images.unsplash.com/photo-1595273670150-db0d3bf3b73e?auto=format&fit=crop&w=600&q=80",
    experienceEn: "12+ Years",
    experienceBn: "১২+ বছর",
    speciality: "continental",
    specialityEn: "Modern European & Plating Logic",
    specialityBn: "আধুনিক ইউরোপীয় রন্ধনশৈলী এবং প্লেটিং লজিক",
    bgEn: "Graduate of Le Cordon Bleu, London. Worked as Chef de Partie at two Michelin-starred establishments in the UK and Dubai luxury hotels.",
    bgBn: "লন্ডনের বিশ্ববিখ্যাত 'লে কর্ডন ব্লু' থেকে স্নাতক। যুক্তরাজ্য এবং দুবাইয়ের দুটি বিখ্যাত মিশেলিন-স্টার রেস্তোরাঁ ও বিলাসবহুল হোটেলে শেফ ডি পার্টি হিসেবে কাজ করেছেন।",
    bioEn: "Chef Tanvir approaches culinary arts as an intricate form of sensory architecture. He is celebrated for teaching 'mother sauce' chemistry, high-heat protein searing, and modern fine dining visual design techniques.",
    bioBn: "শেফ তানভীর রান্নাকে একটি সূক্ষ্ম বহুমাত্রিক দৃশ্য ও স্বাদ স্থাপত্য হিসেবে দেখেন। তিনি মূল সসের রসায়ন, প্রোটিনের উচ্চ-তাপে নিখুঁত ভাজা এবং বিশ্বমানের ফাইন ডাইনিং প্লেটিং শৈলী শেখানোর জন্য অত্যন্ত জনপ্রিয়।",
    philosophyEn: "We eat with our eyes first, but the flavor must hold a memorable story of balance and visual texture.",
    philosophyBn: "আমরা প্রথমে চোখ দিয়ে খাবার উপভোগ করি, কিন্তু স্বাদটির মধ্যে ভারসাম্য ও অনন্য টেক্সচারের একটি স্মরণীয় গল্প থাকতে হবে।",
    achievementsEn: [
      "Guest Instructor at International Plating Seminars",
      "Co-creator of the Lodonex Modern Plating Framework",
      "Featured in 'Culinary Art Asia' Magazine as a top contemporary trendsetter"
    ],
    achievementsBn: [
      "আন্তর্জাতিক প্লেটিং সেমিনারসমূহে আমন্ত্রিত অতিথি প্রশিক্ষক",
      "লোডোনেক্সের সিগনেচার 'মডার্ন প্লেটিং ফ্রেমওয়ার্ক' এর সহ-প্রতিষ্ঠাতা",
      "শীর্ষ সমসাময়িক শেফ হিসেবে 'কালিনারি আর্ট এশিয়া' ম্যাগাজিনে ফিচার্ড"
    ],
    signatureDishesEn: ["Pan-Seared Salmon with Herb Emulsion", "Sous Vide Duck Breast with Red Wine Reduction", "Deconstructed Lemon Meringue Tart"],
    signatureDishesBn: ["ভেষজ ইমালশনের সাথে প্যান-সিয়ারড স্যালমন মাছ", "রেড ওয়াইন রিডাকশনে সু-ভি হাঁসের মাংস", "ডিকনস্ট্রাক্টেড লেমন মেরিঙ্গু টার্ট"],
    courseId: "course-3",
    courseTitleEn: "Continental Culinary Arts",
    courseTitleBn: "মহাদেশীয় রন্ধনশিল্প শিক্ষা"
  },
  {
    id: "chef-4",
    nameEn: "Chef Lee Wei",
    nameBn: "শেফ লি ওয়েই",
    roleEn: "Master of Asian Fusion & Wok Artistry",
    roleBn: "মাস্টার, এশিয়ান ফিউশন এবং ওক আর্ট",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80",
    experienceEn: "14+ Years",
    experienceBn: "১৪+ বছর",
    speciality: "chinese",
    specialityEn: "High-Heat Cantonese Wok Hei & Dim Sum",
    specialityBn: "উচ্চ-তাপের ক্যান্টনিজ ওক হাই এবং ডিম সাম তৈরি",
    bgEn: "Former Head Chef of premium Pan-Asian bistros in Kuala Lumpur and Bangkok. Gold medalist in the Asia-Pacific Wok Master Championships (2019).",
    bgBn: "কুয়ালালামপুর এবং ব্যাংককের বিখ্যাত প্যান-এশিয়ান বিস্ট্রোর প্রাক্তন প্রধান শেফ। এশিয়া-প্যাসিফিক ওক মাস্টার চ্যাম্পিয়নশিপে (২০১৯) স্বর্ণপদক বিজয়ী।",
    bioEn: "Chef Lee Wei brings the magic of Cantonese fire control directly to students. He focuses on the physics of the wok, teaches the art of delicate dough rolling for transparent crystal dumplings, and specializes in rich broth frameworks.",
    bioBn: "শেফ লি ওয়েই ওকের আগুনের নিখুঁত নিয়ন্ত্রণের জাদু শিক্ষার্থীদের কাছে নিয়ে আসেন। তিনি ডিম সামের স্বচ্ছ পাতলা ডো তৈরির শিল্প এবং চাইনিজ সুগন্ধযুক্ত স্টক বা ঝোলের মূল ভিত্তি নিখুঁতভাবে তৈরি করা শেখান।",
    philosophyEn: "Wok Hei is the soul of Asian cooking—capturing the breath of the wok in a microsecond of perfect high-heat dispersion.",
    philosophyBn: "ওক হাই হলো এশিয়ান রান্নার আত্মা—তীব্র উচ্চ-তাপমাত্রার সঠিক সঞ্চালনের মাধ্যমে একটি ক্ষুদ্রাতিক্ষুদ্র সেকেন্ডে আগুনের ধোঁয়াটে স্বাদকে বন্দি করা।",
    achievementsEn: [
      "Winner of the Asia-Pacific Golden Wok Trophy 2019",
      "Consultant Chef for award-winning Pan-Asian franchises in South Asia",
      "Master of the 24-Fold Crystal Dumpling Technique"
    ],
    achievementsBn: [
      "এশিয়া-প্যাসিফিক গোল্ডেন ওক ট্রফি ২০১৯ বিজয়ী",
      "দক্ষিণ এশিয়ার শীর্ষস্থানীয় প্যান-এশিয়ান রেস্তোরাঁ ব্র্যান্ডগুলোর প্রধান পরামর্শক",
      "২৪-ভাঁজের ঐতিহ্যবাহী ক্রিস্টাল ডাম্পলিং টেকনিকের মাস্টার ট্রেইনার"
    ],
    signatureDishesEn: ["High-Heat Wok-Seared Szechuan Noodles", "24-Fold Crystal Shrimp Har Gow", "Double-Boiled Imperial Ginseng Duck Broth"],
    signatureDishesBn: ["উচ্চ তাপে ভাজা সিচুয়ান নুডলস (ওক-সিয়ারড)", "২৪-ভাঁজের ঐতিহ্যবাহী ক্রিস্টাল চিংড়ি হার গাও", "ডাবল-বয়েলড রাজকীয় জিনসেং হাঁসের ঝোল"],
    courseId: "course-4",
    courseTitleEn: "Chinese / Wok Masterclass",
    courseTitleBn: "চাইনিজ / ওক মাস্টারক্লাস"
  }
];

interface OurChefsProps {
  lang: Language;
  onSelectCourse: (courseId: string) => void;
}

export function OurChefs({ lang, onSelectCourse }: OurChefsProps) {
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>("all");
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);

  const isEn = lang === "en";

  const categories = [
    { id: "all", labelEn: "All Specialities", labelBn: "সকল স্পেশালিটি" },
    { id: "traditional", labelEn: "Traditional Bengali", labelBn: "ঐতিহ্যবাহী বাঙালি" },
    { id: "baking", labelEn: "Artisan Baking", labelBn: "আর্টিসান বেকিং" },
    { id: "continental", labelEn: "Continental", labelBn: "মহাদেশীয় রান্না" },
    { id: "chinese", labelEn: "Asian Fusion / Wok", labelBn: "এশিয়ান ফিউশন / ওক" },
  ];

  const filteredChefs = selectedSpeciality === "all"
    ? CHEFS
    : CHEFS.filter(chef => chef.speciality === selectedSpeciality);

  return (
    <div id="our-chefs-page" className="py-12 bg-[#FDFCF9] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Elegant Editorial Header */}
        <div className="text-center space-y-4 mb-12 max-w-2xl mx-auto">
          <div className="flex justify-center items-center gap-1.5 text-editorial-accent">
            <ChefHat className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold font-sans">
              {isEn ? "The Lodonex Faculty" : "লোডোনেক্স অনুষদ"}
            </span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-editorial-dark tracking-tight leading-none">
            {isEn ? "Meet Our Executive Culinary Masters" : "আমাদের রন্ধন বিশেষজ্ঞদের সাথে পরিচিত হোন"}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
            {isEn
              ? "Every lesson is taught by certified Michelin-caliber veterans, national heritage award winners, and master bakery chemists dedicated to your professional growth."
              : "আমাদের প্রতিটি ক্লাস পরিচালিত হয় আন্তর্জাতিক মানের দক্ষ শেফ, জাতীয় পুরস্কারপ্রাপ্ত হেরিটেজ গবেষক এবং বেকিং সাইন্স বিশেষজ্ঞদের দ্বারা।"}
          </p>
        </div>

        {/* Speciality Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-editorial-border/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSpeciality(cat.id)}
              className={`px-4 py-2 text-[11px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
                selectedSpeciality === cat.id
                  ? "bg-editorial-accent text-white"
                  : "border border-editorial-border bg-white text-slate-600 hover:bg-[#F7F5F0] hover:text-editorial-dark"
              }`}
            >
              {isEn ? cat.labelEn : cat.labelBn}
            </button>
          ))}
        </div>

        {/* Chefs Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredChefs.map((chef) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={chef.id}
                id={`chef-card-${chef.id}`}
                className="bg-white border border-editorial-border flex flex-col justify-between hover:shadow-md transition-shadow group relative"
              >
                {/* Chef Badge / Speciality Tag */}
                <div className="absolute top-3 left-3 z-10 bg-[#1A1A1A] text-[#F5F2EB] text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 font-mono">
                  {isEn ? chef.specialityEn : chef.specialityBn}
                </div>

                <div>
                  {/* Aspect Ratio Controlled Chef Frame */}
                  <div className="aspect-[4/5] w-full overflow-hidden border-b border-editorial-border bg-stone-100 relative">
                    <img
                      src={chef.image}
                      alt={isEn ? chef.nameEn : chef.nameBn}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-editorial-accent tracking-wider block">
                      {isEn ? `EXPERIENCE: ${chef.experienceEn}` : `অভিজ্ঞতা: ${chef.experienceBn}`}
                    </span>
                    <h3 className="font-serif font-extrabold text-lg text-editorial-dark group-hover:text-editorial-accent transition-colors">
                      {isEn ? chef.nameEn : chef.nameBn}
                    </h3>
                    <p className="text-[11px] font-sans font-bold text-slate-500 leading-tight uppercase tracking-wider">
                      {isEn ? chef.roleEn : chef.roleBn}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1.5 font-sans line-clamp-3">
                      {isEn ? chef.bgEn : chef.bgBn}
                    </p>
                  </div>
                </div>

                {/* Footer CTA of Card */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedChef(chef)}
                    className="w-full py-2 border border-editorial-border hover:border-editorial-accent text-editorial-dark hover:text-white hover:bg-editorial-accent text-[11px] uppercase tracking-wider font-bold transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isEn ? "View Full Portfolio" : "সম্পূর্ণ পোর্টফোলিও দেখুন"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Interactive Master Portfolio Showcase Modal */}
        <AnimatePresence>
          {selectedChef && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedChef(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-[#FDFCF9] border border-editorial-border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedChef(null)}
                  className="absolute top-4 right-4 p-2 bg-[#1A1A1A] hover:bg-red-800 text-white rounded-none border border-editorial-border transition z-20 cursor-pointer"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Double Panel Layout inside Modal */}
                <div className="grid grid-cols-1 md:grid-cols-12">
                  
                  {/* Left Column: Image and High-contrast Stats */}
                  <div className="md:col-span-5 bg-stone-900 text-stone-100 flex flex-col justify-between border-r border-editorial-border md:min-h-[500px]">
                    <div className="aspect-[4/5] md:aspect-auto md:h-[320px] w-full relative overflow-hidden bg-stone-800">
                      <img
                        src={selectedChef.image}
                        alt={isEn ? selectedChef.nameEn : selectedChef.nameBn}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <span className="text-[9px] bg-editorial-accent text-white px-2 py-0.5 uppercase tracking-widest font-mono font-bold">
                          {isEn ? selectedChef.specialityEn : selectedChef.specialityBn}
                        </span>
                        <h2 className="font-serif font-extrabold text-xl text-white mt-1.5">
                          {isEn ? selectedChef.nameEn : selectedChef.nameBn}
                        </h2>
                        <p className="text-[10px] uppercase text-stone-300 font-sans tracking-wider">
                          {isEn ? selectedChef.roleEn : selectedChef.roleBn}
                        </p>
                      </div>
                    </div>

                    {/* Stats or summary in dark sidebar */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-center bg-[#1E1E1E]">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#2A2A2A] text-editorial-accent flex items-center justify-center">
                          <Award className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-stone-400 block uppercase font-mono tracking-wider">
                            {isEn ? "Years of Excellence" : "রন্ধন অভিজ্ঞতা"}
                          </span>
                          <span className="text-sm font-bold text-stone-100">
                            {isEn ? selectedChef.experienceEn : selectedChef.experienceBn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#2A2A2A] text-editorial-accent flex items-center justify-center">
                          <ChefHat className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-stone-400 block uppercase font-mono tracking-wider">
                            {isEn ? "Key Focus" : "প্রধান ক্ষেত্র"}
                          </span>
                          <span className="text-xs font-bold text-stone-200">
                            {isEn ? selectedChef.specialityEn : selectedChef.specialityBn}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Narrative Portfolio & Experiences */}
                  <div className="md:col-span-7 p-6 sm:p-8 space-y-6 text-left">
                    
                    {/* Bio & Philosophy Block */}
                    <div className="space-y-2.5">
                      <span className="text-[9px] text-editorial-accent font-extrabold tracking-widest block uppercase font-mono">
                        {isEn ? "Culinary Philosophy" : "রন্ধন দর্শন"}
                      </span>
                      <blockquote className="font-serif font-bold text-base text-editorial-dark italic border-l-2 border-editorial-accent pl-3 leading-relaxed">
                        "{isEn ? selectedChef.philosophyEn : selectedChef.philosophyBn}"
                      </blockquote>
                      <p className="text-xs text-slate-500 leading-relaxed pt-1">
                        {isEn ? selectedChef.bioEn : selectedChef.bioBn}
                      </p>
                    </div>

                    {/* Signature Dishes with beautiful small paper cards */}
                    <div className="space-y-3">
                      <h4 className="font-serif font-extrabold text-sm text-editorial-dark flex items-center gap-2">
                        <Heart className="h-4 w-4 text-editorial-accent fill-editorial-accent" />
                        <span>{isEn ? "Signature Plates" : "শেফের সিগনেচার ডিশসমূহ"}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {(isEn ? selectedChef.signatureDishesEn : selectedChef.signatureDishesBn).map((dish, i) => (
                          <div key={i} className="p-3 bg-[#F7F5F0] border border-editorial-border font-medium text-slate-700 flex items-start gap-1.5">
                            <span className="text-[10px] text-editorial-accent font-mono font-bold">{i + 1}.</span>
                            <span>{dish}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Career Milestones */}
                    <div className="space-y-3">
                      <h4 className="font-serif font-extrabold text-sm text-editorial-dark flex items-center gap-2">
                        <Award className="h-4 w-4 text-editorial-accent" />
                        <span>{isEn ? "Notable Milestones & Credentials" : "উল্লেখযোগ্য অর্জন এবং যোগ্যতা"}</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 pl-1">
                        {(isEn ? selectedChef.achievementsEn : selectedChef.achievementsBn).map((ach, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="mt-0.5 h-4 w-4 bg-editorial-accent/10 text-editorial-accent flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3" />
                            </div>
                            <span className="leading-relaxed">{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Active Masterclass / course connection */}
                    <div className="pt-5 border-t border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F7F5F0]/50 p-4 border border-editorial-border">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-widest text-slate-400 font-extrabold block">
                          {isEn ? "Core Course Instructed" : "পরিচালিত মূল কোর্স"}
                        </span>
                        <span className="font-serif font-extrabold text-sm text-editorial-dark block">
                          {isEn ? selectedChef.courseTitleEn : selectedChef.courseTitleBn}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectCourse(selectedChef.courseId);
                          setSelectedChef(null);
                        }}
                        className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{isEn ? "Explore Course" : "কোর্সটি দেখুন"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
