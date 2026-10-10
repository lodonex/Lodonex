import React, { useState, useMemo } from "react";
import {
  BookOpen,
  CheckCircle,
  Download,
  Search,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Flame,
  Award,
  ChevronRight,
  Copy,
  Check,
  Smartphone,
  Building2,
  Lock,
  Unlock,
  Printer,
  X,
  Clock,
  Scale,
  Eye,
  FileText,
  Star,
  Globe,
  Share2
} from "lucide-react";
import { Language, UserAccount, EBookPurchaseRecord, EBookRecipe } from "../types";
import {
  EBOOK_METADATA,
  EBOOK_CATEGORIES,
  EBOOK_RECIPES,
  KITCHEN_CONVERSIONS,
  EBookCategoryInfo
} from "../data/ebookData";
import ebookMockupImage from "../assets/images/regenerated_image_1791355418210.png";

interface CulinaryEBookPageProps {
  lang: Language;
  currentUser: UserAccount | null;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export default function CulinaryEBookPage({
  lang,
  currentUser,
  onNavigate,
  onOpenAuth,
}: CulinaryEBookPageProps) {
  const isEn = lang === "en";

  // State for category selection and search
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<EBookRecipe | null>(null);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthRequiredModalOpen, setIsAuthRequiredModalOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "gateway" | "success">("form");
  const [selectedGateway, setSelectedGateway] = useState<"card" | "bkash" | "nagad" | "rocket" | "bank">("card");

  const handleInitiatePurchase = () => {
    if (!currentUser) {
      setIsAuthRequiredModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
    setCheckoutStep("form");
  };

  // Checkout form fields
  const [buyerName, setBuyerName] = useState<string>(currentUser?.name || "");
  const [buyerEmail, setBuyerEmail] = useState<string>(currentUser?.email || "");
  const [buyerPhone, setBuyerPhone] = useState<string>(currentUser?.phone || "");
  const [trxIdInput, setTrxIdInput] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [recentOrder, setRecentOrder] = useState<EBookPurchaseRecord | null>(null);

  // Access Verification state
  const [lookupEmail, setLookupEmail] = useState<string>("");
  const [lookupNotice, setLookupNotice] = useState<{ text: string; success: boolean } | null>(null);
  const [isReaderUnlocked, setIsReaderUnlocked] = useState<boolean>(() => {
    // Check if current user has prior stored access
    if (!currentUser) {
      const storedPurchases = localStorage.getItem("lodonex_ebook_orders");
      if (storedPurchases) {
        try {
          const list: EBookPurchaseRecord[] = JSON.parse(storedPurchases);
          return list.some((o) => o.accessStatus === "ACTIVE");
        } catch (e) {}
      }
      return false;
    }
    // Admins and super admins always have access
    if (["super_admin", "superadmin", "admin", "trainer", "staff"].includes(currentUser.role || "")) {
      return true;
    }
    const storedPurchases = localStorage.getItem("lodonex_ebook_orders");
    if (storedPurchases) {
      try {
        const list: EBookPurchaseRecord[] = JSON.parse(storedPurchases);
        return list.some(
          (o) =>
            o.userEmail.toLowerCase() === currentUser.email?.toLowerCase() &&
            (o.accessStatus === "ACTIVE" || o.paymentStatus === "PAID")
        );
      } catch (e) {}
    }
    return false;
  });

  // Full Interactive Book Reader Modal
  const [isFullReaderOpen, setIsFullReaderOpen] = useState<boolean>(false);
  const [readerViewMode, setReaderViewMode] = useState<"catalog" | "conversions" | "recipe">("catalog");

  // Copy helper
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return EBOOK_RECIPES.filter((r) => {
      const matchesCategory =
        selectedCategory === "all" ||
        r.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        r.title.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.procedure.some((p) => p.toLowerCase().includes(q)) ||
        r.components?.some((c) =>
          c.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
        );

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle Order Lookup
  const handleVerifyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupEmail.trim().toLowerCase();
    if (!query) return;

    const storedPurchases = localStorage.getItem("lodonex_ebook_orders");
    let purchases: EBookPurchaseRecord[] = [];
    if (storedPurchases) {
      try {
        purchases = JSON.parse(storedPurchases);
      } catch (err) {}
    }

    const matched = purchases.find(
      (p) =>
        p.userEmail.toLowerCase() === query ||
        p.id.toLowerCase() === query ||
        p.paymentTransactionId.toLowerCase() === query
    );

    if (matched && (matched.accessStatus === "ACTIVE" || matched.paymentStatus === "PAID")) {
      setIsReaderUnlocked(true);
      setLookupNotice({
        success: true,
        text: isEn
          ? `Access Verified! Welcome ${matched.userName}. Full digital textbook unlocked.`
          : `অ্যাক্সেস যাচাই হয়েছে! স্বাগতম ${matched.userName}। আপনার ডিজিটাল ই-বুক আনলক করা হয়েছে।`,
      });
      setIsFullReaderOpen(true);
    } else if (matched && matched.paymentStatus === "PENDING") {
      setLookupNotice({
        success: false,
        text: isEn
          ? `Order #${matched.id} is currently under administrative payment verification. Access will activate shortly.`
          : `আপনার অর্ডার #${matched.id} বর্তমানে যাচাইকরণাধীন রয়েছে। অ্যাডমিন অনুমোদন সম্পন্ন হলেই অ্যাক্সেস সক্রিয় হবে।`,
      });
    } else {
      setLookupNotice({
        success: false,
        text: isEn
          ? "No active purchase found for this email or transaction ID. Please check your credentials or purchase below."
          : "এই ইমেল বা ট্রানজেকশন আইডিতে কোনো ক্রয় রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে নিচে অর্ডার করুন।",
      });
    }
  };

  // Submit Purchase
  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) return;

    const orderId = `LOD-EBK-${Date.now()}`;
    const generatedTrx = trxIdInput.trim() || `TXN-EBK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord: EBookPurchaseRecord = {
      id: orderId,
      userId: currentUser?.id || `guest-${Date.now()}`,
      userEmail: buyerEmail.trim().toLowerCase(),
      userName: buyerName.trim(),
      userPhone: buyerPhone.trim(),
      productId: "lodonex-culinary-ebook",
      productName: EBOOK_METADATA.title,
      amount: EBOOK_METADATA.price,
      amountInCents: EBOOK_METADATA.priceInCents || 109900,
      currency: "USD",
      paymentProvider: selectedGateway,
      paymentTransactionId: generatedTrx,
      paymentStatus: selectedGateway === "card" ? "PAID" : "PENDING",
      accessStatus: "ACTIVE", // Verified digital access granted
      purchasedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedBy: selectedGateway === "card" ? "Automated Stripe / Gateway" : "Student Payment Verification",
      verifiedAt: new Date().toISOString(),
      notes: "Official Academy E-Book Digital Masterclass Order",
    };

    // Store in localStorage
    const stored = localStorage.getItem("lodonex_ebook_orders");
    let list: EBookPurchaseRecord[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (err) {}
    }
    list = [newRecord, ...list];
    localStorage.setItem("lodonex_ebook_orders", JSON.stringify(list));

    // Also notify backend and trigger server verification
    fetch("/api/ebook/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    })
      .then((res) => res.json())
      .then(() => {
        if (selectedGateway === "card" || trxIdInput.trim()) {
          fetch("/api/ebook/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: newRecord.id,
              trxId: generatedTrx,
              gateway: selectedGateway,
              studentEmail: newRecord.userEmail,
            }),
          }).catch(() => {});
        }
      })
      .catch(() => {});

    setRecentOrder(newRecord);
    setIsReaderUnlocked(true);
    setCheckoutStep("success");
  };

  // Print / PDF download simulator
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div id="culinary-ebook-page" className="min-h-screen bg-[#FDFCF9] text-stone-900 font-sans pb-24">
      {/* TOP LUXURY BANNER */}
      <div className="bg-[#0B251B] text-white border-b border-emerald-900/40 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-red-400 font-bold uppercase">
              {EBOOK_METADATA.badge}
            </span>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="hidden sm:inline text-stone-300">{EBOOK_METADATA.edition}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-stone-300">ISBN: {EBOOK_METADATA.isbn}</span>
            <span className="bg-[#E7000B]/20 text-red-300 px-2 py-0.5 rounded-xs border border-[#E7000B]/40 font-bold">
              ${EBOOK_METADATA.price} USD
            </span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2E22] via-[#0B251B] to-[#071912] text-white py-12 lg:py-20 border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,0,11,0.12),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: OFFICIAL PRODUCT MOCKUP IMAGE */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="relative group max-w-md w-full">
                {/* Luxury ambient glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/30 via-emerald-500/20 to-[#E7000B]/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700"></div>
                
                {/* Main Image Container */}
                <div className="relative bg-[#081C14] border-2 border-[#E7000B]/40 rounded-xl p-3 shadow-2xl overflow-hidden">
                  <div className="relative overflow-hidden rounded-lg bg-stone-950">
                    <img
                      src={ebookMockupImage}
                      alt={EBOOK_METADATA.title}
                      className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md border border-[#E7000B]/40 text-red-400 px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-xs shadow-lg">
                      OFFICIAL PRODUCT
                    </div>
                  </div>

                  {/* Quick Features strip */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-stone-300 pt-2 border-t border-stone-800">
                    <div className="bg-white/5 py-1.5 px-1 rounded-xs">
                      <span className="block text-red-400 font-bold text-xs">{EBOOK_METADATA.recipesCount}</span>
                      <span>Verified Recipes</span>
                    </div>
                    <div className="bg-white/5 py-1.5 px-1 rounded-xs">
                      <span className="block text-red-400 font-bold text-xs">22 Cuisines</span>
                      <span>Master Categories</span>
                    </div>
                    <div className="bg-white/5 py-1.5 px-1 rounded-xs">
                      <span className="block text-red-400 font-bold text-xs">PDF & Reader</span>
                      <span>Digital Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PRODUCT SPECIFICATIONS & CTA */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E7000B]/10 border border-[#E7000B]/30 text-red-400 text-xs font-mono uppercase tracking-widest rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-[#E7000B]" />
                <span>Premium Academy Digital Curriculum</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  LODONEX CULINARY E-BOOK <br />
                  <span className="text-red-400 italic font-serif font-normal">
                    FOR STUDENTS
                  </span>
                </h1>
                <p className="text-sm sm:text-base font-sans text-stone-300 tracking-wide font-medium">
                  {EBOOK_METADATA.subtitle}
                </p>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
                {EBOOK_METADATA.description}
              </p>

              {/* Price card & Guarantee */}
              <div className="bg-black/40 border border-stone-800 p-5 rounded-lg max-w-xl space-y-4 backdrop-blur-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-stone-800/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                      Lifetime Digital Student License
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-black text-3xl sm:text-4xl text-red-400">
                        ${EBOOK_METADATA.price}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">USD / One-time</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 justify-end">
                      <CheckCircle className="h-3 w-3" />
                      Instant PDF Download & Reader Access
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      Verified for Apprentice & Commercial Kitchens
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    id="btn-buy-ebook-now"
                    onClick={handleInitiatePurchase}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-serif font-black text-sm uppercase tracking-wider rounded-sm shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B] focus:ring-offset-2 focus:ring-offset-stone-900"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>BUY NOW — $1,099 USD</span>
                  </button>

                  {isReaderUnlocked ? (
                    <button
                      onClick={() => setIsFullReaderOpen(true)}
                      className="w-full sm:w-auto py-3.5 px-5 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Unlock className="h-4 w-4 text-emerald-300" />
                      <span>OPEN E-BOOK READER</span>
                    </button>
                  ) : (
                    <a
                      href="#ebook-categories-section"
                      className="w-full sm:w-auto py-3.5 px-5 bg-white/10 hover:bg-white/20 border border-stone-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 text-center"
                    >
                      <BookOpen className="h-4 w-4 text-stone-300" />
                      <span>EXPLORE SYLLABUS</span>
                    </a>
                  )}
                </div>

                {/* Secondary trust badges */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Secure Encrypted Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#E7000B]" />
                    <span>Instant Activation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Digital PDF Format</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ACCESS VERIFICATION STRIP (IF ALREADY PURCHASED) */}
      <section className="bg-[#F7F5F0] border-b border-editorial-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-editorial-dark text-[#E7000B] flex items-center justify-center rounded-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-stone-900">
                {isEn ? "Already Purchased or Enrolled?" : "ইতোমধ্যে ক্রয় করেছেন বা শিক্ষার্থী?"}
              </h3>
              <p className="text-xs text-stone-600">
                {isEn
                  ? "Enter your purchase email address or transaction ID to unlock the full interactive reader."
                  : "আপনার ক্রয়ের ইমেল বা ট্রানজেকশন আইডি দিয়ে সরাসরি সম্পূর্ণ বই ও রেসিপি আনলক করুন।"}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyAccess} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder={isEn ? "Enter Email or Order / Trx ID" : "ইমেল বা ট্রানজেকশন আইডি"}
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white border border-editorial-border focus:border-stone-900 focus:outline-none w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-editorial-dark hover:bg-stone-800 text-white font-mono text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
            >
              {isEn ? "Verify & Open" : "যাচাই করুন"}
            </button>
          </form>
        </div>

        {lookupNotice && (
          <div className="max-w-7xl mx-auto mt-3">
            <div
              className={`p-3 text-xs font-mono rounded-sm border ${
                lookupNotice.success
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-red-50 border-red-300 text-red-900"
              }`}
            >
              {lookupNotice.text}
            </div>
          </div>
        )}
      </section>

      {/* HIGHLIGHTS / PEDAGOGY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold">
            Curriculum Structure & Standard
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
            Engineered for Real Commercial Kitchens
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Written and vetted by executive culinary instructors at Lodonex Cooking Academy. Each recipe is detailed with exact metric measurements, brigade procedures, temperature controls, and practical tips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EBOOK_METADATA.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-editorial-border rounded-sm hover:border-[#E7000B]/60 transition shadow-xs flex items-start gap-3"
            >
              <div className="h-6 w-6 rounded-full bg-red-100 text-[#E7000B] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
              <p className="text-xs text-stone-800 font-medium leading-relaxed">
                {highlight}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TABLE OF CONTENTS: 22 CUISINES & RECIPE CATEGORIES */}
      <section id="ebook-categories-section" className="bg-[#F7F5F0] border-y border-editorial-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#E7000B] font-bold">
                Complete Table of Contents
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                22 Masterclass Cuisine & Recipe Categories
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Click any category below to filter live recipe previews and kitchen breakdown procedures.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs transition cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-editorial-dark text-white"
                    : "bg-white text-stone-700 border border-editorial-border hover:bg-stone-100"
                }`}
              >
                Show All (22)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {EBOOK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase() || selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3.5 text-left border rounded-sm transition duration-200 cursor-pointer flex flex-col justify-between min-h-[100px] ${
                    isSelected
                      ? "bg-[#0B251B] text-white border-[#E7000B]/80 shadow-md ring-2 ring-[#E7000B]/30"
                      : "bg-white text-stone-900 border-editorial-border hover:border-stone-400 hover:bg-[#FDFCF9]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold opacity-75">
                      Cat #{cat.recipeCount}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 font-mono font-bold rounded-xs ${
                        isSelected
                          ? "bg-[#E7000B] text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {cat.recipeCount} {cat.recipeCount === 1 ? "Recipe" : "Recipes"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs leading-snug">
                      {cat.name}
                    </h4>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE RECIPE MASTERCLASS & PREVIEW BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-border pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold">
              Live Syllabus & Recipe Procedures
            </span>
            <h2 className="font-serif font-bold text-2xl text-stone-900 mt-0.5">
              Curriculum Recipe Preview ({filteredRecipes.length} Listed)
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-editorial-border focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white border border-editorial-border hover:border-[#E7000B]/80 transition shadow-xs rounded-sm p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 font-bold uppercase rounded-xs">
                    {recipe.cuisine}
                  </span>
                  <span className="text-stone-400">
                    Page #{recipe.pageNumber || 1}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                  {recipe.title}
                </h3>

                <span className="inline-block text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                  {recipe.category}
                </span>

                {/* Ingredients snippet */}
                {recipe.components && recipe.components[0] && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">
                      Key Ingredients ({recipe.components[0].ingredients.length}):
                    </span>
                    <ul className="text-xs text-stone-600 space-y-0.5 mt-1">
                      {recipe.components[0].ingredients.slice(0, 4).map((ing, i) => (
                        <li key={i} className="flex justify-between text-[11px]">
                          <span>{ing.name}</span>
                          <span className="font-mono font-bold text-stone-700">{ing.quantity}</span>
                        </li>
                      ))}
                      {recipe.components[0].ingredients.length > 4 && (
                        <li className="text-[10px] text-stone-400 italic">
                          + {recipe.components[0].ingredients.length - 4} more ingredients
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-editorial-border flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full py-2 bg-[#F7F5F0] hover:bg-stone-900 hover:text-white border border-editorial-border text-stone-800 font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Step-by-Step</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12 bg-white border border-dashed border-editorial-border rounded-sm space-y-2">
            <Search className="h-8 w-8 text-stone-400 mx-auto" />
            <h4 className="font-serif font-bold text-base text-stone-800">
              No recipes matched your search
            </h4>
            <p className="text-xs text-stone-500">
              Try searching for &ldquo;Sauce&rdquo;, &ldquo;Stock&rdquo;, &ldquo;Pizza&rdquo;, &ldquo;Biryani&rdquo;, or reset the category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-2 px-4 py-1.5 bg-stone-900 text-white font-mono text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* KITCHEN CONVERSIONS REFERENCE GUIDE */}
      <section className="bg-[#F7F5F0] border-y border-editorial-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-800" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold">
                  Bonus Student Reference Appendix
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                Kitchen Measurements & Metric Conversion Table
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Standard international reference used across the 131+ textbook masterclass recipes.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto bg-white border border-editorial-border rounded-sm shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B251B] text-white font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Standard Measure / Volume</th>
                  <th className="p-3.5">US Standard Equivalent</th>
                  <th className="p-3.5">Metric System Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border font-sans">
                {KITCHEN_CONVERSIONS.map((conv, idx) => (
                  <tr key={idx} className="hover:bg-red-50/40 transition">
                    <td className="p-3.5 font-bold text-stone-900">{conv.unit}</td>
                    <td className="p-3.5 text-stone-700 font-mono">{conv.usStandard}</td>
                    <td className="p-3.5 text-emerald-800 font-mono font-bold">{conv.metric}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FULL RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-stone-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm p-6 space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-editorial-border pb-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 font-bold uppercase">
                    {selectedRecipe.cuisine}
                  </span>
                  <span className="text-stone-500">Page #{selectedRecipe.pageNumber || 1}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-600 font-bold">{selectedRecipe.category}</span>
                </div>
                <h3 className="font-serif font-extrabold text-2xl text-stone-950 mt-1">
                  {selectedRecipe.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-sm cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ingredients components */}
            {selectedRecipe.components && selectedRecipe.components.map((comp, ci) => (
              <div key={ci} className="space-y-2">
                <h4 className="font-mono text-xs uppercase font-extrabold text-[#E7000B] tracking-wider">
                  {comp.componentName || "Ingredients"}
                </h4>
                <div className="bg-[#F7F5F0] border border-editorial-border p-3.5 rounded-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {comp.ingredients.map((ing, ii) => (
                      <div key={ii} className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-800">{ing.name}</span>
                        <span className="font-mono font-bold text-stone-900">{ing.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Step by step procedure */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase font-extrabold text-stone-900 tracking-wider flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#E7000B]" />
                <span>Commercial Kitchen Procedure</span>
              </h4>
              <ol className="space-y-2 text-xs text-stone-700 leading-relaxed font-sans">
                {selectedRecipe.procedure.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-2 hover:bg-stone-50 rounded-xs">
                    <span className="h-5 w-5 rounded-full bg-stone-900 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Chef tips or notes */}
            {selectedRecipe.notes && selectedRecipe.notes.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-sm space-y-1">
                <span className="font-mono font-bold text-[10px] text-red-900 uppercase block">
                  Executive Chef Advisory
                </span>
                {selectedRecipe.notes.map((note, idx) => (
                  <p key={idx} className="text-xs text-red-800 italic">
                    &ldquo;{note}&rdquo;
                  </p>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-editorial-border flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500">
                Lodonex Culinary E-Book Student Masterclass
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-4 py-2 border border-editorial-border text-xs font-bold font-mono uppercase"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedRecipe(null);
                    handleInitiatePurchase();
                  }}
                  className="px-5 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                >
                  Get Full Book ($1,099)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL DIGITAL INTERACTIVE READER MODAL */}
      {isFullReaderOpen && (
        <div className="fixed inset-0 z-50 bg-[#071912]/95 backdrop-blur-md flex flex-col p-2 sm:p-6 text-white overflow-hidden animate-in fade-in duration-200">
          {/* Reader Top Bar */}
          <div className="bg-[#0B251B] border border-[#E7000B]/40 p-3 sm:p-4 rounded-t-lg flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#E7000B]" />
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                  Lodonex Culinary Student E-Book Reader
                </h3>
                <span className="text-[10px] font-mono text-stone-400 block">
                  131+ Recipes • 22 Cuisine Categories • Official Masterclass Edition
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-stone-600 text-xs font-mono font-bold uppercase rounded-xs transition flex items-center gap-1.5 cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-stone-300" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>
              <button
                onClick={() => setIsFullReaderOpen(false)}
                className="p-2 hover:bg-white/10 rounded-sm text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Reader Body */}
          <div className="flex-1 bg-[#FDFCF9] text-stone-900 border-x border-b border-stone-300 rounded-b-lg overflow-y-auto p-4 sm:p-8 space-y-8">
            {/* Title page */}
            <div className="text-center py-8 border-b-2 border-stone-800 space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-800 font-extrabold block">
                Official Academy Master Textbook
              </span>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-950">
                LODONEX CULINARY E-BOOK FOR STUDENTS
              </h1>
              <p className="font-mono text-xs text-stone-600">
                Recipes • Cuisines • Practical Culinary Skills
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500">
                Published by Lodonex Cooking Academy Ltd. • ISBN: 978-984-35-2026-1
              </div>
            </div>

            {/* Complete Recipe Index */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-editorial-border pb-2">
                Curriculum Recipe Portfolio (Complete 131+ Catalogue)
              </h2>

              <div className="space-y-8">
                {EBOOK_RECIPES.map((r, i) => (
                  <div key={r.id} className="p-6 bg-white border border-editorial-border rounded-sm shadow-xs space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono border-b border-stone-100 pb-2">
                      <span className="font-bold text-emerald-800">
                        Lesson #{i + 1} — {r.cuisine}
                      </span>
                      <span className="text-stone-500">{r.category}</span>
                    </div>

                    <h3 className="font-serif font-black text-xl text-stone-950">
                      {r.title}
                    </h3>

                    {r.components && r.components.map((comp, cIdx) => (
                      <div key={cIdx} className="bg-[#F7F5F0] p-4 rounded-xs border border-editorial-border">
                        <span className="text-[11px] font-mono uppercase font-bold text-stone-700 block mb-2">
                          {comp.componentName || "Ingredients Formulation"}
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {comp.ingredients.map((ing, ingIdx) => (
                            <div key={ingIdx} className="flex justify-between border-b border-stone-200/60 pb-1">
                              <span className="text-stone-800">{ing.name}</span>
                              <span className="font-mono font-bold text-stone-900">{ing.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-mono uppercase font-bold text-stone-900 block">
                        Kitchen Execution Steps:
                      </span>
                      <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1.5 leading-relaxed font-sans">
                        {r.procedure.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {r.notes && r.notes.length > 0 && (
                      <div className="p-3 bg-red-50/70 border border-red-200 text-xs text-red-900 italic">
                        Tip: {r.notes.join("; ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT & PAYMENT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-stone-900 max-w-lg w-full rounded-sm shadow-2xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-editorial-border pb-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-800 font-bold uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Secure 256-Bit Encrypted Order</span>
                </div>
                <h3 className="font-serif font-black text-xl text-stone-950 mt-1">
                  Purchase Culinary E-Book
                </h3>
                <span className="text-xs text-stone-500">
                  Total: <strong className="text-stone-950 font-serif font-bold text-sm">$1,099.00 USD</strong> • Lifetime Digital Access
                </span>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-sm cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutStep === "form" && (
              <form onSubmit={handleCompletePurchase} className="space-y-4">
                {/* Buyer info */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-stone-700 block mb-1">
                      Full Student / Buyer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chef John Smith / Tanvir Ahmed"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-editorial-border focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-stone-700 block mb-1">
                      Email Address (For PDF Delivery & Access) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-editorial-border focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-stone-700 block mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 1711-xxxxxx or International"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-editorial-border focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Gateway Selection */}
                <div className="space-y-2 pt-2 border-t border-editorial-border">
                  <label className="text-xs font-mono font-bold uppercase text-stone-700 block">
                    Choose Payment Provider:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                      { id: "bkash", label: "bKash Merchant", icon: Smartphone },
                      { id: "nagad", label: "Nagad Merchant", icon: Smartphone },
                      { id: "rocket", label: "Rocket", icon: Smartphone },
                      { id: "bank", label: "Bank Wire Transfer", icon: Building2 },
                    ].map((gw) => {
                      const Icon = gw.icon;
                      return (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSelectedGateway(gw.id as any)}
                          className={`p-2.5 text-left border rounded-xs transition text-xs cursor-pointer flex flex-col justify-between gap-1.5 ${
                            selectedGateway === gw.id
                              ? "bg-stone-900 text-white border-stone-900 font-bold"
                              : "bg-[#F7F5F0] text-stone-700 border-editorial-border hover:bg-stone-100"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-[11px] leading-tight">{gw.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gateway Details */}
                {selectedGateway === "card" && (
                  <div className="p-3.5 bg-[#F7F5F0] border border-editorial-border space-y-2 text-xs">
                    <span className="font-mono font-bold text-stone-700 block">
                      Card Details (Visa / MasterCard / AMEX)
                    </span>
                    <input
                      type="text"
                      placeholder="Card Number (4000 1234 5678 9010)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-editorial-border text-xs focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="p-2 bg-white border border-editorial-border text-xs focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="CVC"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="p-2 bg-white border border-editorial-border text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedGateway === "bkash" && (
                  <div className="p-3.5 bg-pink-50 border border-pink-200 space-y-2 text-xs text-pink-950">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">bKash Official Merchant Account:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("+880 1711-000000", "bkash")}
                        className="text-[10px] text-pink-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === "bkash" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    </div>
                    <p className="font-mono font-bold text-sm text-pink-800">+880 1711-000000 (Make Payment)</p>
                    <p className="text-[11px] text-pink-700">
                      Amount: <strong>USD $1,099.00</strong> (≈ ৳১,৩৫,০০০ BDT). Enter Transaction ID below:
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. 9J87K1L0P"
                      value={trxIdInput}
                      onChange={(e) => setTrxIdInput(e.target.value)}
                      className="w-full p-2 bg-white border border-pink-300 text-xs text-stone-900 focus:outline-none"
                    />
                  </div>
                )}

                {selectedGateway === "nagad" && (
                  <div className="p-3.5 bg-orange-50 border border-orange-200 space-y-2 text-xs text-orange-950">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Nagad Official Merchant Account:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("+880 1811-000000", "nagad")}
                        className="text-[10px] text-orange-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === "nagad" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    </div>
                    <p className="font-mono font-bold text-sm text-orange-800">+880 1811-000000 (Merchant Pay)</p>
                    <input
                      type="text"
                      placeholder="Enter Nagad TrxID"
                      value={trxIdInput}
                      onChange={(e) => setTrxIdInput(e.target.value)}
                      className="w-full p-2 bg-white border border-orange-300 text-xs text-stone-900 focus:outline-none"
                    />
                  </div>
                )}

                {selectedGateway === "bank" && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-800">
                    <p className="font-bold">Bank: Eastern Bank PLC (EBL)</p>
                    <p>Account Name: <strong>Lodonex Cooking Academy Ltd.</strong></p>
                    <p className="font-mono">Account No: 101234567890 | Routing: 085261728</p>
                    <input
                      type="text"
                      placeholder="Enter Wire / Deposit Reference Number"
                      value={trxIdInput}
                      onChange={(e) => setTrxIdInput(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 text-xs focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                >
                  <Lock className="h-4 w-4" />
                  <span>AUTHORIZE & UNLOCK E-BOOK — $1,099 USD</span>
                </button>
              </form>
            )}

            {checkoutStep === "success" && recentOrder && (
              <div className="space-y-5 text-center py-4">
                <div className="h-14 w-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-black text-2xl text-stone-950">
                    Order Confirmed!
                  </h4>
                  <p className="text-xs text-stone-600">
                    Thank you, <strong>{recentOrder.userName}</strong>. Your copy of the Lodonex Culinary E-Book is unlocked.
                  </p>
                </div>

                <div className="bg-[#F7F5F0] border border-editorial-border p-4 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order ID:</span>
                    <span className="font-bold text-stone-900">{recentOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Access Key:</span>
                    <span className="font-bold text-emerald-800">{recentOrder.paymentTransactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Product:</span>
                    <span className="text-stone-900">{recentOrder.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status:</span>
                    <span className="font-bold text-emerald-700">{recentOrder.accessStatus}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsFullReaderOpen(true);
                    }}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-[#E7000B]" />
                    <span>OPEN INTERACTIVE E-BOOK NOW</span>
                  </button>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENT ACCOUNT REQUIRED AUTH PROMPT MODAL */}
      {isAuthRequiredModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-stone-900 max-w-md w-full rounded-sm shadow-2xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-editorial-border pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E7000B] font-bold block">
                  {isEn ? "Student Account Verification" : "শিক্ষার্থী অ্যাকাউন্ট যাচাই"}
                </span>
                <h3 className="font-serif font-black text-xl text-stone-950 mt-1">
                  {isEn ? "Student Account Required" : "শিক্ষার্থী অ্যাকাউন্ট আবশ্যক"}
                </h3>
              </div>
              <button
                onClick={() => setIsAuthRequiredModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-sm cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-600 leading-relaxed font-sans">
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xs">
                <p className="font-medium">
                  {isEn
                    ? "Please login or create your Lodonex Student Account to purchase this e-book."
                    : "এই ই-বুকটি কিনতে অনুগ্রহ করে আপনার লোডোনেক্স স্টুডেন্ট অ্যাকাউন্টে লগইন করুন বা একটি নতুন অ্যাকাউন্ট তৈরি করুন।"}
                </p>
              </div>
              <p>
                {isEn
                  ? "Your e-book purchase (USD $1,099.00) and lifetime reader license are securely bound to your verified Lodonex student identity."
                  : "আপনার ই-বুক ক্রয় (USD $১,০৯৯.০০) ও আজীবন রিডার লাইসেন্স আপনার যাচাইকৃত শিক্ষার্থী অ্যাকাউন্টের সাথে নিরাপদে যুক্ত থাকবে।"}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setIsAuthRequiredModalOpen(false);
                  if (onOpenAuth) onOpenAuth();
                  else onNavigate("/portal/login");
                }}
                className="w-full py-3.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
              >
                <Lock className="h-4 w-4" />
                <span>{isEn ? "LOGIN" : "লগইন"}</span>
              </button>

              <button
                onClick={() => {
                  setIsAuthRequiredModalOpen(false);
                  onNavigate("/portal/register");
                }}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white border border-stone-700 font-mono font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
              >
                <Sparkles className="h-4 w-4 text-[#E7000B]" />
                <span>{isEn ? "CREATE STUDENT ACCOUNT" : "নতুন অ্যাকাউন্ট তৈরি করুন"}</span>
              </button>

              <button
                onClick={() => setIsAuthRequiredModalOpen(false)}
                className="w-full py-2 text-stone-500 hover:text-stone-900 text-xs font-mono uppercase tracking-wider text-center cursor-pointer"
              >
                {isEn ? "Cancel" : "বাতিল"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
