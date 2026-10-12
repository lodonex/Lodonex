/**
 * LODONEX CULINARY ACADEMY — SECURE PAYMENT METHODS FOOTER
 * 
 * Displays verified and active payment methods:
 * - International Cards: Visa, Mastercard, American Express (AMEX)
 * - Mobile Financial Services (MFS): bKash, Nagad, Rocket
 * - Participating Local Bank: Eastern Bank PLC (EBL Direct Transfer / Wire)
 * 
 * Complies with strict trust and verification guidelines:
 * - Exact Heading: "Secure Payment Methods"
 * - Exact Trust Label: "100% Payment Verification"
 * - Exact Supporting Text: "Pay using supported international cards, Bangladeshi mobile financial services, and participating local banks. Payments are verified through our configured payment provider before purchases are confirmed."
 */

import React from "react";
import { Language } from "../types";

interface SecurePaymentMethodsFooterProps {
  lang: Language;
}

export default function SecurePaymentMethodsFooter({ lang }: SecurePaymentMethodsFooterProps) {
  const isEn = lang === "en";

  return (
    <div
      id="secure-payment-methods-footer"
      className="mt-10 pt-8 border-t border-neutral-800 text-left"
    >
      <div className="bg-neutral-900/90 border border-neutral-800/80 rounded-sm p-5 sm:p-7 shadow-xl">
        {/* Top Header Row with Exact Heading & Trust Label */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-serif font-black text-sm sm:text-base tracking-wide text-white">
                Secure Payment Methods
              </h3>
            </div>

            {/* Exact Required Supporting Text */}
            <p className="text-[11px] sm:text-xs text-[#E5E2D9]/70 leading-relaxed font-sans">
              Pay using supported international cards, Bangladeshi mobile financial services, and participating local banks. Payments are verified through our configured payment provider before purchases are confirmed.
            </p>
          </div>
        </div>

        {/* Payment Channels Grid */}
        <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Group 1: International Cards */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E5E2D9]/50 block">
              International Cards
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* Visa Badge */}
              <div
                title="Visa — Debit & Credit Cards"
                className="h-10 px-3 bg-white border border-neutral-300 rounded-xs flex items-center justify-center shadow-xs transition hover:border-[#E7000B]"
              >
                <svg
                  className="h-5 w-auto"
                  viewBox="0 0 64 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Visa"
                >
                  <path
                    d="M25.7 19.3L28.8 0.7H33.8L30.7 19.3H25.7ZM48.6 0.7C47.4 0.2 45.6 0 43.4 0C38.2 0 34.6 2.7 34.5 6.6C34.4 9.5 37.1 11.1 39.1 12.1C41.1 13.1 41.8 13.7 41.8 14.7C41.8 16.1 40.1 16.8 38.4 16.8C35.9 16.8 34.6 16.4 33.1 15.7L32.3 15.3L31.5 20.3C32.9 20.9 35.4 21.4 38.0 21.4C43.5 21.4 47.1 18.7 47.2 14.5C47.3 11.9 45.7 9.9 43.1 8.6C41.5 7.8 40.5 7.2 40.5 6.3C40.5 5.5 41.4 4.7 43.3 4.7C44.9 4.7 46.2 5.0 47.2 5.5L47.7 5.7L48.6 0.7ZM63.3 0.7H59.4C57.9 0.7 56.7 1.1 56.0 2.7L47.9 22H53.1L54.1 19.3H60.4L61.0 22H65.6L63.3 0.7ZM55.6 15.2C56.1 13.8 58.0 8.7 58.0 8.7C58.0 8.7 58.5 7.4 58.8 6.5L59.2 8.5L60.0 12.4L60.4 15.2H55.6ZM19.2 0.7L14.3 14.2L12.3 2.9C12.0 1.5 10.9 0.7 9.6 0.7H0.9L0.5 2.6C2.3 3.0 4.4 3.7 5.8 4.6C6.7 5.2 6.9 5.8 7.3 7.0L11.7 23.4H17.0L24.6 0.7H19.2Z"
                    fill="#1A1F71"
                  />
                  <path
                    d="M12.3 2.9L8.6 20.3L6.0 7.0C5.6 5.8 5.4 5.2 4.5 4.6C3.1 3.7 1.0 3.0 0.5 2.6L0.9 0.7H9.6C10.9 0.7 12.0 1.5 12.3 2.9Z"
                    fill="#F7B600"
                  />
                </svg>
              </div>

              {/* Mastercard Badge */}
              <div
                title="Mastercard — Global Debit & Credit"
                className="h-10 px-3 bg-white border border-neutral-300 rounded-xs flex items-center justify-center gap-1.5 shadow-xs transition hover:border-[#E7000B]"
              >
                <svg
                  className="h-6 w-auto"
                  viewBox="0 0 38 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Mastercard"
                >
                  <circle cx="12" cy="12" r="11" fill="#EB001B" />
                  <circle cx="26" cy="12" r="11" fill="#F79E1B" />
                  <path
                    d="M19 4.3C21.4 6.2 23 9.1 23 12.3C23 15.5 21.4 18.4 19 20.3C16.6 18.4 15 15.5 15 12.3C15 9.1 16.6 6.2 19 4.3Z"
                    fill="#FF5F00"
                  />
                </svg>
                <span className="font-sans font-black text-[10px] tracking-tight text-neutral-900 hidden sm:inline">
                  mastercard
                </span>
              </div>

              {/* American Express (AMEX) Badge */}
              <div
                title="American Express — Card Payments"
                className="h-10 px-2.5 bg-[#006FCF] border border-[#005bb0] rounded-xs flex items-center justify-center shadow-xs transition hover:brightness-110"
              >
                <div className="flex items-center gap-1 text-white font-sans font-black text-[10px] tracking-wider uppercase">
                  <span>AMEX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Mobile Financial Services (MFS) */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E5E2D9]/50 block">
              Mobile Financial Services (MFS)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* bKash Badge */}
              <div
                title="bKash Merchant Pay & TrxID Verification"
                className="h-10 px-3 bg-white border border-neutral-300 rounded-xs flex items-center justify-center gap-1.5 shadow-xs transition hover:border-[#D12053]"
              >
                {/* bKash Origami Bird SVG */}
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="bKash"
                >
                  <path d="M52 14L88 44L52 38L52 14Z" fill="#D12053" />
                  <path d="M12 40L46 22L40 52L12 40Z" fill="#DF1E5A" />
                  <path d="M48 42L86 48L54 84L48 42Z" fill="#E2136E" />
                  <path d="M38 56L50 86L18 72L38 56Z" fill="#C41952" />
                </svg>
                <span className="font-sans font-extrabold text-xs text-[#E2136E] tracking-tight">
                  bKash
                </span>
              </div>

              {/* Nagad Badge */}
              <div
                title="Nagad Merchant Payment"
                className="h-10 px-3 bg-white border border-neutral-300 rounded-xs flex items-center justify-center gap-1.5 shadow-xs transition hover:border-[#F7941D]"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Nagad"
                >
                  <circle cx="50" cy="50" r="44" fill="#F7941D" />
                  <path
                    d="M32 64C32 46 44 32 62 32C52 38 48 48 54 58C56 62 52 68 44 68C38 68 32 66 32 64Z"
                    fill="#FFFFFF"
                  />
                  <circle cx="64" cy="40" r="8" fill="#E61C24" />
                </svg>
                <span className="font-sans font-black text-xs text-[#F7941D] tracking-tight">
                  Nagad
                </span>
              </div>

              {/* Rocket Badge */}
              <div
                title="DBBL Rocket Mobile Payment"
                className="h-10 px-3 bg-white border border-neutral-300 rounded-xs flex items-center justify-center gap-1.5 shadow-xs transition hover:border-[#8C3494]"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Rocket"
                >
                  <circle cx="50" cy="50" r="44" fill="#8C3494" />
                  <path
                    d="M50 20L65 50H56L62 76L42 54H48L35 50L50 20Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <span className="font-sans font-black text-xs text-[#8C3494] tracking-tight">
                  Rocket
                </span>
              </div>
            </div>
          </div>

          {/* Group 3: Participating Local Bank Wire */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E5E2D9]/50 block">
              Participating Local Bank
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* Eastern Bank PLC (EBL) Badge */}
              <div
                title="Eastern Bank PLC (EBL) — Direct Corporate Account & Wire Transfer"
                className="h-10 px-3 bg-white border border-neutral-300 rounded-xs flex items-center gap-2 shadow-xs transition hover:border-[#003366]"
              >
                <div className="h-6 w-6 rounded-xs bg-[#003366] text-[#FFCC00] flex items-center justify-center font-serif font-black text-xs">
                  EBL
                </div>
                <div className="text-left leading-none">
                  <span className="font-serif font-bold text-xs text-[#003366] block">
                    Eastern Bank PLC
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-0.5">
                    Direct Wire & Account Transfer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Security Notice */}
        <div className="mt-5 pt-3.5 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>All student enrollments and digital product purchases undergo automated and administrative transaction reconciliation.</span>
          </div>
          <span className="text-neutral-500">
            Currency: BDT (৳) & USD ($)
          </span>
        </div>
      </div>
    </div>
  );
}
