import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingBag,
  Globe,
  User,
  LogOut,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  Mail,
  Shield,
  Award,
  Bell,
  ChevronDown,
  LayoutDashboard,
  ExternalLink,
  Sparkles
} from "lucide-react";
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSuperAdmin =
    currentUser &&
    (currentUser.role === "super_admin" ||
      currentUser.role === "superadmin" ||
      currentUser.email?.toLowerCase() === "lodonexcookingacademy@gmail.com");
  const isStaff =
    currentUser &&
    ["super_admin", "superadmin", "admin", "staff", "trainer"].includes(currentUser.role || "");

  const menuItems = [
    ...(currentUser
      ? [
          {
            id: "dashboard",
            label: isSuperAdmin
              ? (lang === "en" ? "Super Admin" : "সুপার অ্যাডমিন")
              : isStaff
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
    { id: "culinary-ebook", label: lang === "en" ? "Culinary E-Book" : "রন্ধন ই-বুক", badge: "$199" },
    { id: "verify-cert", label: lang === "en" ? "Verify Certificate" : "সার্টিফিকেট যাচাই", badge: "VERIFY" },
    { id: "recipes", label: t.myRecipes },
    { id: "chefs", label: lang === "en" ? "Our Team" : "আমাদের টিম" },
    { id: "jobs", label: t.chefJobsAccommodation },
    { id: "gallery", label: t.gallery },
    { id: "about", label: t.aboutUs },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "super_admin":
      case "superadmin":
        return { label: "SUPER ADMIN", bg: "bg-stone-900 text-amber-300 border-amber-500/30" };
      case "admin":
        return { label: "ADMIN", bg: "bg-stone-900 text-amber-300 border-amber-500/30" };
      case "staff":
        return { label: "STAFF", bg: "bg-red-950 text-red-200 border-red-800" };
      case "trainer":
        return { label: "TRAINER CHEF", bg: "bg-stone-800 text-amber-200 border-amber-600/30" };
      default:
        return { label: "STUDENT", bg: "bg-stone-100 text-stone-800 border-stone-200" };
    }
  };

  const roleInfo = getRoleBadge(currentUser?.role);

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FDFCF9]/95 backdrop-blur-md text-stone-900 border-b border-editorial-border font-sans transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Academy Name */}
          <div
            id="header-logo"
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => {
              if (onNavigate) {
                onNavigate(currentUser ? (isStaff ? "/admin/dashboard" : "/student/dashboard") : "/");
              } else {
                setCurrentTab("dashboard");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="h-12 w-12 bg-white border border-stone-200 shadow-xs overflow-hidden flex items-center justify-center shrink-0 group-hover:border-stone-400 transition-colors">
              <img
                src={lodonexLogo}
                alt="Lodonex Logo"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-stone-950">
                  LODONEX
                </span>
                <span className="h-1 w-1 rounded-full bg-editorial-accent"></span>
              </div>
              <span className="text-[9.5px] font-sans uppercase font-bold tracking-[0.22em] text-stone-500 block -mt-0.5">
                Cooking Academy
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex space-x-1 xl:space-x-2 items-center">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    if (item.id === "courses" && onNavigate) {
                      onNavigate("/courses");
                    } else if (item.id === "culinary-ebook" && onNavigate) {
                      onNavigate("/culinary-ebook");
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
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    isActive
                      ? "border-stone-900 text-stone-950 font-extrabold"
                      : "border-transparent text-stone-600 hover:text-stone-950 hover:border-stone-300"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-amber-100/90 text-amber-900 text-[8px] font-mono font-bold tracking-wider border border-amber-300/50">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls & User Profile Area */}
          <div id="header-controls" className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 border border-stone-200 bg-white text-stone-800 text-xs hover:bg-stone-50 transition duration-200 shadow-xs cursor-pointer"
              title="Toggle Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="h-3.5 w-3.5 text-editorial-accent" />
              <span className="font-mono font-bold tracking-wider text-[11px]">{lang === "en" ? "BN" : "EN"}</span>
            </button>

            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 transition duration-200 shadow-xs cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cart.length > 0 && (
                <span
                  id="cart-count-badge"
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-editorial-accent text-[9px] font-bold text-white shadow-xs"
                >
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile / Auth Widget Area */}
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
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-black text-amber-300 hover:text-white border border-stone-800 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs"
              >
                <User className="h-3.5 w-3.5 text-amber-400" />
                <span>{lang === "en" ? "Portal Login" : "লগইন"}</span>
              </button>
            ) : (
              <div ref={profileMenuRef} className="relative">
                {/* User Profile Bar Card */}
                <button
                  id="user-profile-menu-trigger"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 bg-white hover:bg-stone-50 p-1.5 pr-2.5 border border-stone-200 hover:border-stone-300 transition-all duration-200 cursor-pointer shadow-xs text-left"
                >
                  {/* Avatar / Photo */}
                  <div className={`h-8 w-8 text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 ${
                    isStaff ? "bg-stone-950 text-amber-300 border border-amber-500/30" : "bg-editorial-accent"
                  }`}>
                    {currentUser.photoUrl ? (
                      <img src={currentUser.photoUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                    ) : (
                      currentUser.name.substring(0, 2).toUpperCase()
                    )}
                  </div>

                  {/* Name, Role & Status Indicator */}
                  <div className="hidden sm:block leading-tight text-left">
                    <div className="font-extrabold text-[12px] text-stone-900 truncate max-w-[120px]" title={currentUser.name}>
                      {currentUser.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-1 py-0.2 text-[8px] font-mono font-extrabold uppercase border ${roleInfo.bg}`}>
                        {roleInfo.label}
                      </span>
                      <span className="flex items-center gap-0.5 text-[8.5px] font-sans font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        Active
                      </span>
                    </div>
                  </div>

                  <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Luxury Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header Banner */}
                    <div className="p-4 bg-stone-950 text-white border-b border-amber-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                          LODONEX ACADEMY
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          LIVE SESSION
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="font-serif font-bold text-sm text-stone-100 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-400 font-mono truncate">{currentUser.email}</p>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-800">
                        <span className={`px-1.5 py-0.5 text-[8.5px] font-mono font-extrabold uppercase border ${roleInfo.bg}`}>
                          {roleInfo.label}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: {currentUser.id.slice(-6)}
                        </span>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-2 divide-y divide-stone-100 text-xs font-sans">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            if (onNavigate) {
                              onNavigate(isStaff ? "/admin/dashboard" : "/student/dashboard");
                            } else {
                              setCurrentTab(isStaff ? "admin" : "dashboard");
                            }
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-medium transition cursor-pointer text-left"
                        >
                          <LayoutDashboard className="h-4 w-4 text-editorial-accent" />
                          <span>{isStaff ? (lang === "en" ? "Academy Command Center" : "অ্যাডমিন ড্যাশবোর্ড") : (lang === "en" ? "Student Portal Dashboard" : "শিক্ষার্থী ড্যাশবোর্ড")}</span>
                        </button>

                        {/* Switch portal for staff */}
                        {isStaff && (
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              if (onNavigate) {
                                onNavigate(currentTab === "admin" ? "/student/dashboard" : "/admin/dashboard");
                              } else {
                                setCurrentTab(currentTab === "admin" ? "dashboard" : "admin");
                              }
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-medium transition cursor-pointer text-left"
                          >
                            <Shield className="h-4 w-4 text-amber-600" />
                            <span>{currentTab === "admin" ? (lang === "en" ? "Switch to Student View" : "শিক্ষার্থী ভিউ") : (lang === "en" ? "Switch to Admin Panel" : "অ্যাডমিন প্যানেল")}</span>
                          </button>
                        )}

                        {/* Welcome email receipt */}
                        {onOpenWelcomeEmail && !isSuperAdmin && (
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              onOpenWelcomeEmail();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-medium transition cursor-pointer text-left"
                          >
                            <Mail className="h-4 w-4 text-stone-500" />
                            <span>{lang === "en" ? "Enrollment & Welcome Email" : "স্বাগতম ইমেইল রসিদ"}</span>
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onLogOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-bold transition cursor-pointer text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{lang === "en" ? "Log Out of Academy" : "লগ আউট"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 border border-stone-200 bg-white text-stone-900 hover:bg-stone-50 transition duration-200 shadow-xs cursor-pointer flex items-center justify-center"
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
            className="lg:hidden border-t border-stone-200 bg-[#FDFCF9] divide-y divide-stone-200/80 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-mob-${item.id}`}
                onClick={() => {
                  if (item.id === "courses" && onNavigate) {
                    onNavigate("/courses");
                  } else if (item.id === "culinary-ebook" && onNavigate) {
                    onNavigate("/culinary-ebook");
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
                    ? "bg-stone-100 text-editorial-accent"
                    : "text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-mono font-bold border border-amber-300">
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
