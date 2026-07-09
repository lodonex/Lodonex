import React from "react";
import { Language } from "../types";
import { ShieldCheck, Landmark, FileText, Star, Award, CheckCircle2, ChevronRight } from "lucide-react";

interface PoliciesProps {
  lang: Language;
  policyType: "terms" | "refund" | "privacy";
  onBackToCourses?: () => void;
}

export default function Policies({ lang, policyType, onBackToCourses }: PoliciesProps) {
  const isEn = lang === "en";

  return (
    <div id="policies-page-root" className="space-y-8 animate-fadeIn text-left">
      {/* Academy Branding Banner */}
      <div className="bg-[#1A1A1A] border border-editorial-border p-6 sm:p-8 text-[#F5F2EB] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-editorial-accent/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-editorial-accent/20 border border-editorial-accent/45 text-editorial-accent font-mono text-[10px] uppercase tracking-widest">
            {isEn ? "The Premier Culinary Authority" : "দেশের শ্রেষ্ঠ রন্ধন একাডেমী"}
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
            {isEn ? "Lodonex Culinary Academy" : "লোডোনেক্স কালিনারি একাডেমি"}
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E2D9]/80 font-sans leading-relaxed">
            {isEn
              ? "Widely recognized as Bangladesh's best cooking academy, Lodonex bridges traditional heritage with modern culinary sciences. We deliver world-class training in commercial gastronomy, patisserie, continental cuisines, and kitchen command systems."
              : "বাংলাদেশের সেরা কুকিং একাডেমি হিসেবে স্বীকৃত, লোডোনেক্স ঐতিহ্যবাহী বাঙালি রান্না ও আধুনিক রন্ধন বিজ্ঞানের মেলবন্ধন ঘটায়। আমরা বাণিজ্যিক গ্যাস্ট্রোনমি, পেটিসারি, কন্টিনেন্টাল কুজিন এবং পেশাদার রান্নাঘর পরিচালনার বিশ্বমানের কোর্স প্রদান করি।"}
          </p>
        </div>
      </div>

      {/* Grid Layout: Main Document & Left Sidebar explaining Why Lodonex is the best */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Document Frame */}
        <div className="lg:col-span-8 bg-white border border-editorial-border p-5 sm:p-8 space-y-6">
          {policyType === "terms" && (
            <div id="terms-content" className="space-y-6">
              <div className="border-b border-editorial-border pb-4 flex items-center gap-2.5">
                <FileText className="h-6 w-6 text-editorial-accent" />
                <div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-editorial-dark">
                    {isEn ? "Terms and Conditions" : "শর্তাবলী ও নিয়মাবলি"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {isEn ? "LAST UPDATED: JULY 2026 • EFFECTIVE IMMEDIATELY" : "সর্বশেষ আপডেট: জুলাই ২০২৬ • অবিলম্বে কার্যকর"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                <p>
                  {isEn
                    ? "Welcome to Lodonex Culinary Academy (referred to as 'Lodonex', 'Academy', 'We', or 'Our'). By enrolling in our courses, subscribing to our services, or utilizing our physical and digital facilities, you agree to comply with and be bound by the following Terms and Conditions."
                    : "লোডোনেক্স কালিনারি একাডেমিতে (এখানে 'লোডোনেক্স', 'একাডেমি', 'আমরা' বা 'আমাদের' হিসেবে উল্লেখ করা হয়েছে) আপনাকে স্বাগত জানাই। আমাদের কোর্সসমূহে এনরোল করে, আমাদের সাবস্ক্রিপশন নিয়ে বা ডিজিটাল সেবা ব্যবহারের মাধ্যমে আপনি নিম্নোক্ত শর্তাবলী ও নিয়মাবলি মেনে চলতে সম্মত হচ্ছেন।"}
                </p>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "1. Admission and Account Registration" : "১. ভর্তি এবং অ্যাকাউন্ট রেজিস্ট্রেশন"}
                  </h3>
                  <p>
                    {isEn
                      ? "Students must register with authentic information, including a valid email address and legal name. Accounts are personal and non-transferable. Lodonex reserves the right to deny admission or suspend accounts of individuals who provide false information or violate our Student Code of Conduct."
                      : "শিক্ষার্থীদের অবশ্যই তাদের সঠিক নাম, সচল ইমেইল ও প্রয়োজনীয় সত্য তথ্য দিয়ে অ্যাকাউন্ট রেজিস্ট্রেশন করতে হবে। একটি অ্যাকাউন্ট কেবল সংশ্লিষ্ট শিক্ষার্থীর নিজস্ব ব্যবহারের জন্য। ভুয়া তথ্য প্রদান করলে বা শৃঙ্খলা ভঙ্গ করলে লোডোনেক্স যেকোনো অ্যাকাউন্ট বাতিল করার অধিকার সংরক্ষণ করে।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "2. Masterclass Enrollment & Access" : "২. মাস্টারক্লাস এনরোলমেন্ট ও এক্সেস"}
                  </h3>
                  <p>
                    {isEn
                      ? "Enrolled students are granted a non-exclusive, non-transferable license to access our digital learning resources, masterclass videos, premium step-by-step recipes, and interact with the designated culinary instructors. Copying, recording, or redistributing course materials is strictly prohibited and constitutes intellectual property theft."
                      : "এনরোল করা শিক্ষার্থীরা আমাদের সমস্ত ডিজিটাল লেকচার, রান্নার ভিডিও টিউটোরিয়াল, প্রিমিয়াম ধাপে ধাপে সাজানো রেসিপি বুক ও প্রশিক্ষকদের সাথে যোগাযোগের ব্যক্তিগত লাইসেন্স পাবেন। কোর্সের কোনো কন্টেন্ট, ভিডিও বা টেক্সট কোনো মাধ্যমে কপি, রেকর্ড বা রি-ডিস্ট্রিবিউট করা সম্পূর্ণ নিষিদ্ধ এবং আইনত দণ্ডনীয় অপরাধ।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "3. Admin Approval & Simulated Verification" : "৩. অ্যাডমিন অনুমোদন ও ডেমো সিস্টেম"}
                  </h3>
                  <p>
                    {isEn
                      ? "To maintain professional-grade kitchen safety standards, student registrations undergo an administrative screening process. Under our current simulator environment, you can use the floating administration panel to toggle approvals instantly for training purposes."
                      : "পেশাদার রান্নাঘরের নিরাপত্তা ও শৃঙ্খলা বজায় রাখার স্বার্থে প্রতিটি নতুন শিক্ষার্থী রেজিস্ট্রেশনের পর আমাদের অ্যাডমিন প্যানেল থেকে অনুমোদন পেতে হয়। বর্তমান ডেমো এনভায়রনমেন্টে আপনি সুবিধার্থে স্ক্রিনের নিচে থাকা স্যান্ডবক্স অ্যাডমিন প্যানেল ব্যবহার করে তাৎক্ষণিকভাবে যেকোনো আইডি অনুমোদন করতে পারবেন।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "4. Professional Certification and Assessment" : "৪. প্রফেশনাল সার্টিফিকেট ও মূল্যায়ন"}
                  </h3>
                  <p>
                    {isEn
                      ? "Certificates are awarded only to students who successfully pass all lesson quizzes and complete the designated culinary modules. The digitally generated certificate contains cryptographic credentials confirming completion under the professional standards of Lodonex Cooking Academy."
                      : "সার্টিফিকেট কেবল সেই সব শিক্ষার্থীদের প্রদান করা হবে যারা কোর্সের সব কুইজ সফলভাবে শেষ করবেন এবং কোর্স কারিকুলাম সম্পূর্ণ করবেন। এই ডিজিটাল সার্টিফিকেটে লোডোনেক্স কুকিং একাডেমির পেশাদার মানদণ্ডে যাচাইকৃত তথ্য ও কিউআর আইডি যুক্ত থাকে।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "5. Changes to Courses and Pricing" : "৫. কোর্স ও মূল্যের পরিবর্তন"}
                  </h3>
                  <p>
                    {isEn
                      ? "Lodonex reserves the right to modify course curricula, adjust tuition fees, change course instructors, or reschedule live masterclasses. Enrolled students will be notified of any major shifts via email at least 48 hours prior."
                      : "কোর্স কারিকুলাম পরিবর্তন, ফি সমন্বয়, প্রশিক্ষক পরিবর্তন বা লাইভ ক্লাসের সময়সূচি পরিবর্তনের সকল অধিকার লোডোনেক্স সংরক্ষণ করে। যেকোনো বড় পরিবর্তনের ক্ষেত্রে শিক্ষার্থীদের অন্তত ৪৮ ঘণ্টা পূর্বে ইমেইলে অবহিত করা হবে।"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {policyType === "refund" && (
            <div id="refund-content" className="space-y-6">
              <div className="border-b border-editorial-border pb-4 flex items-center gap-2.5">
                <Landmark className="h-6 w-6 text-editorial-accent" />
                <div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-editorial-dark">
                    {isEn ? "Refund and Return Policy" : "রিফান্ড ও রিটার্ন পলিসি"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {isEn ? "LAST UPDATED: JULY 2026 • REFUND GUARANTEE" : "সর্বশেষ আপডেট: জুলাই ২০২৬ • রিফান্ড গ্যারান্টি"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                <p>
                  {isEn
                    ? "At Lodonex, we stand behind the outstanding quality of our culinary training. We aim to ensure a transparent, fair, and seamless experience regarding refunds, cancellations, and physical gear returns."
                    : "লোডোনেক্সে আমরা আমাদের রন্ধন প্রশিক্ষণের চমৎকার মানের ব্যাপারে শতভাগ আত্মবিশ্বাসী। রিফান্ড, কোর্স বাতিল এবং ফিজিক্যাল কিচেন গিয়ারের রিটার্নের ক্ষেত্রে আমরা একটি স্বচ্ছ ও নিখুঁত অভিজ্ঞতা নিশ্চিত করি।"}
                </p>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "1. 7-Day Course Refund Guarantee" : "১. ৭-দিনের কোর্স রিফান্ড গ্যারান্টি"}
                  </h3>
                  <p>
                    {isEn
                      ? "If you are not completely satisfied with a masterclass course you purchased, you may request a 100% refund within 7 days of enrollment. To qualify, you must not have completed more than 20% of the lessons or generated a certificate. Once approved, the refund will be automatically processed back to your original payment channel (Bkash, Nagad, or Credit Card) within 3-5 business days."
                      : "যদি কোনো কোর্স কিনে আপনি সন্তুষ্ট হতে না পারেন, তবে এনরোল করার ৭ দিনের মধ্যে ১০০% রিফান্ডের আবেদন করতে পারবেন। তবে রিফান্ড পাওয়ার জন্য শিক্ষার্থী অনধিক ২০% লেসন সম্পন্ন করা থাকতে হবে এবং কোনো সার্টিফিকেট তৈরি করা যাবে না। আবেদন অনুমোদনের ৩-৫ কার্যদিবসের মধ্যে আপনার মূল পেমেন্ট মাধ্যমে (বিকাশ, রকেট, নগদ বা কার্ড) টাকা ফেরত চলে যাবে।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "2. Physical Kitchen Utensils & Chef Uniform Returns" : "২. ফিজিক্যাল কিচেন সামগ্রী ও সেফ ইউনিফর্ম রিটার্ন"}
                  </h3>
                  <p>
                    {isEn
                      ? "For practical hybrid courses where physical chef toolkits, knives, aprons, or uniforms are shipped to your address, you can request a return or exchange within 10 days of delivery. The returned items must be completely unused, in their original packaging, and clean of any grease or food stains. Shipping costs for returns are covered by the student unless the item was delivered damaged."
                      : "যেসব হাইব্রিড কোর্সে ফিজিক্যাল সেফ টুলকিট, ছুরি, অ্যাপ্রন বা সেফ কোট আপনার ঠিকানায় পাঠানো হয়, তা গ্রহণের ১০ দিনের মধ্যে রিটার্ন বা সাইজ এক্সচেঞ্জের আবেদন করতে পারবেন। পণ্যগুলো অবশ্যই সম্পূর্ণ অব্যবহৃত ও নিখুঁত অবস্থায় আদি প্যাকেজিংসহ ফেরত দিতে হবে। পণ্যের ক্ষতি ব্যতীত অন্য যেকোনো কারণে রিটার্নের ক্ষেত্রে কুরিয়ার চার্জ শিক্ষার্থীকে বহন করতে হবে।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "3. Non-Refundable Services" : "৩. যেসকল ক্ষেত্রে রিফান্ড প্রযোজ্য নয়"}
                  </h3>
                  <p>
                    {isEn
                      ? "Special promotional bundle deals, custom practical kitchen ingredients boxes shipped for exams, and physical books/guides are non-refundable once shipped or claimed. Live masterclass attendance bookings can be rescheduled up to 24 hours prior, but are non-refundable for no-shows."
                      : "বিশেষ প্রোমোশনাল অফার বা বান্ডেল ডিল, রান্নার পরীক্ষার জন্য পাঠানো কাঁচামাল সামগ্রীর বক্স, এবং ফিজিক্যাল বই একবার শিপমেন্ট হয়ে গেলে তা রিফান্ডযোগ্য নয়। লাইভ মাস্টারক্লাসের সিট বুকিং ক্লাস শুরুর ২৪ ঘণ্টা পূর্ব পর্যন্ত ফ্রিতে রিশিডিউল করা যাবে, তবে ক্লাসে উপস্থিত না থাকলে বুকিং রিফান্ড করা হবে না।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "4. How to Request a Refund" : "৪. যেভাবে রিফান্ডের আবেদন করবেন"}
                  </h3>
                  <p>
                    {isEn
                      ? "To initiate a refund, please send an email to refund@lodonex.edu.bd with your invoice number, registered email address, and reason for satisfaction review. Alternatively, you can fill out our Instant Inquiry contact form in the footer, and our billing desk will respond to you promptly."
                      : "রিফান্ড প্রক্রিয়া শুরু করতে অনুগ্রহ করে আপনার ইনভয়েস নম্বর, রেজিস্ট্রিকৃত ইমেইল এবং রিফান্ডের কারণ উল্লেখ করে refund@lodonex.edu.bd ইমেইলে যোগাযোগ করুন। অথবা ফুটারের তাৎক্ষণিক অনুসন্ধান ফর্মটি ব্যবহার করতে পারেন।"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {policyType === "privacy" && (
            <div id="privacy-content" className="space-y-6">
              <div className="border-b border-editorial-border pb-4 flex items-center gap-2.5">
                <ShieldCheck className="h-6 w-6 text-editorial-accent" />
                <div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-editorial-dark">
                    {isEn ? "Privacy Policy" : "গোপনীয়তা নীতিমালা"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {isEn ? "LAST UPDATED: JULY 2026 • STUDENT DATA ENCRYPTION" : "সর্বশেষ আপডেট: জুলাই ২০২৬ • ডাটা এনক্রিপশন"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                <p>
                  {isEn
                    ? "At Lodonex Cooking Academy, we hold your personal privacy in the highest regard. This Privacy Policy documents how we collect, secure, utilize, and manage your student profile information and culinary progress data."
                    : "লোডোনেক্স কুকিং একাডেমিতে আপনার গোপনীয়তা বজায় রাখা আমাদের অন্যতম প্রধান দায়িত্ব। এই গোপনীয়তা নীতিমালায় আমরা আমাদের শিক্ষার্থী ও রন্ধন প্রশিক্ষণার্থীদের ডাটা সংগ্রহ, সুরক্ষা এবং ব্যবস্থাপনার বিবরণ তুলে ধরেছি।"}
                </p>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "1. Information We Collect" : "১. আমরা যেসকল তথ্য সংগ্রহ করি"}
                  </h3>
                  <p>
                    {isEn
                      ? "When you register, enroll in masterclasses, or submit reviews, we collect personal identifier information including your full name, email address, password hashes, payment logs, completed culinary exercises, progress state, and custom cooking recipes. Your real-world payment credentials (like PINs/passwords) are processed directly by SSLCommerz or Firebase secure gates and are NEVER saved in our databases."
                      : "আপনার রেজিস্ট্রেশন, মাস্টারক্লাসে অংশগ্রহণ, রেসিপি ডায়েরি সেভ বা ফিডব্যাক প্রদানের সময় আমরা নাম, ইমেইল, পাসওয়ার্ড হ্যাশ, পেমেন্ট লগ, কোর্সের অগ্রগতি এবং আপনার তৈরি কাস্টম রেসিপির ডাটা সংগ্রহ করি। আপনার কার্ডের পিন বা পেমেন্ট পাসওয়ার্ড আমাদের সিস্টেমে কখনোই জমা হয় না; এগুলো নিরাপদ গেটওয়ে (যেমন SSLCommerz ও ফায়ারবেজ) দ্বারা সরাসরি নিয়ন্ত্রিত হয়।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "2. How We Utilize Your Data" : "২. আপনার তথ্যের ব্যবহার"}
                  </h3>
                  <p>
                    {isEn
                      ? "Collected data is strictly used to customize your learning dashboards, track module completion states, generate authentic verification badges, construct verifiable culinary certificates, process billing requests, and deliver vital course announcement emails."
                      : "সংগৃহীত তথ্যসমূহ কঠোরভাবে আপনার লার্নিং ড্যাশবোর্ড কাস্টমাইজেশন, কোর্সের অগ্রগতি ট্র্যাক করা, অর্জনসমূহ ভেরিফাই করা, সার্টিফিকেট তৈরি, পেমেন্ট ভেরিফিকেশন এবং কোর্স সংক্রান্ত প্রয়োজনীয় নোটিফিকেশন ইমেইল পাঠাতে ব্যবহার করা হয়।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "3. Security of Data and Cloud Storage" : "৩. ডাটা সিকিউরিটি ও ক্লাউড স্টোরেজ"}
                  </h3>
                  <p>
                    {isEn
                      ? "All data is securely housed inside encrypted Cloud Firestore databases configured with rigid server-side security rules. This blocks any unauthorized query reads or modifications. Furthermore, we maintain a secure LocalStorage fallback caching system to keep your profile working smoothly even under poor network connectivity."
                      : "সকল তথ্য এনক্রিপ্ট করে ক্লাউড ফায়ারস্টোর ডাটাবেজে সংরক্ষণ করা হয়। সার্ভার সাইড সিকিউরিটি রুলস প্রযোগ থাকায় অন্য কারো পক্ষে আপনার ডাটায় অননুমোদিত এক্সেস নেওয়া অসম্ভব। এছাড়াও দুর্বল নেটওয়ার্কের মধ্যেও আপনার প্রোফাইল নিরবচ্ছিন্ন রাখতে আমরা লোকাল স্টোরেজ ক্যাশিং প্রযুক্তি ব্যবহার করি।"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-editorial-dark text-sm sm:text-base">
                    {isEn ? "4. Third-Party Sharing Limits" : "৪. থার্ড পার্টি শেয়ারিং সীমাবদ্ধতা"}
                  </h3>
                  <p>
                    {isEn
                      ? "Lodonex is strictly offline-first and student-centric. We NEVER sell, lease, or distribute your personal contact details, email addresses, or academic performance records to third-party ad networks or marketing groups. Data is only shared to fulfill standard operations (like Google Firebase authentication services)."
                      : "লোডোনেক্স পুরোপুরিভাবে বিজ্ঞাপন-মুক্ত ও শিক্ষার্থী-কেন্দ্রিক একাডেমি। আমরা কখনোই কোনো বিজ্ঞাপন নেটওয়ার্ক বা মার্কেটিং গ্রুপের কাছে আপনার নাম, ইমেইল বা যোগাযোগের তথ্য বিক্রি বা লিজ দেই না। স্ট্যান্ডার্ড সার্ভিস বাস্তবায়নে যতটুকু প্রয়োজন (যেমন গুগল ফায়ারবেজ অথেনটিকেশন) কেবল তখনই প্রযুক্তি অংশীদারদের সাথে ডাটা শেয়ার করা হয়।"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back Action */}
          {onBackToCourses && (
            <div className="pt-4 border-t border-editorial-border flex justify-start">
              <button
                onClick={onBackToCourses}
                className="px-5 py-2.5 bg-editorial-dark text-white hover:bg-slate-800 text-[11px] font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isEn ? "Return to Course Catalog" : "কোর্স ক্যাটালগে ফিরে যান"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Why Lodonex is the best Cooking Academy Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF8F5] border border-editorial-border p-5 space-y-5">
            <div className="border-b border-editorial-border pb-3">
              <h3 className="font-serif font-bold text-editorial-dark text-base">
                {isEn ? "Why Lodonex is No. 1" : "কেন লোডোনেক্স সেরা একাডেমি?"}
              </h3>
              <p className="text-[10px] text-editorial-accent font-sans uppercase font-bold tracking-wider mt-0.5">
                {isEn ? "Bangladesh's Premier Institute" : "বাংলাদেশের এক নম্বর রন্ধন শিক্ষা প্রতিষ্ঠান"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-white border border-editorial-border text-editorial-accent flex-shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-sans text-editorial-dark">
                    {isEn ? "Michelin-Standard Instruction" : "বিশ্বমানের শেফ ও গাইডেন্স"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isEn
                      ? "Learn classical and modern techniques from internationally accredited Master Chefs with decades of combined global restaurant experience."
                      : "আন্তর্জাতিকভাবে প্রশংসিত মাস্টারশেফদের তত্ত্বাবধানে হাতে-কলমে শিখুন আধুনিক ও ঐতিহ্যবাহী রান্নার শ্রেষ্ঠ কৌশলসমূহ।"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-white border border-editorial-border text-editorial-accent flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-sans text-editorial-dark">
                    {isEn ? "Rigorous Practical Syllabus" : "বাস্তবধর্মী সম্পূর্ণ সিলেবাস"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isEn
                      ? "From heritage Bengali gastronomy to advanced French patisserie, commercial baking, and restaurant management, our courses cover every facet."
                      : "বাঙালি রান্নার ঐতিহ্য থেকে শুরু করে ক্লাসিক ফ্রেঞ্চ পেটিসারি, বাণিজ্যিক বেকিং এবং হোটেল-রেস্টুরেন্ট কিচেন ম্যানেজমেন্টের প্রতিটি দিক অন্তর্ভুক্ত।"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-white border border-editorial-border text-editorial-accent flex-shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-sans text-editorial-dark">
                    {isEn ? "Verifiable Secure Portals" : "যাচাইকৃত সিকিউর পোর্টাল ও ব্যাজ"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isEn
                      ? "We are equipped with advanced student dashboard systems, secure Firestore storage, and instant verifiable certificates for professional career advancement."
                      : "অত্যাধুনিক স্টুডেন্ট ড্যাশবোর্ড, নিরাপদ ডাটাবেজ এবং ডিজিটাল সার্টিফিকেট যা চাকরি ও ক্যারিয়ারে আপনাকে রাখবে বহুদূর এগিয়ে।"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-white border border-editorial-border text-editorial-accent flex-shrink-0">
                  <Star className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-sans text-editorial-dark">
                    {isEn ? "Top Rated by 5,000+ Students" : "৫০০০+ শিক্ষার্থীর আস্থার প্রতীক"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isEn
                      ? "Consistently voted Bangladesh's best cooking academy with high-quality feedback and a flawless support network for aspiring culinary professionals."
                      : "উচ্চমানের রন্ধন শিক্ষা এবং নিখুঁত দিকনির্দেশনার মাধ্যমে শিক্ষার্থীদের মূল্যায়নে সর্বদাই শীর্ষ তালিকায় ভূষিত লোডোনেক্স।"}
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="pt-4 border-t border-editorial-border/60">
              <p className="text-[11px] italic text-slate-600 font-sans leading-relaxed">
                {isEn
                  ? `"Lodonex provided me with the structured commercial baking expertise that allowed me to launch my own successful artisanal pastry shop in Dhaka."`
                  : `"লোডোনেক্সের নিখুঁত ও বাণিজ্যিক বেকিং প্রশিক্ষণ আমাকে ঢাকায় আমার নিজের পেস্ট্রি শপ চালু করতে দারুণভাবে সাহায্য করেছে।"`}
              </p>
              <p className="text-[10px] text-editorial-accent font-bold font-mono mt-1 text-right">
                — Nuzhat S., Pastry Chef Owner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
