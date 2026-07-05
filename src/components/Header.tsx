import React from "react";
import { ShoppingBag, Globe, User, LogOut, ShieldAlert, CheckCircle } from "lucide-react";
import { Language, Course, UserAccount } from "../types";
import { TRANSLATIONS } from "../data/translations";

const lodonexLogo = "/src/assets/images/lodonex_logo_1783226863502.jpg";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  cart: Course[];
  setIsCartOpen: (open: boolean) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogOut: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  cart,
  setIsCartOpen,
  currentUser,
  onOpenAuth,
  onLogOut,
}: HeaderProps) {
  const t = TRANSLATIONS[lang];

  const menuItems = [
    { id: "dashboard", label: t.studentDashboard },
    { id: "courses", label: t.ourCourses },
    { id: "recipes", label: t.myRecipes },
    { id: "live", label: t.liveMasterclass },
    { id: "blogs", label: t.blogs },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FDFCF9]/95 backdrop-blur-md text-slate-900 border-b border-editorial-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Academy Name */}
          <div
            id="header-logo"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              setCurrentTab("dashboard");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="h-12 w-12 bg-white border border-editorial-border overflow-hidden flex items-center justify-center">
              <img
                src={lodonexLogo}
                alt="Lodonex Logo"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-tight text-editorial-dark block">
                Lodonex
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                {lang === "en" ? "Cooking Academy" : "কুকিং একাডেমি"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex space-x-1 lg:space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-bold transition-all duration-200 border-b-2 cursor-pointer ${
                  currentTab === item.id
                    ? "border-editorial-dark text-editorial-dark font-extrabold"
                    : "border-transparent text-slate-500 hover:text-editorial-dark"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div id="header-controls" className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="flex items-center space-x-1 px-3 py-1.5 border border-editorial-border bg-white text-editorial-dark text-xs hover:bg-[#F7F5F0] transition duration-200 rounded-none shadow-xs cursor-pointer"
              title="Toggle Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="h-3.5 w-3.5 text-editorial-accent" />
              <span className="font-bold tracking-wider">{lang === "en" ? "BN" : "EN"}</span>
            </button>

            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 border border-editorial-border bg-white text-editorial-dark hover:bg-[#F7F5F0] transition duration-200 rounded-none shadow-xs cursor-pointer"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span
                  id="cart-count-badge"
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-editorial-accent text-[9px] font-bold text-white rounded-none"
                >
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile / Auth Widget */}
            {!currentUser ? (
              <button
                id="header-auth-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-editorial-accent hover:bg-red-800 text-white text-[11px] font-extrabold uppercase tracking-wider transition duration-200 cursor-pointer rounded-none shadow-xs"
              >
                <User className="h-3.5 w-3.5" />
                <span>{lang === "en" ? "Register / Log In" : "রেজিস্টার / লগইন"}</span>
              </button>
            ) : (
              <div
                id="user-profile-widget"
                className="flex items-center space-x-2 bg-[#F7F5F0] p-1.5 border border-editorial-border rounded-none"
              >
                {/* Initials */}
                <div className="h-8 w-8 rounded-none bg-editorial-accent text-white flex items-center justify-center font-bold text-xs relative">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>

                {/* Name & Account Status info */}
                <div className="hidden lg:block text-left text-[11px] max-w-[120px] font-sans leading-tight">
                  <div className="font-extrabold text-editorial-dark truncate max-w-[100px]" title={currentUser.name}>
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {currentUser.status === "approved" ? (
                      <span className="text-emerald-600 text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                        <CheckCircle className="h-2 w-2" /> {lang === "en" ? "Approved" : "অনুমোদিত"}
                      </span>
                    ) : (
                      <span className="text-amber-600 text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                        <ShieldAlert className="h-2 w-2" /> {lang === "en" ? "Pending" : "অপেক্ষমাণ"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Log Out Button */}
                <button
                  onClick={onLogOut}
                  className="p-1 text-slate-400 hover:text-editorial-accent transition cursor-pointer"
                  title={lang === "en" ? "Log Out" : "লগ আউট"}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div id="mobile-nav" className="md:hidden flex items-center justify-around py-2 border-t border-editorial-border bg-white">
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mob-${item.id}`}
              onClick={() => {
                setCurrentTab(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-2 py-1 text-[11px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
                currentTab === item.id
                  ? "text-editorial-accent border-b border-editorial-accent"
                  : "text-slate-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
