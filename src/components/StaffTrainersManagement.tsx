/**
 * LODONEX SUPER ADMIN — STAFF & TRAINERS MANAGEMENT
 * 
 * Production-ready management console for Lodonex faculty, instructors,
 * administrative staff, and registrar accounts.
 * 
 * Powered by real-time Firebase Firestore streams with Zero-Crash error boundaries,
 * comprehensive search & filtering, detailed profile inspection, and strict Super Admin RBAC.
 */

import React, { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from "react";
import {
  Users,
  Shield,
  ShieldAlert,
  Check,
  X,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  Edit3,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Lock,
  UserCheck,
  UserX,
  ChevronRight,
  Clock,
  Sparkles,
  Info
} from "lucide-react";
import { Language, UserAccount, UserRole, UserStatus } from "../types";
import { db, auth, handleFirestoreError, OperationType } from "../utils/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  onSnapshot,
  getDocs,
  serverTimestamp,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";

// Designated Super Admin constant
export const SUPER_ADMIN_EMAIL = "lodonexcookingacademy@gmail.com";

// ==========================================
// 1. COMPONENT-LEVEL ERROR BOUNDARY (PREVENTS BLANK PAGES)
// ==========================================
interface ErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  lang?: Language;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class StaffErrorBoundary extends (React.Component as any) {
  state: ErrorBoundaryState = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || "An unexpected rendering error occurred." };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("StaffTrainersManagement ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    (this as any).setState({ hasError: false, errorMessage: "" });
    if ((this as any).props.onRetry) {
      (this as any).props.onRetry();
    }
  };

  render() {
    if ((this as any).state.hasError) {
      const isEn = (this as any).props.lang !== "bn";
      return (
        <div className="bg-red-50 border-2 border-red-300 p-8 rounded-lg text-center space-y-4 my-6 shadow-sm">
          <div className="h-14 w-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-black text-xl text-red-900">
              {isEn ? "Unable to Render Staff & Trainers Console" : "স্টাফ ও ট্রেইনার কনসোল রেন্ডার করা যাচ্ছে না"}
            </h3>
            <p className="text-xs text-red-700 max-w-md mx-auto">
              {isEn
                ? "A component error occurred while displaying team data. Your database records remain safe."
                : "টিম ডেটা প্রদর্শনে একটি ত্রুটি ঘটেছে। আপনার ডেটাবেসের রেকর্ড নিরাপদ রয়েছে।"}
            </p>
            {(this as any).state.errorMessage && (
              <p className="font-mono text-[11px] text-red-600 bg-red-100/60 p-2 rounded-sm max-w-lg mx-auto">
                {(this as any).state.errorMessage}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer shadow-xs"
          >
            {isEn ? "Reload Team Console" : "পুনরায় চেষ্টা করুন"}
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// ==========================================
// 2. SAFE DATE FORMATTER (PREVENTS TYPEERRORS)
// ==========================================
export function formatCreationDate(dateVal: any): string {
  if (!dateVal) return "Not provided";
  try {
    if (typeof dateVal === "string") {
      if (dateVal.includes("T")) {
        return dateVal.split("T")[0];
      }
      return dateVal;
    }
    // Firestore Timestamp object
    if (typeof dateVal === "object") {
      if (typeof dateVal.toDate === "function") {
        return dateVal.toDate().toISOString().split("T")[0];
      }
      if (typeof dateVal.seconds === "number") {
        return new Date(dateVal.seconds * 1000).toISOString().split("T")[0];
      }
    }
    if (typeof dateVal === "number") {
      return new Date(dateVal).toISOString().split("T")[0];
    }
    return String(dateVal);
  } catch {
    return "Not provided";
  }
}

// Helper to determine if an account is a team member
export function isTeamAccount(user: Partial<UserAccount>): boolean {
  const role = (user.role || "").toLowerCase().trim();
  const email = (user.email || "").toLowerCase().trim();
  return (
    ["super_admin", "superadmin", "admin", "trainer", "staff"].includes(role) ||
    email === SUPER_ADMIN_EMAIL
  );
}

// Helper to check Super Admin privileges
export function checkIsSuperAdmin(currentUser?: UserAccount | null): boolean {
  if (!currentUser) return false;
  const role = (currentUser.role || "").toLowerCase().trim();
  const email = (currentUser.email || "").toLowerCase().trim();
  return role === "super_admin" || role === "superadmin" || email === SUPER_ADMIN_EMAIL;
}

// ==========================================
// 3. MAIN COMPONENT PROPS
// ==========================================
interface StaffTrainersManagementProps {
  lang: Language;
  currentUser: UserAccount;
  initialUsers?: UserAccount[];
  onUpdateUserAccount?: (user: UserAccount) => void;
}

export default function StaffTrainersManagement({
  lang,
  currentUser,
  initialUsers = [],
  onUpdateUserAccount
}: StaffTrainersManagementProps) {
  const isEn = lang === "en";
  const isSuperAdmin = checkIsSuperAdmin(currentUser);

  // Team members list from Firestore
  const [teamMembers, setTeamMembers] = useState<UserAccount[]>(() => {
    return (initialUsers || []).filter(isTeamAccount);
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection & Details Modal State
  const [selectedMember, setSelectedMember] = useState<UserAccount | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<UserAccount | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("staff");
  const [editStatus, setEditStatus] = useState<UserStatus>("active");
  const [editResponsibilities, setEditResponsibilities] = useState<string>("");
  const [editPhone, setEditPhone] = useState<string>("");
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Create Staff Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newRole, setNewRole] = useState<"admin" | "trainer" | "staff">("staff");
  const [newPassword, setNewPassword] = useState<string>("StaffPass@2026");
  const [newResponsibilities, setNewResponsibilities] = useState<string>("");
  const [isCreatingStaff, setIsCreatingStaff] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // ==========================================
  // 4. REAL-TIME FIRESTORE LISTENER
  // ==========================================
  const setupTeamListener = () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const usersCol = collection(db, "users");
      const unsubscribe = onSnapshot(
        usersCol,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const list: UserAccount[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const memberObj: UserAccount = {
              id: docSnap.id,
              uid: data.uid || docSnap.id,
              name: data.name || "Unnamed Member",
              email: data.email || "",
              phone: data.phone || "",
              role: data.role || "staff",
              status: data.status || "active",
              emailVerified: typeof data.emailVerified === "boolean" ? data.emailVerified : true,
              responsibilities: data.responsibilities || data.assignedResponsibilities || "",
              assignedResponsibilities: data.assignedResponsibilities || data.responsibilities || "",
              assignedBatchId: data.assignedBatchId || "",
              assignedCourseIds: data.assignedCourseIds || [],
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              city: data.city || "",
              address: data.address || ""
            };

            if (isTeamAccount(memberObj)) {
              list.push(memberObj);
            }
          });

          // Sort by newest first or Super Admin on top
          list.sort((a, b) => {
            if (a.email?.toLowerCase() === SUPER_ADMIN_EMAIL) return -1;
            if (b.email?.toLowerCase() === SUPER_ADMIN_EMAIL) return 1;
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });

          setTeamMembers(list);
          setIsLoading(false);
          setIsRefreshing(false);
        },
        (error) => {
          console.error("Firestore team members subscription error:", error);
          setLoadError(
            isEn
              ? "Firebase could not stream team records. Please check your network and security permissions."
              : "ফায়ারবেস থেকে টিম রেকর্ড লোড করা সম্ভব হয়নি। আপনার নেটওয়ার্ক সংযোগ যাচাই করুন।"
          );
          setIsLoading(false);
          setIsRefreshing(false);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error("Failed to setup team listener:", err);
      setLoadError(err?.message || "Error connecting to Firebase Firestore.");
      setIsLoading(false);
      setIsRefreshing(false);
      return () => {};
    }
  };

  useEffect(() => {
    const unsub = setupTeamListener();
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setLoadError(null);
    try {
      const q = collection(db, "users");
      const snap = await getDocs(q);
      const list: UserAccount[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const memberObj: UserAccount = {
          id: docSnap.id,
          uid: data.uid || docSnap.id,
          name: data.name || "Unnamed Member",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "staff",
          status: data.status || "active",
          emailVerified: typeof data.emailVerified === "boolean" ? data.emailVerified : true,
          responsibilities: data.responsibilities || data.assignedResponsibilities || "",
          assignedResponsibilities: data.assignedResponsibilities || data.responsibilities || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
        if (isTeamAccount(memberObj)) {
          list.push(memberObj);
        }
      });
      setTeamMembers(list);
    } catch (e: any) {
      console.error("Manual refresh error:", e);
      setLoadError("Manual sync failed: " + (e?.message || "Unknown error"));
    } finally {
      setIsRefreshing(false);
    }
  };

  // ==========================================
  // 5. FILTERED DATA CALCULATIONS
  // ==========================================
  const filteredTeam = useMemo(() => {
    return teamMembers.filter((m) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (m.name || "").toLowerCase().includes(q);
        const matchesEmail = (m.email || "").toLowerCase().includes(q);
        const matchesPhone = (m.phone || "").toLowerCase().includes(q);
        const matchesRole = (m.role || "").toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesRole) {
          return false;
        }
      }

      // Role filter
      if (roleFilter !== "all") {
        const mRole = (m.role || "").toLowerCase();
        if (roleFilter === "superadmin" && !["super_admin", "superadmin"].includes(mRole)) return false;
        if (roleFilter === "admin" && mRole !== "admin") return false;
        if (roleFilter === "trainer" && mRole !== "trainer") return false;
        if (roleFilter === "staff" && mRole !== "staff") return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const mStatus = (m.status || "").toLowerCase();
        if (statusFilter === "pending" && mStatus !== "pending") return false;
        if (statusFilter === "active" && !["active", "approved"].includes(mStatus)) return false;
        if (statusFilter === "suspended" && mStatus !== "suspended") return false;
        if (statusFilter === "blocked" && mStatus !== "blocked") return false;
      }

      return true;
    });
  }, [teamMembers, searchQuery, roleFilter, statusFilter]);

  // Statistics counters
  const totalCount = teamMembers.length;
  const activeCount = teamMembers.filter((m) => m.status === "active" || m.status === "approved").length;
  const pendingCount = teamMembers.filter((m) => m.status === "pending").length;
  const trainersCount = teamMembers.filter((m) => m.role === "trainer").length;
  const staffCount = teamMembers.filter((m) => m.role === "staff").length;
  const adminsCount = teamMembers.filter((m) => m.role === "admin" || m.role === "super_admin" || m.role === "superadmin").length;

  // ==========================================
  // 6. MANAGEMENT ACTIONS (STRICT RBAC & AUDIT LOGS)
  // ==========================================

  // Fast Status Toggle (Approve / Activate / Suspend)
  const handleQuickStatusChange = async (member: UserAccount, targetStatus: UserStatus) => {
    if (!isSuperAdmin) {
      alert("Unauthorized: Only Super Admin can change account statuses.");
      return;
    }

    // Safety guard: Protect permanent Super Admin account from accidental removal or suspension
    if (member.email?.toLowerCase() === SUPER_ADMIN_EMAIL || member.role === "super_admin" || member.role === "superadmin") {
      alert("Action Forbidden: The primary Super Admin account cannot be suspended or deactivated.");
      return;
    }

    try {
      // 1. Direct Firestore update
      const memberRef = doc(db, "users", member.id);
      await updateDoc(memberRef, {
        status: targetStatus,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email || "Super Admin"
      });

      // 2. Call trusted backend proxy route for server audit logging
      fetch("/api/admin/users/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": currentUser.role || "super_admin",
          "x-user-id": currentUser.id,
          "x-user-name": currentUser.name || "Super Admin"
        },
        body: JSON.stringify({
          userId: member.id,
          status: targetStatus
        })
      }).catch((e) => console.warn("Backend status audit log notice:", e));

      // Local optimistic update
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: targetStatus } : m))
      );

      setActionNotice(
        isEn
          ? `Status updated: ${member.name} is now ${targetStatus.toUpperCase()}.`
          : `${member.name}-এর স্ট্যাটাস ${targetStatus.toUpperCase()} করা হয়েছে।`
      );
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error("Update team status error:", err);
      alert(isEn ? "Failed to update member status: " + err.message : "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (member: UserAccount) => {
    setEditingMember(member);
    setEditRole(member.role || "staff");
    setEditStatus(member.status || "active");
    setEditResponsibilities(member.responsibilities || member.assignedResponsibilities || "");
    setEditPhone(member.phone || "");
    setEditError(null);
  };

  // Submit Edit Member
  const handleSaveEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!isSuperAdmin) {
      setEditError("Only Super Admin can update team accounts.");
      return;
    }

    // Safety guard: Protect master super admin
    if (editingMember.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      if (editRole !== "super_admin" && editRole !== "superadmin") {
        setEditError("Primary Super Admin account role cannot be changed.");
        return;
      }
      if (editStatus !== "active" && editStatus !== "approved") {
        setEditError("Primary Super Admin account cannot be deactivated.");
        return;
      }
    }

    setIsSavingEdit(true);
    setEditError(null);

    try {
      const userRef = doc(db, "users", editingMember.id);
      await updateDoc(userRef, {
        role: editRole,
        status: editStatus,
        phone: editPhone.trim(),
        responsibilities: editResponsibilities.trim(),
        assignedResponsibilities: editResponsibilities.trim(),
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email || "Super Admin"
      });

      // Call server endpoint for audit log
      fetch("/api/admin/users/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": currentUser.role || "super_admin",
          "x-user-id": currentUser.id,
          "x-user-name": currentUser.name || "Super Admin"
        },
        body: JSON.stringify({
          userId: editingMember.id,
          role: editRole,
          status: editStatus
        })
      }).catch((e) => console.warn("Backend edit audit notice:", e));

      // Local state update
      const updatedUser: UserAccount = {
        ...editingMember,
        role: editRole,
        status: editStatus,
        phone: editPhone.trim(),
        responsibilities: editResponsibilities.trim(),
        assignedResponsibilities: editResponsibilities.trim()
      };

      setTeamMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? updatedUser : m))
      );

      if (onUpdateUserAccount) {
        onUpdateUserAccount(updatedUser);
      }

      setEditingMember(null);
      setIsSavingEdit(false);
      setActionNotice(
        isEn
          ? `Account successfully updated for ${editingMember.name}.`
          : `${editingMember.name}-এর অ্যাকাউন্ট তথ্য সংরক্ষিত হয়েছে।`
      );
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error("Save edit error:", err);
      setEditError(err?.message || "Failed to save profile changes.");
      setIsSavingEdit(false);
    }
  };

  // Submit Create Staff Account
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setCreateError("Only Super Admin can provision staff accounts.");
      return;
    }

    const cleanName = newName.trim();
    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanPhone = newPhone.trim();

    if (!cleanName || !cleanEmail || !newPassword) {
      setCreateError(isEn ? "Full Name, Email, and Password are required." : "সকল আবশ্যকীয় তথ্য পূরণ করুন।");
      return;
    }

    // Email collision check
    if (teamMembers.some((m) => m.email?.toLowerCase() === cleanEmail)) {
      setCreateError(isEn ? "A team member with this email already exists." : "এই ইমেলে ইতোমধ্যে একজন টিম সদস্য আছেন।");
      return;
    }

    setIsCreatingStaff(true);
    setCreateError(null);

    try {
      const newMemberId = `${newRole}-${Date.now()}`;
      const newStaffDoc: UserAccount = {
        id: newMemberId,
        uid: newMemberId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || "Not provided",
        role: newRole,
        status: "active",
        emailVerified: true,
        responsibilities: newResponsibilities.trim() || "Assigned by Super Admin",
        assignedResponsibilities: newResponsibilities.trim() || "Assigned by Super Admin",
        assignedCourseIds: newRole === "trainer" ? ["course-1"] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 1. Direct write to Firestore users collection
      const userDocRef = doc(db, "users", newMemberId);
      await setDoc(userDocRef, {
        ...newStaffDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Call backend proxy endpoint for server session creation & audit logging
      fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": currentUser.role || "super_admin",
          "x-user-id": currentUser.id,
          "x-user-name": currentUser.name || "Super Admin"
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: newRole,
          password: newPassword,
          assignedResponsibilities: newResponsibilities.trim()
        })
      }).catch((e) => console.warn("Backend user creation notice:", e));

      // Local optimistic update
      setTeamMembers((prev) => [newStaffDoc, ...prev]);
      if (onUpdateUserAccount) {
        onUpdateUserAccount(newStaffDoc);
      }

      setIsCreateModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewResponsibilities("");
      setNewPassword("StaffPass@2026");
      setIsCreatingStaff(false);

      setActionNotice(
        isEn
          ? `Team member account created: ${cleanName} (${newRole.toUpperCase()}).`
          : `নতুন টিম অ্যাকাউন্ট তৈরি হয়েছে: ${cleanName} (${newRole.toUpperCase()})।`
      );
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error("Create staff error:", err);
      setCreateError(err?.message || "Failed to create staff account in Firebase.");
      setIsCreatingStaff(false);
    }
  };

  // Unauthorized Access Guard View
  if (!isSuperAdmin) {
    return (
      <div className="bg-red-50 border-2 border-red-300 p-8 rounded-lg text-center space-y-4 my-6 shadow-sm">
        <div className="h-14 w-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold font-mono">
          403
        </div>
        <h3 className="font-serif font-black text-2xl text-red-900">
          {isEn ? "403 Forbidden: Super Admin Privileges Required" : "৪০৩ নিষিদ্ধ: সুপার অ্যাডমিন অনুমতি প্রয়োজন"}
        </h3>
        <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
          {isEn
            ? "Access to Staff & Trainers Management is strictly restricted to the Academy Super Administrator (lodonexcookingacademy@gmail.com). Regular administrative staff cannot view or alter faculty accounts."
            : "স্টাফ ও ট্রেইনার ম্যানেজমেন্ট শুধুমাত্র একাডেমি সুপার অ্যাডমিনিস্ট্রেটরের জন্য সংরক্ষিত। সাধারণ অ্যাডমিনরা টিম অ্যাকাউন্ট পরিবর্তন করতে পারেন না।"}
        </p>
      </div>
    );
  }

  return (
    <StaffErrorBoundary lang={lang} onRetry={handleManualRefresh}>
      <div className="space-y-6 mt-6">
        {/* ACTION NOTICE TOAST */}
        {actionNotice && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3.5 flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================
            PAGE HEADER & CONTROLS
           ======================================================== */}
        <div className="bg-white border border-stone-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-red-100 text-[#E7000B] text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs border border-red-200">
                  <Shield className="inline h-3 w-3 mr-1" />
                  SUPER ADMIN CONSOLE
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE FIRESTORE STREAM
                </span>
              </div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 mt-1">
                {isEn ? "Staff & Trainers Management" : "স্টাফ ও ট্রেইনার প্রশাসন"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-sans mt-0.5">
                {isEn
                  ? "Manage Lodonex team members, staff accounts, trainers, and their assigned responsibilities."
                  : "লডনেক্স টিম মেম্বার, স্টাফ অ্যাকাউন্ট, ট্রেইনার ও তাদের দায়িত্ব পরিচালনা করুন।"}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs font-bold uppercase tracking-wider transition rounded-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                title="Refresh Real-Time Firebase Stream"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#E7000B]" : ""}`} />
                <span className="hidden sm:inline">{isRefreshing ? (isEn ? "Syncing..." : "লোড হচ্ছে...") : (isEn ? "Sync" : "রিফ্রেশ")}</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-serif font-black text-xs uppercase tracking-wider rounded-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
              >
                <Plus className="h-4 w-4" />
                <span>{isEn ? "Create Staff Account" : "নতুন স্টাফ নিয়োগ"}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              METRIC SUMMARY TILES
             ======================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xs">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Total Team Records</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif font-black text-2xl text-stone-900">{totalCount}</span>
                <span className="text-[10px] font-mono text-stone-400">Members</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xs">
              <span className="text-[10px] font-mono uppercase text-emerald-700 block">Active Faculty</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif font-black text-2xl text-emerald-800">{activeCount}</span>
                <span className="text-[10px] font-mono text-emerald-600">Active</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xs">
              <span className="text-[10px] font-mono uppercase text-teal-700 block">Chefs & Trainers</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif font-black text-2xl text-teal-800">{trainersCount}</span>
                <span className="text-[10px] font-mono text-teal-600">Faculty</span>
              </div>
            </div>

            <div className={`p-3 rounded-xs border ${pendingCount > 0 ? "bg-amber-50 border-amber-300" : "bg-stone-50 border-stone-200/80"}`}>
              <span className={`text-[10px] font-mono uppercase block ${pendingCount > 0 ? "text-amber-800 font-bold" : "text-stone-500"}`}>
                Pending Approvals
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`font-serif font-black text-2xl ${pendingCount > 0 ? "text-amber-900" : "text-stone-900"}`}>
                  {pendingCount}
                </span>
                {pendingCount > 0 && (
                  <span className="text-[9px] font-mono font-bold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-xs">
                    Needs Review
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SEARCH & FILTERING TOOLBAR
           ======================================================== */}
        <div className="bg-white border border-stone-200/90 shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search by team member name, email, or role..." : "নাম, ইমেল বা পদবী দিয়ে অনুসন্ধান করুন..."}
              className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#E7000B] focus:outline-none transition rounded-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-2 py-1 rounded-xs">
              <Briefcase className="h-3.5 w-3.5 text-stone-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-xs text-stone-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">{isEn ? "All Roles" : "সকল পদবী"}</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin / Registrar</option>
                <option value="trainer">Trainer / Chef</option>
                <option value="staff">Faculty / Staff</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-2 py-1 rounded-xs">
              <Filter className="h-3.5 w-3.5 text-stone-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-stone-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">{isEn ? "All Statuses" : "সকল স্ট্যাটাস"}</option>
                <option value="active">{isEn ? "Active" : "সক্রিয়"}</option>
                <option value="pending">{isEn ? "Pending Review" : "অনুমোদনের অপেক্ষায়"}</option>
                <option value="suspended">{isEn ? "Suspended" : "স্থগিত"}</option>
                <option value="blocked">{isEn ? "Blocked" : "ব্লকড"}</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xs cursor-pointer transition font-mono"
              >
                {isEn ? "Clear" : "মুছুন"}
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            ERROR STATE DISPLAY
           ======================================================== */}
        {loadError && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xs flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-red-900">
                  {isEn ? "Firebase Data Loading Error" : "ফায়ারবেস ডেটা লোডিং ত্রুটি"}
                </h4>
                <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
              </div>
            </div>
            <button
              onClick={handleManualRefresh}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xs transition cursor-pointer"
            >
              {isEn ? "Retry" : "পুনরায় চেষ্টা"}
            </button>
          </div>
        )}

        {/* ========================================================
            TEAM MEMBERS TABLE
           ======================================================== */}
        <div className="bg-white border border-stone-200/90 shadow-xs overflow-hidden">
          {isLoading && teamMembers.length === 0 ? (
            /* Loading State */
            <div className="p-12 text-center space-y-3">
              <div className="h-10 w-10 border-3 border-[#E7000B] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-mono text-stone-600">
                {isEn ? "Loading real-time team members from Firebase..." : "ফায়ারবেস থেকে টিম মেম্বারদের তথ্য লোড হচ্ছে..."}
              </p>
            </div>
          ) : filteredTeam.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-7 w-7 text-stone-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-800">
                  {isEn ? "No staff or trainer records found." : "কোনো স্টাফ বা ট্রেইনারের তথ্য পাওয়া যায়নি।"}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                    ? isEn
                      ? "No records matched your current search filters. Try clearing your filters."
                      : "আপনার ফিল্টারের সাথে কোনো রেকর্ড মিলছে না। ফিল্টার মুছে আবার চেষ্টা করুন।"
                    : isEn
                    ? "No staff or trainer accounts are registered yet. Click 'Create Staff Account' to add your first team member."
                    : "এখনও কোনো টিম অ্যাকাউন্ট তৈরি করা হয়নি। নতুন সদস্য যুক্ত করতে বাটনে ক্লিক করুন।"}
                </p>
              </div>
              {searchQuery || roleFilter !== "all" || statusFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-mono text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  {isEn ? "Reset Filters" : "ফিল্টার মুছুন"}
                </button>
              ) : (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-[#E7000B] hover:bg-[#C90009] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  {isEn ? "Add First Staff Member" : "প্রথম সদস্য নিয়োগ দিন"}
                </button>
              )}
            </div>
          ) : (
            /* Real Data Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 uppercase font-bold text-[10px] text-stone-600 tracking-wider">
                    <th className="p-3.5">Team Member</th>
                    <th className="p-3.5">Email & Phone</th>
                    <th className="p-3.5">Role / Account Type</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Registration Date</th>
                    <th className="p-3.5">Email Verified</th>
                    <th className="p-3.5">Assigned Responsibilities</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredTeam.map((member) => {
                    const isMasterAdmin =
                      member.email?.toLowerCase() === SUPER_ADMIN_EMAIL ||
                      member.role === "super_admin" ||
                      member.role === "superadmin";

                    return (
                      <tr key={member.id} className="hover:bg-stone-50/80 transition-colors">
                        {/* Member Identity */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold font-serif text-xs shrink-0">
                              {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                <span className="truncate">{member.name || "Unnamed"}</span>
                                {isMasterAdmin && (
                                  <span className="text-[9px] bg-amber-100 text-amber-900 font-mono font-bold px-1.5 py-0.2 rounded-xs border border-amber-300">
                                    CHIEF
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-stone-400 block truncate">
                                ID: {member.id || "Not provided"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Official Email & Phone */}
                        <td className="p-3.5 font-mono">
                          <div className="text-stone-800 font-medium truncate max-w-[200px]" title={member.email}>
                            {member.email || "Not provided"}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {member.phone || "Not provided"}
                          </div>
                        </td>

                        {/* System Role */}
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs inline-block ${
                              member.role === "super_admin" || member.role === "superadmin"
                                ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                                : member.role === "trainer"
                                ? "bg-teal-100 text-teal-900 border border-teal-300"
                                : member.role === "staff"
                                ? "bg-indigo-100 text-indigo-900 border border-indigo-300"
                                : "bg-blue-100 text-blue-900 border border-blue-300"
                            }`}
                          >
                            {member.role === "super_admin" || member.role === "superadmin"
                              ? "SUPER ADMIN"
                              : member.role === "trainer"
                              ? "TRAINER CHEF"
                              : member.role === "staff"
                              ? "FACULTY STAFF"
                              : "ADMIN / REGISTRAR"}
                          </span>
                        </td>

                        {/* Account Status */}
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wide rounded-xs inline-block ${
                              member.status === "active" || member.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : member.status === "pending"
                                ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                                : member.status === "suspended"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {member.status === "pending" ? "PENDING REVIEW" : member.status?.toUpperCase() || "ACTIVE"}
                          </span>
                        </td>

                        {/* Registration Date */}
                        <td className="p-3.5 font-mono text-[11px] text-stone-600">
                          {formatCreationDate(member.createdAt)}
                        </td>

                        {/* Email Verification Status */}
                        <td className="p-3.5">
                          {member.emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                              <CheckCircle className="h-3 w-3 text-emerald-600" />
                              VERIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-xs">
                              <Clock className="h-3 w-3 text-stone-400" />
                              UNVERIFIED
                            </span>
                          )}
                        </td>

                        {/* Assigned Responsibilities */}
                        <td className="p-3.5 text-stone-700 max-w-[180px]">
                          <span className="truncate block text-[11px]" title={member.responsibilities || member.assignedResponsibilities}>
                            {member.responsibilities || member.assignedResponsibilities || "Not provided"}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Details Button */}
                            <button
                              onClick={() => {
                                setSelectedMember(member);
                                setIsDetailsModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px] font-bold uppercase transition rounded-xs cursor-pointer flex items-center gap-1"
                              title="View Full Profile Details"
                            >
                              <Eye className="h-3 w-3" />
                              <span>{isEn ? "View" : "বিস্তারিত"}</span>
                            </button>

                            {/* Edit / Promote Button */}
                            <button
                              onClick={() => handleOpenEditModal(member)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px] font-bold uppercase transition rounded-xs cursor-pointer flex items-center gap-1"
                              title="Edit Role & Responsibilities"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>{isEn ? "Edit" : "সম্পাদনা"}</span>
                            </button>

                            {/* Status Actions (Guarded for Non-Master) */}
                            {!isMasterAdmin && (
                              <>
                                {member.status === "pending" ? (
                                  <>
                                    <button
                                      onClick={() => handleQuickStatusChange(member, "active")}
                                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[10px] font-bold uppercase transition rounded-xs cursor-pointer shadow-2xs flex items-center gap-1"
                                      title="Approve Team Account"
                                    >
                                      <Check className="h-3 w-3" />
                                      <span>{isEn ? "Approve" : "অনুমোদন"}</span>
                                    </button>
                                    <button
                                      onClick={() => handleQuickStatusChange(member, "blocked")}
                                      className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white font-mono text-[10px] font-bold uppercase transition rounded-xs cursor-pointer shadow-2xs flex items-center gap-1"
                                      title="Reject Team Account"
                                    >
                                      <X className="h-3 w-3" />
                                      <span>{isEn ? "Reject" : "বাতিল"}</span>
                                    </button>
                                  </>
                                ) : member.status === "active" || member.status === "approved" ? (
                                  <button
                                    onClick={() => handleQuickStatusChange(member, "suspended")}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold uppercase transition rounded-xs cursor-pointer"
                                    title="Suspend Member"
                                  >
                                    {isEn ? "Suspend" : "স্থগিত"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleQuickStatusChange(member, "active")}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold uppercase transition rounded-xs cursor-pointer"
                                    title="Reactivate Member"
                                  >
                                    {isEn ? "Activate" : "সক্রিয়"}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================================
            MODAL 1: TEAM MEMBER DETAILS INSPECTOR
           ======================================================== */}
        {isDetailsModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white border border-stone-300 w-full max-w-lg shadow-2xl rounded-xs overflow-hidden">
              {/* Modal Header */}
              <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#E7000B] text-white flex items-center justify-center font-serif font-bold text-sm">
                    {selectedMember.name ? selectedMember.name.charAt(0).toUpperCase() : "T"}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">
                      {selectedMember.name}
                    </h3>
                    <span className="text-[10px] font-mono text-stone-400">
                      System ID: {selectedMember.id}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-stone-400 hover:text-white cursor-pointer p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs font-sans">
                {/* Summary Banner */}
                <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-500 block">Account Role</span>
                    <span className="font-bold text-stone-900 uppercase font-mono text-xs">
                      {selectedMember.role?.toUpperCase() || "STAFF"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block">Account Status</span>
                    <span
                      className={`font-bold uppercase font-mono text-xs px-2 py-0.5 rounded-xs ${
                        selectedMember.status === "active" || selectedMember.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedMember.status === "pending"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {selectedMember.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div className="p-2.5 bg-stone-50/60 border border-stone-100 rounded-xs">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Official Email</span>
                    <span className="font-mono text-stone-900 font-semibold block truncate" title={selectedMember.email}>
                      {selectedMember.email || "Not provided"}
                    </span>
                  </div>

                  <div className="p-2.5 bg-stone-50/60 border border-stone-100 rounded-xs">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Contact Phone</span>
                    <span className="font-mono text-stone-900 font-semibold block">
                      {selectedMember.phone || "Not provided"}
                    </span>
                  </div>

                  <div className="p-2.5 bg-stone-50/60 border border-stone-100 rounded-xs">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Registration Date</span>
                    <span className="font-mono text-stone-900 block">
                      {formatCreationDate(selectedMember.createdAt)}
                    </span>
                  </div>

                  <div className="p-2.5 bg-stone-50/60 border border-stone-100 rounded-xs">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Email Verified</span>
                    <span className="font-mono text-stone-900 font-bold block">
                      {selectedMember.emailVerified ? "YES (VERIFIED)" : "NO (PENDING)"}
                    </span>
                  </div>
                </div>

                {/* Assigned Responsibilities */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">
                    Assigned Responsibilities & Duties
                  </span>
                  <p className="text-stone-800 text-xs leading-relaxed">
                    {selectedMember.responsibilities || selectedMember.assignedResponsibilities || "Not provided."}
                  </p>
                </div>

                {/* Assigned Courses/Batches (if trainer) */}
                {selectedMember.role === "trainer" && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xs space-y-1 text-teal-900">
                    <span className="text-[10px] font-mono uppercase font-bold block">
                      Trainer Faculty Assignment
                    </span>
                    <p className="text-xs">
                      Assigned Batch: {selectedMember.assignedBatchId || "General Faculty"} • Courses:{" "}
                      {selectedMember.assignedCourseIds?.join(", ") || "Level 1 Culinary Arts"}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleOpenEditModal(selectedMember);
                  }}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-mono text-xs uppercase font-bold rounded-xs cursor-pointer transition flex items-center gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-mono text-xs uppercase font-bold rounded-xs cursor-pointer transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: EDIT MEMBER PROFILE & ROLE ASSIGNMENT
           ======================================================== */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white border border-stone-300 w-full max-w-lg shadow-2xl rounded-xs overflow-hidden">
              <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-[#E7000B]" />
                  <h3 className="font-serif font-bold text-sm text-white">
                    Edit Team Account: {editingMember.name}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingMember(null)}
                  className="text-stone-400 hover:text-white cursor-pointer p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditMember} className="p-5 space-y-4 text-xs font-sans">
                {editError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xs font-mono text-[11px]">
                    {editError}
                  </div>
                )}

                {/* Email (Readonly) */}
                <div>
                  <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                    Official Email (Permanent)
                  </label>
                  <input
                    type="text"
                    value={editingMember.email}
                    disabled
                    className="w-full p-2 bg-stone-100 border border-stone-200 text-stone-500 font-mono text-xs rounded-xs cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                    Official Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+880 1711-000000"
                    className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs rounded-xs"
                  />
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                      Account Role *
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                      disabled={editingMember.email?.toLowerCase() === SUPER_ADMIN_EMAIL}
                      className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs font-bold rounded-xs cursor-pointer"
                    >
                      <option value="staff">Staff (Faculty & Operations)</option>
                      <option value="trainer">Trainer (Chef Instructor)</option>
                      <option value="admin">Admin (Registrar)</option>
                      {editingMember.email?.toLowerCase() === SUPER_ADMIN_EMAIL && (
                        <option value="super_admin">Super Admin</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                      Account Status *
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      disabled={editingMember.email?.toLowerCase() === SUPER_ADMIN_EMAIL}
                      className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs font-bold rounded-xs cursor-pointer"
                    >
                      <option value="active">Active (Full Access)</option>
                      <option value="pending">Pending (Awaiting Review)</option>
                      <option value="suspended">Suspended (Access Paused)</option>
                      <option value="blocked">Blocked (Access Revoked)</option>
                    </select>
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                    Assigned Responsibilities & Duties
                  </label>
                  <textarea
                    rows={3}
                    value={editResponsibilities}
                    onChange={(e) => setEditResponsibilities(e.target.value)}
                    placeholder="e.g. Lead Pastry Instructor, Batch B-2026, Inventory Oversight"
                    className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs rounded-xs"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs uppercase font-bold rounded-xs cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-serif font-black text-xs uppercase tracking-wider rounded-xs cursor-pointer transition shadow-xs disabled:opacity-50"
                  >
                    {isSavingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: CREATE STAFF ACCOUNT
           ======================================================== */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white border border-stone-300 w-full max-w-lg shadow-2xl rounded-xs overflow-hidden">
              <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-[#E7000B]" />
                  <h3 className="font-serif font-black text-base text-white">
                    {isEn ? "Create Staff & Faculty Account" : "নতুন স্টাফ বা ট্রেইনার নিয়োগ"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-stone-400 hover:text-white cursor-pointer p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="p-5 space-y-3.5 text-xs font-sans">
                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xs font-mono text-[11px]">
                    {createError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                    {isEn ? "Full Name *" : "পুরো নাম *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Chef Tanvir Ahmed"
                    className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs rounded-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                      {isEn ? "Official Email *" : "অফিসিয়াল ইমেল *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="tanvir@lodonex.com"
                      className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                      {isEn ? "Phone Number" : "ফোন নম্বর"}
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+880 1711-234567"
                      className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                      {isEn ? "Assign Role *" : "পদবী নির্বাচন *"}
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs font-bold rounded-xs cursor-pointer"
                    >
                      <option value="staff">STAFF (Faculty & Operations)</option>
                      <option value="trainer">TRAINER (Chef Instructor)</option>
                      <option value="admin">ADMIN (Registrar Desk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                      {isEn ? "Initial Password *" : "পাসওয়ার্ড *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 font-mono text-xs focus:border-[#E7000B] focus:outline-none rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-stone-500 uppercase font-bold mb-1">
                    {isEn ? "Assigned Responsibilities" : "দায়িত্বসমূহ"}
                  </label>
                  <input
                    type="text"
                    value={newResponsibilities}
                    onChange={(e) => setNewResponsibilities(e.target.value)}
                    placeholder="e.g. Lead Pastry Instructor, Morning Batch"
                    className="w-full p-2 bg-white border border-stone-300 focus:border-[#E7000B] focus:outline-none text-xs rounded-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs uppercase font-bold rounded-xs cursor-pointer transition"
                  >
                    {isEn ? "Cancel" : "বাতিল"}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingStaff}
                    className="px-5 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-serif font-black text-xs uppercase tracking-wider rounded-xs cursor-pointer transition shadow-xs disabled:opacity-50"
                  >
                    {isCreatingStaff ? (isEn ? "Provisioning..." : "তৈরি হচ্ছে...") : (isEn ? "Activate Staff User" : "অ্যাকাউন্ট চালু করুন")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StaffErrorBoundary>
  );
}
