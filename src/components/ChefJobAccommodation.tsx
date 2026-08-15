import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Home,
  Globe,
  Plane,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  UserCheck,
  Send,
  HelpCircle,
  ChevronDown,
  BedDouble,
  Utensils,
  Wifi,
  Coffee,
  HeartHandshake,
  Check,
  X,
} from "lucide-react";
import { Language } from "../types";

interface ChefJobAccommodationProps {
  lang: Language;
  onOpenAuth?: () => void;
  onSelectCourse?: (courseId: string) => void;
}

interface JobListing {
  id: string;
  titleEn: string;
  titleBn: string;
  companyEn: string;
  companyBn: string;
  locationEn: string;
  locationBn: string;
  country: "dubai" | "europe" | "saudi" | "qatar" | "bangladesh";
  flag: string;
  salaryEn: string;
  salaryBn: string;
  lqfRequirementEn: string;
  lqfRequirementBn: string;
  accommodationTypeEn: string;
  accommodationTypeBn: string;
  contractTypeEn: string;
  contractTypeBn: string;
  benefitsEn: string[];
  benefitsBn: string[];
  descriptionEn: string;
  descriptionBn: string;
  deadline: string;
  isHot?: boolean;
}

const JOB_LISTINGS: JobListing[] = [
  {
    id: "job-dubai-1",
    titleEn: "Demi Chef de Partie - Hot Kitchen",
    titleBn: "ডেমি শেফ ডি পার্টি - হট কিচেন",
    companyEn: "Jumeirah Luxury Resort & Spa",
    companyBn: "জুমেইরাহ লাক্সারি রিসোর্ট অ্যান্ড স্পা",
    locationEn: "Dubai Marina, United Arab Emirates (UAE)",
    locationBn: "দুবাই মেরিনা, সংযুক্ত আরব আমিরাত (ইউএই)",
    country: "dubai",
    flag: "🇦🇪",
    salaryEn: "8,500 AED/month (~2,80,000 BDT) Tax-Free",
    salaryBn: "৮,৫০০ দিরহাম/মাস (~২,৮০,০০০ টাকা) করমুক্ত",
    lqfRequirementEn: "LQF Level 4 or Level 5",
    lqfRequirementBn: "এলকিউএফ লেভেল ৪ অথবা লেভেল ৫",
    accommodationTypeEn: "Private Studio Apartment (Fully Furnished + AC + WiFi)",
    accommodationTypeBn: "ব্যক্তিগত স্টুডিও অ্যাপার্টমেন্ট (ফার্নিশড + এসি + ওয়াইফাই)",
    contractTypeEn: "2-Year Renewable Employment Contract",
    contractTypeBn: "২-বছরের নবায়নযোগ্য কর্মসংস্থান চুক্তি",
    benefitsEn: [
      "100% Free Furnished Luxury Accommodation",
      "Official UAE Employment Visa & Health Insurance",
      "Annual Round-Trip Flight Ticket to Dhaka",
      "Complimentary Gourmet Staff Meals (3x daily)",
      "30 Days Paid Annual Vacation & Overtime Bonus"
    ],
    benefitsBn: [
      "১০০% বিনামূল্যে সম্পূর্ণ ফার্নিশড লাক্সারি আবাসন",
      "সরকারি ইউএই এমপ্লয়মেন্ট ভিসা এবং পূর্ণাঙ্গ স্বাস্থ্যবীমা",
      "প্রতি বছর ঢাকায় যাওয়া-আসার বিমান টিকিট",
      "প্রতিদিন ৩ বেলা বিনামূল্যে পুষ্টিকর খাবার",
      "৩০ দিনের বাৎসরিক বেতনসহ ছুটি ও ওভারটাইম বোনাস"
    ],
    descriptionEn: "Lead kitchen sections for high-end banquets and fine-dining operations. Oversee ingredient preparation, sauce reductions, and line execution following modern hygiene and HACCP standards.",
    descriptionBn: "ফাইন-ডাইনিং ও বৃহৎ রাষ্ট্রীয় ভোজের হট কিচেন সেকশন পরিচালনা। আন্তর্জাতিক এইচএসিসিপি এবং ফুড সেফটি অনুযায়ী সস তৈরি ও প্রিমিয়াম প্লেটিং নিশ্চিত করা।",
    deadline: "30 Sept 2026",
    isHot: true
  },
  {
    id: "job-dubai-2",
    titleEn: "Artisan Pastry & Bakery Chef",
    titleBn: "আর্টিসান পেস্ট্রি ও বেকারি শেফ",
    companyEn: "The Royal Atlantis Beach Club",
    companyBn: "দ্য রয়্যাল আটলান্টিস বিচ ক্লাব",
    locationEn: "Palm Jumeirah, Dubai (UAE)",
    locationBn: "পাম জুমেইরাহ, দুবাই (ইউএই)",
    country: "dubai",
    flag: "🇦🇪",
    salaryEn: "9,200 AED/month (~3,05,000 BDT) Tax-Free",
    salaryBn: "৯,২০০ দিরহাম/মাস (~৩,০৫,০০০ টাকা) করমুক্ত",
    lqfRequirementEn: "LQF Level 5 (Specialized Pastry Track)",
    lqfRequirementBn: "এলকিউএফ লেভেল ৫ (স্পেশালাইজড পেস্ট্রি ট্র্যাক)",
    accommodationTypeEn: "Staff Residence Complex with Swimming Pool & Gym",
    accommodationTypeBn: "সুইমিং পুল ও জিম সহ প্রিমিয়াম স্টাফ রেসিডেন্স কমপ্লেক্স",
    contractTypeEn: "2-Year Full-Time Visa Sponsored Contract",
    contractTypeBn: "২-বছরের ফুল-টাইম স্পন্সরড ভিসা চুক্তি",
    benefitsEn: [
      "Dedicated Staff Accommodation with Air Conditioning & Shuttle",
      "Full Work Visa, Emirates ID & Medical Cover",
      "Free Duty Meals by Master Chefs",
      "Annual Bonus & Gratuity Pay",
      "Access to International Pastry Expos"
    ],
    benefitsBn: [
      "এসি ও কিচেন শাটল বাস সহ নিজস্ব স্টাফ আবাসন",
      "সরকারি ওয়ার্ক ভিসা, এমিরেটস আইডি ও হেলথ ইন্স্যুরেন্স",
      "মাস্টার শেফদের তৈরি ফ্রি ডিনার ও লাঞ্চ",
      "বার্ষিক উৎসব বোনাস ও গ্র্যাচুইটি সুবিধা",
      "আন্তর্জাতিক পেস্ট্রি এক্সপোতে অংশগ্রহণের সুযোগ"
    ],
    descriptionEn: "Craft artisanal sourdough loaves, laminated French viennoiseries, delicate macarons, and multi-tiered confectionery displays for VIP guests.",
    descriptionBn: "আর্টিসানাল সোরডো ব্রেড, ফ্রেঞ্চ ক্রসাঁ, পেস্ট্রি এবং ভিআইপি অতিথিদের জন্য বিশেষ কনফেকশনারি ডেজার্ট প্রস্তুতকরণ।",
    deadline: "15 Oct 2026",
    isHot: true
  },
  {
    id: "job-europe-1",
    titleEn: "Junior Sous Chef - Asian & Continental Fusion",
    titleBn: "জুনিয়র সু শেফ - এশিয়ান ও কন্টিনেন্টাল ফিউশন",
    companyEn: "Grand Hyatt & Gastronomy Suites",
    companyBn: "গ্র্যান্ড হায়াত অ্যান্ড গ্যাস্ট্রোনমি সুইটস",
    locationEn: "Berlin / Frankfurt, Germany",
    locationBn: "বার্লিন / ফ্রাঙ্কফুর্ট, জার্মানি",
    country: "europe",
    flag: "🇩🇪",
    salaryEn: "€2,850/month (~3,60,000 BDT) Gross",
    salaryBn: "€২,৮৫০ ইউরো/মাস (~৩,৬০,০০০ টাকা)",
    lqfRequirementEn: "LQF Level 6 or Level 7",
    lqfRequirementBn: "এলকিউএফ লেভেল ৬ অথবা লেভেল ৭",
    accommodationTypeEn: "Subsidized Academy & Hotel City Apartment in Berlin",
    accommodationTypeBn: "বার্লিনে একাডেমি ও হোটেল ভর্তুকিযুক্ত সিটি অ্যাপার্টমেন্ট",
    contractTypeEn: "German EU Blue Card / Skilled Worker Visa (3 Years)",
    contractTypeBn: "জার্মান ইইউ ব্লু কার্ড / স্কিল্ড ওয়ার্কার ভিসা (৩ বছর)",
    benefitsEn: [
      "Furnished Modern Apartment Included in Package",
      "German Work Permit & EU Residency Pathway",
      "Comprehensive EU Public Health & Social Security",
      "Free Daily Staff Dining & Uniform Laundry",
      "Language Course Support & Relocation Allowance"
    ],
    benefitsBn: [
      "প্যাকেজের সাথে ফার্নিশড আধুনিক ইউরোপিয়ান অ্যাপার্টমেন্ট",
      "জার্মান ওয়ার্ক পারমিট এবং স্থায়ী ইইউ রেসিডেন্সির সুযোগ",
      "পূর্ণাঙ্গ ইউরোপিয়ান হেলথ ও সোশ্যাল সিকিউরিটি কভার",
      "দৈনিক ফ্রি খাবার ও ইউনিফর্ম লন্ড্রি সুবিধা",
      "জার্মান ভাষা সহায়তা ও রিলোকেশন এলাউন্স"
    ],
    descriptionEn: "Oversee specialized culinary stations, collaborate with Michelin-starred visiting chefs, manage food production inventory, and ensure EU kitchen compliance.",
    descriptionBn: "বিশেষায়িত কালিনারি স্টেশন পরিচালনা, মিশেলিন স্টার শেফদের সাথে ফিউশন মেনু ডেভেলপমেন্ট এবং ইউরোপীয় ফুড স্ট্যান্ডার্ড বজায় রাখা।",
    deadline: "20 Oct 2026",
    isHot: false
  },
  {
    id: "job-europe-2",
    titleEn: "Chef de Partie - Bengali Heritage & Asian Grill",
    titleBn: "শেফ ডি পার্টি - বাঙালি হেরিটেজ ও এশিয়ান গ্রিল",
    companyEn: "The Bengal Pavilion & Hospitality Club",
    companyBn: "দ্য বেঙ্গল প্যাভিলিয়ন অ্যান্ড হসপিটালিটি ক্লাব",
    locationEn: "Central London / Manchester, United Kingdom (UK)",
    locationBn: "সেন্ট্রাল লন্ডন / ম্যানচেস্টার, যুক্তরাজ্য (ইউকে)",
    country: "europe",
    flag: "🇬🇧",
    salaryEn: "£2,400/month (~3,75,000 BDT)",
    salaryBn: "£২,৪০০ পাউন্ড/মাস (~৩,৭৫,০০০ টাকা)",
    lqfRequirementEn: "LQF Level 5 or Level 6",
    lqfRequirementBn: "এলকিউএফ লেভেল ৫ অথবা লেভেল ৬",
    accommodationTypeEn: "Staff House Ensuite Room with Central Heating & WiFi",
    accommodationTypeBn: "সেন্ট্রাল হিটিং ও ওয়াইফাই সহ স্টাফ হাউস এনস্যুট রুম",
    contractTypeEn: "UK Skilled Worker Visa (Skilled Chef Route)",
    contractTypeBn: "ইউকে স্কিল্ড ওয়ার্কার ভিসা (স্কিল্ড শেফ রুট)",
    benefitsEn: [
      "Fully Furnished Ensuite Room near Transit Hub",
      "UK Tier 2 Skilled Worker Visa Sponsorship (3-5 Years)",
      "NHS Healthcare Coverage for Full Duration",
      "Chef Duty Meals & Uniform Service",
      "Pathway to UK Permanent Residency (ILR)"
    ],
    benefitsBn: [
      "ট্রেন স্টেশনের কাছে সম্পূর্ণ ফার্নিশড এনস্যুট রুম",
      "ইউকে টায়ার-২ স্কিল্ড ওয়ার্কার ভিসা স্পন্সরশিপ",
      "যুক্তরাজ্যের এনএইচএস স্বাস্থ্যসেবা সুবিধা",
      "ডিউটি খাবার ও লন্ড্রি সার্ভিস",
      "ভবিষ্যতে ইউকে স্থায়ী নাগরিকত্ব (ILR) অর্জনের পথ"
    ],
    descriptionEn: "Execute authentic heritage Bengali and Mughal dishes with contemporary British plating styles. Train apprentice line cooks and manage spice formulation.",
    descriptionBn: "ঐতিহ্যবাহী বাঙালি এবং মোগলাই খাবারের আধুনিক প্রেজেন্টেশন এবং কিচেন টিমকে রেসিপি ফর্মুলেশন শেখানো।",
    deadline: "05 Nov 2026",
    isHot: true
  },
  {
    id: "job-saudi-1",
    titleEn: "Senior Commis / Banquet Line Cook",
    titleBn: "সিনিয়র কমিস / ব্যাঙ্কুয়েট লাইন কুক",
    companyEn: "Al Faisaliah Luxury Hotel",
    companyBn: "আল ফয়সালিয়াহ লাক্সারি হোটেল",
    locationEn: "Riyadh, Kingdom of Saudi Arabia (KSA)",
    locationBn: "রিয়াদ, সৌদি আরব (কেএসএ)",
    country: "saudi",
    flag: "🇸🇦",
    salaryEn: "6,800 SAR/month (~2,15,000 BDT) Tax-Free",
    salaryBn: "৬,৮০০ রিয়াল/মাস (~২,১৫,০০০ টাকা) করমুক্ত",
    lqfRequirementEn: "LQF Level 3 or Level 4",
    lqfRequirementBn: "এলকিউএফ লেভেল ৩ অথবা লেভেল ৪",
    accommodationTypeEn: "Single En-Suite Room in Modern Chef Staff Compound",
    accommodationTypeBn: "আধুনিক শেফ স্টাফ কম্পাউন্ডে সিঙ্গেল এন-স্যুট রুম",
    contractTypeEn: "2-Year Saudi Iqama Sponsored Contract",
    contractTypeBn: "২-বছরের সৌদি আকামা স্পন্সরড চুক্তি",
    benefitsEn: [
      "100% Free Accommodation with Gym & Recreation Lounge",
      "Saudi Work Visa (Iqama), Medical Insurance & VIP Transport",
      "Annual Free Return Ticket to Bangladesh",
      "Buffet Dining in Staff Restaurant",
      "Tax-Free Savings & End-of-Service Bonus"
    ],
    benefitsBn: [
      "জিম ও বিনোদন লাউঞ্জ সহ ১০০% ফ্রি আবাসন",
      "সৌদি ওয়ার্ক ভিসা (আকামা), মেডিকেল ইন্স্যুরেন্স ও এসি ট্রান্সপোর্ট",
      "প্রতি বছর বাংলাদেশে যাওয়া-আসার ফ্রি বিমান টিকিট",
      "স্টাফ রেস্তোরাঁয় ৩ বেলা বুফে খাবার",
      "সম্পূর্ণ করমুক্ত সঞ্চয় এবং গ্র্যাচুইটি বোনাস"
    ],
    descriptionEn: "Prepare ingredients, cold cuts, hot buffet lines, and banquet staging for high-profile governmental events and private royal celebrations.",
    descriptionBn: "রাষ্ট্রীয় ভিআইপি অনুষ্ঠান ও রাজকীয় ভোজের জন্য ক্যাটারিং এবং কিচেন স্টেশনের সুশৃঙ্খল দায়িত্ব পালন।",
    deadline: "18 Oct 2026",
    isHot: false
  },
  {
    id: "job-bd-1",
    titleEn: "Executive Chef Trainee / Station In-Charge",
    titleBn: "এক্সিকিউটিভ শেফ ট্রেইনি / স্টেশন ইন-চার্জ",
    companyEn: "InterContinental Dhaka & Pan Pacific Sonargaon",
    companyBn: "ইন্টারকন্টিনেন্টাল ঢাকা ও প্যান প্যাসিফিক সোনারগাঁও",
    locationEn: "Dhaka, Bangladesh",
    locationBn: "ঢাকা, বাংলাদেশ",
    country: "bangladesh",
    flag: "🇧🇩",
    salaryEn: "৳55,000 - ৳85,000 BDT/month + Service Charge",
    salaryBn: "৳৫৫,০০০ - ৳৮৫,০০০ টাকা/মাস + সার্ভিস চার্জ",
    lqfRequirementEn: "LQF Level 3 or Level 4",
    lqfRequirementBn: "এলকিউএফ লেভেল ৩ অথবা লেভেল ৪",
    accommodationTypeEn: "Lodonex Academy Hostels (Gulshan/Banani) or Housing Allowance",
    accommodationTypeBn: "লোডোনেক্স একাডেমি হোস্টেল (গুলশান/বনানী) অথবা আবাসন ভাতা",
    contractTypeEn: "Permanent 5-Star Hotel Employment",
    contractTypeBn: "স্থায়ী ৫-তারকা হোটেল কর্মসংস্থান",
    benefitsEn: [
      "5-Star Hotel Training & Placement Credentials",
      "Monthly Service Charge Distribution Pool",
      "Free Luxury Staff Meals & Uniform Cleaning",
      "Opportunity for Fast-Track Transfer to Dubai Branches",
      "Provident Fund, Gratuity & Festival Bonuses"
    ],
    benefitsBn: [
      "৫-তারকা আন্তর্জাতিক হোটেলের বাস্তব অভিজ্ঞতা ও সার্টিফিকেট",
      "মাসিক সার্ভিস চার্জ পুল থেকে অতিরিক্ত আয়ের সুযোগ",
      "ফ্রি স্টাফ ডাইনিং এবং ইউনিফর্ম লন্ড্রি সুবিধা",
      "পরবর্তীতে সরাসরি দুবাই শাখায় বদলির বিশেষ অগ্রাধিকার",
      "প্রভিডেন্ট ফান্ড, গ্র্যাচুইটি এবং উৎসব বোনাস"
    ],
    descriptionEn: "Work alongside internationally certified culinary directors, master multi-cuisine buffet operations, and step into senior roles within top 5-star properties.",
    descriptionBn: "শীর্ষ আন্তর্জাতিক ৫-তারকা হোটেলে সরাসরি হেড শেফের অধীনে কাজ করে কন্টিনেন্টাল ও বেকারি সেকশন পরিচালনা করা।",
    deadline: "31 Oct 2026",
    isHot: true
  }
];

