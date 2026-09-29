import React, { useState, useEffect } from "react";
import { Search, Award, CheckCircle, XCircle, ShieldCheck, Calendar, Clock, GraduationCap, ArrowRight, Share2, Printer, ExternalLink, Sparkles } from "lucide-react";
import { Language, DigitalCertificate } from "../types";
import { MOCK_DIGITAL_CERTIFICATES } from "../data/lmsMockData";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

interface CertificateVerificationProps {
  lang: Language;
  initialCertNumber?: string;
  onNavigateToCourse?: (courseId: string) => void;
}

export default function CertificateVerification({
  lang,
  initialCertNumber = "",
  onNavigateToCourse
}: CertificateVerificationProps) {
  const isEn = lang === "en";
  const [certQuery, setCertQuery] = useState(initialCertNumber || "");
  const [searchState, setSearchState] = useState<"idle" | "loading" | "verified" | "not_found">("idle");
  const [verifiedCert, setVerifiedCert] = useState<DigitalCertificate | null>(null);

  // Sample certificate IDs for quick verification testing
  const sampleCerts = [
    { num: "LOD-CERT-2026-0891", name: "Tasnim Rahman (Culinary Foundation)" },
    { num: "LOD-CERT-2026-0042", name: "Sarah Khan (Winter Cohort)" },
    { num: "LOD-CERT-2026-0105", name: "Tanvir Hasan (Continental Cuisine)" }
  ];

  const handleVerify = async (queryNum?: string) => {
    const targetNum = (queryNum || certQuery).trim().toUpperCase();
    if (!targetNum) return;

    setSearchState("loading");

    // First try backend API
    try {
      const response = await fetch(`/api/certificates/verify/${encodeURIComponent(targetNum)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.verified) {
          setVerifiedCert({
            id: data.certificateNumber,
            certificateNumber: data.certificateNumber,
            studentId: "",
            studentName: data.studentName,
            studentEmail: "",
            courseId: "course-1",
            courseTitle: data.courseTitle,
            batchName: data.batchName,
            completionDate: data.completionDate,
            issueDate: data.issueDate,
            duration: data.duration,
            trainingHours: data.trainingHours || "360 Hours",
            grade: data.grade,
            authorizedSignatory: data.authorizedSignatory,
            signatoryTitle: data.signatoryTitle,
            isValid: true
          });
          setSearchState("verified");
          return;
        }
      }
    } catch (e) {
      // Fallback to local mock data
    }

    // Local fallback check
    const localMatch = MOCK_DIGITAL_CERTIFICATES.find(
      (c) => c.certificateNumber.toUpperCase() === targetNum
    );

    if (localMatch) {
      setVerifiedCert(localMatch);
      setSearchState("verified");
    } else {
      setVerifiedCert(null);
      setSearchState("not_found");
    }
  };

  useEffect(() => {
    if (initialCertNumber) {
      setCertQuery(initialCertNumber);
      handleVerify(initialCertNumber);
    }
  }, [initialCertNumber]);

  return (
    <div id="certificate-verification-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Page Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-widest">
          <ShieldCheck className="h-4 w-4 text-editorial-accent" />
          <span>{isEn ? "Official Lodonex Accreditation Registry" : "অফিসিয়াল লোডোনেক্স অ্যাক্রেডিটেশন রেজিস্ট্রি"}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-editorial-dark tracking-tight">
          {isEn ? "Verify Digital Culinary Certificate" : "ডিজিটাল কালিনারি সার্টিফিকেট যাচাইকরণ"}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Enter the unique certificate identification number issued by Lodonex Cooking Academy to verify credential validity, student qualification, and LQF accreditation."
            : "লোডোনেক্স কুকিং একাডেমি কর্তৃক প্রদত্ত সার্টিফিকেটের অনন্য নম্বরটি লিখে সত্যতা, শিক্ষার্থীর যোগ্যতা এবং এলকিউএফ স্বীকৃতি যাচাই করুন।"}
        </p>
      </div>

      {/* Verification Search Bar */}
      <div className="bg-white border-2 border-editorial-border p-6 shadow-sm mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={certQuery}
              onChange={(e) => setCertQuery(e.target.value.toUpperCase())}
              placeholder={isEn ? "e.g. LOD-CERT-2026-0891" : "যেমন: LOD-CERT-2026-0891"}
              className="w-full pl-11 pr-4 py-3 bg-[#FDFCF9] border border-editorial-border font-mono text-sm tracking-wider uppercase text-editorial-dark focus:outline-none focus:border-editorial-accent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={searchState === "loading"}
            className="px-6 py-3 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            {searchState === "loading" ? (
              <span>{isEn ? "Verifying..." : "যাচাই করা হচ্ছে..."}</span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>{isEn ? "Verify Credential" : "যাচাই করুন"}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{isEn ? "Try sample numbers:" : "নমুনা নম্বর চেষ্টা করুন:"}</span>
          {sampleCerts.map((sample) => (
            <button
              key={sample.num}
              type="button"
              onClick={() => {
                setCertQuery(sample.num);
                handleVerify(sample.num);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-[11px] font-mono transition cursor-pointer"
            >
              {sample.num}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result: VERIFIED */}
      {searchState === "verified" && verifiedCert && (
        <div id="verified-certificate-card" className="bg-[#FCFBF8] border-2 border-emerald-600 p-6 sm:p-10 shadow-md relative overflow-hidden animate-fadeIn">
          {/* Security Watermark Badge */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{isEn ? "Officially Verified & Authentic" : "অফিসিয়ালি যাচাইকৃত ও বৈধ"}</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Academy Header within Certificate Result */}
            <div className="text-center space-y-2 pb-6 border-b border-editorial-border">
              <div className="h-16 w-16 mx-auto bg-white border border-editorial-border p-1 overflow-hidden shadow-xs">
                <img src={lodonexLogo} alt="Lodonex Official Seal" className="h-full w-full object-cover" />
              </div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark tracking-tight">
                LODONEX COOKING ACADEMY
              </h2>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Directorate of Culinary Education & National Apprenticeship Guild
              </p>
            </div>

            {/* Certificate Details Body */}
            <div className="space-y-6 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                {isEn ? "This is to officially certify that" : "এই মর্মে প্রত্যয়ন করা হচ্ছে যে"}
              </p>

              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-editorial-accent italic">
                {verifiedCert.studentName}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                {isEn
                  ? "has successfully completed all prescribed theoretical curricula, HACCP kitchen hygiene examinations, and hands-on practical masterclasses for the qualification of:"
                  : "সফলভাবে নির্ধারিত সকল তাত্ত্বিক কারিকুলাম, এইচএসিসিপি কিচেন হাইজিন পরীক্ষা এবং ব্যবহারিক মাস্টারক্লাস সম্পন্ন করেছেন:"}
              </p>

              <div className="inline-block px-6 py-3 bg-amber-50 border-2 border-amber-300 text-amber-950 font-serif font-bold text-lg sm:text-xl">
                {verifiedCert.courseTitle}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-left border-y border-editorial-border py-4 bg-white/70 px-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{isEn ? "Certificate No." : "সার্টিফিকেট নং"}</span>
                  <span className="font-mono text-xs font-extrabold text-editorial-dark">{verifiedCert.certificateNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{isEn ? "Issue Date" : "ইস্যুর তারিখ"}</span>
                  <span className="text-xs font-semibold text-editorial-dark">{verifiedCert.issueDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{isEn ? "Training Hours" : "প্রশিক্ষণ ঘন্টা"}</span>
                  <span className="text-xs font-semibold text-editorial-dark">{verifiedCert.trainingHours || verifiedCert.duration}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{isEn ? "Awarded Grade" : "অর্জিত গ্রেড"}</span>
                  <span className="text-xs font-bold text-emerald-700">{verifiedCert.grade}</span>
                </div>
              </div>

              {/* Signatures & Accreditation Footer */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
                <div className="text-left space-y-1">
                  <div className="font-serif font-bold text-sm text-slate-800 italic border-b border-slate-300 pb-1 inline-block">
                    {verifiedCert.authorizedSignatory}
                  </div>
                  <p className="text-[11px] text-slate-500">{verifiedCert.signatoryTitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-black font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>{isEn ? "Print Verification Report" : "প্রিন্ট রিপোর্ট"}</span>
                  </button>
                  {onNavigateToCourse && (
                    <button
                      onClick={() => onNavigateToCourse(verifiedCert.courseId)}
                      className="px-3.5 py-1.5 bg-editorial-dark hover:bg-black text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{isEn ? "View Course Details" : "কোর্স দেখুন"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Result: NOT FOUND */}
      {searchState === "not_found" && (
        <div id="unverified-certificate-notice" className="bg-red-50 border-2 border-red-300 p-8 text-center space-y-4">
          <div className="h-12 w-12 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-red-900">
              {isEn ? "Certificate Record Not Found" : "সার্টিফিকেটের তথ্য পাওয়া যায়নি"}
            </h3>
            <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
              {isEn
                ? `No official credential matching identification number "${certQuery}" exists in the Lodonex National Accreditation Registry. Please verify the code on your physical certificate or contact the registrar.`
                : `"${certQuery}" নম্বরের সাথে সামঞ্জস্যপূর্ণ কোনো সার্টিফিকেট লোডোনেক্স ডাটাবেজে পাওয়া যায়নি। অনুগ্রহ করে আপনার কাগজের সার্টিফিকেটের নম্বরটি পুনরায় চেক করুন অথবা একাডেমির সাথে যোগাযোগ করুন।`}
            </p>
          </div>
          <div className="pt-2 text-xs text-slate-600">
            <span className="font-semibold">{isEn ? "Registrar Helpline: " : "রেজিস্ট্রার হেল্পলাইন: "}</span>
            <span className="font-mono">+880 1700-111000 / lodonexcookingacademy@gmail.com</span>
          </div>
        </div>
      )}
    </div>
  );
}
