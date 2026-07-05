import React from "react";
import { ShieldAlert, BookOpen, Clock, Award, CheckCircle, Sparkles, UserCheck } from "lucide-react";
import { Language, UserAccount } from "../types";

interface PendingApprovalViewProps {
  lang: Language;
  currentUser: UserAccount;
  onSimulateApprove: () => void;
}

export default function PendingApprovalView({
  lang,
  currentUser,
  onSimulateApprove,
}: PendingApprovalViewProps) {
  const isEn = lang === "en";

  return (
    <div id="pending-approval-card" className="max-w-2xl mx-auto py-8 px-4 font-sans text-left">
      <div className="bg-[#FDFCF9] border-2 border-amber-500/40 shadow-xs relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-amber-500 w-full absolute top-0 left-0"></div>

        <div className="p-6 sm:p-10 space-y-6">
          {/* Main Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-editorial-border">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-widest">
                {isEn ? "Pending Admin Approval" : "অ্যাডমিন অনুমোদনের অপেক্ষায়"}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold italic text-editorial-dark mt-1">
                {isEn ? "Registration Logged Successfully!" : "নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Welcome to Lodonex Gastronomy Academy." : "লোডোনেক্স রন্ধন একাডেমিতে আপনাকে স্বাগতম।"}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-[#F7F5F0] p-4 border border-editorial-border space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-700">
              {isEn ? "Student Account Details" : "শিক্ষার্থী অ্যাকাউন্ট বিবরণ"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono block uppercase text-[9px] tracking-wider">{isEn ? "Full Name" : "নাম"}</span>
                <span className="font-bold text-editorial-dark">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono block uppercase text-[9px] tracking-wider">{isEn ? "Email Address" : "ইমেইল"}</span>
                <span className="font-bold text-editorial-dark">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono block uppercase text-[9px] tracking-wider">{isEn ? "Assigned Role" : "নির্ধারিত ভূমিকা"}</span>
                <span className="font-bold text-editorial-dark font-mono uppercase tracking-wider text-[10px]">Gastronomy Apprentice</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono block uppercase text-[9px] tracking-wider">{isEn ? "System Access Status" : "এক্সেস স্ট্যাটাস"}</span>
                <span className="font-extrabold text-amber-600 uppercase tracking-wider">
                  ● {isEn ? "PENDING APPROVAL" : "অনুমোদনের অপেক্ষায়"}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation of what gets unlocked */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-editorial-dark italic">
              {isEn ? "What happens when an admin approves your request?" : "অ্যাডমিন আপনার অনুরোধ অনুমোদন করলে আপনি কী পাবেন?"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 border border-editorial-border bg-white space-y-1">
                <BookOpen className="h-5 w-5 text-editorial-accent" />
                <h4 className="font-bold text-xs text-editorial-dark">
                  {isEn ? "Dashboard Updates" : "ড্যাশবোর্ড আপডেট"}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {isEn
                    ? "Track your lessons, complete interactive quizzes, and unlock exclusive culinary badges."
                    : "আপনার পাঠ ট্র্যাক করুন, কুইজ সম্পূর্ণ করুন এবং রন্ধনশিল্পের ব্যাজসমূহ অর্জন করুন।"}
                </p>
              </div>

              <div className="p-3 border border-editorial-border bg-white space-y-1">
                <Award className="h-5 w-5 text-editorial-accent" />
                <h4 className="font-bold text-xs text-editorial-dark">
                  {isEn ? "Certification Options" : "সার্টিফিকেশন অপশন"}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {isEn
                    ? "Complete 100% of any masterclass course to instantly generate your verified digital gastronomy certificate."
                    : "যেকোনো মাস্টারক্লাস সম্পূর্ণ করে তাৎক্ষণিক আপনার নিজস্ব ডিজিটাল সার্টিফিকেট ডাউনলোড করুন।"}
                </p>
              </div>

              <div className="p-3 border border-editorial-border bg-white space-y-1">
                <Sparkles className="h-5 w-5 text-editorial-accent" />
                <h4 className="font-bold text-xs text-editorial-dark">
                  {isEn ? "Recipe Journal" : "রেসিপি জার্নাল"}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {isEn
                    ? "Add your personal creations, specify ingredients and preparation timers directly in your cookbook."
                    : "আপনার নিজস্ব রন্ধনশৈলী যোগ করুন, উপাদান ও নির্দেশনাবলী সংরক্ষণ করুন আপনার বুকমার্কে।"}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Helper */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-widest">
              <UserCheck className="h-3 w-3" />
              {isEn ? "Admin Sandbox Simulator" : "অ্যাডমিন স্যান্ডবক্স সিমুলেটর"}
            </span>
            <p className="text-xs text-amber-900 max-w-md mx-auto leading-relaxed">
              {isEn
                ? "Since we are running in an interactive preview, you can test the admin approval system instantly by clicking the button below or using the floating simulation bar!"
                : "আমরা ইন্টারঅ্যাক্টিভ প্রিভিউ মোডে থাকায়, আপনি নিচের বাটনে ক্লিক করে বা নিচে অবস্থিত ফ্লোটিং প্যানেল দিয়ে অ্যাডমিন এক্সেস সরাসরি সিমুলেট করতে পারেন!"}
            </p>
            <button
              onClick={onSimulateApprove}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-widest transition duration-200 cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle className="h-4 w-4" />
              {isEn ? "Simulate Admin Approval" : "অ্যাডমিন অনুমোদন সিমুলেট করুন"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
