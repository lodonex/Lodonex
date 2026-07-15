import React, { useState } from "react";
import { X, Trash, CreditCard, ShieldCheck, CheckCircle, Smartphone, Key, Lock, ArrowLeft, User } from "lucide-react";
import { Language, Course } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "../utils/price";

interface PaymentModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  cart: Course[];
  onRemoveFromCart: (courseId: string) => void;
  onPaymentSuccess: (purchasedCourses: Course[]) => void;
}

export default function PaymentModal({
  lang,
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onPaymentSuccess,
}: PaymentModalProps) {
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState<"cart" | "gateway" | "otp" | "success">("cart");
  const [selectedGateway, setSelectedGateway] = useState<"bkash" | "nagad" | "rocket" | "card">("bkash");

  // Branded Input simulations
  const [accountNumber, setAccountNumber] = useState("");
  const [securePin, setSecurePin] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [simulatedOTP, setSimulatedOTP] = useState("");
  const [userOTPInput, setUserOTPInput] = useState("");
  const [errorText, setErrorText] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const getCardType = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(clean)) return "mastercard";
    if (/^3[47]/.test(clean)) return "amex";
    return "unknown";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setAccountNumber(parts.join(" "));
    } else {
      setAccountNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
      setCardExpiry(`${value.substring(0, 2)}/${value.substring(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCardCvc(value);
  };

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setStep("gateway");
    setErrorText("");
  };

  const handleProcessGateway = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGateway === "card") {
      if (!accountNumber.trim() || !cardHolder.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        setErrorText(lang === "en" ? "Please fill in all card details." : "দয়া করে সবগুলো কার্ডের তথ্য পূরণ করুন।");
        return;
      }
      const cleanNum = accountNumber.replace(/\s+/g, "");
      if (cleanNum.length < 13 || cleanNum.length > 19) {
        setErrorText(lang === "en" ? "Invalid Card Number." : "ভুল কার্ড নম্বর।");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setErrorText(lang === "en" ? "Invalid Expiry Date (MM/YY)." : "ভুল মেয়াদোত্তীর্ণের তারিখ (MM/YY)।");
        return;
      }
      if (cardCvc.length < 3) {
        setErrorText(lang === "en" ? "Invalid CVC/CVV." : "ভুল CVC/CVV কোড।");
        return;
      }
    } else {
      if (!accountNumber.trim() || !securePin.trim()) {
        setErrorText(lang === "en" ? "Please fill in all security fields." : "দয়া করে সবগুলো নিরাপত্তা ঘর পূরণ করুন।");
        return;
      }
    }

    // Generate a random 6 digit OTP for simulation
    const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOTP(randomOTP);
    setStep("otp");
    setErrorText("");
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (userOTPInput !== simulatedOTP) {
      setErrorText(lang === "en" ? "Incorrect OTP. Try typing the simulated code displayed above!" : "ভুল ওটিপি। উপরে প্রদর্শিত সিমুলেটেড কোডটি টাইপ করুন!");
      return;
    }

    // Success
    setStep("success");
    setTimeout(() => {
      onPaymentSuccess(cart);
      // reset states
      setStep("cart");
      setAccountNumber("");
      setSecurePin("");
      setCardHolder("");
      setCardExpiry("");
      setCardCvc("");
      setSimulatedOTP("");
      setUserOTPInput("");
      onClose();
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div id="checkout-payment-overlay" className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      {/* Sidebar Cart / Payment drawer with sharp corners */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between rounded-none border-l border-editorial-border"
      >
        {/* Header with clean uppercase text */}
        <div className="p-5 border-b border-editorial-border flex items-center justify-between flex-shrink-0 bg-[#1A1A1A] text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-editorial-accent" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold font-sans">
              {step === "cart" ? t.shoppingCart : t.checkout}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-none hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Body content based on step */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-left">
          {step === "cart" && (
            <div id="payment-step-cart" className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-4 font-sans">
                  <div className="h-16 w-16 bg-[#F7F5F0] border border-editorial-border rounded-none flex items-center justify-center text-editorial-accent mx-auto">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    {t.cartEmpty}
                  </p>
                </div>
              ) : (
                <>
                  <div id="cart-items-list" className="space-y-3 font-sans">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        id={`cart-item-${item.id}`}
                        className="p-3 rounded-none border border-editorial-border bg-[#F7F5F0] flex items-center gap-3 justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.image} alt={item.titleEn} className="h-12 w-12 rounded-none object-cover flex-shrink-0 border border-editorial-border" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-editorial-dark truncate">
                              {lang === "en" ? item.titleEn : item.titleBn}
                            </h4>
                            <span className="text-[10px] text-slate-400 block mt-0.5 uppercase tracking-wider">{item.tutor}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold font-mono text-editorial-dark">
                            {formatPrice(item.price, lang)}
                          </span>
                          <button
                            id={`remove-cart-btn-${item.id}`}
                            onClick={() => onRemoveFromCart(item.id)}
                            className="p-1.5 text-slate-400 hover:text-editorial-accent transition cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-editorial-border pt-4 space-y-1 text-right font-sans">
                    <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">{t.subtotal}</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-editorial-dark block italic">
                      {formatPrice(subtotal, lang)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "gateway" && (
            <div id="payment-step-gateway" className="space-y-5">
              <button
                onClick={() => setStep("cart")}
                className="flex items-center gap-1.5 text-slate-500 hover:text-editorial-dark text-xs font-bold uppercase tracking-widest transition mb-2 cursor-pointer font-sans"
              >
                <ArrowLeft className="h-4 w-4" />
                {lang === "en" ? "Back to Cart" : "কার্টে ফিরে যান"}
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.selectPaymentMethod}
                </span>

                {/* Branded Gateway Selector Grid with Editorial Borders */}
                <div className="grid grid-cols-2 gap-2 font-sans">
                  {[
                    { id: "bkash", name: t.paymentOptions.bkash, color: "bg-[#e2125f]" },
                    { id: "nagad", name: t.paymentOptions.nagad, color: "bg-[#f15a22]" },
                    { id: "rocket", name: t.paymentOptions.rocket, color: "bg-[#8c2e8c]" },
                    { id: "card", name: t.paymentOptions.visa, color: "bg-[#1A1A1A]" },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      id={`gateway-select-${gw.id}`}
                      onClick={() => {
                        setSelectedGateway(gw.id as any);
                        setErrorText("");
                      }}
                      className={`p-3 rounded-none border text-left font-bold transition flex flex-col justify-between h-20 cursor-pointer ${
                        selectedGateway === gw.id
                          ? "border-editorial-dark bg-[#F7F5F0] text-editorial-accent"
                          : "border-editorial-border bg-white text-slate-800"
                      }`}
                    >
                      <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400">SECURE SYSTEM</span>
                      <span className="text-xs uppercase tracking-wider">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secure simulated payment input fields with paper feel */}
              <form onSubmit={handleProcessGateway} className="space-y-4 pt-2 font-sans">
                {selectedGateway === "card" && (
                  <div className="relative h-36 w-full rounded-lg bg-gradient-to-br from-slate-900 via-zinc-800 to-stone-900 text-white p-4 flex flex-col justify-between shadow-md border border-zinc-700 font-mono select-none overflow-hidden mb-3">
                    {/* Abstract background graphics to make it look hyper-realistic and beautiful */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-editorial-accent/10 rounded-full blur-xl pointer-events-none" />
                    
                    {/* Top Row: Chip and Card Brand Logo */}
                    <div className="flex justify-between items-center z-10">
                      {/* Simulated Gold Card Chip */}
                      <div className="w-9 h-7 rounded bg-gradient-to-tr from-[#e5c158] via-[#ffd700] to-[#f9e8a2] relative overflow-hidden shadow-inner border border-yellow-600/30">
                        <div className="absolute inset-x-2 top-0 bottom-0 border-x border-yellow-700/20" />
                        <div className="absolute inset-y-1.5 left-0 right-0 border-y border-yellow-700/20" />
                      </div>
                      
                      {/* Dynamic Card Brand */}
                      <div className="flex items-center">
                        {getCardType(accountNumber) === "visa" && (
                          <span className="text-sm font-black italic tracking-widest text-[#F5F2EB] drop-shadow-xs">VISA</span>
                        )}
                        {getCardType(accountNumber) === "mastercard" && (
                          <div className="flex -space-x-1.5 items-center">
                            <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                            <div className="w-5 h-5 rounded-full bg-amber-500 opacity-90" />
                          </div>
                        )}
                        {getCardType(accountNumber) === "amex" && (
                          <span className="text-xs font-bold tracking-widest bg-blue-600 px-1 py-0.5 rounded text-white font-sans">AMEX</span>
                        )}
                        {getCardType(accountNumber) === "unknown" && (
                          <CreditCard className="h-5 w-5 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Card Number */}
                    <div className="text-base tracking-[0.18em] font-medium text-zinc-100 z-10 drop-shadow-sm min-h-[24px]">
                      {accountNumber || "•••• •••• •••• ••••"}
                    </div>

                    {/* Bottom Row: Card Holder & Expiry */}
                    <div className="flex justify-between items-end z-10">
                      <div className="max-w-[70%] truncate">
                        <span className="text-[7px] uppercase tracking-wider text-zinc-400 block mb-0.5">Cardholder Name</span>
                        <span className="text-[10px] uppercase tracking-wide text-zinc-200 block truncate font-sans">
                          {cardHolder || "YOUR NAME"}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 font-sans">
                        <span className="text-[7px] uppercase tracking-wider text-zinc-400 block mb-0.5">Expires</span>
                        <span className="text-[10px] text-zinc-200 block">
                          {cardExpiry || "MM/YY"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-none border border-editorial-border bg-[#F7F5F0]">
                  <span className="text-[9px] font-bold block uppercase tracking-widest text-slate-400 mb-3">
                    {selectedGateway.toUpperCase()} SECURE PORTAL
                  </span>

                  <div className="space-y-3.5 text-xs">
                    {selectedGateway === "card" ? (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                            {lang === "en" ? "Cardholder Name" : "কার্ডধারীর নাম"} *
                          </label>
                          <div className="relative">
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. TASNIM AHMED"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                              className="w-full pl-9 pr-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                            {lang === "en" ? "Card Number" : "কার্ড নম্বর"} *
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="4111 2222 3333 4444"
                              value={accountNumber}
                              onChange={handleCardNumberChange}
                              className="w-full pl-9 pr-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                              {lang === "en" ? "Expiration Date" : "মেয়াদোত্তীর্ণের তারিখ"} *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              className="w-full px-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                              {lang === "en" ? "CVC / CVV" : "সিভিসি / সিভিভি"} *
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                              <input
                                type="password"
                                required
                                placeholder="•••"
                                maxLength={4}
                                value={cardCvc}
                                onChange={handleCvcChange}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                            {t.enterNumber} *
                          </label>
                          <div className="relative">
                            <Smartphone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="01712345678"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                            {t.enterPin} *
                          </label>
                          <div className="relative">
                            <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="password"
                              required
                              placeholder="••••"
                              maxLength={4}
                              value={securePin}
                              onChange={(e) => setSecurePin(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {errorText && (
                  <p className="text-xs text-red-700 font-bold bg-red-50 p-2.5 rounded-none border border-red-200">
                    {errorText}
                  </p>
                )}

                <button
                  id="checkout-pay-now-btn"
                  type="submit"
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-red-600 text-white rounded-none text-xs font-bold uppercase tracking-widest shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="h-4 w-4 text-editorial-accent" />
                  {t.payNow} ({formatPrice(subtotal, lang)})
                </button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div id="payment-step-otp" className="space-y-5 text-center font-sans">
              {/* Simulated SMS Alert overlay - Red/Cream Editorial style */}
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-left text-red-800 space-y-1">
                <p className="font-bold uppercase tracking-widest text-[9px] text-editorial-accent">SIMULATED SECURE CODE</p>
                <p className="font-bold">
                  {lang === "en"
                    ? `Verification PIN: ${simulatedOTP}`
                    : `ভেরিফিকেশন কোড: ${simulatedOTP}`}
                </p>
              </div>

              <div className="space-y-2 max-w-xs mx-auto pt-2 text-center">
                <Smartphone className="h-8 w-8 text-editorial-accent mx-auto" />
                <h4 className="font-serif font-bold text-editorial-dark text-base sm:text-lg italic">{t.otpHeading}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t.enterOtp}</p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4 max-w-xs mx-auto">
                <input
                  id="otp-input-field"
                  type="text"
                  required
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={userOTPInput}
                  onChange={(e) => setUserOTPInput(e.target.value)}
                  className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold py-2.5 bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:border-editorial-dark text-slate-950"
                />

                {errorText && (
                  <p className="text-xs text-red-700 font-bold bg-red-50 p-2 rounded-none border border-red-200">
                    {errorText}
                  </p>
                )}

                <button
                  id="verify-pay-otp-btn"
                  type="submit"
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-slate-800 text-white rounded-none text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                >
                  {t.verifyAndPay}
                </button>
              </form>
            </div>
          )}

          {step === "success" && (
            <div id="payment-step-success" className="text-center py-8 space-y-4 font-sans">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-none">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="space-y-1.5 text-center">
                <h4 className="font-serif font-bold text-editorial-dark text-lg italic">
                  {lang === "en" ? "Transaction Verified!" : "পেমেন্ট সফল হয়েছে!"}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {t.paymentSuccess}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Drawer Action Footer */}
        {step === "cart" && cart.length > 0 && (
          <div className="p-5 border-t border-editorial-border space-y-3 bg-[#F7F5F0] flex-shrink-0 text-left font-sans">
            <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-slate-500">
              <span>Total Fees</span>
              <span className="text-[#1A1A1A] font-mono text-sm">{formatPrice(subtotal, lang)}</span>
            </div>
            <button
              id="proceed-checkout-btn"
              onClick={handleStartCheckout}
              className="w-full py-3 bg-[#1A1A1A] hover:bg-red-600 text-white rounded-none text-xs font-bold uppercase tracking-widest shadow transition text-center cursor-pointer"
            >
              {t.checkout}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
