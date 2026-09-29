import React, { useState } from "react";
import { ShoppingBag, Globe, User, LogOut, ShieldCheck, CheckCircle, Menu, X, Mail, Shield, Award } from "lucide-react";
import { Language, Course, UserAccount } from "../types";
import { TRANSLATIONS } from "../data/translations";
import lodonexLogo from "../assets/images/lodonex_logo_new_1783662734826.jpg";

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
  onOpenWelcomeEmail?: () => void;
  onNavigate?: (path: string) => void;
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
  onOpenWelcomeEmail,
  onNavigate,
}: HeaderProps) {
  const t = TRANSLATIONS[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStaff = currentUser && ["superadmin", "admin", "trainer"].includes(currentUser.role || "");

  const menuItems = [
    ...(currentUser
      ? [
          {
            id: "dashboard",
            label: isStaff
              ? (lang === "en" ? "Admin Panel" : "অ্যাডমিন প্যানেল")
              : (lang === "en" ? "Student Portal" : "শিক্ষার্থী পোর্টাল")
          }
        ]
      : [
          {
            id: "home",
            label: lang === "en" ? "Home" : "মূল পাতা"
          }
        ]),
    { id: "courses", label: t.ourCourses },
    { id: "verify-cert", label: lang === "en" ? "Verify Certificate" : "সার্টিফিকেট যাচাই", badge: "PUBLIC" },
    { id: "recipes", label: t.myRecipes },
    { id: "chefs", label: t.ourChefs },
    { id: "jobs", label: t.chefJobsAccommodation },
    { id: "gallery", label: t.gallery },
    { id: "about", label: t.aboutUs },
  ];

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "superadmin":
        return "SUPER ADMIN";
      case "admin":
        return "ADMIN / STAFF";
      case "trainer":
        return "TRAINER CHEF";
      default:
        return "STUDENT";
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FDFCF9]/95 backdrop-blur-md text-slate-900 border-b border-editorial-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Academy Name */}
          <div
            id="header-logo"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              if (onNavigate) {
                onNavigate(currentUser ? (isStaff ? "/admin/dashboard" : "/student/dashboard") : "/");
              } else {
                setCurrentTab("dashboard");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="h-12 w-12 bg-white border border-editorial-border overflow-hidden flex items-center justify-center shrink-0">
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
              <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-slate-500 block">
                Cooking Academy
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex space-x-1 xl:space-x-3 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  if (item.id === "courses" && onNavigate) {
                    onNavigate("/courses");
                  } else if (item.id === "verify-cert" && onNavigate) {
                    onNavigate("/verify-cert");
                  } else if (item.id === "dashboard" && onNavigate) {
                    onNavigate(isStaff ? "/admin/dashboard" : "/student/dashboard");
                  } else if (item.id === "home" && onNavigate) {
                    onNavigate("/");
                  } else {
                    setCurrentTab(item.id);
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-2.5 py-1.5 text-xs uppercase tracking-widest font-bold transition-all duration-200 border-b-2 cursor-pointer flex items-center gap-1 ${
                  currentTab === item.id
                    ? "border-editorial-dark text-editorial-dark font-extrabold"
                    : "border-transparent text-slate-500 hover:text-editorial-dark"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 py-0.2 bg-amber-100 text-amber-800 text-[8px] font-extrabold rounded-none">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div id="header-controls" className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="flex items-center space-x-1 px-2.5 py-1.5 border border-editorial-border bg-white text-editorial-dark text-xs hover:bg-[#F7F5F0] transition duration-200 shadow-xs cursor-pointer"
              title="Toggle Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="h-3.5 w-3.5 text-editorial-accent" />
              <span className="font-bold tracking-wider">{lang === "en" ? "BN" : "EN"}</span>
            </button>

            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 border border-editorial-border bg-white text-editorial-dark hover:bg-[#F7F5F0] transition duration-200 shadow-xs cursor-pointer"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span
                  id="cart-count-badge"
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-editorial-accent text-[9px] font-bold text-white"
                >
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile / Auth Widget */}
            {!currentUser ? (
              <button
                id="header-auth-btn"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate("/portal/login");
                  } else {
                    onOpenAuth();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-editorial-accent hover:bg-red-800 text-white text-[11px] font-extrabold uppercase tracking-wider transition duration-200 cursor-pointer shadow-xs"
              >
                <User className="h-3.5 w-3.5" />
                <span>{lang === "en" ? "Portal Login" : "লগইন"}</span>
              </button>
            ) : (
              <div
                id="user-profile-widget"
                className="flex items-center space-x-2 bg-[#F7F5F0] p-1.5 border border-editorial-border"
              >
                {/* Initials */}
                <div className={`h-8 w-8 text-white flex items-center justify-center font-bold text-xs ${
                  isStaff ? "bg-[#111]" : "bg-editorial-accent"
                }`}>
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>

                {/* Name & Account Status info */}
                <div className="hidden sm:block text-left text-[11px] max-w-[130px] font-sans leading-tight">
                  <div className="font-extrabold text-editorial-dark truncate max-w-[110px]" title={currentUser.name}>
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`px-1 text-[8px] font-extrabold uppercase tracking-wider ${
                      isStaff
                        ? "bg-red-100 text-editorial-accent"
                        : currentUser.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>

                {/* Switch between Student/Admin Panel if Staff */}
                {isStaff && (
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(currentTab === "admin" ? "/student/dashboard" : "/admin/dashboard");
                      } else {
                        setCurrentTab(currentTab === "admin" ? "dashboard" : "admin");
                      }
                    }}
                    className="p-1 text-slate-600 hover:text-black transition cursor-pointer"
                    title={lang === "en" ? "Toggle Admin View" : "অ্যাডমিন ভিউ পরিবর্তন"}
                  >
                    <Shield className="h-4 w-4 text-editorial-accent" />
                  </button>
                )}

                {/* View Confirmation Email Button */}
                {onOpenWelcomeEmail && (
                  <button
                    onClick={onOpenWelcomeEmail}
                    className="p-1 text-[#1A1A1A] hover:text-editorial-accent transition cursor-pointer relative"
                    title={lang === "en" ? "View Welcome & Confirmation Email" : "স্বাগতম ইমেইল দেখুন"}
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                )}

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

            {/* Mobile Menu Toggle (Hamburger / 3 lines) */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 border border-editorial-border bg-white text-editorial-dark hover:bg-[#F7F5F0] transition duration-200 shadow-xs cursor-pointer flex items-center justify-center"
              title="Menu"
            >
              {isMobileMenuOpen ? <X className="h-4.5 w-4.5 text-editorial-accent" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav"
            className="lg:hidden border-t border-editorial-border bg-[#FDFCF9] divide-y divide-editorial-border/60"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-mob-${item.id}`}
                onClick={() => {
                  if (item.id === "courses" && onNavigate) {
                    onNavigate("/courses");
                  } else if (item.id === "verify-cert" && onNavigate) {
                    onNavigate("/verify-cert");
                  } else if (item.id === "dashboard" && onNavigate) {
                    onNavigate(isStaff ? "/admin/dashboard" : "/student/dashboard");
                  } else if (item.id === "home" && onNavigate) {
                    onNavigate("/");
                  } else {
                    setCurrentTab(item.id);
                  }
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  currentTab === item.id
                    ? "bg-[#F7F5F0] text-editorial-accent"
                    : "text-slate-600 hover:bg-[#F7F5F0]/40 hover:text-editorial-dark"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
