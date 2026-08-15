import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Image as ImageIcon,
  Sparkles,
  Camera,
  Play,
  Award,
  ChefHat,
  Eye,
  X,
  Share2,
  Check,
  Maximize2,
  ArrowRight,
  Filter,
  Layers,
  MapPin,
  Heart,
} from "lucide-react";
import { Language } from "../types";
import chef1Image from "../assets/images/regenerated_image_1783236070688.jpg";
import chef2Image from "../assets/images/regenerated_image_1783570906752.jpg";
import chef3Image from "../assets/images/regenerated_image_1783572520006.jpg";
import chef4Image from "../assets/images/regenerated_image_1783649665068.png";

interface GalleryProps {
  lang: Language;
  onSelectCourse?: (courseId: string) => void;
}

interface GalleryItem {
  id: string;
  titleEn: string;
  titleBn: string;
  category: "masterclasses" | "plating" | "campus" | "dubai-global" | "convocations";
  categoryEn: string;
  categoryBn: string;
  image: string;
  aspect: "square" | "landscape" | "portrait";
  locationEn: string;
  locationBn: string;
  authorEn: string;
  authorBn: string;
  date: string;
  lqfLevel?: number;
  descriptionEn: string;
  descriptionBn: string;
  tagsEn: string[];
  tagsBn: string[];
  courseId?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    titleEn: "Executive Bengali Mustard Ilish Plating",
    titleBn: "এক্সিকিউটিভ সর্ষে ইলিশ প্লেটিং আর্ট",
    category: "plating",
    categoryEn: "Gourmet Plating",
    categoryBn: "গোরমেট প্লেটিং",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
    aspect: "square",
    locationEn: "Dhaka Master Kitchen Studio",
    locationBn: "ঢাকা মাস্টার কিচেন স্টুডিও",
    authorEn: "Chef Tawhid Shekh",
    authorBn: "শেফ তৌহিদ শেখ",
    date: "August 2026",
    lqfLevel: 4,
    descriptionEn: "A contemporary elevated presentation of heritage Padma Shorshe Ilish with cold-pressed mustard emulsion, micro-greens, and smoked banana leaf oil aroma.",
    descriptionBn: "ঐতিহ্যবাহী পদ্মা নদীর সর্ষে ইলিশের আধুনিক প্লেটিং, সাথে কোল্ড-প্রেসড সরিষার ইমালশন এবং স্মোকড কলাপাতা অয়েল।",
    tagsEn: ["Heritage Cuisine", "Molecular Emulsion", "LQF Level 4"],
    tagsBn: ["ঐতিহ্যবাহী রান্না", "মলিকিউলার ইমালশন", "লেভেল ৪"],
    courseId: "course-1"
  },
  {
    id: "gal-2",
    titleEn: "Artisan Sourdough & Laminated Viennoiserie",
    titleBn: "আর্টিসান সোরডো ও ফ্রেঞ্চ ক্রোসাঁ বেকিং",
    category: "masterclasses",
    categoryEn: "Live Masterclass",
    categoryBn: "লাইভ মাস্টারক্লাস",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
    locationEn: "Lodonex Pastry Lab, Banani",
    locationBn: "লোডোনেক্স পেস্ট্রি ল্যাব, বনানী",
    authorEn: "Master Baker Faculty",
    authorBn: "মাস্টার বেকার ফ্যাকাল্টি",
    date: "July 2026",
    lqfLevel: 3,
    descriptionEn: "Apprentices mastering 72-hour wild sourdough fermentation and 27-layer butter lamination for flaky golden French pastries.",
    descriptionBn: "৭২-ঘণ্টার বুনো ইস্ট ফারমেন্টেশন এবং বাটার লেয়ারিংয়ের মাধ্যমে পারফেক্ট ফ্রেঞ্চ ক্রোসাঁ তৈরির ব্যবহারিক ক্লাস।",
    tagsEn: ["Artisan Baking", "Wild Yeast", "LQF Level 3"],
    tagsBn: ["আর্টিসান বেকিং", "ইস্ট ফারমেন্টেশন", "লেভেল ৩"],
    courseId: "course-2"
  },
  {
    id: "gal-3",
    titleEn: "Dubai Marina 5-Star Hotel Placement Cohort",
    titleBn: "দুবাই মেরিনা ৫-তারকা হোটেলে গ্র্যাজুয়েটদের যোগদান",
    category: "dubai-global",
    categoryEn: "Global Placements",
    categoryBn: "বৈশ্বিক কর্মসংস্থান",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80",
    aspect: "portrait",
    locationEn: "Jumeirah Beach Residence, Dubai (UAE)",
    locationBn: "জুমেইরাহ বিচ রেসিডেন্স, দুবাই (ইউএই)",
    authorEn: "Lodonex Alumni Chapter Dubai",
    authorBn: "লোডোনেক্স অ্যালামনাই চ্যাপ্টার দুবাই",
    date: "June 2026",
    lqfLevel: 5,
    descriptionEn: "Cohort 12 graduates arriving at their furnished luxury staff apartments in Dubai Marina after completing their LQF Level 5 certifications.",
    descriptionBn: "এলকিউএফ লেভেল ৫ সম্পন্ন করে দুবাই মেরিনার বিলাসবহুল স্টাফ রেসিডেন্সে লোডোনেক্সের ১২তম ব্যাচের শিক্ষার্থীদের আগমন।",
    tagsEn: ["Dubai Placement", "Furnished Housing", "5-Star Hotel"],
    tagsBn: ["দুবাই প্লেসমেন্ট", "ফার্নিশড আবাসন", "৫-তারকা হোটেল"]
  },
  {
    id: "gal-4",
    titleEn: "High-Flame Wok Seasoning & Dim Sum Craft",
    titleBn: "হাই-ফ্লেম ওক সিজনিং ও ডিম সাম প্রস্তুতি",
    category: "masterclasses",
    categoryEn: "Live Masterclass",
    categoryBn: "লাইভ মাস্টারক্লাস",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    aspect: "square",
    locationEn: "Asian Wok Amphitheater",
    locationBn: "এশিয়ান ওক অ্যাম্ফিথিয়েটার",
    authorEn: "Chef Bishal",
    authorBn: "শেফ বিশাল",
    date: "May 2026",
    lqfLevel: 4,
    descriptionEn: "Training culinary students on authentic Cantonese wok breath ('Wok Hei') control, dumpling pleating, and high-heat sauce glazes.",
    descriptionBn: "ক্যান্টনিজ ওক হেই টেকনিক, পারফেক্ট ডাম্পলিং ভাঁজ এবং তীব্র আঁচে দ্রুত সস গ্লেজ তৈরির হাতে-কলমে প্রশিক্ষণ।",
    tagsEn: ["Wok Hei", "Asian Cuisine", "LQF Level 4"],
    tagsBn: ["ওক হেই", "এশিয়ান কুইজিন", "লেভেল ৪"],
    courseId: "course-4"
  },
  {
    id: "gal-5",
    titleEn: "State-of-the-Art Commercial Kitchen Stations",
    titleBn: "আধুনিক বাণিজ্যিক কিচেন স্টেশন ও ল্যাব",
    category: "campus",
    categoryEn: "Campus & Labs",
    categoryBn: "ক্যাম্পাস ও ল্যাব",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
    locationEn: "Lodonex Central Campus, Gulshan-2",
    locationBn: "লোডোনেক্স সেন্ট্রাল ক্যাম্পাস, গুলশান-২",
    authorEn: "Campus Administration",
    authorBn: "ক্যাম্পাস প্রশাসন",
    date: "2026",
    descriptionEn: "Individual stainless steel workstations equipped with Rational combi steamers, sous-vide precision immersion circulators, and blast chillers.",
    descriptionBn: "জার্মান র্যাশনাল কম্বি স্টিমার, সু-ভিড প্রেসিশন মেশিন ও ব্লাস্ট চিলার সহ প্রত্যেক শিক্ষার্থীর জন্য আলাদা স্টেইনলেস স্টিল ওয়ার্কস্টেশন।",
    tagsEn: ["Commercial Equipment", "HACCP Sterile", "Kitchen Labs"],
    tagsBn: ["বাণিজ্যিক যন্ত্রপাতি", "এইচএসিসিপি ল্যাব", "কিচেন সুবিধা"]
  },
  {
    id: "gal-6",
    titleEn: "Annual Convocation & Gold Medal Honors",
    titleBn: "বার্ষিক সমাবর্তন ও স্বর্ণপদক প্রদান অনুষ্ঠান",
    category: "convocations",
    categoryEn: "Convocations",
    categoryBn: "সমাবর্তন ও অ্যাওয়ার্ড",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
    locationEn: "Dhaka International Convention Hall",
    locationBn: "ঢাকা আন্তর্জাতিক কনভেনশন হল",
    authorEn: "Academic Senate Board",
    authorBn: "একাডেমিক সিনেট বোর্ড",
    date: "March 2026",
    descriptionEn: "Over 350 culinary graduates receiving their government-registered diplomas, European fellowship pins, and international placement certificates.",
    descriptionBn: "৩৫০ জনেরও বেশি গ্র্যাজুয়েটদের সরকারি স্বীকৃত ডিপ্লোমা সনদ এবং আন্তর্জাতিক চাকরির যোগদানপত্র হস্তান্তর অনুষ্ঠান।",
    tagsEn: ["Convocation", "Gold Medal", "Diploma Award"],
    tagsBn: ["সমাবর্তন", "স্বর্ণপদক", "ডিপ্লোমা সনদ"]
  },
  {
    id: "gal-7",
    titleEn: "Classic French Mother Sauce Reductions",
    titleBn: "ক্লাসিক ফ্রেঞ্চ মাদার সস ও বিফ স্টেক প্লেটিং",
    category: "plating",
    categoryEn: "Gourmet Plating",
    categoryBn: "গোরমেট প্লেটিং",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    aspect: "square",
    locationEn: "Continental Masterclass Kitchen",
    locationBn: "কন্টিনেন্টাল মাস্টারক্লাস কিচেন",
    authorEn: "Chef Tawhid Shekh",
    authorBn: "শেফ তৌহিদ শেখ",
    date: "July 2026",
    lqfLevel: 5,
    descriptionEn: "Pan-seared tenderloin medallion with Espagnole sauce reduction, fondant potatoes, and glazed heirloom carrots.",
    descriptionBn: "প্যান-সিয়ার্ড বিফ টেন্ডারলয়েন স্টেক, সাথে ক্লাসিক এস্পানল সস রিডাকশন ও ফন্ড্যান্ট পটেটো।",
    tagsEn: ["Continental", "Mother Sauces", "LQF Level 5"],
    tagsBn: ["কন্টিনেন্টাল", "মাদার সস", "লেভেল ৫"],
    courseId: "course-1"
  },
  {
    id: "gal-8",
    titleEn: "Apprentice Student Lounge & Practice Kitchen",
    titleBn: "শিক্ষার্থীদের স্টাডি লাউঞ্জ ও প্র্যাকটিস কিচেন",
    category: "campus",
    categoryEn: "Campus & Labs",
    categoryBn: "ক্যাম্পাস ও ল্যাব",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    aspect: "landscape",
    locationEn: "Lodonex Residential Hostel, Banani",
    locationBn: "লোডোনেক্স রেসিডেন্সিয়াল হোস্টেল, বনানী",
    authorEn: "Hostel Management",
    authorBn: "হোস্টেল ব্যবস্থাপনা",
    date: "2026",
    descriptionEn: "24/7 dedicated practice kitchen where hostel residents experiment with culinary recipes, prepare for trade tests, and collaborate with peers.",
    descriptionBn: "হোস্টেলের শিক্ষার্থীদের জন্য সার্বক্ষণিক উন্মুক্ত প্র্যাকটিস কিচেন ও স্টাডি লাউঞ্জ যেখানে শিক্ষার্থীরা নিজেদের রেসিপি তৈরি করতে পারেন।",
    tagsEn: ["Student Life", "Hostel Facility", "24/7 Access"],
    tagsBn: ["শিক্ষার্থী জীবন", "হোস্টেল সুবিধা", "২৪/৭ প্র্যাকটিস"]
  }
];

