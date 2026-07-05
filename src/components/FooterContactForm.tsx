import React, { useState } from "react";
import { Send, Check } from "lucide-react";
import { Language } from "../types";

interface FooterContactFormProps {
  lang: Language;
}

export default function FooterContactForm({ lang }: FooterContactFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 800);
  };

  if (submitted) {
    return (
      <div id="contact-success-state" className="bg-emerald-950/40 border border-emerald-500/20 p-4 text-emerald-300 space-y-2 text-left">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-none bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check className="h-4 w-4" />
          </div>
          <span className="font-bold text-[11px] uppercase tracking-wider">
            {lang === "en" ? "Message Sent!" : "বার্তা পাঠানো হয়েছে!"}
          </span>
        </div>
        <p className="text-[10px] text-emerald-300/80 leading-relaxed">
          {lang === "en"
            ? "Thank you for contacting Lodonex. Our support team will respond to you within 24 hours."
            : "লোডোনেক্সের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমাদের সাপোর্ট টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।"}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-[10px] text-emerald-400 font-bold underline hover:text-emerald-300 transition"
        >
          {lang === "en" ? "Send another message" : "আরেকটি বার্তা পাঠান"}
        </button>
      </div>
    );
  }

  return (
    <form id="footer-contact-form" onSubmit={handleSubmit} className="space-y-2 text-left">
      <input
        type="text"
        required
        placeholder={lang === "en" ? "Your Name" : "আপনার নাম"}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-2.5 py-1.5 bg-neutral-800 border border-neutral-700 text-[#F5F2EB] placeholder-[#E5E2D9]/40 focus:outline-none focus:border-editorial-accent text-[11px]"
      />
      <input
        type="email"
        required
        placeholder={lang === "en" ? "Your Email" : "আপনার ইমেইল"}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-2.5 py-1.5 bg-neutral-800 border border-neutral-700 text-[#F5F2EB] placeholder-[#E5E2D9]/40 focus:outline-none focus:border-editorial-accent text-[11px]"
      />
      <textarea
        required
        rows={2}
        placeholder={lang === "en" ? "Your Inquiry..." : "আপনার জিজ্ঞাসা..."}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full px-2.5 py-1.5 bg-neutral-800 border border-neutral-700 text-[#F5F2EB] placeholder-[#E5E2D9]/40 focus:outline-none focus:border-editorial-accent text-[11px] resize-none"
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-editorial-accent hover:bg-red-800 disabled:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] transition duration-200 cursor-pointer"
      >
        {loading ? (
          <span className="animate-pulse">{lang === "en" ? "Sending..." : "পাঠানো হচ্ছে..."}</span>
        ) : (
          <>
            <Send className="h-3 w-3" />
            {lang === "en" ? "Submit Inquiry" : "সাবমিট করুন"}
          </>
        )}
      </button>
    </form>
  );
}
