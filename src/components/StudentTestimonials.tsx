import React from "react";
import { Language } from "../types";
import { Star, Award, Compass, Sparkles, GraduationCap, Quote } from "lucide-react";

interface StudentTestimonialsProps {
  lang: Language;
}

interface Testimonial {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  quoteEn: string;
  quoteBn: string;
  rating: number;
  completedCourseEn: string;
  completedCourseBn: string;
  avatar: string;
  badges: {
    id: string;
    titleEn: string;
    titleBn: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[];
}

export default function StudentTestimonials({ lang }: StudentTestimonialsProps) {
  const isEn = lang === "en";

  const testimonials: Testimonial[] = [
    {
      id: "testimonial-1",
      nameEn: "Nusrat Jahan",
      nameBn: "নুসরাত জাহান",
      roleEn: "Home Culinary Enthusiast",
      roleBn: "রন্ধন অনুরাগী",
      quoteEn: "Learning traditional Bengali heritage recipes under Chef Tawhid completely transformed my approach. The timing of 'Phoron' tempering was a game-changer! Highly recommended academy.",
      quoteBn: "শেফ তৌহিদের অধীনে ঐতিহ্যবাহী বাঙালি রান্নার কোর্সটি আমার রান্নার পদ্ধতি বদলে দিয়েছে। সঠিক সময়ে ফোড়ন দেওয়ার কৌশলটি সত্যি অসাধারণ! এই একাডেমিটির প্রতিটি মডিউল দারুণ গোছানো।",
      rating: 5,
      completedCourseEn: "Traditional Bengali Heritage Masterclass",
      completedCourseBn: "ঐতিহ্যবাহী বাঙালি রন্ধন মাস্টারক্লাস",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      badges: [
        {
          id: "badge-first",
          titleEn: "Gastronomy Pioneer",
          titleBn: "রন্ধনশিল্পের অগ্রদূত",
          icon: Compass,
          color: "bg-blue-50 text-blue-700 border-blue-200"
        },
        {
          id: "badge-quiz",
          titleEn: "Culinary Theorist",
          titleBn: "রন্ধন তত্ত্ববিদ",
          icon: Award,
          color: "bg-purple-50 text-purple-700 border-purple-200"
        }
      ]
    },
    {
      id: "testimonial-2",
      nameEn: "Sajid Rahman",
      nameBn: "সাজিদ রহমান",
      roleEn: "Aspiring Artisan Baker",
      roleBn: "পেশাদার বেকার পদপ্রার্থী",
      quoteEn: "The science of sourdough fermentation was a complete mystery to me. Chef Robert's deep dive into dough hydration and wild starters gave me the confidence to open my home micro-bakery!",
      quoteBn: "টকমিষ্টি পাউরুটির গাঁজন প্রক্রিয়াটি আমার কাছে এক রহস্য ছিল। ময়দার হাইড্রেশন এবং ওয়াইল্ড স্টার্টার নিয়ে শেফ রবার্টের চমৎকার বিশ্লেষণ আমাকে একটি হোম মাইক্রো-বেকারি খোলার আত্মবিশ্বাস দিয়েছে!",
      rating: 5,
      completedCourseEn: "Professional Sourdough & Bakery Masterclass",
      completedCourseBn: "পেশাদার বেকিং এবং পেস্ট্রি মাস্টারক্লাস",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      badges: [
        {
          id: "badge-graduate",
          titleEn: "Master Chef Graduate",
          titleBn: "মাস্টার শেফ গ্র্যাজুয়েট",
          icon: GraduationCap,
          color: "bg-amber-50 text-amber-700 border-amber-200"
        },
        {
          id: "badge-quiz",
          titleEn: "Culinary Theorist",
          titleBn: "রন্ধন তত্ত্ববিদ",
          icon: Award,
          color: "bg-purple-50 text-purple-700 border-purple-200"
        }
      ]
    },
    {
      id: "testimonial-3",
      nameEn: "Ishrat Amin",
      nameBn: "ইশরাত আমিন",
      roleEn: "Gourmet Hobbyist",
      roleBn: "গৌরমেট রন্ধন শৌখিন",
      quoteEn: "Crafting fresh, handmade pasta dough and assembling an authentic Roman Carbonara without using processed cream was a revelation. The interactive quiz was both fun and highly rigorous!",
      quoteBn: "তাজা হাতে তৈরি পাস্তা তৈরি করা এবং প্রক্রিয়াজাত হেভি ক্রিম ছাড়াই আসল রোমান কার্বোনারা প্রস্তুত করা আমার জন্য দারুণ অভিজ্ঞতা ছিল। কোর্সের শেষ কুইজটি ছিল চ্যালেঞ্জিং ও আনন্দদায়ক!",
      rating: 5,
      completedCourseEn: "Italian & Mediterranean Pasta Masterclass",
      completedCourseBn: "ইতালীয় ও ভূমধ্যসাগরীয় পাস্তা মাস্টারক্লাস",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      badges: [
        {
          id: "badge-recipe",
          titleEn: "Creative Alchemist",
          titleBn: "সৃজনশীল রন্ধনশিল্পী",
          icon: Sparkles,
          color: "bg-rose-50 text-rose-700 border-rose-200"
        }
      ]
    },
    {
      id: "testimonial-4",
      nameEn: "Farhana Yasmin",
      nameBn: "ফারহানা ইয়াসমিন",
      roleEn: "Professional Pastry Candidate",
      roleBn: "পেশাদার পেস্ট্রি শেফ পদপ্রার্থী",
      quoteEn: "The Gourmet Chocolate & French Pastry Masterclass was exceptionally detailed. Mastering tempered chocolate crystals to get that perfect snap and glossy look was absolutely empowering!",
      quoteBn: "গৌরমেট চকলেট এবং ফরাসি পেস্ট্রি মাস্টারক্লাসটি অত্যন্ত গোছানো ছিল। চকলেটে নিখুঁত ভঙ্গুরতা ও চমৎকার গ্লসি ফিনিশের বৈজ্ঞানিক তত্ত্ব আয়ত্ত করা আমার আত্মবিশ্বাসকে বহুগুণ বাড়িয়ে দিয়েছে!",
      rating: 5,
      completedCourseEn: "Gourmet Chocolate & French Pastry Masterclass",
      completedCourseBn: "গৌরমেট চকলেট এবং ফরাসি পেস্ট্রি মাস্টারক্লাস",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
      badges: [
        {
          id: "badge-pastry",
          titleEn: "Pâtissier Elite",
          titleBn: "পেস্ট্রি এলিট",
          icon: Sparkles,
          color: "bg-amber-50 text-amber-700 border-amber-200"
        },
        {
          id: "badge-quiz",
          titleEn: "Culinary Theorist",
          titleBn: "রন্ধন তত্ত্ববিদ",
          icon: Award,
          color: "bg-purple-50 text-purple-700 border-purple-200"
        }
      ]
    }
  ];

  return (
    <div id="student-testimonials-section" className="space-y-8 border-t border-editorial-border/60 pt-10 text-left">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-editorial-accent"></span>
          {isEn ? "Student Testimonials" : "শিক্ষার্থীদের প্রশংসাপত্র"}
        </h2>
        <p className="font-serif italic text-xl sm:text-2xl text-editorial-dark">
          {isEn ? "Stories of Culinary Transformation & Achievement" : "রন্ধন রূপান্তর এবং অর্জনের কিছু বাস্তব গল্প"}
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            id={t.id}
            className="bg-white border border-editorial-border p-6 flex flex-col justify-between space-y-6 relative hover:shadow-sm transition-all"
          >
            {/* Top quote icon design element */}
            <Quote className="absolute top-4 right-4 h-8 w-8 text-[#F7F5F0] pointer-events-none stroke-[3]" />

            {/* Quote content */}
            <div className="space-y-4 relative z-10">
              {/* Star ratings */}
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-editorial-accent text-editorial-accent" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed font-sans">
                &ldquo;{isEn ? t.quoteEn : t.quoteBn}&rdquo;
              </p>
            </div>

            {/* Bottom student info */}
            <div className="space-y-4 pt-4 border-t border-editorial-border/40">
              {/* Completed Course */}
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold font-sans">
                  {isEn ? "Completed Course" : "সম্পন্নকৃত কোর্স"}
                </span>
                <span className="text-xs font-serif font-bold text-editorial-dark block">
                  {isEn ? t.completedCourseEn : t.completedCourseBn}
                </span>
              </div>

              {/* Badges Earned */}
              <div className="flex flex-wrap gap-1.5">
                {t.badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <span
                      key={b.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-none text-[10px] font-bold tracking-tight uppercase ${b.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {isEn ? b.titleEn : b.titleBn}
                    </span>
                  );
                })}
              </div>

              {/* Student profile */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={isEn ? t.nameEn : t.nameBn}
                  className="h-10 w-10 rounded-full object-cover border border-editorial-border"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif font-bold text-xs text-editorial-dark">
                    {isEn ? t.nameEn : t.nameBn}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans">
                    {isEn ? t.roleEn : t.roleBn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
