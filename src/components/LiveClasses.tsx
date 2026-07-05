import React, { useState, useEffect } from "react";
import { Tv, MessageSquare, Send, Calendar, Users, Clock, AlertCircle, Sparkles, Volume2 } from "lucide-react";
import { Language, LiveClass } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";

interface LiveClassesProps {
  lang: Language;
  liveClasses: LiveClass[];
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  isChef?: boolean;
}

export default function LiveClasses({ lang, liveClasses }: LiveClassesProps) {
  const t = TRANSLATIONS[lang];

  // Live class countdown calculations (Simulate 3 days from now)
  const [countdown, setCountdown] = useState({ days: 3, hours: 14, minutes: 25, seconds: 40 });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Sabina Yasmin", message: lang === "en" ? "Chef, can we substitute mutton with beef in this recipe?" : "শেফ, আমরা কি খাসির মাংসের পরিবর্তে গরুর মাংস ব্যবহার করতে পারি?", time: "18:02" },
    { id: "2", sender: "Chef Tanvir Ahmed", message: lang === "en" ? "Yes Sabina! Beef works perfectly, just increase koshano time by 10 mins." : "হ্যাঁ সাবিনা! গরুর মাংস চমৎকার হবে, শুধু কষানোর সময় আরও ১০ মিনিট বাড়িয়ে দেবেন।", time: "18:03", isChef: true },
    { id: "3", sender: "Anisur Rahman", message: lang === "en" ? "Aroma is coming through the screen! Amazing!" : "মনে হচ্ছে ঘ্রাণ স্ক্রিন ভেদ করে চলে আসছে! অসাধারণ!", time: "18:04" },
    { id: "4", sender: "Khadija Begum", message: lang === "en" ? "What is the perfect heat level during steaming?" : "দম দেওয়ার সময় চুলার সঠিক আঁচ কেমন হওয়া দরকার?", time: "18:05" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [joined, setJoined] = useState(false);

  // Reminders list
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  // Ticking countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: lang === "en" ? "Culinary Apprentice (You)" : "রন্ধন শিক্ষার্থী (আপনি)",
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsSending(true);

    // Simulated Chef Auto response after 3 seconds for engagement
    setTimeout(() => {
      const chefMsg: ChatMessage = {
        id: `chef-reply-${Date.now()}`,
        sender: "Chef Tanvir Ahmed",
        message:
          lang === "en"
            ? "Excellent question! Always ensure spices are fully sauteed until oil separates."
            : "খুব ভালো প্রশ্ন! সবসময় খেয়াল রাখবেন মশলাটা যেন তেল ওপরে ভাসা পর্যন্ত ভালো করে কষানো হয়।",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        isChef: true,
      };
      setChatMessages((prev) => [...prev, chefMsg]);
      setIsSending(false);
    }, 2500);
  };

  const toggleReminder = (id: string) => {
    setRemindedIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const activeLiveClass = liveClasses.find((lc) => lc.status === "live") || liveClasses[0];
  const upcomingClasses = liveClasses.filter((lc) => lc.status === "upcoming");

  return (
    <div id="live-classes-section" className="space-y-10 py-6">
      {/* Active Live Class Broadcasting Area */}
      <div id="live-broadcast-layout" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-editorial-border">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-editorial-accent"></span>
            </span>
            <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400">
              {t.liveNow}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 font-sans">
            <Users className="h-4 w-4 text-editorial-accent" />
            ১৮৪ {lang === "en" ? "Watching Live" : "জন শিক্ষার্থী দেখছেন"}
          </span>
        </div>

        {/* Live Container Player & Chat */}
        <div id="live-container" className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-none border border-editorial-border bg-[#F7F5F0]">
          {/* Stream Player Viewport */}
          <div className="lg:col-span-2 relative aspect-video bg-black flex items-center justify-center border-b lg:border-b-0 lg:border-r border-editorial-border">
            {joined ? (
              <>
                <iframe
                  id="live-stream-frame"
                  src="https://www.youtube.com/embed/j_E2DszXfM0?autoplay=1&mute=1" // Biryani masterclass video
                  title="Live Cooking Stream"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute bottom-4 left-4 bg-editorial-accent text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-none uppercase flex items-center gap-1.5 border border-red-700">
                  <Volume2 className="h-4 w-4" />
                  Stream Muted (Click to Unmute)
                </div>
              </>
            ) : (
              <div className="text-center p-6 space-y-5 max-w-sm z-10">
                <div className="mx-auto h-16 w-16 bg-editorial-accent/10 rounded-none border border-editorial-accent/20 flex items-center justify-center text-editorial-accent">
                  <Tv className="h-8 w-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight italic">
                    {lang === "en" ? activeLiveClass.titleEn : activeLiveClass.titleBn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans">{t.tutor}: <span className="text-white font-bold">{activeLiveClass.tutor}</span></p>
                </div>
                <button
                  id="join-live-now-btn"
                  onClick={() => setJoined(true)}
                  className="w-full py-3 bg-editorial-accent hover:bg-red-700 text-white rounded-none text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                >
                  {t.joinLiveClass}
                </button>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-[#1A1A1A] border border-editorial-border px-3 py-1 text-[9px] font-sans font-bold text-editorial-accent flex items-center gap-1.5 uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-editorial-accent animate-ping"></span>
              Live Broadcast
            </div>
          </div>

          {/* Chat Panel Box */}
          <div id="live-chat-panel" className="bg-white h-80 sm:h-auto flex flex-col justify-between">
            {/* Header */}
            <div className="p-3.5 border-b border-editorial-border flex items-center justify-between text-[#1A1A1A] flex-shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 font-sans">
                <MessageSquare className="h-4 w-4 text-editorial-accent" />
                {t.classChat}
              </span>
              <span className="text-[8px] bg-[#F7F5F0] border border-editorial-border px-2 py-0.5 rounded-none text-editorial-accent font-sans font-bold tracking-widest">
                VERIFIED
              </span>
            </div>

            {/* Chat Feed */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4 min-h-0 text-xs scrollbar-thin text-left font-sans">
              {chatMessages.map((msg) => (
                <div key={msg.id} id={`chat-msg-${msg.id}`} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold truncate text-xs ${msg.isChef ? "text-editorial-accent" : "text-slate-800"}`}>
                      {msg.sender}
                    </span>
                    {msg.isChef && (
                      <span className="bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 text-[8px] font-bold px-1.5 py-0.5 rounded-none uppercase">
                        CHEF
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 font-mono ml-auto">{msg.time}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-[#F7F5F0] p-2.5 rounded-none border border-editorial-border/40">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-editorial-border flex gap-2 flex-shrink-0 bg-[#FDFCF9]">
              <input
                id="chat-message-input"
                type="text"
                placeholder={t.enterMessage}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-white border border-editorial-border rounded-none px-3 py-2 text-xs text-slate-950 focus:outline-none focus:border-[#1A1A1A] font-sans"
              />
              <button
                id="send-chat-message-btn"
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2.5 bg-[#1A1A1A] hover:bg-slate-800 text-white rounded-none transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Upcoming Masterclasses Countdown Scheduler */}
      <div id="upcoming-live-schedules" className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-editorial-border text-left">
          <Calendar className="h-5 w-5 text-editorial-accent" />
          <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400">
            {t.upcomingLiveClasses}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingClasses.map((cl) => {
            const isRegistered = remindedIds.includes(cl.id);

            return (
              <div
                key={cl.id}
                id={`upcoming-class-card-${cl.id}`}
                className="bg-white rounded-none border border-editorial-border overflow-hidden flex flex-col justify-between text-left"
              >
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-editorial-border">
                  <img src={cl.image} alt={cl.titleEn} className="h-full w-full object-cover transition-transform duration-500 hover:scale-101" />

                  {/* Dynamic Floating Countdown Widget */}
                  <div className="absolute inset-0 bg-[#1A1A1A]/45 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="text-center text-white space-y-2.5">
                      <span className="text-[9px] font-sans tracking-widest text-white uppercase font-bold border border-white/20 px-3 py-1 bg-black/30">
                        {lang === "en" ? "Streaming Live In" : "লাইভ শুরু হবে"}
                      </span>
                      <div className="flex gap-2 justify-center font-serif text-sm sm:text-base font-bold">
                        <div className="bg-[#1A1A1A]/95 px-2.5 py-1.5 rounded-none border border-editorial-border">
                          {countdown.days}d
                        </div>
                        <div className="bg-[#1A1A1A]/95 px-2.5 py-1.5 rounded-none border border-editorial-border">
                          {countdown.hours}h
                        </div>
                        <div className="bg-[#1A1A1A]/95 px-2.5 py-1.5 rounded-none border border-editorial-border">
                          {countdown.minutes}m
                        </div>
                        <div className="bg-editorial-accent border border-red-700 px-2.5 py-1.5 rounded-none text-white">
                          {countdown.seconds}s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-base sm:text-lg text-editorial-dark leading-snug">
                      {lang === "en" ? cl.titleEn : cl.titleBn}
                    </h4>
                    <p className="text-xs text-slate-500 font-sans font-medium">
                      {t.tutor}: <span className="text-[#1A1A1A] font-bold">{cl.tutor}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-editorial-border flex items-center justify-between text-xs text-slate-400 font-sans font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-editorial-accent" />
                      {cl.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-editorial-accent" />
                      {cl.time} BDT
                    </span>
                  </div>

                  <button
                    id={`remind-btn-${cl.id}`}
                    onClick={() => toggleReminder(cl.id)}
                    className={`w-full py-3 rounded-none text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      isRegistered
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-[#1A1A1A] hover:bg-slate-800 text-white border-editorial-dark"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-editorial-accent" />
                    {isRegistered
                      ? lang === "en"
                        ? "Registered (Notifications Active)"
                        : "রেজিস্ট্রেশন সম্পন্ন (নোটিফিকেশন সক্রিয়)"
                      : lang === "en"
                      ? "Register & Get Invite"
                      : "রেজিস্ট্রেশন করুন"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
