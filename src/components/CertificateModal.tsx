import React from "react";
import { X, Award, Shield, Check, Printer, Share2 } from "lucide-react";
import { Language, Course } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion } from "motion/react";

interface CertificateModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  studentName: string;
}

export default function CertificateModal({
  lang,
  isOpen,
  onClose,
  course,
  studentName,
}: CertificateModalProps) {
  const t = TRANSLATIONS[lang];
  if (!isOpen || !course) return null;

  // Formulate date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString(lang === "en" ? "en-US" : "bn-BD", options);

  return (
    <div
      id="certificate-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white border border-editorial-dark rounded-none overflow-hidden shadow-2xl flex flex-col items-center justify-between p-6 sm:p-8"
      >
        {/* Certificate Frame Card */}
        <div
          id="certificate-frame"
          className="relative w-full aspect-[4/3] max-w-2xl bg-[#FDFCF9] text-[#1A1A1A] border-8 border-editorial-dark p-6 sm:p-10 flex flex-col justify-between items-center text-center shadow-xs rounded-none overflow-hidden"
        >
          {/* Double Thin Inset Borders */}
          <div className="absolute inset-2 border border-editorial-border pointer-events-none"></div>
          <div className="absolute inset-3 border border-editorial-border/40 pointer-events-none"></div>

          {/* Academic Header */}
          <div className="space-y-1 sm:space-y-2 z-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-none bg-[#1A1A1A] text-white flex items-center justify-center border border-editorial-border">
              <Award className="h-6 w-6 text-editorial-accent" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xs sm:text-sm tracking-[0.25em] text-editorial-dark uppercase">
                {t.academyName}
              </h2>
              <span className="text-[8px] uppercase tracking-[0.2em] font-sans font-bold text-slate-400">
                Culinary Academic Credentials Council
              </span>
            </div>
          </div>

          {/* Diploma Statement */}
          <div className="space-y-2 sm:space-y-3.5 z-10 w-full px-4 text-center">
            <h1 className="font-serif italic text-xl sm:text-4xl font-light text-editorial-dark">
              {t.certificateOfCompletion}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-sans font-bold uppercase tracking-widest">{t.certificateAwardedTo}</p>
            <h3 className="font-serif font-bold text-2xl sm:text-4xl text-editorial-accent border-b border-editorial-border pb-1 max-w-md mx-auto tracking-wide italic">
              {studentName}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500 max-w-lg mx-auto leading-relaxed font-sans">
              {t.certificateText}
            </p>
            <h4 className="font-serif font-bold text-sm sm:text-lg text-editorial-dark italic">
              “{lang === "en" ? course.titleEn : course.titleBn}”
            </h4>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="w-full flex justify-between items-end px-2 sm:px-6 z-10 mt-2 sm:mt-6 text-left">
            <div className="text-left space-y-1 font-sans">
              <div className="h-6 w-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_signature.png')] bg-contain bg-no-repeat bg-center opacity-80"></div>
              <div className="border-t border-editorial-border w-24 sm:w-32"></div>
              <span className="text-[9px] text-editorial-dark block font-bold uppercase tracking-wider">{course.tutor}</span>
              <span className="text-[8px] text-slate-400 block uppercase tracking-wider">{lang === "en" ? "Supervising Instructor" : "তত্ত্বাবধায়ক ইন্সট্রাক্টর"}</span>
            </div>

            {/* Custom vector flat red wax stamp */}
            <div className="relative h-14 w-14 bg-editorial-accent text-white border border-red-700 flex items-center justify-center font-bold text-[8px] uppercase font-serif tracking-widest rounded-none shadow-sm">
              <div className="absolute inset-1 border border-dashed border-red-100"></div>
              <Shield className="h-5 w-5 text-white/90" />
            </div>

            <div className="text-right space-y-1 font-sans">
              <span className="text-xs font-serif font-bold text-editorial-dark block italic">{formattedDate}</span>
              <div className="border-t border-editorial-border w-24 sm:w-32"></div>
              <span className="text-[9px] text-editorial-dark block font-bold uppercase tracking-wider">{t.authorizedSignature}</span>
              <span className="text-[8px] text-slate-400 block uppercase tracking-wider">Professional Cooking Council</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full flex gap-3 justify-center mt-6">
          <button
            onClick={() => window.print()}
            className="px-5 py-3 bg-white border border-editorial-border text-editorial-dark text-xs font-bold uppercase tracking-widest rounded-none transition flex items-center gap-1.5 hover:bg-[#F7F5F0] cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            {lang === "en" ? "Print Credential" : "প্রিন্ট করুন"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-slate-850 text-white text-xs font-bold uppercase tracking-widest rounded-none transition flex items-center gap-1.5 cursor-pointer"
          >
            <X className="h-4 w-4 text-editorial-accent" />
            {lang === "en" ? "Close Portal" : "বন্ধ করুন"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
