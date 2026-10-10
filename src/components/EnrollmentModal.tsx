import React, { useState } from "react";
import { X, CheckCircle, Shield, CreditCard, Clock, Calendar, AlertCircle, ArrowRight, UserCheck, BookOpen, Send, Sparkles } from "lucide-react";
import { Language, Course, UserAccount, Batch, EnrollmentApplication } from "../types";
import { formatPrice } from "../utils/price";
import { MOCK_BATCHES } from "../data/lmsMockData";

interface EnrollmentModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onEnrollmentSubmitted: (app: EnrollmentApplication) => void;
}

export default function EnrollmentModal({
  lang,
  isOpen,
  onClose,
  course,
  currentUser,
  onOpenAuth,
  onEnrollmentSubmitted,
}: EnrollmentModalProps) {
  if (!isOpen || !course) return null;
  const isEn = lang === "en";

  // Filter batches for this course
  const courseBatches = MOCK_BATCHES.filter((b) => b.courseId === course.id);
  const defaultBatch = courseBatches[0] || null;

  const [selectedBatchId, setSelectedBatchId] = useState<string>(defaultBatch ? defaultBatch.id : "batch-101");
  const [paymentOption, setPaymentOption] = useState<"bkash" | "nagad" | "bank" | "cash">("bkash");
  const [trxId, setTrxId] = useState<string>("");
  const [applicantName, setApplicantName] = useState<string>(currentUser ? currentUser.name : "");
  const [applicantEmail, setApplicantEmail] = useState<string>(currentUser ? currentUser.email : "");
  const [applicantPhone, setApplicantPhone] = useState<string>(currentUser?.phone || "+880 1712-000000");
  const [notes, setNotes] = useState<string>("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [submittedApp, setSubmittedApp] = useState<EnrollmentApplication | null>(null);

  const selectedBatch = courseBatches.find((b) => b.id === selectedBatchId) || defaultBatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const newApp: EnrollmentApplication = {
      id: `app-${Date.now()}`,
      studentId: currentUser.id,
      studentName: applicantName || currentUser.name,
      studentEmail: applicantEmail || currentUser.email,
      studentPhone: applicantPhone,
      courseId: course.id,
      courseTitle: isEn ? course.titleEn : course.titleBn,
      batchId: selectedBatch?.id,
      batchName: selectedBatch?.name,
      status: trxId.trim() ? "payment_submitted" : "applied",
      appliedAt: new Date().toISOString(),
      notes: notes,
      paymentMethod: paymentOption.toUpperCase(),
      transactionId: trxId.trim(),
      totalFee: course.price,
      paidAmount: trxId.trim() ? course.price : 0,
    };

    setSubmittedApp(newApp);
    setStep("success");
    onEnrollmentSubmitted(newApp);

    // Call backend API in parallel
    fetch("/api/enrollments/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApp),
    }).catch(() => {});
  };

  return (
    <div id="enrollment-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="bg-[#FDFCF9] border-2 border-editorial-border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-900">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white border-b border-editorial-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-editorial-accent" />
            <h2 className="font-serif font-extrabold text-lg text-editorial-dark tracking-tight">
              {isEn ? "Course Enrollment Application" : "কোর্স এনরোলমেন্ট আবেদনপত্র"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-black transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Summary Banner */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                  {course.levelEn} • {course.duration}
                </span>
                <h3 className="font-serif font-bold text-base text-editorial-dark">
                  {isEn ? course.titleEn : course.titleBn}
                </h3>
                <p className="text-xs text-slate-600">
                  {isEn ? "Lead Instructor:" : "প্রধান প্রশিক্ষক:"} {course.tutor}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">{isEn ? "Official Tuition" : "টিউশন ফি"}</span>
                <span className="font-serif font-extrabold text-xl text-editorial-accent">{formatPrice(course.price)}</span>
              </div>
            </div>

            {/* Check User Login Status */}
            {!currentUser && (
              <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-red-900">
                    {isEn ? "Student Account Required" : "শিক্ষার্থী অ্যাকাউন্ট আবশ্যক"}
                  </h4>
                  <p className="text-xs text-red-700 leading-relaxed">
                    {isEn
                      ? "To track your coursework, practical attendance, and receive an accredited digital diploma, please log in or create your student account before submitting."
                      : "আপনার কোর্সওয়ার্ক, ব্যবহারিক হাজিরা এবং ডিজিটাল ডিপ্লোমা প্রাপ্তির জন্য অনুগ্রহ করে আবেদন সাবমিট করার পূর্বে লগইন বা সাইন আপ করুন।"}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-4 py-1.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                  >
                    {isEn ? "Log In / Register Now" : "লগইন / সাইন আপ করুন"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Select Cohort / Batch */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {isEn ? "1. Select Upcoming Cohort / Batch:" : "১. আসন্ন ব্যাচ নির্বাচন করুন:"}
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {courseBatches.length > 0 ? (
                  courseBatches.map((batch) => (
                    <label
                      key={batch.id}
                      className={`p-3.5 border text-xs cursor-pointer transition flex items-start justify-between ${
                        selectedBatchId === batch.id
                          ? "border-editorial-accent bg-[#F7F5F0] shadow-xs"
                          : "border-slate-200 hover:border-slate-400 bg-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="batch"
                            value={batch.id}
                            checked={selectedBatchId === batch.id}
                            onChange={() => setSelectedBatchId(batch.id)}
                            className="accent-editorial-accent"
                          />
                          <span className="font-bold text-slate-900">{batch.name}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] pl-5">
                          📅 {batch.startDate} • {batch.classDays.join(", ")} ({batch.classTime})
                        </p>
                        <p className="text-slate-500 text-[11px] pl-5">
                          📍 {batch.location}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {batch.maxStudents - batch.enrolledStudentsCount} {isEn ? "Seats Left" : "আসন খালি"}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="p-3 bg-white border border-slate-200 text-xs text-slate-600">
                    {isEn ? "Morning Cohort (Sun-Tue-Thu 09:30 AM - 01:30 PM)" : "মর্নিং ব্যাচ (রবি-মঙ্গল-বৃহঃ সকাল ৯:৩০ - দুপুর ১:৩০)"}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Applicant Information */}
            <div className="space-y-3 pt-2 border-t border-editorial-border">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {isEn ? "2. Applicant Information:" : "২. শিক্ষার্থীর বিবরণ:"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-slate-500 mb-1 font-semibold">{isEn ? "Full Name" : "পুরো নাম"}</span>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Tasnim Rahman"
                    className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                  />
                </div>
                <div>
                  <span className="block text-slate-500 mb-1 font-semibold">{isEn ? "Email Address" : "ইমেল ঠিকানা"}</span>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-500 mb-1 font-semibold">{isEn ? "Phone Number" : "মোবাইল নম্বর"}</span>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Preference & TrxID */}
            <div className="space-y-3 pt-2 border-t border-editorial-border">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {isEn ? "3. Payment Verification & Method:" : "৩. পেমেন্ট ও ভেরিফিকেশন:"}
                </label>
                <span className="text-[10px] text-slate-500 italic">
                  {isEn ? "Optional at application; can pay after review" : "আবেদনের সময় ঐচ্ছিক"}
                </span>
              </div>

              {/* Payment Method Badges */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "bkash", label: "bKash" },
                  { id: "nagad", label: "Nagad" },
                  { id: "bank", label: isEn ? "Bank Transfer" : "ব্যাংক ট্রান্সফার" },
                  { id: "cash", label: isEn ? "Campus Cash" : "ক্যাশ অন ক্যাম্পাস" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentOption(item.id as any)}
                    className={`py-2 px-1 text-center font-bold text-[11px] border transition cursor-pointer ${
                      paymentOption === item.id
                        ? "border-editorial-accent bg-red-50 text-editorial-accent"
                        : "border-slate-200 hover:border-slate-400 bg-white text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* TrxID input for mobile wallets / bank */}
              {paymentOption !== "cash" && (
                <div className="space-y-1.5 pt-1">
                  <span className="block text-[11px] text-slate-600 font-semibold">
                    {isEn
                      ? `Paid already via ${paymentOption.toUpperCase()}? Enter Transaction ID (TrxID):`
                      : `${paymentOption.toUpperCase()} ট্রানজেকশন আইডি (TrxID) থাকলে লিখুন:`}
                  </span>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="e.g. BKASH98765432 or EBL-DEP-0012"
                    className="w-full px-3 py-2 font-mono text-xs uppercase bg-white border border-slate-300 focus:outline-none focus:border-editorial-accent text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    {isEn
                      ? "Submitting a valid TrxID expedites your admission and unlocks instant course material access upon admin verification."
                      : "সঠিক ট্রানজেকশন আইডি দিলে আপনার আবেদন দ্রুত যাচাই করে অ্যাডমিন কোর্স অ্যাক্সেস নিশ্চিত করবেন।"}
                  </p>
                </div>
              )}
            </div>

            {/* Notes / Special Requests */}
            <div className="space-y-1">
              <span className="block text-xs text-slate-500 font-semibold">
                {isEn ? "Additional Notes or Culinary Background:" : "অতিরিক্ত নোট বা পূর্ব অভিজ্ঞতা:"}
              </span>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isEn ? "e.g. Prior line cook experience in Gulshan..." : "যেমন: ক্যাটারিং বা কিচেনে পূর্ব কাজের অভিজ্ঞতা..."}
                className="w-full px-3 py-2 bg-white border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent text-slate-900"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-editorial-border flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:text-black font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                {isEn ? "Cancel" : "বাতিল"}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center gap-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
              >
                <span>{isEn ? "Submit Application" : "আবেদন জমা দিন"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="h-16 w-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block font-bold">
                APPLICATION REF: {submittedApp?.id}
              </span>
              <h3 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Enrollment Application Received!" : "এনরোলমেন্ট আবেদনপত্র গৃহীত হয়েছে!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {isEn
                  ? `Thank you, ${submittedApp?.studentName}. Your application for ${submittedApp?.courseTitle} has been recorded in the Lodonex Admissions Registry.`
                  : `ধন্যবাদ, ${submittedApp?.studentName}। ${submittedApp?.courseTitle} কোর্সের জন্য আপনার আবেদনপত্রটি সফলভাবে জমা হয়েছে।`}
              </p>
            </div>

            {/* Next Steps Checklist */}
            <div className="bg-[#F7F5F0] border border-editorial-border p-4 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-editorial-dark border-b border-editorial-border pb-1">
                {isEn ? "Official Admissions Workflow:" : "ভর্তি কার্যক্রমের ধাপসমূহ:"}
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Step 1: Application submitted and queued for review" : "১ম ধাপ: আবেদন জমা দেওয়া সম্পন্ন"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{isEn ? "Step 2: Admin reviews qualification & payment verification" : "২য় ধাপ: অ্যাডমিন যাচাইকরণ ও পেমেন্ট রিভিউ"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{isEn ? "Step 3: Approval notification & course unlocked in Student Panel" : "৩য় ধাপ: অনুমোদন ও স্টুডেন্ট প্যানেলে কোর্স উন্মুক্ত"}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-editorial-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              {isEn ? "Return to Academy" : "একাডেমিতে ফিরে যান"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
