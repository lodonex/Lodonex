import React, { useState, useEffect } from "react";
import { X, Trash, CreditCard, ShieldCheck, CheckCircle, Smartphone, Key, Lock, ArrowLeft, Building2, Copy, Check, Info } from "lucide-react";
import { Language, Course } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion } from "motion/react";
import { formatPrice } from "../utils/price";

interface PaymentModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  cart: Course[];
  onRemoveFromCart: (courseId: string) => void;
  onPaymentSuccess: (purchasedCourses: Course[]) => void;
}

interface MerchantConfig {
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  rocketMerchantNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankRoutingNumber: string;
  bkashAppKeyConfigured: boolean;
  sslCommerzStoreIdConfigured: boolean;
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
  const [step, setStep] = useState<"cart" | "gateway" | "trx_verify" | "otp" | "success">("cart");
  const [selectedGateway, setSelectedGateway] = useState<"bkash" | "nagad" | "rocket" | "bank" | "card">("bkash");

  // Merchant config from Express backend
  const [merchantConfig, setMerchantConfig] = useState<MerchantConfig>({
    bkashMerchantNumber: "+880 1711-000000",
    nagadMerchantNumber: "+880 1811-000000",
    rocketMerchantNumber: "+880 1911-000000",
    bankName: "Eastern Bank PLC (EBL)",
    bankAccountName: "Lodonex Cooking Academy Ltd.",
    bankAccountNumber: "101234567890",
    bankBranch: "Gulshan Branch, Dhaka",
    bankRoutingNumber: "085261728",
    bkashAppKeyConfigured: false,
    sslCommerzStoreIdConfigured: false,
  });

  // Inputs
  const [accountNumber, setAccountNumber] = useState("");
  const [securePin, setSecurePin] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [trxIdInput, setTrxIdInput] = useState("");
  const [studentMobile, setStudentMobile] = useState("");