export default function Gallery({ lang, onSelectCourse }: GalleryProps) {
  const isEn = lang === "en";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    { id: "all", labelEn: "All Highlights", labelBn: "সকল ছবি ও মুহূর্ত" },
    { id: "plating", labelEn: "Gourmet Plating & Dishes", labelBn: "গোরমেট প্লেটিং ও রেসিপি" },
    { id: "masterclasses", labelEn: "Live Masterclasses", labelBn: "লাইভ মাস্টারক্লাস" },
    { id: "campus", labelEn: "Campus & High-Tech Labs", labelBn: "ক্যাম্পাস ও আধুনিক ল্যাব" },
    { id: "dubai-global", labelEn: "Dubai & Global Placements", labelBn: "দুবাই ও বৈশ্বিক কর্মসংস্থান" },
    { id: "convocations", labelEn: "Convocations & Honors", labelBn: "সমাবর্তন ও অ্যাওয়ার্ড" },
  ];

  const filteredItems = activeCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="academy-gallery-page" className="py-8 bg-[#FDFCF9] min-h-screen text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-editorial-accent">
            <Camera className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold font-mono">
              {isEn ? "Visual Archive & Studio Chronicle" : "ভিজ্যুয়াল আর্কাইভ ও স্টুডিও ক্রনিকল"}
            </span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-editorial-dark tracking-tight leading-tight">
            {isEn ? "Lodonex Culinary Moments & Master Plating" : "লোডোনেক্সের রন্ধনশিল্পের অসাধারণ মুহূর্তসমূহ"}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
            {isEn
              ? "Explore our live masterclass sessions, Michelin-caliber dish creations, world-class stainless steel kitchen labs, student hostel facilities, and verified alumni placements across Dubai & Europe."
              : "আমাদের লাইভ মাস্টারক্লাস, আন্তর্জাতিক মানের খাবার প্লেটিং, আধুনিক কিচেন ল্যাব, শিক্ষার্থী হোস্টেল এবং দুবাই ও ইউরোপে সফলভাবে কর্মরত গ্র্যাজুয়েটদের স্থিরচিত্র ঘুরে দেখুন।"}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-editorial-border/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-[11px] uppercase tracking-wider font-bold transition cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-editorial-accent text-white"
                  : "bg-white border border-editorial-border text-slate-600 hover:bg-[#F7F5F0] hover:text-editorial-dark"
              }`}
            >
              {isEn ? cat.labelEn : cat.labelBn}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                id={`gallery-item-${item.id}`}
                onClick={() => setSelectedItem(item)}
                className="group bg-white border border-editorial-border overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer relative"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                  <img
                    src={item.image}
                    alt={isEn ? item.titleEn : item.titleBn}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-[#1A1A1A]/90 text-[#F5F2EB] text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 font-mono backdrop-blur-xs">
                    {isEn ? item.categoryEn : item.categoryBn}
                  </div>

                  {/* Hover Overlay with Eye Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 bg-white text-editorial-dark rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.date}</span>
                      {item.lqfLevel && (
                        <span className="text-editorial-accent font-bold">
                          LQF Level {item.lqfLevel}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-sm text-editorial-dark group-hover:text-editorial-accent transition-colors line-clamp-2">
                      {isEn ? item.titleEn : item.titleBn}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-editorial-border/40 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{isEn ? item.authorEn : item.authorBn}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{isEn ? item.locationEn.split(",")[0] : item.locationBn.split(",")[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Video Reel Highlights Bar */}
        <div className="bg-[#F7F5F0] border border-editorial-border p-6 sm:p-8 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-editorial-border/60 pb-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-mono text-editorial-accent font-extrabold block">
                {isEn ? "Cinematic Masterclass Reels" : "সিনেমাটিক মাস্টারক্লাস ক্লিপস"}
              </span>
              <h2 className="font-serif font-extrabold text-xl text-editorial-dark">
                {isEn ? "Watch Live Studio Demonstrations & Technique Breakdowns" : "লাইভ স্টুডিও ডেমো ও টেকনিক ভিডিও প্রিভিউ"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                titleEn: "Tempering French Chocolate & Mirror Glaze",
                titleBn: "ফ্রেঞ্চ চকোলেট টেম্পারিং ও মিরর গ্লেজ টেকনিক",
                duration: "04:15",
                chef: "Pastry Master Faculty",
                img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
              },
              {
                titleEn: "Sous-Vide Meat Precision & Searing",
                titleBn: "সু-ভিড মিট প্রেসিশন ও প্যান-সিয়ারিং কৌশল",
                duration: "06:30",
                chef: "Chef Tawhid Shekh",
                img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
              },
              {
                titleEn: "Wok Seasoning & High Flame Mastery",
                titleBn: "ওক সিজনিং এবং তীব্র আগুনের নিয়ন্ত্রণ",
                duration: "05:45",
                chef: "Chef Bishal",
                img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
              }
            ].map((reel, idx) => (
              <div
                key={idx}
                className="bg-white border border-editorial-border overflow-hidden group cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  if (onSelectCourse) onSelectCourse("course-1");
                }}
              >
                <div className="aspect-video w-full relative overflow-hidden bg-stone-900">
                  <img
                    src={reel.img}
                    alt={reel.titleEn}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-editorial-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white font-mono text-[9px] font-bold">
                    {reel.duration}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="font-serif font-bold text-xs text-editorial-dark line-clamp-1 group-hover:text-editorial-accent transition">
                    {isEn ? reel.titleEn : reel.titleBn}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {reel.chef}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-[#FDFCF9] border border-editorial-border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-[#1A1A1A] hover:bg-red-800 text-white transition z-20 cursor-pointer"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Column: Big Image Display */}
                  <div className="md:col-span-7 bg-stone-900 flex items-center justify-center min-h-[350px]">
                    <img
                      src={selectedItem.image}
                      alt={isEn ? selectedItem.titleEn : selectedItem.titleBn}
                      className="max-h-[500px] w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Right Column: Full Details */}
                  <div className="md:col-span-5 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-editorial-accent text-white px-2 py-0.5 uppercase tracking-widest font-mono font-bold">
                          {isEn ? selectedItem.categoryEn : selectedItem.categoryBn}
                        </span>
                        {selectedItem.lqfLevel && (
                          <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 uppercase tracking-widest font-mono font-bold">
                            LQF Level {selectedItem.lqfLevel}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-editorial-dark leading-tight">
                        {isEn ? selectedItem.titleEn : selectedItem.titleBn}
                      </h2>

                      <div className="space-y-1 text-xs text-slate-500 font-sans border-b border-editorial-border/60 pb-3">
                        <div className="flex items-center gap-1.5">
                          <ChefHat className="h-3.5 w-3.5 text-editorial-accent" />
                          <span className="font-medium text-slate-700">{isEn ? selectedItem.authorEn : selectedItem.authorBn}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-editorial-accent" />
                          <span>{isEn ? selectedItem.locationEn : selectedItem.locationBn}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {isEn ? selectedItem.descriptionEn : selectedItem.descriptionBn}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {(isEn ? selectedItem.tagsEn : selectedItem.tagsBn).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#F7F5F0] border border-editorial-border text-[10px] text-slate-600 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-editorial-border flex items-center justify-between gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-2 border border-editorial-border hover:bg-[#F7F5F0] text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                        <span>{copiedLink ? (isEn ? "Link Copied!" : "লিংক কপি হয়েছে") : (isEn ? "Share" : "শেয়ার")}</span>
                      </button>

                      {selectedItem.courseId && onSelectCourse && (
                        <button
                          onClick={() => {
                            onSelectCourse(selectedItem.courseId!);
                            setSelectedItem(null);
                          }}
                          className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isEn ? "View Course" : "কোর্স দেখুন"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
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
