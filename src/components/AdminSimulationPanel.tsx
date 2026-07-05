import React, { useState } from "react";
import { UserCheck, Shield, ChevronDown, ChevronUp, UserX, UserPlus, RefreshCw } from "lucide-react";
import { Language, UserAccount } from "../types";

interface AdminSimulationPanelProps {
  lang: Language;
  users: UserAccount[];
  currentUser: UserAccount | null;
  onUpdateUserStatus: (userId: string, status: "pending" | "approved") => void;
  onAddSimulatedUser: () => void;
  onResetSimulation: () => void;
}

export default function AdminSimulationPanel({
  lang,
  users,
  currentUser,
  onUpdateUserStatus,
  onAddSimulatedUser,
  onResetSimulation,
}: AdminSimulationPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const isEn = lang === "en";

  return (
    <div
      id="admin-simulation-panel"
      className="fixed bottom-0 right-0 left-0 z-40 bg-slate-950/95 border-t-2 border-editorial-accent text-white font-sans text-xs transition-all duration-300"
    >
      {/* Panel Header bar with Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-editorial-accent" />
          <span className="font-extrabold uppercase tracking-widest text-[10px] text-editorial-accent">
            {isEn ? "Lodonex Administrative Gateway (Sandbox Simulator)" : "লোডোনেক্স প্রশাসনিক গেটওয়ে (স্যান্ডবক্স সিমুলেটর)"}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-neutral-800 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-[11px]"
            title={isMinimized ? "Expand Panel" : "Minimize Panel"}
          >
            {isMinimized ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span className="hidden sm:inline">{isEn ? "Show Sandbox Admin Options" : "অ্যাডমিন অপশন দেখান"}</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span className="hidden sm:inline">{isEn ? "Hide Sandbox Admin Options" : "অ্যাডমিন অপশন লুকান"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Admin Portal controls */}
      {!isMinimized && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1: System Info & Actions */}
          <div className="space-y-3 border-r border-neutral-800 pr-0 md:pr-6">
            <div>
              <h4 className="font-serif font-bold text-sm tracking-wide text-neutral-200 italic mb-1">
                {isEn ? "Administrative Actions" : "প্রশাসনিক কার্যাবলী"}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn
                  ? "Manage incoming student applications. Approve a registered email address below to unlock their Dashboard, certificate generation, and recipe logging instantly."
                  : "শিক্ষার্থীদের আবেদনপত্র পরিচালনা করুন। নিচে যেকোনো ইমেল অনুমোদন করে ড্যাশবোর্ড এবং সার্টিফিকেট তাৎক্ষণিক সক্রিয় করুন।"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1.5">
              <button
                onClick={onAddSimulatedUser}
                className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold uppercase tracking-wider text-[9px] transition cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="h-3.5 w-3.5 text-neutral-400" />
                {isEn ? "Simulate New Sign-up" : "নতুন শিক্ষার্থী সিমুলেট"}
              </button>
              <button
                onClick={onResetSimulation}
                className="px-2.5 py-1.5 bg-neutral-800 hover:bg-red-950/40 border border-neutral-700 text-neutral-300 hover:text-white font-bold uppercase tracking-wider text-[9px] transition cursor-pointer flex items-center gap-1"
                title="Reset all localStorage records"
              >
                <RefreshCw className="h-3.5 w-3.5 text-neutral-400" />
                {isEn ? "Reset Simulation" : "সিমুলেশন রিসেট"}
              </button>
            </div>
          </div>

          {/* Col 2 & 3: Users Applications List */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <h4 className="font-serif font-bold text-sm tracking-wide text-neutral-200 italic mb-2">
              {isEn ? "Registered Students Database" : "নিবন্ধিত শিক্ষার্থীদের ডাটাবেজ"}
            </h4>

            {users.length === 0 ? (
              <div className="p-3 bg-neutral-900 border border-neutral-800 text-center text-slate-500 rounded-none italic text-[11px]">
                {isEn ? "No users registered yet. Try registering in the top-right menu!" : "এখনও কোনো অ্যাকাউন্ট নেই। সাইন আপ করুন!"}
              </div>
            ) : (
              <div className="max-h-28 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {users.map((user) => {
                  const isSelf = currentUser && currentUser.email === user.email;
                  return (
                    <div
                      key={user.id}
                      className={`p-2.5 border flex items-center justify-between gap-3 transition ${
                        isSelf
                          ? "bg-editorial-accent/10 border-editorial-accent/30"
                          : "bg-neutral-900 border-neutral-800"
                      }`}
                    >
                      <div className="text-left space-y-0.5 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-100">{user.name}</span>
                          {isSelf && (
                            <span className="px-1 bg-editorial-accent text-white text-[8px] uppercase tracking-wider font-extrabold rounded-none">
                              {isEn ? "YOU" : "আপনি"}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status badge */}
                        <div>
                          {user.status === "approved" ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-950 border border-amber-800 text-amber-400 text-[9px] font-bold uppercase tracking-wider animate-pulse">
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div>
                          {user.status === "pending" ? (
                            <button
                              onClick={() => onUpdateUserStatus(user.id, "approved")}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[9px] transition cursor-pointer flex items-center gap-1 rounded-none shadow-xs"
                            >
                              <UserCheck className="h-3 w-3" />
                              {isEn ? "Grant Access" : "অনুমোদন দিন"}
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateUserStatus(user.id, "pending")}
                              className="px-2 py-1 bg-neutral-800 hover:bg-amber-950 border border-neutral-700 text-amber-500 font-bold uppercase tracking-wider text-[9px] transition cursor-pointer flex items-center gap-1 rounded-none"
                            >
                              <UserX className="h-3 w-3" />
                              {isEn ? "Revoke Access" : "বাতিল করুন"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