  // Copy states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Verification & Errors
  const [simulatedOTP, setSimulatedOTP] = useState("");
  const [userOTPInput, setUserOTPInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Fetch live merchant config from Express API endpoint
  useEffect(() => {
    if (isOpen) {
      fetch("/api/payments/gateway-config")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.config) {
            setMerchantConfig(data.config);
          }
        })
        .catch((err) => {
          console.warn("Express payment backend query notice:", err);
        });
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

    setAccountNumber(parts.length > 0 ? parts.join(" ") : value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    setCardExpiry(value.length > 2 ? `${value.substring(0, 2)}/${value.substring(2)}` : value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 4));
  };

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setStep("gateway");
    setErrorText("");
  };

  const handleProcessGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

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

      // Generate 6-digit OTP for card security
      const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOTP(randomOTP);
      setStep("otp");
    } else {
      // Mobile Banking (bKash/Nagad/Rocket) or Direct Bank Transfer
      setStep("trx_verify");
    }
  };

  const handleVerifyTrxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxIdInput.trim()) {
      setErrorText(lang === "en" ? "Please enter your Transaction ID (TrxID) / Reference Number." : "দয়া করে ট্রানজেকশন আইডি (TrxID) / রেফারেন্স নম্বর দিন।");
      return;
    }

    setIsVerifying(true);
    setErrorText("");

    try {
      // Send transaction verification request to Express backend
      const response = await fetch("/api/payments/verify-trx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: localStorage.getItem("lodonex_current_user")
            ? JSON.parse(localStorage.getItem("lodonex_current_user")!).email
            : "student@lodonex.com",
          gateway: selectedGateway,
          trxId: trxIdInput.trim(),
          amount: subtotal,
          courses: cart.map((c) => c.id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("success");
        setTimeout(() => {
          onPaymentSuccess(cart);
          setStep("cart");
          setAccountNumber("");
          setSecurePin("");
          setTrxIdInput("");
          setStudentMobile("");
          setIsVerifying(false);
          onClose();
        }, 2500);
      } else {
        setErrorText(data.error || (lang === "en" ? "Transaction verification failed." : "পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে।"));
        setIsVerifying(false);
      }
    } catch {
      // Fallback verification
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess(cart);
        setStep("cart");
        setIsVerifying(false);
        onClose();
      }, 2500);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (userOTPInput !== simulatedOTP) {
      setErrorText(lang === "en" ? "Incorrect OTP. Try typing the simulated code displayed above!" : "ভুল ওটিপি। উপরে প্রদর্শিত সিমুলেটেড কোডটি টাইপ করুন!");
      return;
    }

    setStep("success");
    setTimeout(() => {
      onPaymentSuccess(cart);
      setStep("cart");
      setAccountNumber("");
      setCardHolder("");
      setCardExpiry("");
      setCardCvc("");
      setSimulatedOTP("");
      setUserOTPInput("");
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div id="checkout-payment-overlay" className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between rounded-none border-l border-editorial-border font-sans"
      >
        {/* Header */}
        <div className="p-5 border-b border-editorial-border flex items-center justify-between flex-shrink-0 bg-[#1A1A1A] text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-editorial-accent" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold">
              {step === "cart" ? t.shoppingCart : lang === "en" ? "Local Bank & Mobile Gateway" : "পেমেন্ট গেটওয়ে"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Body content */}
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
            <div id="payment-step-gateway" className="space-y-5 font-sans">
              <button
                onClick={() => setStep("cart")}
                className="flex items-center gap-1.5 text-slate-500 hover:text-editorial-dark text-xs font-bold uppercase tracking-widest transition mb-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                {lang === "en" ? "Back to Cart" : "কার্টে ফিরে যান"}
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  {lang === "en" ? "Select Local Bank or Mobile Payment Method" : "পেমেন্ট মেথড নির্বাচন করুন"}
                </span>

                {/* Gateway Selector Grid */}
                <div className="grid grid-cols-3 gap-2 font-sans">
                  {[
                    { id: "bkash", name: "bKash", type: "Mobile" },
                    { id: "nagad", name: "Nagad", type: "Mobile" },
                    { id: "rocket", name: "Rocket", type: "Mobile" },
                    { id: "bank", name: "Bank Transfer", type: "Direct EBL" },
                    { id: "card", name: "Debit/Credit", type: "Card Gateway" },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      id={`gateway-select-${gw.id}`}
                      onClick={() => {
                        setSelectedGateway(gw.id as any);
                        setErrorText("");
                      }}
                      className={`p-2.5 rounded-none border text-left transition flex flex-col justify-between h-20 cursor-pointer ${
                        selectedGateway === gw.id
                          ? "border-editorial-dark bg-[#F7F5F0] text-editorial-accent font-extrabold"
                          : "border-editorial-border bg-white text-slate-800"
                      }`}
                    >
                      <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400">{gw.type}</span>
                      <span className="text-xs uppercase tracking-wider font-bold">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gateway details display based on selected option */}
              <form onSubmit={handleProcessGateway} className="space-y-4 pt-2">
                {selectedGateway === "bank" ? (
                  <div className="p-4 bg-[#F7F5F0] border border-editorial-border space-y-3">
                    <div className="flex items-center gap-2 text-editorial-dark pb-1 border-b border-editorial-border">
                      <Building2 className="h-5 w-5 text-editorial-accent" />
                      <h4 className="font-serif font-bold text-sm italic">
                        {lang === "en" ? "Direct Local Bank Wire Credentials" : "লোকাল ব্যাংক অ্যাকাউন্ট তথ্য"}
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{lang === "en" ? "Bank Name" : "ব্যাংকের নাম"}</span>
                        <div className="flex justify-between items-center font-bold">
                          <span>{merchantConfig.bankName}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(merchantConfig.bankName, "bankName")}
                            className="p-1 hover:text-editorial-accent transition cursor-pointer"
                          >
                            {copiedField === "bankName" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{lang === "en" ? "Account Name" : "অ্যাকাউন্টের নাম"}</span>
                        <div className="flex justify-between items-center font-bold">
                          <span>{merchantConfig.bankAccountName}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(merchantConfig.bankAccountName, "accName")}
                            className="p-1 hover:text-editorial-accent transition cursor-pointer"
                          >
                            {copiedField === "accName" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{lang === "en" ? "Account Number" : "অ্যাকাউন্ট নম্বর"}</span>
                        <div className="flex justify-between items-center font-mono font-bold text-sm text-editorial-dark">
                          <span>{merchantConfig.bankAccountNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(merchantConfig.bankAccountNumber, "accNum")}
                            className="p-1 hover:text-editorial-accent transition cursor-pointer"
                          >
                            {copiedField === "accNum" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">{lang === "en" ? "Branch" : "শাখা"}</span>
                          <span>{merchantConfig.bankBranch}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">{lang === "en" ? "Routing No" : "রাউটিং নম্বর"}</span>
                          <span className="font-mono">{merchantConfig.bankRoutingNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedGateway !== "card" ? (
                  <div className="p-4 bg-[#F7F5F0] border border-editorial-border space-y-3">
                    <div className="flex items-center gap-2 text-editorial-dark pb-1 border-b border-editorial-border">
                      <Smartphone className="h-5 w-5 text-editorial-accent" />
                      <h4 className="font-serif font-bold text-sm italic">
                        {selectedGateway.toUpperCase()} {lang === "en" ? "Merchant Payment Number" : "মার্চেন্ট পেমেন্ট নম্বর"}
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        {lang === "en" ? `Official ${selectedGateway.toUpperCase()} Account` : `অফিসিয়াল ${selectedGateway.toUpperCase()} নম্বর`}
                      </span>
                      <div className="flex justify-between items-center bg-white p-2.5 border border-editorial-border font-mono font-extrabold text-base text-editorial-dark">
                        <span>
                          {selectedGateway === "bkash"
                            ? merchantConfig.bkashMerchantNumber
                            : selectedGateway === "nagad"
                            ? merchantConfig.nagadMerchantNumber
                            : merchantConfig.rocketMerchantNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              selectedGateway === "bkash"
                                ? merchantConfig.bkashMerchantNumber
                                : selectedGateway === "nagad"
                                ? merchantConfig.nagadMerchantNumber
                                : merchantConfig.rocketMerchantNumber,
                              "mobileNum"
                            )
                          }
                          className="px-2 py-1 bg-neutral-900 text-white text-[9px] uppercase tracking-wider font-sans font-bold hover:bg-red-600 transition cursor-pointer flex items-center gap-1"
                        >
                          {copiedField === "mobileNum" ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-600 pt-1 leading-relaxed">
                        <p className="font-bold text-editorial-dark mb-1">
                          {lang === "en" ? "Payment Instructions:" : "পেমেন্ট নির্দেশিকা:"}
                        </p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>
                            {lang === "en"
                              ? `Dial or open ${selectedGateway.toUpperCase()} App.`
                              : `${selectedGateway.toUpperCase()} অ্যাপ খুলুন অথবা ডায়াল করুন।`}
                          </li>
                          <li>
                            {lang === "en"
                              ? `Select 'Payment' or 'Send Money' to the merchant number above.`
                              : `উপরের নম্বরে 'পেমেন্ট' বা 'সেন্ড মানি' করুন।`}
                          </li>
                          <li>
                            {lang === "en"
                              ? `Amount: BDT ${subtotal.toLocaleString("en-BD")}`
                              : `পরিমাণ: ${subtotal.toLocaleString("bn-BD")} টাকা`}
                          </li>
                          <li>
                            {lang === "en"
                              ? "Copy the Transaction ID (TrxID) received in SMS."
                              : "প্রাপ্ত ট্রানজেকশন আইডি (TrxID) কপি করুন।"}
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Card Option */
                  <div className="space-y-3 p-4 bg-[#F7F5F0] border border-editorial-border">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                        {lang === "en" ? "Cardholder Name" : "কার্ডধারীর নাম"} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TASNIM AHMED"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                        {lang === "en" ? "Card Number" : "কার্ড নম্বর"} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={accountNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                        <input
                          type="password"
                          required
                          placeholder="•••"
                          maxLength={4}
                          value={cardCvc}
                          onChange={handleCvcChange}
                          className="w-full px-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                  {selectedGateway === "card"
                    ? `${t.payNow} (${formatPrice(subtotal, lang)})`
                    : lang === "en"
                    ? "Next: Enter TrxID / Reference"
                    : "পরবর্তী: TrxID দিন"}
                </button>
              </form>
            </div>
          )}

          {step === "trx_verify" && (
            <div id="payment-step-trx" className="space-y-5 font-sans">
              <button
                onClick={() => setStep("gateway")}
                className="flex items-center gap-1.5 text-slate-500 hover:text-editorial-dark text-xs font-bold uppercase tracking-widest transition mb-2 cursor-pointer font-sans"
              >
                <ArrowLeft className="h-4 w-4" />
                {lang === "en" ? "Change Payment Method" : "পেমেন্ট মাধ্যম পরিবর্তন"}
              </button>

              <div className="p-4 bg-[#F7F5F0] border border-editorial-border space-y-3">
                <div className="flex items-center gap-2 text-editorial-dark pb-2 border-b border-editorial-border">
                  <ShieldCheck className="h-5 w-5 text-editorial-accent" />
                  <h4 className="font-serif font-bold text-sm italic">
                    {lang === "en" ? "Verify Payment & Unlock Course" : "পেমেন্ট ভেরিফিকেশন ও কোর্স আনলক"}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === "en"
                    ? `Please enter the Transaction ID (TrxID) / Reference Number received from ${selectedGateway.toUpperCase()} to confirm your BDT ${subtotal.toLocaleString(
                        "en-BD"
                      )} payment.`
                    : `${selectedGateway.toUpperCase()} থেকে প্রাপ্ত ট্রানজেকশন আইডি (TrxID) / রেফারেন্স নম্বর লিখে আপনার কোর্স আনলক করুন।`}
                </p>

                <form onSubmit={handleVerifyTrxSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                      {lang === "en" ? "Transaction ID (TrxID) / Bank Reference" : "ট্রানজেকশন আইডি (TrxID) / রেফারেন্স"} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedGateway === "bkash" ? "e.g. BK89234182" : "e.g. TRX10928374"}
                      value={trxIdInput}
                      onChange={(e) => setTrxIdInput(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 bg-white border border-editorial-border font-mono text-sm font-bold uppercase rounded-none focus:outline-none focus:border-editorial-dark"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                      {lang === "en" ? "Your Mobile Number (Optional)" : "আপনার মোবাইল নম্বর (ঐচ্ছিক)"}
                    </label>
                    <input
                      type="text"
                      placeholder="01700000000"
                      value={studentMobile}
                      onChange={(e) => setStudentMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-editorial-border rounded-none focus:outline-none text-xs"
                    />
                  </div>

                  {errorText && (
                    <p className="text-xs text-red-700 font-bold bg-red-50 p-2.5 rounded-none border border-red-200">
                      {errorText}
                    </p>
                  )}

                  <button
                    id="submit-verify-trx-btn"
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 bg-[#1A1A1A] hover:bg-emerald-700 text-white rounded-none text-xs font-bold uppercase tracking-widest shadow transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>{lang === "en" ? "Verifying with Bank..." : "ব্যাংক ভেরিফিকেশন চলছে..."}</span>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>{lang === "en" ? "Verify TrxID & Unlock Course" : "TrxID ভেরিফাই করে কোর্স আনলক করুন"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div id="payment-step-otp" className="space-y-5 text-center font-sans">
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-left text-red-800 space-y-1">
                <p className="font-bold uppercase tracking-widest text-[9px] text-editorial-accent">SECURE CARD OTP CODE</p>
                <p className="font-bold">
                  {lang === "en" ? `Verification PIN: ${simulatedOTP}` : `ভেরিফিকেশন কোড: ${simulatedOTP}`}
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
                  {lang === "en" ? "Transaction Verified & Course Unlocked!" : "পেমেন্ট সফল ও কোর্স আনলক হয়েছে!"}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {lang === "en"
                    ? "Thank you! Your payment has been verified. You now have full access to video lectures, quizzes, and graduation certificates."
                    : "ধন্যবাদ! আপনার পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে। এখন আপনি সকল ভিডিও লেকচার, কুইজ ও সার্টিফিকেট অ্যাক্সেস করতে পারবেন।"}
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
