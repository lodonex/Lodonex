import React from "react";
import { X, CheckCircle, Mail, Send, Award, ArrowRight, ShieldCheck, Printer } from "lucide-react";
import { Language, UserAccount } from "../types";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

interface WelcomeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  lang: Language;
}

export default function WelcomeEmailModal({
  isOpen,
  onClose,
  user,
  lang,
}: WelcomeEmailModalProps) {
  if (!isOpen || !user) return null;

  const isEn = lang === "en";
  const formattedDate = new Date().toLocaleDateString(isEn ? "en-US" : "bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-[#FDFCF9] w-full max-w-2xl border-2 border-editorial-dark shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Email Header Bar */}
        <div className="bg-[#1A1A1A] text-white px-5 py-3.5 flex items-center justify-between border-b border-editorial-accent">
          <div className="flex items-center space-x-2.5">
            <Mail className="h-5 w-5 text-editorial-accent" />
            <span className="font-serif font-bold text-sm tracking-wide text-amber-50">
              {isEn ? "Lodonex Confirmation & Welcome Email" : "লোডোনেক্স নিশ্চিতকরণ ও স্বাগতম ইমেইল"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Simulated Meta Details Bar */}
        <div className="bg-[#F4F1EA] px-6 py-3 border-b border-editorial-border/60 text-xs text-slate-700 space-y-1 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <strong className="text-slate-900 uppercase font-extrabold text-[10px] tracking-wider mr-2">
                {isEn ? "FROM:" : "প্রেরক:"}
              </strong>
              <span className="font-semibold text-editorial-accent">
                Lodonex Admissions Office &lt;lodonexcookingacademy@gmail.com&gt;
              </span>
            </div>
            <span className="text-[10px] text-slate-500">{formattedDate}</span>
          </div>
          <div>
            <strong className="text-slate-900 uppercase font-extrabold text-[10px] tracking-wider mr-2">
              {isEn ? "TO:" : "প্রাপক:"}
            </strong>
            <span className="font-semibold text-slate-900">
              {user.name} &lt;{user.email}&gt;
            </span>
          </div>
          <div>
            <strong className="text-slate-900 uppercase font-extrabold text-[10px] tracking-wider mr-2">
              {isEn ? "SUBJECT:" : "বিষয়:"}
            </strong>
            <span className="font-bold text-slate-950">
              {isEn
                ? "Official Confirmation & Welcome – Lodonex Culinary Academy Registration"
                : "অফিসিয়াল নিশ্চিতকরণ ও স্বাগতম – লোডোনেক্স কালিনারি একাডেমি রেজিস্ট্রেশন"}
            </span>
          </div>
        </div>

        {/* Printable Email Body Scroll Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-sm font-sans leading-relaxed">
          {/* Logo & Seal Header */}
          <div className="flex items-center justify-between border-b-2 border-editorial-dark pb-4">
            <div className="flex items-center space-x-3">
              <img
                src={lodonexLogo}
                alt="Lodonex Logo"
                className="h-12 w-12 object-cover border border-editorial-border"
              />
              <div>
                <h2 className="font-serif font-extrabold text-xl text-editorial-dark tracking-tight">
                  Lodonex Cooking Academy
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  LQF Accredited Culinary Institute
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {isEn ? "Confirmed & Delivered" : "প্রেরিত ও নিশ্চিত"}
            </div>
          </div>

          {/* Salutation */}
          <div>
            <h3 className="font-serif text-lg font-bold text-editorial-dark">
              {isEn ? `Dear ${user.name},` : `প্রিয় ${user.name},`}
            </h3>
            <p className="mt-2 text-slate-700">
              {isEn
                ? "Welcome to Lodonex Cooking Academy! We are delighted to confirm that your student registration has been successfully processed and recorded in our central accreditation database."
                : "লোডোনেক্স কুকিং একাডেমিতে আপনাকে স্বাগতম! অত্যন্ত আনন্দের সাথে জানাচ্ছি যে আপনার শিক্ষার্থী রেজিস্ট্রেশন সফলভাবে সম্পূর্ণ হয়েছে এবং আমাদের অ্যাক্রেডিটেশন ডাটাবেজে সংরক্ষিত হয়েছে।"}
            </p>
          </div>

          {/* Confirmation Key Credentials Box */}
          <div className="p-4 bg-[#F7F5F0] border border-editorial-border space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              {isEn ? "Official Enrollment Details" : "অফিসিয়াল এনরোলমেন্ট তথ্য"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">
                  {isEn ? "Registered Email" : "নিবন্ধিত ইমেইল"}:
                </span>
                <span className="font-bold text-slate-900">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">
                  {isEn ? "Academy Administration" : "একাডেমি এডমিন ইমেইল"}:
                </span>
                <span className="font-bold text-editorial-accent">lodonexcookingacademy@gmail.com</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">
                  {isEn ? "Curriculum Framework" : "কারিকুলাম ফ্রেমওয়ার্ক"}:
                </span>
                <span className="font-bold text-slate-900">LQF Level 1 to Level 6 Path</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">
                  {isEn ? "Account Role" : "অ্যাকাউন্ট রোল"}:
                </span>
                <span className="font-bold text-slate-900">
                  {user.email.toLowerCase() === "lodonexcookingacademy@gmail.com"
                    ? "Administrator"
                    : "Student Candidate"}
                </span>
              </div>
            </div>
          </div>

          {/* Directives */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-editorial-dark border-b border-editorial-border pb-1 uppercase tracking-wider">
              {isEn ? "Student Directives & Next Steps" : "শিক্ষার্থীদের জন্য বিশেষ নির্দেশাবলী"}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-editorial-accent font-bold">•</span>
                <span>
                  {isEn
                    ? "Start with Level 1 – Lodonex Certified Culinary Foundation to master basic knife cuts, HACCP food safety, and mother sauces."
                    : "লেভেল ১ – লোডোনেক্স সার্টিফাইড কালিনারি ফাউন্ডেশন দিয়ে শুরু করুন এবং নাইফ স্কিলস, এইচএসিসিপি সেফটি ও বেসিক সস শিখুন।"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-editorial-accent font-bold">•</span>
                <span>
                  {isEn
                    ? "Watch step-by-step masterclass lectures and test your skills with theory quizzes."
                    : "ভিডিও টিউটোরিয়াল দেখুন এবং প্রতিটি লেভেলের থিওরি কুইজে অংশগ্রহণ করুন।"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-editorial-accent font-bold">•</span>
                <span>
                  {isEn
                    ? "Create custom recipes in your Recipe Manager portfolio to showcase your culinary artistry."
                    : "আপনার রেসিপি ম্যানেজার পোর্টফোলিওতে নতুন নতুন রেসিপি যোগ করে আপনার প্রতিভা প্রকাশ করুন।"}
                </span>
              </li>
            </ul>
          </div>

          {/* Closing & Sign-off */}
          <div className="border-t border-editorial-border/60 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs italic text-slate-600">
                {isEn
                  ? "For administrative support or course inquiries, contact us anytime at:"
                  : "প্রশাসনিক সহযোগিতা বা তথ্য অনুসন্ধানের জন্য যোগাযোগ করুন:"}
              </p>
              <p className="text-xs font-bold text-editorial-accent mt-0.5">
                lodonexcookingacademy@gmail.com
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-sm text-editorial-dark block">
                Executive Chef Council
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Lodonex Cooking Academy
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F4F1EA] px-6 py-4 border-t border-editorial-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>
              {isEn
                ? "Confirmation email sent to your inbox!"
                : "নিশ্চিতকরণ ইমেল আপনার ইনবক্সে পাঠানো হয়েছে!"}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{isEn ? "Print Email" : "প্রিন্ট করুন"}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 bg-editorial-dark hover:bg-red-900 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{isEn ? "Enter Academy Portal" : "একাডেমি পোর্টালে যান"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