export default function ChefJobAccommodation({
  lang,
  onOpenAuth,
  onSelectCourse,
}: ChefJobAccommodationProps) {
  const isEn = lang === "en";

  const [activeTab, setActiveTab] = useState<"jobs" | "accommodation" | "roadmap" | "faq">("jobs");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedLqf, setSelectedLqf] = useState<string>("all");

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState<JobListing | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantLqf, setApplicantLqf] = useState("LQF Level 4");
  const [applicantExperience, setApplicantExperience] = useState("1-2 Years");
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Accommodation Booking state
  const [resortCampus, setResortCampus] = useState("dhaka-gulshan");
  const [roomType, setRoomType] = useState("single-deluxe");
  const [resortDate, setResortDate] = useState("2026-09-01");
  const [stayDuration, setStayDuration] = useState("3");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Calculator State
  const [calcTrack, setCalcTrack] = useState<"dubai" | "europe" | "bd">("dubai");
  const [calcLevel, setCalcLevel] = useState<number>(4);

  const filteredJobs = JOB_LISTINGS.filter((job) => {
    const matchCountry = selectedCountry === "all" || job.country === selectedCountry;
    const matchLqf = selectedLqf === "all" || job.lqfRequirementEn.includes(selectedLqf);
    return matchCountry && matchLqf;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) return;
    setApplicationSuccess(true);
    setTimeout(() => {
      setApplicationSuccess(false);
      setApplyingJob(null);
      setApplicantName("");
      setApplicantEmail("");
      setApplicantPhone("");
    }, 2800);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
    }, 3000);
  };

  return (
    <div id="chef-job-accommodation-page" className="py-8 bg-[#FDFCF9] min-h-screen text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Top Headline & Vision Banner */}
        <div className="bg-editorial-dark text-white border border-[#1A1A1A] p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-editorial-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-editorial-accent text-white font-mono text-[9px] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                {isEn ? "Global Placement & Relocation Gateway" : "বৈশ্বিক কর্মসংস্থান ও আবাসন নেটওয়ার্ক"}
              </span>
              <span className="px-2.5 py-1 bg-white/10 text-stone-300 font-mono text-[9px] uppercase tracking-widest font-bold">
                {isEn ? "Dubai • London • Berlin • Riyadh" : "দুবাই • লন্ডন • বার্লিন • রিয়াদ"}
              </span>
            </div>
            
            <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {isEn
                ? "Elite Chef Career Placement & Guaranteed Accommodation in Dubai & Europe"
                : "দুবাই এবং ইউরোপের শীর্ষ রেস্তোরাঁয় শেফ চাকরি ও শতভাগ নিশ্চিত আবাসন সুবিধা"}
            </h1>
            
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {isEn
                ? "Lodonex is Bangladesh's premier accredited gastronomy institution with an active international hospitality pipeline. We connect our certified graduates directly to 5-star hotels, Michelin-starred kitchens, and luxury cruise liners—complete with free furnished housing, full work visa sponsorship, and tax-free global earnings."
                : "লোডোনেক্স একাডেমির সার্টিফাইড শিক্ষার্থীদের জন্য রয়েছে দুবাই, যুক্তরাজ্য, জার্মানি এবং মধ্যপ্রাচ্যের বিলাসবহুল ৫-তারকা হোটেলসমূহে সরাসরি ইন্টারভিউ, ১০০% নিশ্চিত আবাসন, ওয়ার্ক পারমিট ভিসা এবং আকর্ষণীয় করমুক্ত বেতন প্যাকেজ।"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800 text-left">
              <div>
                <span className="block font-serif font-extrabold text-xl sm:text-2xl text-editorial-accent">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  {isEn ? "Furnished Housing" : "ফার্নিশড আবাসন"}
                </span>
              </div>
              <div>
                <span className="block font-serif font-extrabold text-xl sm:text-2xl text-white">৳2.5L - ৳3.8L</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  {isEn ? "Avg Monthly Salary" : "মাসিক গড় আয়"}
                </span>
              </div>
              <div>
                <span className="block font-serif font-extrabold text-xl sm:text-2xl text-white">450+</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  {isEn ? "Alumni in Dubai" : "দুবাইয়ে কর্মরত গ্র্যাজুয়েট"}
                </span>
              </div>
              <div>
                <span className="block font-serif font-extrabold text-xl sm:text-2xl text-white">65+</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  {isEn ? "Partner Hotel Chains" : "পার্টনার হোটেল চেইন"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-editorial-border gap-2 pb-2">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[
              { id: "jobs", labelEn: "Verified International Job Openings", labelBn: "ভেরিফাইড আন্তর্জাতিক চাকরির তালিকা", icon: Briefcase },
              { id: "accommodation", labelEn: "Campus & International Housing", labelBn: "একাডেমি ও আন্তর্জাতিক হোস্টেল আবাসন", icon: Home },
              { id: "roadmap", labelEn: "6-Step Relocation & Visa Roadmap", labelBn: "৬-ধাপে ভিসা ও ক্যারিয়ার রিলোকেশন", icon: Plane },
              { id: "faq", labelEn: "Placement FAQ & Guidelines", labelBn: "চাকরি ও আবাসন সহায়িকা (FAQ)", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`job-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-editorial-accent text-editorial-accent bg-[#F7F5F0]"
                      : "border-transparent text-slate-500 hover:text-editorial-dark hover:bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{isEn ? tab.labelEn : tab.labelBn}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isEn ? "Active Recruitment Cycle: 2026-2027" : "সক্রিয় নিয়োগ কার্যক্রম: ২০২৬-২০২৭"}</span>
          </div>
        </div>

        {/* TAB 1: VERIFIED INTERNATIONAL JOB BOARD */}
        {activeTab === "jobs" && (
          <div className="space-y-6 text-left">
            {/* Filters Bar */}
            <div className="p-4 bg-white border border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider mr-1">
                  {isEn ? "Filter Destination:" : "দেশ নির্বাচন:"}
                </span>
                {[
                  { id: "all", labelEn: "All Countries", labelBn: "সকল দেশ" },
                  { id: "dubai", labelEn: "🇦🇪 Dubai / UAE", labelBn: "🇦🇪 দুবাই / ইউএই" },
                  { id: "europe", labelEn: "🇪🇺 UK & Germany", labelBn: "🇪🇺 ইউকে ও জার্মানি" },
                  { id: "saudi", labelEn: "🇸🇦 Saudi Arabia", labelBn: "🇸🇦 সৌদি আরব" },
                  { id: "bangladesh", labelEn: "🇧🇩 Dhaka 5-Star", labelBn: "🇧🇩 ঢাকা ৫-তারকা" },
                ].map((country) => (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      selectedCountry === country.id
                        ? "bg-editorial-dark text-white"
                        : "bg-[#F7F5F0] text-slate-600 hover:bg-stone-200"
                    }`}
                  >
                    {isEn ? country.labelEn : country.labelBn}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  {isEn ? "LQF Level:" : "এলকিউএফ:"}
                </span>
                <select
                  value={selectedLqf}
                  onChange={(e) => setSelectedLqf(e.target.value)}
                  className="px-3 py-1.5 border border-editorial-border bg-white text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="all">{isEn ? "All Levels (1-8)" : "সকল লেভেল (১-৮)"}</option>
                  <option value="Level 3">{isEn ? "Level 3 - Commis I" : "লেভেল ৩ - কমিস ১"}</option>
                  <option value="Level 4">{isEn ? "Level 4 - Senior Commis" : "লেভেল ৪ - সিনিয়র কমিস"}</option>
                  <option value="Level 5">{isEn ? "Level 5 - Demi Chef de Partie" : "লেভেল ৫ - ডেমি শেফ ডি পার্টি"}</option>
                  <option value="Level 6">{isEn ? "Level 6 - Sous Chef" : "লেভেল ৬ - সু শেফ"}</option>
                </select>
              </div>
            </div>

            {/* Job Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className="bg-white border border-editorial-border flex flex-col justify-between p-6 hover:shadow-md transition-shadow relative space-y-4"
                >
                  {job.isHot && (
                    <div className="absolute top-0 right-0 bg-editorial-accent text-white font-mono text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5">
                      {isEn ? "Urgent Hiring • Visa Ready" : "জরুরি নিয়োগ • ভিসা প্রস্তুত"}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <span className="text-base">{job.flag}</span>
                          <span className="font-serif font-bold text-editorial-dark">{isEn ? job.companyEn : job.companyBn}</span>
                        </div>
                        <h3 className="font-serif font-extrabold text-lg text-editorial-dark mt-1">
                          {isEn ? job.titleEn : job.titleBn}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-editorial-accent flex-shrink-0" />
                          <span>{isEn ? job.locationEn : job.locationBn}</span>
                        </div>
                      </div>
                    </div>

                    {/* Salary & Accommodation Highlight Box */}
                    <div className="p-3.5 bg-[#F7F5F0] border-l-3 border-editorial-accent space-y-1.5 font-sans">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          {isEn ? "Salary & Remuneration:" : "মাসিক বেতন ও ভাতা:"}
                        </span>
                        <span className="font-serif font-extrabold text-editorial-dark text-sm text-emerald-800">
                          {isEn ? job.salaryEn : job.salaryBn}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <Home className="h-3.5 w-3.5 text-editorial-accent mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{isEn ? job.accommodationTypeEn : job.accommodationTypeBn}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Award className="h-3 w-3 text-editorial-accent flex-shrink-0" />
                        <span>{isEn ? `Required: ${job.lqfRequirementEn}` : `যোগ্যতা: ${job.lqfRequirementBn}`}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {isEn ? job.descriptionEn : job.descriptionBn}
                    </p>

                    {/* Key Benefits Checklist */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono block">
                        {isEn ? "Included Employment Perks:" : "অন্তর্ভুক্ত সুযোগ-সুবিধা:"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                        {(isEn ? job.benefitsEn : job.benefitsBn).slice(0, 4).map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-editorial-border flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isEn ? `Apply by: ${job.deadline}` : `আবেদনের শেষ তারিখ: ${job.deadline}`}
                    </span>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isEn ? "Apply for Placement" : "আবেদন করুন"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMY HOSTELS & INTERNATIONAL HOUSING */}
        {activeTab === "accommodation" && (
          <div className="space-y-8 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Housing Facilities Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-editorial-accent font-mono block">
                    {isEn ? "Lodonex Residential Facilities" : "লোডোনেক্স আবাসন সুবিধা"}
                  </span>
                  <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                    {isEn
                      ? "Dedicated Student Hostels in Dhaka & Partner Chef Lodgings in Dubai"
                      : "ঢাকায় শিক্ষার্থীদের জন্য সুসজ্জিত হোস্টেল এবং দুবাইয়ে ট্রানজিশন অ্যাপার্টমেন্ট"}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {isEn
                      ? "To support culinary apprentices from across Bangladesh and international trainees, Lodonex operates safe, modern residential accommodations near our commercial master kitchen labs in Gulshan and Banani, as well as transit housing in Dubai."
                      : "দূর-দূরান্ত থেকে আসা শিক্ষার্থী ও আন্তর্জাতিক ট্রেইনিদের জন্য ঢাকায় গুলশান ও বনানীতে লোডোনেক্সের রয়েছে নিজস্ব শীতাতপ নিয়ন্ত্রিত আধুনিক হোস্টেল এবং দুবাইয়ে ট্রানজিশন রেসিডেন্স।"}
                  </p>
                </div>

                {/* Campus Housing Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-editorial-border space-y-2">
                    <div className="h-8 w-8 bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent">
                      <BedDouble className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-editorial-dark">
                      {isEn ? "Single Executive Suite" : "সিঙ্গেল এক্সিকিউটিভ স্যুট"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isEn ? "Private en-suite bathroom, study desk, 40\" monitor for lecture reviews, silent AC." : "ব্যক্তিগত বাথরুম, স্টাডি ডেস্ক, লেকচার দেখার ডিসপ্লে ও সাইলেন্ট এসি।"}
                    </p>
                    <span className="font-mono text-xs font-bold text-editorial-accent block pt-1">
                      {isEn ? "৳12,500/month" : "১২,৫০০ টাকা/মাস"}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-editorial-border space-y-2">
                    <div className="h-8 w-8 bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent">
                      <Home className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-editorial-dark">
                      {isEn ? "Shared Apprentice Double" : "শেয়ার্ড ডাবল রুম"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isEn ? "2-student shared room with individual wardrobe, ergonomic study zone, and high-speed fiber." : "২ জন শিক্ষার্থীর জন্য আরামদায়ক বেড, নিজস্ব ওয়ারড্রোব ও ফাইবার ওয়াইফাই।"}
                    </p>
                    <span className="font-mono text-xs font-bold text-editorial-accent block pt-1">
                      {isEn ? "৳7,500/month" : "৭,৫০০ টাকা/মাস"}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-editorial-border space-y-2">
                    <div className="h-8 w-8 bg-[#F7F5F0] border border-editorial-border flex items-center justify-center text-editorial-accent">
                      <Building2 className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-editorial-dark">
                      {isEn ? "Dubai Transition Villa" : "দুবাই ট্রানজিশন ভিলা"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isEn ? "30-90 day orientation lodging in Deira / Dubai Marina before hotel check-in." : "দুবাইয়ের হোটেলে যোগদানের পূর্বে ৩০-৯০ দিনের ওরিয়েন্টেশন আবাসন।"}
                    </p>
                    <span className="font-mono text-xs font-bold text-editorial-accent block pt-1">
                      {isEn ? "100% Sponsor Covered" : "১০০% স্পন্সর কভার্ড"}
                    </span>
                  </div>
                </div>

                {/* Amenities Bento */}
                <div className="p-5 bg-[#F7F5F0] border border-editorial-border space-y-3">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-editorial-dark">
                    {isEn ? "Inclusive Living Amenities for Apprentices" : "হোস্টেলের সুযোগ-সুবিধাসমূহ"}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "3x Daily Halal Meals" : "৩ বেলা পুষ্টিকর হালাল খাবার"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "High-Speed WiFi" : "উচ্চগতির ফাইবার ওয়াইফাই"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "24/7 Kitchen Lab Access" : "২৪/৭ কিচেন ল্যাবে প্রবেশ"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "24/7 Security & CCTV" : "সার্বক্ষণিক নিরাপত্তা ও সিসিটিভি"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "Daily Campus Shuttle" : "দৈনিক ক্যাম্পাস শাটল সার্ভিস"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "Student Study Lounge" : "শিক্ষার্থীদের স্টাডি লাউঞ্জ"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Accommodation Booking Request Form */}
              <div className="lg:col-span-5 bg-white border border-editorial-border p-6 shadow-xs space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-editorial-accent font-extrabold block">
                    {isEn ? "Reserve Student Housing" : "হোস্টেল সিট বুকিং আবেদন"}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-editorial-dark">
                    {isEn ? "Book Your Academy Room" : "আপনার হোস্টেল সিট নিশ্চিত করুন"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isEn
                      ? "Submit your reservation request for Dhaka campus hostels or Dubai pre-placement suites."
                      : "ঢাকা বা দুবাই আবাসনের জন্য আপনার পছন্দের রুম ও সময় নির্বাচন করে আবেদন জমা দিন।"}
                  </p>
                </div>

                {bookingSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h4 className="font-serif font-bold text-sm text-emerald-900">
                      {isEn ? "Reservation Request Received!" : "বুকিং আবেদন সফলভাবে জমা হয়েছে!"}
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {isEn
                        ? "Our hostel accommodation warden will review your application and send room confirmation & check-in guidelines to your email."
                        : "আমাদের হোস্টেল টিম আপনার আবেদনটি পর্যালোচনা করে ২৪ ঘণ্টার মধ্যে ইমেইলে কনফার্মেশন পাঠাবে।"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {isEn ? "Campus Location:" : "ক্যাম্পাস লোকেশন:"}
                      </label>
                      <select
                        value={resortCampus}
                        onChange={(e) => setResortCampus(e.target.value)}
                        className="w-full px-3 py-2 border border-editorial-border bg-[#FDFCF9] text-xs font-medium text-slate-700 outline-none"
                      >
                        <option value="dhaka-gulshan">{isEn ? "Dhaka Main Campus - Gulshan-2" : "ঢাকা মেইন ক্যাম্পাস - গুলশান-২"}</option>
                        <option value="dhaka-banani">{isEn ? "Dhaka Central Hostel - Banani" : "ঢাকা সেন্ট্রাল হোস্টেল - বনানী"}</option>
                        <option value="dubai-deira">{isEn ? "Dubai Transit Lodge - Deira" : "দুবাই ট্রানজিট লজ - ডেইরা"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {isEn ? "Preferred Room Type:" : "রুমের ধরন:"}
                      </label>
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="w-full px-3 py-2 border border-editorial-border bg-[#FDFCF9] text-xs font-medium text-slate-700 outline-none"
                      >
                        <option value="single-deluxe">{isEn ? "Single Executive Suite (৳12,500/mo)" : "সিঙ্গেল এক্সিকিউটিভ স্যুট (১২,৫০০ টাকা/মাস)"}</option>
                        <option value="shared-double">{isEn ? "Shared Apprentice Double (৳7,500/mo)" : "শেয়ার্ড ডাবল রুম (৭,৫০০ টাকা/মাস)"}</option>
                        <option value="trainee-dorm">{isEn ? "4-Bed Trainee Dormitory (৳4,500/mo)" : "৪-বেড ট্রেইনি ডরমিটরি (৪,৫০০ টাকা/মাস)"}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {isEn ? "Check-in Date:" : "চেক-ইন তারিখ:"}
                        </label>
                        <input
                          type="date"
                          value={resortDate}
                          onChange={(e) => setResortDate(e.target.value)}
                          className="w-full px-3 py-2 border border-editorial-border bg-[#FDFCF9] text-xs text-slate-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {isEn ? "Duration (Months):" : "সময়কাল (মাস):"}
                        </label>
                        <select
                          value={stayDuration}
                          onChange={(e) => setStayDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-editorial-border bg-[#FDFCF9] text-xs text-slate-700 outline-none"
                        >
                          <option value="1">1 {isEn ? "Month" : "মাস"}</option>
                          <option value="3">3 {isEn ? "Months (Course Term)" : "মাস (কোর্স মেয়াদ)"}</option>
                          <option value="6">6 {isEn ? "Months (Diploma)" : "মাস (ডিপ্লোমা)"}</option>
                          <option value="12">12 {isEn ? "Months (Fellowship)" : "মাস (ফেলোশিপ)"}</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-editorial-dark hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isEn ? "Submit Housing Reservation" : "আবাসন রিজার্ভেশন জমা দিন"}</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: 6-STEP RELOCATION & VISA ROADMAP */}
        {activeTab === "roadmap" && (
          <div className="space-y-8 text-left">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-editorial-accent font-mono block">
                {isEn ? "From Enrollment to International Kitchens" : "ভর্তি থেকে আন্তর্জাতিক কিচেন পর্যন্ত যাত্রা"}
              </span>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Your 6-Step Global Relocation & Career Pipeline" : "৬-ধাপে আপনার আন্তর্জাতিক শেফ ক্যারিয়ার নিশ্চিতকরণ"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  titleEn: "Masterclass & LQF Level Certification",
                  titleBn: "১. মাস্টারক্লাস ও এলকিউএফ সার্টিফিকেশন",
                  descEn: "Complete structured online lessons, interactive culinary chemistry quizzes, and achieve passing marks in the practical exam.",
                  descBn: "অনলাইন ভিডিও টিউটোরিয়াল ও কুইজ সম্পন্ন করে নির্ধারিত এলকিউএফ লেভেল ৩ থেকে লেভেল ৬ সার্টিফিকেট অর্জন করুন।"
                },
                {
                  step: "02",
                  titleEn: "Practical Trade Test & Dish Portfolio",
                  titleBn: "২. ব্যবহারিক ট্রেড টেস্ট ও ডিজিটাল পোর্টফোলিও",
                  descEn: "Produce 3 signature dishes in our video assessment lab to compile an accredited digital video portfolio for international recruiters.",
                  descBn: "আমাদের স্টুডিও ল্যাবে ৩টি সিগনেচার ডিশ রান্না করে আন্তর্জাতিক মানের ভিডিও পোর্টফোলিও প্রস্তুত করুন।"
                },
                {
                  step: "03",
                  titleEn: "Direct Virtual Interview with Hotel HR",
                  titleBn: "৩. সরাসরি আন্তর্জাতিক হোটেল কর্তৃপক্ষের ইন্টারভিউ",
                  descEn: "Lodonex schedules your live one-on-one virtual interview with executive chefs from Dubai, UK, or German hotel groups.",
                  descBn: "দুবাই বা ইউরোপের ৫-তারকা হোটেলের এক্সিকিউটিভ শেফ ও এইচআর টিমের সাথে অনলাইন ইন্টারভিউ সম্পন্ন করুন।"
                },
                {
                  step: "04",
                  titleEn: "Official Contract & Visa Processing",
                  titleBn: "৪. অফিশিয়াল চুক্তি ও ওয়ার্ক পারমিট ভিসা প্রসেসিং",
                  descEn: "Receive your signed employment contract, sponsored work visa, and official government attestation with zero hassle.",
                  descBn: "স্বীকৃত নিয়োগপত্র গ্রহণ এবং সরকারি ওয়ার্ক পারমিট ভিসা প্রসেসিং সম্পন্ন করা হয়।"
                },
                {
                  step: "05",
                  titleEn: "Flight & Airport Welcome Service",
                  titleBn: "৫. এয়ার টিকিট এবং আন্তর্জাতিক এয়ারপোর্টে অভ্যর্থনা",
                  descEn: "Employer-sponsored flight ticket to Dubai or European airport with dedicated Lodonex hospitality pickup assistance.",
                  descBn: "হোটেল কর্তৃক প্রদত্ত বিমান টিকিটে গন্তব্যে পৌঁছানো এবং এয়ারপোর্টে টিম কর্তৃক অভ্যর্থনা প্রদান।"
                },
                {
                  step: "06",
                  titleEn: "Check-in to Furnished Accommodation",
                  titleBn: "৬. সুসজ্জিত আবাসনে চেক-ইন ও কর্মজীবন শুরু",
                  descEn: "Check into your fully furnished residence with AC, WiFi, and gym, and commence your prestigious international culinary career.",
                  descBn: "সম্পূর্ণ ফার্নিশড ফ্ল্যাটে অবস্থান নিয়ে আন্তর্জাতিক হোটেলের সম্মানিত শেফ হিসেবে উজ্জ্বল ক্যারিয়ার শুরু করুন।"
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white border border-editorial-border space-y-3 relative">
                  <span className="font-serif font-extrabold text-3xl text-editorial-accent/30 block">
                    {item.step}
                  </span>
                  <h3 className="font-serif font-bold text-base text-editorial-dark">
                    {isEn ? item.titleEn : item.titleBn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {isEn ? item.descEn : item.descBn}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Career & Take-Home Salary Calculator */}
            <div className="p-6 sm:p-8 bg-[#F7F5F0] border border-editorial-border space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-editorial-border/60 pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-editorial-accent font-extrabold block">
                    {isEn ? "Interactive Career Simulator" : "ইন্টারেক্টিভ ইনকাম ক্যালকুলেটর"}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-editorial-dark">
                    {isEn ? "Calculate Your Estimated Earnings & Free Housing Value" : "আপনার সম্ভাব্য বৈশ্বিক আয় ও ফ্রি আবাসনের আর্থিক মূল্য গণনা করুন"}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {isEn ? "Target Destination:" : "কাঙ্ক্ষিত কর্মসংস্থান:"}
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: "dubai", label: "🇦🇪 Dubai / UAE (0% Tax)" },
                      { id: "europe", label: "🇪🇺 UK & Germany (EU Scale)" },
                      { id: "bd", label: "🇧🇩 Dhaka 5-Star Hotel" },
                    ].map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setCalcTrack(loc.id as any)}
                        className={`px-3 py-2 text-xs font-bold text-left transition cursor-pointer ${
                          calcTrack === loc.id
                            ? "bg-editorial-dark text-white"
                            : "bg-white border border-editorial-border text-slate-700"
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {isEn ? "LQF Qualification Level:" : "এলকিউএফ যোগ্যতা স্তর:"}
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { level: 3, label: "LQF 3: Commis I" },
                      { level: 4, label: "LQF 4: Senior Commis" },
                      { level: 5, label: "LQF 5: Demi Chef de Partie" },
                      { level: 6, label: "LQF 6: Sous Chef" },
                    ].map((lvl) => (
                      <button
                        key={lvl.level}
                        type="button"
                        onClick={() => setCalcLevel(lvl.level)}
                        className={`px-3 py-2 text-xs font-bold text-left transition cursor-pointer ${
                          calcLevel === lvl.level
                            ? "bg-editorial-accent text-white"
                            : "bg-white border border-editorial-border text-slate-700"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="p-6 bg-white border border-editorial-border space-y-4">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono font-bold block">
                    {isEn ? "Estimated Package Value" : "আনুমানিক আর্থিক প্যাকেজ"}
                  </span>
                  <div>
                    <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-editorial-dark text-emerald-800">
                      {calcTrack === "dubai"
                        ? `৳${(calcLevel * 55000 + 45000).toLocaleString()} BDT`
                        : calcTrack === "europe"
                        ? `৳${(calcLevel * 65000 + 60000).toLocaleString()} BDT`
                        : `৳${(calcLevel * 18000 + 20000).toLocaleString()} BDT`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {calcTrack === "dubai"
                        ? `${(calcLevel * 1600 + 1500).toLocaleString()} AED/month (100% Tax-Free)`
                        : calcTrack === "europe"
                        ? `€${(calcLevel * 450 + 750).toLocaleString()} / £${(calcLevel * 400 + 600).toLocaleString()}`
                        : "মাসিক মূল বেতন + সার্ভিস চার্জ বোনাস"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-editorial-border/60 text-xs text-slate-600 space-y-1 font-sans">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <Check className="h-3.5 w-3.5" />
                      <span>{isEn ? "+ Free Furnished Accommodation" : "+ বিনামূল্যে ফার্নিশড আবাসন"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <Check className="h-3.5 w-3.5" />
                      <span>{isEn ? "+ Free 3x Daily Chef Meals" : "+ বিনামূল্যে ৩ বেলা পুষ্টিকর খাবার"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PLACEMENT FAQ & GUIDELINES */}
        {activeTab === "faq" && (
          <div className="space-y-6 text-left max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-editorial-accent font-mono block">
                {isEn ? "Candidate Knowledgebase" : "প্রশ্নোত্তর ও সাধারণ তথ্যাবলি"}
              </span>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Frequently Asked Questions Regarding Job Accommodation" : "চাকরি ও আবাসন সংক্রান্ত সাধারণ প্রশ্নোত্তর"}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  qEn: "Is chef accommodation 100% free in Dubai and European contracts?",
                  qBn: "দুবাই এবং ইউরোপে শেফদের আবাসন কি শতভাগ বিনামূল্যে প্রদান করা হয়?",
                  aEn: "Yes! All luxury 5-star hotel contracts in Dubai, UAE and Saudi Arabia include fully furnished single or double en-suite staff residences with air conditioning, high-speed WiFi, laundry, and daily shuttle buses at zero cost to the candidate.",
                  aBn: "হ্যাঁ! দুবাই, কাতার এবং সৌদি আরবের চুক্তিতে সম্পূর্ণ ফার্নিশড শীতাতপ নিয়ন্ত্রিত আধুনিক রুম, ওয়াইফাই, লন্ড্রি এবং কিচেন শাটল সার্ভিস সম্পূর্ণ বিনামূল্যে প্রদান করা হয়।"
                },
                {
                  qEn: "What minimum LQF level is required to qualify for Dubai placement?",
                  qBn: "দুবাইয়ের ৫-তারকা হোটেলে চাকরি পেতে ন্যূনতম কোন এলকিউএফ লেভেল প্রয়োজন?",
                  aEn: "Entry-level Commis positions require LQF Level 3 or 4. Senior roles such as Demi Chef de Partie and Pastry Specialists require LQF Level 5 or higher. Lodonex prepares you through each level systematically.",
                  aBn: "প্রাথমিক কমিস পদের জন্য এলকিউএফ লেভেল ৩ বা ৪ এবং সিনিয়র শেফ পদের জন্য এলকিউএফ লেভেল ৫ বা তদূর্ধ্ব সার্টিফিকেট প্রয়োজন হয়।"
                },
                {
                  qEn: "How does Lodonex assist students with work visas and flight tickets?",
                  qBn: "ভিসা ও বিমান টিকিটের ক্ষেত্রে লোডোনেক্স একাডেমি কীভাবে সহযোগিতা করে?",
                  aEn: "Our direct tie-ups with hotel management corporations mean the employer sponsors and handles all embassy visa processing, medical attestations, and round-trip flight tickets directly.",
                  aBn: "আমাদের পার্টনার আন্তর্জাতিক হোটেল গ্রুপসমূহ সরাসরি এমপ্লয়মেন্ট ভিসা স্পন্সর করে এবং বিমান টিকিটের ব্যবস্থা করে থাকে।"
                },
                {
                  qEn: "Can I stay in Lodonex Dhaka hostels while completing my cooking course?",
                  qBn: "কোর্স চলাকালীন সময়ে কি ঢাকায় লোডোনেক্স হোস্টেলে থাকা যাবে?",
                  aEn: "Yes, students from across Bangladesh can book our air-conditioned hostel rooms in Gulshan and Banani with 3 meals daily, study desks, and round-the-clock practice kitchen access.",
                  aBn: "অবশ্যই, ঢাকার বাইরের শিক্ষার্থীরা কোর্স চলাকালীন গুলশান ও বনানীর লোডোনেক্স হোস্টেলে ৩ বেলা খাবার ও কিচেন ল্যাব সুবিধাসহ থাকতে পারবেন।"
                }
              ].map((faq, i) => (
                <div key={i} className="p-5 bg-white border border-editorial-border space-y-2">
                  <h4 className="font-serif font-bold text-sm text-editorial-dark flex items-start gap-2">
                    <span className="text-editorial-accent font-mono">Q{i + 1}.</span>
                    <span>{isEn ? faq.qEn : faq.qBn}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {isEn ? faq.aEn : faq.aBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPLICATION MODAL */}
        <AnimatePresence>
          {applyingJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setApplyingJob(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-[#FDFCF9] border border-editorial-border max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setApplyingJob(null)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-editorial-accent transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-1 mb-5">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-editorial-accent font-extrabold block">
                    {isEn ? "Career Placement Application" : "আন্তর্জাতিক চাকরির আবেদনপত্র"}
                  </span>
                  <h3 className="font-serif font-extrabold text-xl text-editorial-dark">
                    {isEn ? applyingJob.titleEn : applyingJob.titleBn}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isEn ? `${applyingJob.companyEn} • ${applyingJob.locationEn}` : `${applyingJob.companyBn} • ${applyingJob.locationBn}`}
                  </p>
                </div>

                {applicationSuccess ? (
                  <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-300 p-6">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h4 className="font-serif font-bold text-base text-emerald-900">
                      {isEn ? "Application Submitted Successfully!" : "আপনার আবেদন সফলভাবে গৃহীত হয়েছে!"}
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {isEn
                        ? "Our international placement board will review your profile, verify your LQF credentials, and contact you via email for the virtual trade test."
                        : "আমাদের আন্তর্জাতিক প্লেসমেন্ট বোর্ড আপনার আবেদনপত্রটি যাচাই করে ইন্টারভিউয়ের সময়সূচি ইমেইলে জানিয়ে দেবে।"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {isEn ? "Full Name:" : "পূর্ণ নাম:"}
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder={isEn ? "Chef Tasnim Rahman" : "তাসনিম রহমান"}
                        className="w-full px-3 py-2 border border-editorial-border bg-white text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {isEn ? "Email Address:" : "ইমেল অ্যাড্রেস:"}
                        </label>
                        <input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="chef@example.com"
                          className="w-full px-3 py-2 border border-editorial-border bg-white text-xs text-slate-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {isEn ? "Phone Number:" : "ফোন নম্বর:"}
                        </label>
                        <input
                          type="tel"
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+880 17XXXXXXXX"
                          className="w-full px-3 py-2 border border-editorial-border bg-white text-xs text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {isEn ? "Current LQF Certification:" : "আপনার এলকিউএফ স্তর:"}
                        </label>
                        <select
                          value={applicantLqf}
                          onChange={(e) => setApplicantLqf(e.target.value)}
                          className="w-full px-3 py-2 border border-editorial-border bg-white text-xs text-slate-800 outline-none"
                        >
                          <option value="LQF Level 3">LQF Level 3 (Commis I)</option>
                          <option value="LQF Level 4">LQF Level 4 (Senior Commis)</option>
                          <option value="LQF Level 5">LQF Level 5 (Demi Chef)</option>
                          <option value="LQF Level 6">LQF Level 6 (Sous Chef)</option>
                          <option value="Student in Progress">Currently Enrolled Student</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {isEn ? "Commercial Experience:" : "রন্ধন অভিজ্ঞতা:"}
                        </label>
                        <select
                          value={applicantExperience}
                          onChange={(e) => setApplicantExperience(e.target.value)}
                          className="w-full px-3 py-2 border border-editorial-border bg-white text-xs text-slate-800 outline-none"
                        >
                          <option value="Fresher">{isEn ? "Fresher / Academy Graduate" : "নতুন গ্র্যাজুয়েট"}</option>
                          <option value="1-2 Years">1 - 2 Years Experience</option>
                          <option value="3-5 Years">3 - 5 Years Experience</option>
                          <option value="5+ Years">5+ Years (Senior Chef)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F7F5F0] border border-editorial-border text-[11px] text-slate-600 font-sans">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isEn ? "Accommodation Guarantee Included" : "আবাসন সুবিধা নিশ্চিত করা হয়েছে"}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {isEn
                          ? "This role provides 100% furnished private/shared accommodation, visa sponsorship, and daily duty meals."
                          : "এই পদে নির্বাচিত হলে শতভাগ ফ্রি ফার্নিশড আবাসন ও ওয়ার্ক পারমিট ভিসা প্রদান করা হবে।"}
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isEn ? "Submit Application to Placement Board" : "আবেদনপত্র জমা দিন"}</span>
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
