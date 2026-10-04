/**
 * LODONEX - REAL-TIME STAFF DASHBOARD
 * 
 * Route: /staff/dashboard
 * Admissions, Payment Verification, and Operational Task Queue
 * Strictly powered by real-time Firestore streams (onSnapshot).
 */

import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Search,
  Check,
  X,
  CreditCard,
  RefreshCw,
  Bell,
  Calendar,
  Eye
} from "lucide-react";
import {
  Language,
  UserAccount,
  EnrollmentApplication,
  PaymentRecord,
  Batch
} from "../types";
import { useRealtimeDashboard } from "../services/useRealtimeDashboard";
import {
  updateFirestoreEnrollmentStatus,
  verifyFirestorePayment
} from "../services/dashboardService";
import { formatPrice } from "../utils/price";

interface StaffDashboardProps {
  lang: Language;
  currentUser: UserAccount;
  onNavigate: (path: string) => void;
}

export default function StaffDashboard({
  lang,
  currentUser,
  onNavigate
}: StaffDashboardProps) {
  const isEn = lang === "en";

  const {
    users,
    batches,
    enrollments,
    payments,
    notifications,
    isLoading,
    error,
    isLive,
    lastUpdated,
    retry
  } = useRealtimeDashboard({
    isStaff: true,
    userId: currentUser.id,
    role: "staff"
  });

  const [activeTab, setActiveTab] = useState<"tasks" | "applications" | "payments" | "batches">("tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Operational Queues from Firestore
  const pendingApplications = enrollments.filter(
    (e) => e.status === "applied" || e.status === "under_review" || e.status === "pending_payment"
  );

  const pendingPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "submitted"
  );

  const handleApproveApp = async (appId: string) => {
    try {
      await updateFirestoreEnrollmentStatus(appId, "active", currentUser.name);
      setActionSuccess(isEn ? "Application Approved & Activated!" : "আবেদন সফলভাবে অনুমোদিত হয়েছে!");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Approve app error:", err);
    }
  };

  const handleVerifyPay = async (paymentId: string) => {
    try {
      await verifyFirestorePayment(paymentId, "verified", currentUser.name);
      setActionSuccess(isEn ? "Payment Verified Successfully!" : "পেমেন্ট সফলভাবে যাচাই হয়েছে!");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Verify payment error:", err);
    }
  };

  return (
    <div id="lodonex-staff-dashboard" className="font-sans text-slate-900 pb-16">
      {/* Top Banner */}
      <div className="bg-[#111111] text-white border-b-2 border-editorial-accent py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  STAFF • ADMISSIONS & OPERATIONS
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/90 font-mono font-bold">
                  {currentUser.name}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isEn ? "Lodonex Staff Operations Console" : "লোডোনেক্স স্টাফ অপারেশনাল কনসোল"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 text-xs font-mono">
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
                {isLive ? "● LIVE" : "CONNECTING..."}
              </span>
              {lastUpdated && (
                <span className="text-white/50 text-[10px]">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-editorial-border pb-px text-xs font-bold uppercase tracking-wider">
          {[
            { id: "tasks", label: isEn ? "Pending Task Queue" : "অপেক্ষমাণ কাজের তালিকা", icon: Clock },
            { id: "applications", label: isEn ? "Admissions" : "ভর্তি আবেদন", icon: Users },
            { id: "payments", label: isEn ? "Payment Verification" : "পেমেন্ট যাচাই", icon: DollarSign },
            { id: "batches", label: isEn ? "Cohorts & Batches" : "ব্যাচসমূহ", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 whitespace-nowrap border-b-2 transition cursor-pointer ${
                  isActive
                    ? "border-amber-600 text-amber-700 font-extrabold bg-amber-50/50"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {actionSuccess && (
          <div className="my-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="h-6 w-6 text-amber-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">
              {isEn ? "Loading real-time operational records..." : "ফায়ারবেস থেকে লাইভ রেকর্ড লোড হচ্ছে..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={retry}
              className="px-3 py-1 bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-red-800"
            >
              {isEn ? "Try Again" : "আবার চেষ্টা করুন"}
            </button>
          </div>
        )}

        {/* TAB 1: TASK QUEUE */}
        {!isLoading && activeTab === "tasks" && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Applications Requiring Review" : "রিভিউ বাকি আবেদন"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-amber-700">
                  {pendingApplications.length}
                </div>
                <p className="text-[10px] text-amber-600">{isEn ? "New Admissions" : "নতুন আবেদনকারী"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Payments to Verify" : "যাচাইযোগ্য পেমেন্ট"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-blue-700">
                  {pendingPayments.length}
                </div>
                <p className="text-[10px] text-blue-600">{isEn ? "TrxIDs to Match" : "ট্রানজেকশন আইডি"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Active Training Cohorts" : "চলমান কোহর্ট"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-slate-900">
                  {batches.filter((b) => b.status === "active").length}
                </div>
                <p className="text-[10px] text-slate-500">{isEn ? "Batches Running" : "সক্রিয় ব্যাচ"}</p>
              </div>
            </div>

            {/* Quick Action: Pending Admissions */}
            <div className="bg-white border border-editorial-border p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {isEn ? "Admissions Queue (Immediate Action Required)" : "ভর্তি আবেদন কিউ (তাৎক্ষণিক ব্যবস্থা গ্রহণ)"}
              </h3>
              {pendingApplications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                  {isEn ? "No data available yet. Admissions queue is empty." : "এখনও কোনো তথ্য নেই। কোনো নতুন আবেদন বাকি নেই।"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Course</th>
                        <th className="p-3">Phone / Contact</th>
                        <th className="p-3">TrxID Reference</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{app.studentName}</td>
                          <td className="p-3 text-slate-700">{app.courseTitle}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{app.studentPhone}</td>
                          <td className="p-3">
                            {app.transactionId ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                                {app.paymentMethod}: {app.transactionId}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">No TrxID</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleApproveApp(app.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase"
                            >
                              {isEn ? "Approve & Enroll" : "অনুমোদন দিন"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Action: Pending Payment Verifications */}
            <div className="bg-white border border-editorial-border p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {isEn ? "Payment Verifications Queue" : "পেমেন্ট ভেরিফিকেশন কিউ"}
              </h3>
              {pendingPayments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                  {isEn ? "No data available yet. No unverified payments." : "এখনও কোনো তথ্য নেই। যাচাই বাকি নেই।"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                        <th className="p-3">Student</th>
                        <th className="p-3">Course</th>
                        <th className="p-3">Gateway</th>
                        <th className="p-3">TrxID</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{p.studentName}</td>
                          <td className="p-3 text-slate-700">{p.courseTitle}</td>
                          <td className="p-3 font-mono uppercase text-[11px] font-bold text-slate-700">{p.gateway}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{p.trxId}</td>
                          <td className="p-3 font-mono font-bold text-emerald-700">{formatPrice(p.amount)}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleVerifyPay(p.id)}
                              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold text-[10px] uppercase"
                            >
                              {isEn ? "Verify Payment" : "যাচাই করুন"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ALL APPLICATIONS */}
        {!isLoading && activeTab === "applications" && (
          <div className="bg-white border border-editorial-border p-6 space-y-4 mt-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {isEn ? "Complete Admissions Register" : "সম্পূর্ণ ভর্তি তালিকা"}
            </h3>
            {enrollments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Applied At</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{app.studentName}</td>
                        <td className="p-3 text-slate-700">{app.courseTitle}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            app.status === "active" || app.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENTS */}
        {!isLoading && activeTab === "payments" && (
          <div className="bg-white border border-editorial-border p-6 space-y-4 mt-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {isEn ? "All Transaction Receipts" : "সকল পেমেন্ট রসিদ"}
            </h3>
            {payments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                      <th className="p-3">Student</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">TrxID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{p.studentName}</td>
                        <td className="p-3 text-slate-700">{p.courseTitle}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{p.trxId}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{formatPrice(p.amount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.status === "verified" || p.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BATCHES */}
        {!isLoading && activeTab === "batches" && (
          <div className="bg-white border border-editorial-border p-6 space-y-4 mt-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {isEn ? "Active Training Batches & Cohorts" : "চলমান ব্যাচ ও কোহর্ট"}
            </h3>
            {batches.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map((b) => (
                  <div key={b.id} className="p-4 border border-slate-200 bg-white space-y-2">
                    <span className="font-bold text-slate-900 text-sm block">{b.name}</span>
                    <p className="text-xs text-slate-600">{b.courseTitle}</p>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-2 border-t">
                      <span>Trainer: {b.trainerName}</span>
                      <span>{b.classTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
