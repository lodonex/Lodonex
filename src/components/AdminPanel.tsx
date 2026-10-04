import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Award,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  CreditCard,
  Send,
  Printer,
  ChevronRight,
  Sparkles,
  Settings,
  RefreshCw,
  X,
  GraduationCap,
  Terminal,
  Mail,
  Download,
  BarChart3,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  Language,
  Course,
  Batch,
  UserAccount,
  EnrollmentApplication,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Exam,
  StudentGradeResult,
  DigitalCertificate,
  PaymentRecord,
  AuditLogEntry
} from "../types";
import { formatPrice } from "../utils/price";
import { useRealtimeDashboard } from "../services/useRealtimeDashboard";
import {
  updateFirestoreEnrollmentStatus,
  updateFirestoreUser,
  createFirestoreBatch,
  issueFirestoreCertificate,
  recordFirestoreAttendance,
  gradeFirestoreSubmission,
  verifyFirestorePayment,
  exportToCSV,
  syncInitialCoursesIfEmpty,
  calculateAttendanceMetrics
} from "../services/dashboardService";

interface AdminPanelProps {
  lang: Language;
  currentUser: UserAccount;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onUpdateUserAccount?: (user: UserAccount) => void;
  initialEnrollments?: EnrollmentApplication[];
  onApproveEnrollmentGlobal?: (appId: string) => void;
  initialUsers?: UserAccount[];
}

export default function AdminPanel({
  lang,
  currentUser,
  courses,
  onSelectCourse,
  onUpdateUserAccount,
  initialEnrollments,
  onApproveEnrollmentGlobal,
  initialUsers
}: AdminPanelProps) {
  const isEn = lang === "en";
  const userRole = currentUser.role || "admin";
  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";
  const isTrainer = userRole === "trainer";

  // Real-time Firestore Dashboard Stream (Super Admin / Admin)
  const {
    users: realtimeUsers,
    filteredUsers,
    courses: realtimeCourses,
    batches: realtimeBatches,
    enrollments: realtimeEnrollments,
    filteredEnrollments,
    payments: realtimePayments,
    filteredPayments,
    attendance: realtimeAttendance,
    filteredAttendance,
    assignments: realtimeAssignments,
    submissions: realtimeSubmissions,
    exams: realtimeExams,
    results: realtimeResults,
    certificates: realtimeCertificates,
    filteredCertificates,
    notifications: realtimeNotifications,
    auditLogs: realtimeAuditLogs,
    isLoading,
    error,
    isLive,
    lastUpdated,
    retry,
    dateFilter,
    setDateFilter,
    selectedCourseFilter,
    setSelectedCourseFilter,
    selectedBatchFilter,
    setSelectedBatchFilter
  } = useRealtimeDashboard({
    isSuperAdmin,
    isAdmin: !isSuperAdmin && userRole === "admin",
    role: userRole,
    userId: currentUser.id
  });

  // Tab State
  const [adminTab, setAdminTab] = useState<
    | "overview"
    | "students"
    | "enrollments"
    | "courses"
    | "batches"
    | "schedule"
    | "attendance"
    | "assignments"
    | "results"
    | "certificates"
    | "payments"
    | "staff"
    | "audit_logs"
    | "email_logs"
    | "settings"
  >("overview");

  // Stores (strictly zero mock data, updated continuously via useRealtimeDashboard)
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [enrollmentsList, setEnrollmentsList] = useState<EnrollmentApplication[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AuditLogEntry[]>([]);
  const [emailLogsList, setEmailLogsList] = useState<any[]>([]);
  const [emailConfig, setEmailConfig] = useState<{ configured: boolean; senderEmail: string } | null>(null);
  const [batchesList, setBatchesList] = useState<Batch[]>([]);
  const [certificatesList, setCertificatesList] = useState<DigitalCertificate[]>([]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>([]);
  const [submissionsList, setSubmissionsList] = useState<AssignmentSubmission[]>([]);
  const [resultsList, setResultsList] = useState<StudentGradeResult[]>([]);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);

  // Synchronize realtime state
  React.useEffect(() => {
    if (realtimeUsers && realtimeUsers.length > 0) setUsersList(realtimeUsers);
  }, [realtimeUsers]);

  React.useEffect(() => {
    if (realtimeEnrollments) setEnrollmentsList(realtimeEnrollments);
  }, [realtimeEnrollments]);

  React.useEffect(() => {
    if (realtimeBatches) setBatchesList(realtimeBatches);
  }, [realtimeBatches]);

  React.useEffect(() => {
    if (realtimeCertificates) setCertificatesList(realtimeCertificates);
  }, [realtimeCertificates]);

  React.useEffect(() => {
    if (realtimeAttendance) setAttendanceList(realtimeAttendance);
  }, [realtimeAttendance]);

  React.useEffect(() => {
    if (realtimeAssignments) setAssignmentsList(realtimeAssignments);
  }, [realtimeAssignments]);

  React.useEffect(() => {
    if (realtimeSubmissions) setSubmissionsList(realtimeSubmissions);
  }, [realtimeSubmissions]);

  React.useEffect(() => {
    if (realtimeResults) setResultsList(realtimeResults);
  }, [realtimeResults]);

  React.useEffect(() => {
    if (realtimePayments) setPaymentsList(realtimePayments);
  }, [realtimePayments]);

  React.useEffect(() => {
    if (realtimeAuditLogs && realtimeAuditLogs.length > 0) {
      setAuditLogsList(realtimeAuditLogs);
    }
  }, [realtimeAuditLogs]);

  React.useEffect(() => {
    // Seed initial accredited courses if courses collection is empty in Firestore
    if (isSuperAdmin && courses && courses.length > 0) {
      syncInitialCoursesIfEmpty(courses);
    }
  }, [isSuperAdmin, courses]);

  React.useEffect(() => {
    async function loadAuditLogs() {
      try {
        const res = await fetch("/api/admin/audit-logs", {
          headers: {
            "x-user-role": userRole,
            "x-user-id": currentUser.id
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.logs && data.logs.length > 0) {
            setAuditLogsList((prev) => (prev.length > 0 ? prev : data.logs));
          }
        }
      } catch (err) {}
    }

    async function loadEmailData() {
      try {
        const [statusRes, logsRes] = await Promise.all([
          fetch("/api/email/status"),
          fetch("/api/email/logs", {
            headers: {
              "x-user-role": userRole,
              "x-user-id": currentUser.id
            }
          })
        ]);
        if (statusRes.ok) {
          const sData = await statusRes.json();
          setEmailConfig(sData);
        }
        if (logsRes.ok) {
          const lData = await logsRes.json();
          if (lData.logs) {
            setEmailLogsList(lData.logs);
          }
        }
      } catch (err) {}
    }

    if (isSuperAdmin) {
      loadAuditLogs();
      loadEmailData();
    }
  }, [isSuperAdmin, userRole, currentUser.id]);

  // Search & Filter States
  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals state
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<UserAccount | null>(null);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isIssueCertOpen, setIsIssueCertOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // New Staff Form State (Super Admin Only)
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"admin" | "staff" | "trainer">("admin");
  const [newStaffPassword, setNewStaffPassword] = useState("StaffPass@2026");
  const [newStaffError, setNewStaffError] = useState("");

  // New Batch Form State
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchCourseId, setNewBatchCourseId] = useState(courses[0]?.id || "course-1");
  const [newBatchTrainer, setNewBatchTrainer] = useState("Chef Tawhid Shekh");
  const [newBatchStartDate, setNewBatchStartDate] = useState("2026-09-01");
  const [newBatchEndDate, setNewBatchEndDate] = useState("2026-12-01");
  const [newBatchDays, setNewBatchDays] = useState("Sunday, Tuesday, Thursday");
  const [newBatchTime, setNewBatchTime] = useState("10:00 AM - 02:00 PM");
  const [newBatchCapacity, setNewBatchCapacity] = useState(16);
  const [newBatchLocation, setNewBatchLocation] = useState("Commercial Hot Kitchen Lab (Campus Dhaka)");

  // New Certificate Form State
  const [certStudentName, setCertStudentName] = useState("");
  const [certStudentEmail, setCertStudentEmail] = useState("");
  const [certCourseId, setCertCourseId] = useState(courses[0]?.id || "course-1");
  const [certGrade, setCertGrade] = useState("Grade A+ (Distinction)");
  const [certHours, setCertHours] = useState("360 Hours");
  const [certSignatory, setCertSignatory] = useState("Chef Dewan / Master Assessor");

  // New Assignment Form State
  const [assignTitle, setAssignTitle] = useState("");
  const [assignCourseId, setAssignCourseId] = useState(courses[0]?.id || "course-1");
  const [assignDueDate, setAssignDueDate] = useState("2026-08-15");
  const [assignMaxMarks, setAssignMaxMarks] = useState(50);
  const [assignDesc, setAssignDesc] = useState("");

  // Grade Entry State
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [givenMarks, setGivenMarks] = useState<number>(45);
  const [givenFeedback, setGivenFeedback] = useState<string>("Exemplary execution and clean plating.");

  // Merchant Credentials Configuration
  const [merchantBkash, setMerchantBkash] = useState("+880 1711-000000");
  const [merchantNagad, setMerchantNagad] = useState("+880 1811-000000");
  const [merchantRocket, setMerchantRocket] = useState("+880 1911-000000");
  const [merchantBank, setMerchantBank] = useState("Eastern Bank PLC (EBL)");
  const [merchantAccNum, setMerchantAccNum] = useState("101234567890");

  // Quick Approve Enrollment Application (Live Firestore)
  const handleApproveEnrollment = async (appId: string) => {
    try {
      await updateFirestoreEnrollmentStatus(appId, "active", currentUser.name);
    } catch (e) {
      console.warn("Firestore updateEnrollment note:", e);
    }
    if (onApproveEnrollmentGlobal) {
      onApproveEnrollmentGlobal(appId);
    }

    // Ensure student user account status is approved as well
    const targetApp = enrollmentsList.find((a) => a.id === appId);
    if (targetApp && targetApp.studentId) {
      try {
        await updateFirestoreUser(targetApp.studentId, {
          status: "approved",
          assignedBatchId: targetApp.batchId || undefined
        });
      } catch (e) {}
    }
  };

  // Change User Status (Live Firestore)
  const handleUpdateStudentStatus = async (userId: string, newStatus: "active" | "approved" | "suspended" | "blocked") => {
    try {
      await updateFirestoreUser(userId, { status: newStatus });
    } catch (e) {
      console.warn("Firestore updateStatus note:", e);
    }
  };

  // Handle Create Batch (Live Firestore)
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find((c) => c.id === newBatchCourseId);

    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      name: newBatchName,
      courseId: newBatchCourseId,
      courseTitle: selCourse ? (isEn ? selCourse.titleEn : selCourse.titleBn) : "Culinary Arts",
      trainerId: "trainer-tawhid-1",
      trainerName: newBatchTrainer,
      startDate: newBatchStartDate,
      endDate: newBatchEndDate,
      classDays: newBatchDays.split(",").map((d) => d.trim()),
      classTime: newBatchTime,
      maxStudents: Number(newBatchCapacity),
      enrolledStudentsCount: 0,
      location: newBatchLocation,
      status: "upcoming"
    };

    try {
      await createFirestoreBatch(newBatch);
    } catch (e) {
      console.warn("Firestore createBatch note:", e);
    }
    setIsAddBatchOpen(false);
    setNewBatchName("");
  };

  // Handle Create Staff / Trainer (Super Admin Only)
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewStaffError("");

    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword) {
      setNewStaffError(isEn ? "All fields are required." : "সকল তথ্য পূরণ করুন।");
      return;
    }

    const cleanEmail = newStaffEmail.trim().toLowerCase();
    if (usersList.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setNewStaffError(isEn ? "A user with this email address already exists." : "এই ইমেলে ইতোমধ্যে একজন ব্যবহারকারী আছেন।");
      return;
    }

    const newStaffUser: UserAccount = {
      id: `${newStaffRole}-${Date.now()}`,
      name: newStaffName.trim(),
      email: cleanEmail,
      phone: newStaffPhone.trim(),
      password: newStaffPassword,
      role: newStaffRole,
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      progress: {
        enrolledCourses: newStaffRole === "trainer" ? ["course-1"] : [],
        completedLessons: [],
        quizScores: {},
        customRecipes: [],
        badges: []
      }
    };

    setUsersList((prev) => [...prev, newStaffUser]);
    if (onUpdateUserAccount) {
      onUpdateUserAccount(newStaffUser);
    }

    // Call backend API
    try {
      await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": userRole,
          "x-user-id": currentUser.id
        },
        body: JSON.stringify({
          name: newStaffName.trim(),
          email: cleanEmail,
          phone: newStaffPhone.trim(),
          role: newStaffRole,
          password: newStaffPassword,
        })
      });
    } catch (err) {}

    setIsAddStaffOpen(false);
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPhone("");
    setNewStaffPassword("StaffPass@2026");
  };

  // Handle Issue Digital Certificate (Live Firestore)
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find((c) => c.id === certCourseId);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const certNum = `LOD-CERT-2026-${randomNum}`;

    const newCert: DigitalCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      studentId: `student-${Date.now()}`,
      studentName: certStudentName,
      studentEmail: certStudentEmail,
      courseId: certCourseId,
      courseTitle: selCourse ? selCourse.titleEn : "Culinary Foundation",
      batchName: "Graduating Masterclass Cohort",
      completionDate: new Date().toISOString().split("T")[0],
      issueDate: new Date().toISOString().split("T")[0],
      duration: "3 Months (360 Hours)",
      trainingHours: certHours,
      grade: certGrade,
      authorizedSignatory: certSignatory,
      signatoryTitle: "Director of Culinary Education & Master Assessor",
      isValid: true
    };

    try {
      await issueFirestoreCertificate(newCert);
    } catch (e) {
      console.warn("Firestore issueCertificate note:", e);
    }
    setIsIssueCertOpen(false);
    setCertStudentName("");
    setCertStudentEmail("");
  };

  // Handle Mark Attendance (Live Firestore)
  const handleToggleAttendance = async (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    const student = usersList.find((u) => u.id === studentId);
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      batchId: batchesList[0]?.id || "batch-101",
      courseId: courses[0]?.id || "course-1",
      date: new Date().toISOString().split("T")[0],
      studentId,
      studentName: student ? student.name : "Apprentice",
      status,
      markedBy: currentUser.name
    };

    try {
      await recordFirestoreAttendance([newRecord]);
    } catch (e) {
      console.warn("Firestore toggleAttendance note:", e);
    }
  };

  // Handle Grade Submission (Live Firestore)
  const handleSaveGrade = async (subId: string) => {
    try {
      await gradeFirestoreSubmission(subId, Number(givenMarks), givenFeedback, currentUser.name);
    } catch (e) {
      console.warn("Firestore saveGrade note:", e);
    }
    setGradingSubId(null);
  };

  // Filter students
  const filteredStudents = usersList.filter((u) => {
    if (u.role !== "student") return false;
    const matchesSearch =
      u.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(studentSearch));
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasPermission = (perm: string) => {
    if (isSuperAdmin) return true;
    if (!currentUser.permissions || currentUser.permissions.length === 0) return true;
    return currentUser.permissions.includes(perm);
  };

  return (
    <div id="lodonex-admin-panel" className="font-sans text-slate-900 pb-16">
      {/* Admin Panel Top Banner */}
      <div className="bg-[#111] text-white border-b-2 border-editorial-accent py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-editorial-accent/20 border border-editorial-accent text-editorial-accent flex items-center justify-center font-bold">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-widest border ${
                  isSuperAdmin
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                    : "bg-editorial-accent text-white border-transparent"
                }`}>
                  {userRole === "super_admin" || userRole === "superadmin" ? "SUPER ADMIN" : userRole.toUpperCase()} ACCESS
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/90 font-mono font-bold">Operator: {currentUser.name}</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isEn ? "Lodonex Academy Administration Portal" : "লোডোনেক্স একাডেমি প্রশাসনিক প্যানেল"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddBatchOpen(true)}
              className="px-3 py-1.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isEn ? "Create Batch" : "নতুন ব্যাচ"}</span>
            </button>
            <button
              onClick={() => setIsIssueCertOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <Award className="h-3.5 w-3.5" />
              <span>{isEn ? "Issue Certificate" : "সার্টিফিকেট ইস্যু"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Admin Navigation Tabs with Permission Filtering */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-editorial-border pb-px text-xs font-bold uppercase tracking-wider">
          {[
            { id: "overview", label: isEn ? "KPI Dashboard" : "ড্যাশবোর্ড", icon: ShieldCheck, show: true },
            { id: "enrollments", label: isEn ? "Enrollments" : "ভর্তি আবেদন", icon: UserCheck, show: hasPermission("enrollments.view") },
            { id: "students", label: isEn ? "Student Roster" : "শিক্ষার্থী তালিকা", icon: Users, show: hasPermission("students.view") },
            { id: "batches", label: isEn ? "Batches" : "ব্যাচসমূহ", icon: Calendar, show: hasPermission("courses.view") },
            { id: "courses", label: isEn ? "Courses" : "কোর্সসমূহ", icon: BookOpen, show: hasPermission("courses.view") },
            { id: "attendance", label: isEn ? "Attendance" : "হাজিরা খাতা", icon: CheckCircle, show: hasPermission("attendance.view") },
            { id: "schedule", label: isEn ? "Class Schedule" : "ক্লাস সিডিউল", icon: Clock, show: hasPermission("courses.view") },
            { id: "assignments", label: isEn ? "Assignments & Work" : "অ্যাসাইনমেন্ট", icon: GraduationCap, show: hasPermission("assignments.view") },
            { id: "results", label: isEn ? "Gradebook & Marks" : "গ্রেড ও নম্বর", icon: Award, show: hasPermission("reports.view") },
            { id: "certificates", label: isEn ? "Certificates" : "সার্টিফিকেট", icon: Shield, show: hasPermission("certificates.view") },
            { id: "payments", label: isEn ? "Payments & Trx" : "পেমেন্ট লগ", icon: DollarSign, show: !isTrainer && hasPermission("payments.view") },
            { id: "staff", label: isEn ? "Staff / Trainers" : "স্টাফ ও ট্রেইনার", icon: Users, show: isSuperAdmin },
            { id: "audit_logs", label: isEn ? "Audit Logs" : "অডিট লগ", icon: Terminal, show: isSuperAdmin },
            { id: "email_logs", label: isEn ? "Email Logs" : "ইমেল লগ", icon: Mail, show: isSuperAdmin },
            { id: "settings", label: isEn ? "Gateways / Settings" : "পেমেন্ট গেটওয়ে", icon: Settings, show: isSuperAdmin },
          ]
            .filter((t) => t.show)
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap border-b-2 transition cursor-pointer ${
                    isActive
                      ? "border-editorial-accent text-editorial-accent font-extrabold bg-red-50/50"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
        </div>

        {/* ========================================================
            TAB 1: REAL-TIME OVERVIEW DASHBOARD
           ======================================================== */}
        {adminTab === "overview" && (
          <div className="space-y-8 mt-6">
            {/* Live Status & Filter Toolbar */}
            <div className="bg-white border border-editorial-border p-4 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-editorial-border pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <div>
                    <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <span>● Live Real-Time Firestore</span>
                      <span className="text-slate-400 font-normal">|</span>
                      <span className="text-slate-600 font-sans font-medium">
                        {isEn ? "Source: Firebase Database" : "উৎস: ফায়ারবেস ডেটাবেস"}
                      </span>
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {isEn ? "Last updated:" : "সর্বশেষ আপডেট:"}{" "}
                      {lastUpdated ? lastUpdated.toLocaleTimeString() : (isEn ? "Live" : "সক্রিয়")}
                    </p>
                  </div>
                </div>

                {/* CSV Export & Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      exportToCSV(
                        `lodonex-students-${Date.now()}`,
                        ["ID", "Name", "Email", "Phone", "Role", "Status", "Created At"],
                        filteredUsers
                          .filter((u) => u.role === "student")
                          .map((u) => [u.id, u.name, u.email, u.phone || "", u.role || "student", u.status, u.createdAt || ""])
                      );
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                    title="Export Student Roster to CSV"
                  >
                    <Download className="h-3 w-3" />
                    <span>{isEn ? "Export Students" : "শিক্ষার্থী এক্সপোর্ট"}</span>
                  </button>

                  <button
                    onClick={() => {
                      exportToCSV(
                        `lodonex-enrollments-${Date.now()}`,
                        ["ID", "Student Name", "Email", "Course", "Batch", "TrxID", "Status", "Applied At"],
                        filteredEnrollments.map((e) => [
                          e.id,
                          e.studentName,
                          e.studentEmail,
                          e.courseTitle,
                          e.batchName || "",
                          e.transactionId || "",
                          e.status,
                          e.appliedAt
                        ])
                      );
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                    title="Export Enrollments to CSV"
                  >
                    <Download className="h-3 w-3" />
                    <span>{isEn ? "Export Enrollments" : "এনরোলমেন্ট এক্সপোর্ট"}</span>
                  </button>

                  <button
                    onClick={() => {
                      exportToCSV(
                        `lodonex-payments-${Date.now()}`,
                        ["Invoice", "Student Email", "Gateway", "TrxID", "Amount", "Status", "Timestamp"],
                        filteredPayments.map((p) => [
                          p.invoiceNumber,
                          p.studentEmail,
                          p.gateway,
                          p.trxId,
                          p.amount,
                          p.status,
                          p.timestamp
                        ])
                      );
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                    title="Export Payments to CSV"
                  >
                    <Download className="h-3 w-3" />
                    <span>{isEn ? "Export Payments" : "পেমেন্ট এক্সপোর্ট"}</span>
                  </button>

                  <button
                    onClick={retry}
                    className="p-1.5 text-slate-600 hover:text-editorial-accent border border-slate-300 hover:border-editorial-accent transition cursor-pointer"
                    title="Refresh Live Data"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Date Filter Pills */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                    <Filter className="h-3 w-3" /> {isEn ? "Date Range:" : "তারিখ:"}
                  </span>
                  {[
                    { id: "all", labelEn: "All Time", labelBn: "সর্বকাল" },
                    { id: "today", labelEn: "Today", labelBn: "আজ" },
                    { id: "week", labelEn: "This Week", labelBn: "চলতি সপ্তাহ" },
                    { id: "month", labelEn: "This Month", labelBn: "চলতি মাস" },
                    { id: "last_month", labelEn: "Last Month", labelBn: "গত মাস" },
                    { id: "year", labelEn: "This Year", labelBn: "চলতি বছর" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setDateFilter(f.id as any)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        dateFilter === f.id
                          ? "bg-editorial-accent text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isEn ? f.labelEn : f.labelBn}
                    </button>
                  ))}
                </div>

                {/* Course & Batch Selectors */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs px-2.5 py-1 text-slate-700 focus:outline-hidden font-medium"
                  >
                    <option value="all">{isEn ? "All Courses" : "সকল কোর্স"}</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isEn ? c.titleEn : c.titleBn}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedBatchFilter}
                    onChange={(e) => setSelectedBatchFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs px-2.5 py-1 text-slate-700 focus:outline-hidden font-medium"
                  >
                    <option value="all">{isEn ? "All Batches" : "সকল ব্যাচ"}</option>
                    {batchesList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="p-8 bg-white border border-editorial-border text-center space-y-3">
                <RefreshCw className="h-6 w-6 animate-spin text-editorial-accent mx-auto" />
                <p className="font-serif font-bold text-slate-700 text-base">
                  {isEn ? "Loading real-time data from Firebase..." : "ফায়ারবেস থেকে রিয়েল-টাইম তথ্য লোড হচ্ছে..."}
                </p>
                <p className="text-xs text-slate-500">
                  {isEn ? "Establishing live document listeners..." : "লাইভ ডেটা স্ট্রীম যুক্ত হচ্ছে..."}
                </p>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                  <p className="text-xs text-red-800 font-medium">
                    {isEn ? "Unable to load real-time data." : "রিয়েল-টাইম তথ্য লোড করা সম্ভব হয়নি।"} {error}
                  </p>
                </div>
                <button
                  onClick={retry}
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase cursor-pointer shrink-0"
                >
                  {isEn ? "Try Again" : "আবার চেষ্টা করুন"}
                </button>
              </div>
            )}

            {/* Super Admin & Admin Complete Metrics Grid */}
            {!isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* 1. Students Metric */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Total Students" : "মোট শিক্ষার্থী"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-editorial-dark">
                    {filteredUsers.filter((u) => u.role === "student").length}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap font-mono">
                    <span className="text-emerald-700 font-bold">
                      {filteredUsers.filter((u) => u.role === "student" && (u.status === "active" || u.status === "approved")).length} active
                    </span>
                    <span>•</span>
                    <span className="text-amber-700">
                      {filteredUsers.filter((u) => u.role === "student" && u.status === "pending").length} pending
                    </span>
                    <span>•</span>
                    <span className="text-red-700">
                      {filteredUsers.filter((u) => u.role === "student" && (u.status === "suspended" || u.status === "blocked")).length} susp
                    </span>
                  </div>
                </div>

                {/* 2. Admin & Staff Team */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Administrative Staff" : "প্রশাসনিক কর্মী"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-indigo-700">
                    {filteredUsers.filter((u) => ["super_admin", "superadmin", "admin", "staff"].includes(u.role || "")).length}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap font-mono">
                    <span>
                      {filteredUsers.filter((u) => u.role === "admin" || u.role === "super_admin" || u.role === "superadmin").length} admins
                    </span>
                    <span>•</span>
                    <span>{filteredUsers.filter((u) => u.role === "staff").length} staff</span>
                  </div>
                </div>

                {/* 3. Trainers / Chefs */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Total Trainers" : "মোট ট্রেইনার"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-teal-700">
                    {filteredUsers.filter((u) => u.role === "trainer").length}
                  </div>
                  <p className="text-[10px] text-teal-600 font-medium">
                    {isEn ? "Executive Culinary Faculty" : "অনুষদ ও শেফ প্রশিক্ষক"}
                  </p>
                </div>

                {/* 4. Active Courses */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Courses & Batches" : "কোর্স ও ব্যাচ"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-editorial-accent">
                    {courses.length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    <span className="text-blue-700 font-bold">{batchesList.filter((b) => b.status === "active").length} active</span>
                    <span> / {batchesList.length} batches</span>
                  </div>
                </div>

                {/* 5. Enrollments */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Total Enrollments" : "মোট ভর্তি আবেদন"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-slate-900">
                    {filteredEnrollments.length}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap font-mono">
                    <span className="text-amber-700 font-bold">
                      {filteredEnrollments.filter((e) => ["applied", "under_review", "pending_payment", "payment_submitted"].includes(e.status)).length} pending
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700">
                      {filteredEnrollments.filter((e) => e.status === "active" || e.status === "approved").length} active
                    </span>
                  </div>
                </div>

                {/* 6. Total Revenue */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Total Revenue" : "মোট সংগৃহীত ফি"}
                  </span>
                  <div className="font-serif text-xl font-extrabold text-slate-900 truncate">
                    {formatPrice(filteredPayments.filter((p) => p.status === "verified").reduce((a, b) => a + b.amount, 0))}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    {filteredPayments.filter((p) => p.status === "verified").length} {isEn ? "Verified Receipts" : "যাচাইকৃত রসিদ"}
                  </p>
                </div>

                {/* 7. Pending Payments */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Pending Payments" : "অমীমাংসিত ফি"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-amber-800">
                    {filteredPayments.filter((p) => p.status === "pending" || p.status === "submitted").length}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {filteredPayments.filter((p) => p.status === "rejected").length} rejected
                  </p>
                </div>

                {/* 8. Digital Certificates */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Certificates Issued" : "ইস্যুকৃত সনদ"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-purple-700">
                    {filteredCertificates.length}
                  </div>
                  <p className="text-[10px] text-purple-600 font-medium">
                    {filteredCertificates.filter((c) => c.isValid).length} {isEn ? "Verifiable Online" : "যাচাইযোগ্য সনদ"}
                  </p>
                </div>

                {/* 9. Attendance Metrics */}
                {(() => {
                  const attM = calculateAttendanceMetrics(filteredAttendance);
                  return (
                    <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isEn ? "Attendance Health" : "হাজিরা পরিসংখ্যান"}
                      </span>
                      <div className="font-serif text-2xl font-extrabold text-emerald-700">
                        {attM.total > 0 ? `${attM.rate}%` : "0%"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {attM.total > 0 ? `${attM.present}P • ${attM.absent}A • ${attM.late}L` : (isEn ? "No records yet" : "রেকর্ড নেই")}
                      </div>
                    </div>
                  );
                })()}

                {/* 10. Academic Work & Exams */}
                <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? "Assignments & Work" : "অ্যাসাইনমেন্ট ও পরীক্ষা"}
                  </span>
                  <div className="font-serif text-2xl font-extrabold text-slate-800">
                    {assignmentsList.length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    <span>{submissionsList.length} subs</span>
                    <span> • </span>
                    <span className="text-emerald-700 font-bold">{resultsList.length} grades</span>
                  </div>
                </div>
              </div>
            )}

            {/* REAL-TIME DYNAMIC CHARTS & VISUAL REPORTS (Calculated strictly from Firebase) */}
            {!isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Enrollment Distribution by Course */}
                <div className="bg-white border border-editorial-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-editorial-dark flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "Course Popularity & Enrollments" : "কোর্স অনুযায়ী আবেদন বন্টন"}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {isEn ? "Real-time" : "লাইভ"}
                    </span>
                  </div>

                  {filteredEnrollments.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
                    </div>
                  ) : (
                    <div className="space-y-2.5 pt-2">
                      {courses.map((course) => {
                        const count = filteredEnrollments.filter((e) => e.courseId === course.id).length;
                        const pct = filteredEnrollments.length > 0 ? Math.round((count / filteredEnrollments.length) * 100) : 0;
                        return (
                          <div key={course.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-800 truncate max-w-[220px]">
                                {isEn ? course.titleEn : course.titleBn}
                              </span>
                              <span className="font-mono text-slate-600 font-bold">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-editorial-accent transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chart 2: Revenue Trend & Payment Verification Health */}
                <div className="bg-white border border-editorial-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-editorial-dark flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-700" />
                      <span>{isEn ? "Payment Breakdown & Financial Health" : "পেমেন্ট অবস্থা ও রসিদ যাচাই"}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {isEn ? "Real-time" : "লাইভ"}
                    </span>
                  </div>

                  {filteredPayments.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {(() => {
                        const verifiedCount = filteredPayments.filter((p) => p.status === "verified").length;
                        const pendingCount = filteredPayments.filter((p) => p.status === "pending" || p.status === "submitted").length;
                        const rejectedCount = filteredPayments.filter((p) => p.status === "rejected").length;
                        const totalCount = filteredPayments.length;

                        const verifiedPct = Math.round((verifiedCount / totalCount) * 100);
                        const pendingPct = Math.round((pendingCount / totalCount) * 100);
                        const rejectedPct = Math.round((rejectedCount / totalCount) * 100);

                        return (
                          <>
                            <div className="flex h-4 w-full overflow-hidden bg-slate-100">
                              <div style={{ width: `${verifiedPct}%` }} className="bg-emerald-600" title={`Verified: ${verifiedCount}`} />
                              <div style={{ width: `${pendingPct}%` }} className="bg-amber-500" title={`Pending: ${pendingCount}`} />
                              <div style={{ width: `${rejectedPct}%` }} className="bg-red-500" title={`Rejected: ${rejectedCount}`} />
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2">
                              <div className="p-2 bg-emerald-50 border border-emerald-200">
                                <span className="text-[10px] text-emerald-800 uppercase font-bold block">{isEn ? "Verified" : "যাচাইকৃত"}</span>
                                <span className="font-extrabold text-emerald-900 text-sm">{verifiedCount} ({verifiedPct}%)</span>
                              </div>
                              <div className="p-2 bg-amber-50 border border-amber-200">
                                <span className="text-[10px] text-amber-800 uppercase font-bold block">{isEn ? "Pending" : "অমীমাংসিত"}</span>
                                <span className="font-extrabold text-amber-900 text-sm">{pendingCount} ({pendingPct}%)</span>
                              </div>
                              <div className="p-2 bg-red-50 border border-red-200">
                                <span className="text-[10px] text-red-800 uppercase font-bold block">{isEn ? "Rejected" : "বাতিল"}</span>
                                <span className="font-extrabold text-red-900 text-sm">{rejectedCount} ({rejectedPct}%)</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Chart 3: Grade Distribution from Real Assessments */}
                <div className="bg-white border border-editorial-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-editorial-dark flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-700" />
                      <span>{isEn ? "Academic Performance & Grade Distribution" : "শিক্ষার্থীদের ফলাফল ও গ্রেড বিন্যাস"}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {isEn ? "Real-time" : "লাইভ"}
                    </span>
                  </div>

                  {resultsList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {[
                        { grade: "Grade A+ (Distinction)", label: "A+ Distinction", color: "bg-purple-600" },
                        { grade: "Grade A (Excellent)", label: "A Excellent", color: "bg-emerald-600" },
                        { grade: "Grade B (Good)", label: "B Good", color: "bg-blue-600" },
                        { grade: "Grade C (Pass)", label: "C Pass", color: "bg-amber-600" },
                      ].map((g) => {
                        const count = resultsList.filter((r) => r.grade?.includes(g.grade.split(" ")[0])).length;
                        const pct = resultsList.length > 0 ? Math.round((count / resultsList.length) * 100) : 0;
                        return (
                          <div key={g.grade} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-800">{g.label}</span>
                              <span className="font-mono text-slate-600 font-bold">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 overflow-hidden">
                              <div className={`h-full ${g.color}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chart 4: Attendance Health Breakdown */}
                <div className="bg-white border border-editorial-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-editorial-dark flex items-center gap-2">
                      <Activity className="h-4 w-4 text-editorial-accent" />
                      <span>{isEn ? "Attendance Health Log" : "হাজিরা পরিস্থিতি"}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {isEn ? "Real-time" : "লাইভ"}
                    </span>
                  </div>

                  {filteredAttendance.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      {isEn ? "No data available yet." : "এখনও কোনো তথ্য নেই।"}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {(() => {
                        const total = filteredAttendance.length;
                        const present = filteredAttendance.filter((a) => a.status === "present").length;
                        const absent = filteredAttendance.filter((a) => a.status === "absent").length;
                        const late = filteredAttendance.filter((a) => a.status === "late").length;
                        const excused = filteredAttendance.filter((a) => a.status === "excused").length;

                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                            <div className="p-3 bg-emerald-50 border border-emerald-200">
                              <span className="text-[10px] text-emerald-800 uppercase font-bold block">{isEn ? "Present" : "উপস্থিত"}</span>
                              <span className="font-extrabold text-emerald-900 text-lg">{present}</span>
                              <span className="text-[10px] text-emerald-700 block">{Math.round((present / total) * 100)}%</span>
                            </div>
                            <div className="p-3 bg-red-50 border border-red-200">
                              <span className="text-[10px] text-red-800 uppercase font-bold block">{isEn ? "Absent" : "অনুপস্থিত"}</span>
                              <span className="font-extrabold text-red-900 text-lg">{absent}</span>
                              <span className="text-[10px] text-red-700 block">{Math.round((absent / total) * 100)}%</span>
                            </div>
                            <div className="p-3 bg-amber-50 border border-amber-200">
                              <span className="text-[10px] text-amber-800 uppercase font-bold block">{isEn ? "Late" : "দেরি"}</span>
                              <span className="font-extrabold text-amber-900 text-lg">{late}</span>
                              <span className="text-[10px] text-amber-700 block">{Math.round((late / total) * 100)}%</span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200">
                              <span className="text-[10px] text-blue-800 uppercase font-bold block">{isEn ? "Excused" : "ছুটি"}</span>
                              <span className="font-extrabold text-blue-900 text-lg">{excused}</span>
                              <span className="text-[10px] text-blue-700 block">{Math.round((excused / total) * 100)}%</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Review Applications Queue */}
            <div className="bg-white border border-editorial-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-editorial-dark">
                    {isEn ? "Immediate Admission Review Queue" : "তাৎক্ষণিক ভর্তি আবেদন রিভিউ তালিকা"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEn
                      ? "Review applicant TrxID and click 'Approve & Unlock' to grant instant classroom and lesson access."
                      : "পেমেন্ট TrxID চেক করে সরাসরি অনুমোদন দিয়ে ক্লাসরুম উন্মুক্ত করুন।"}
                  </p>
                </div>
                <button
                  onClick={() => setAdminTab("enrollments")}
                  className="text-xs font-bold text-editorial-accent hover:underline uppercase"
                >
                  {isEn ? "View All Enrollments" : "সকল আবেদন দেখুন"} →
                </button>
              </div>

              {filteredEnrollments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  {isEn ? "No data available yet. No pending enrollment applications." : "এখনও কোনো আবেদন জমা পড়েনি।"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Course / Level</th>
                        <th className="p-3">Payment TrxID</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnrollments.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{app.studentName}</span>
                            <span className="text-[11px] text-slate-500">{app.studentEmail} • {app.studentPhone}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-700">{app.courseTitle}</td>
                          <td className="p-3">
                            {app.transactionId ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                                {app.paymentMethod}: {app.transactionId}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">No TrxID submitted</span>
                            )}
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
                          <td className="p-3 text-right">
                            {app.status !== "active" && app.status !== "approved" ? (
                              <button
                                onClick={() => handleApproveEnrollment(app.id)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase tracking-wider transition cursor-pointer"
                              >
                                {isEn ? "Approve & Unlock" : "অনুমোদন করুন"}
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>{isEn ? "Enrolled & Active" : "সক্রিয়"}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* REAL RECENT FIREBASE AUDIT TRAIL & ACTIVITIES */}
            <div className="bg-white border border-editorial-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-editorial-dark flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-editorial-accent" />
                    <span>{isEn ? "Recent Firebase Activities & Audit Trail" : "সাম্প্রতিক ফায়ারবেস অ্যাক্টিভিটি লগ"}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEn ? "Immutable chronological record of live operations across the academy." : "একাডেমির সকল রিয়েল-টাইম অপারেশন ও পরিবর্তন লগ।"}
                  </p>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => setAdminTab("audit_logs")}
                    className="text-xs font-bold text-editorial-accent hover:underline uppercase"
                  >
                    {isEn ? "View Complete Log" : "সম্পূর্ণ লগ দেখুন"} →
                  </button>
                )}
              </div>

              {auditLogsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  {isEn ? "No recent activities recorded yet." : "এখনও কোনো অ্যাক্টিভিটি রেকর্ড নেই।"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Actor</th>
                        <th className="p-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogsList.slice(0, 6).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                          <td className="p-3 text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold border border-slate-200 text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {log.actorName} ({log.actorRole})
                          </td>
                          <td className="p-3 text-slate-600 max-w-md truncate">
                            {log.details}
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

        {/* ========================================================
            TAB 2: ENROLLMENTS MANAGEMENT
           ======================================================== */}
        {adminTab === "enrollments" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Course Enrollment Applications" : "কোর্স এনরোলমেন্ট আবেদনপত্র"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Review incoming applications, verify mobile banking or bank wire payments, and allocate batches." : "শিক্ষার্থীদের আবেদন ও পেমেন্ট যাচাই করে ব্যাচ বরাদ্দ করুন।"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Assigned Batch</th>
                    <th className="p-3">Method & TrxID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollmentsList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[10px] font-bold text-slate-500">{app.id}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{app.studentName}</span>
                        <span className="text-[11px] text-slate-500">{app.studentEmail}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{app.courseTitle}</td>
                      <td className="p-3 text-slate-600">{app.batchName || "Not assigned"}</td>
                      <td className="p-3 font-mono text-[11px]">
                        {app.transactionId ? `${app.paymentMethod}: ${app.transactionId}` : "Unpaid"}
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
                      <td className="p-3 text-right space-x-2">
                        {app.status !== "active" && (
                          <button
                            onClick={() => handleApproveEnrollment(app.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            try {
                              await updateFirestoreEnrollmentStatus(app.id, "rejected", currentUser.name);
                            } catch (e) {
                              console.warn("Firestore rejectEnrollment note:", e);
                            }
                          }}
                          className="px-2.5 py-1 border border-slate-300 hover:border-red-600 text-slate-700 hover:text-red-600 font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: STUDENTS MANAGEMENT
           ======================================================== */}
        {adminTab === "students" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Student Accounts & Access Control" : "শিক্ষার্থী তালিকা ও পারমিশন"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Manage apprentice dossiers, activation status, and batch assignments." : "শিক্ষার্থীদের অ্যাকাউন্ট স্ট্যাটাস সক্রিয়, স্থগিত বা ব্লক করুন।"}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={isEn ? "Search by name, email, phone..." : "নাম বা ইমেল দিয়ে খুঁজুন..."}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="px-3 py-1.5 border border-editorial-border text-xs bg-white text-slate-900 focus:outline-none focus:border-editorial-accent"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-editorial-border text-xs bg-white text-slate-900 focus:outline-none focus:border-editorial-accent"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">City / Address</th>
                    <th className="p-3">Assigned Batch</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{st.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">ID: {st.id}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-slate-800 block">{st.email}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{st.phone || "—"}</span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {st.city || "Dhaka"}, {st.country || "Bangladesh"}
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        {st.assignedBatchId || "No batch assigned"}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          st.status === "approved" || st.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : st.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {st.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedStudentForDossier(st)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase"
                        >
                          Dossier
                        </button>
                        {st.status !== "approved" && st.status !== "active" ? (
                          <button
                            onClick={() => handleUpdateStudentStatus(st.id, "approved")}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStudentStatus(st.id, "suspended")}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[10px] uppercase"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: BATCHES MANAGEMENT
           ======================================================== */}
        {adminTab === "batches" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Cohort & Batch Scheduling" : "ব্যাচ ও সময়সূচি"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Organize student batches, assign lead chefs, and limit maximum workshop capacity." : "ব্যাচ তৈরি, আসন সংখ্যা নির্ধারণ এবং প্রশিক্ষক নিয়োগ করুন।"}
                </p>
              </div>
              <button
                onClick={() => setIsAddBatchOpen(true)}
                className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>{isEn ? "Create New Batch" : "নতুন ব্যাচ খুলুন"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batchesList.map((batch) => (
                <div key={batch.id} className="bg-white border border-editorial-border p-6 space-y-4 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-editorial-accent font-mono">
                        {batch.courseTitle}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-editorial-dark mt-0.5">
                        {batch.name}
                      </h3>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      batch.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {batch.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-y border-slate-100 py-3">
                    <p>👨‍🍳 <strong>Trainer:</strong> {batch.trainerName}</p>
                    <p>📅 <strong>Duration:</strong> {batch.startDate} to {batch.endDate}</p>
                    <p>⏰ <strong>Timing:</strong> {batch.classDays.join(", ")} ({batch.classTime})</p>
                    <p>📍 <strong>Lab:</strong> {batch.location}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Enrolled: <strong>{batch.enrolledStudentsCount}</strong> / {batch.maxStudents} Seats
                    </span>
                    <button
                      onClick={() => alert(`Opening student roster for ${batch.name}`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase"
                    >
                      View Roster
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: COURSES MANAGEMENT
           ======================================================== */}
        {adminTab === "courses" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Course Catalog & Syllabus Configuration" : "কোর্স ক্যাটালগ ও সিলেবাস কনফিগারেশন"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Configure tuition fees, modules, training hours, and tutorial videos." : "কোর্সের ফি, প্রশিক্ষণ ঘণ্টা এবং মডিউল পরিচালনা করুন।"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border border-editorial-border p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={course.image} alt={course.titleEn} className="h-16 w-20 object-cover border border-editorial-border shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-wider">
                        {course.levelEn} • {course.duration}
                      </span>
                      <h3 className="font-serif font-bold text-base text-slate-900">
                        {isEn ? course.titleEn : course.titleBn}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {course.lessons.length} Modules • Tuition: <strong className="text-editorial-dark">{formatPrice(course.price)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-3 py-1.5 border border-slate-300 hover:border-slate-800 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      {isEn ? "Inspect Curriculum" : "সিলেবাস দেখুন"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: ATTENDANCE MANAGEMENT
           ======================================================== */}
        {adminTab === "attendance" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Practical Kitchen Attendance Management" : "ব্যবহারিক কিচেন হাজিরা খাতা"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Mark attendance for today's active masterclass sessions." : "আজকের ব্যবহারিক সেশনের উপস্থিতি মার্ক করুন।"}
                </p>
              </div>
              <span className="font-mono text-xs font-bold bg-slate-100 px-3 py-1 border border-slate-200">
                DATE: {new Date().toISOString().split("T")[0]}
              </span>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Mark Status for Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.filter((u) => u.role === "student").map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 text-slate-600">{st.assignedBatchId || "LQF-1 Morning Cohort"}</td>
                      <td className="p-3 flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleAttendance(st.id, "present")}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold uppercase text-[10px] transition cursor-pointer"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(st.id, "late")}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold uppercase text-[10px] transition cursor-pointer"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(st.id, "absent")}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold uppercase text-[10px] transition cursor-pointer"
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleToggleAttendance(st.id, "excused")}
                          className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold uppercase text-[10px] transition cursor-pointer"
                        >
                          Excused
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: ASSIGNMENTS & GRADING
           ======================================================== */}
        {adminTab === "assignments" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Course Assignments & Apprentice Submissions" : "অ্যাসাইনমেন্ট ও জমাকৃত খাতা মূল্যায়ন"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Review submitted portfolios, knife precision pictures, and enter feedback." : "শিক্ষার্থীদের জমাকৃত অ্যাসাইনমেন্ট দেখে নম্বর ও ফিডব্যাক দিন।"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Assignment Title</th>
                    <th className="p-3">Submission Notes / Attachment</th>
                    <th className="p-3">Marks</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissionsList.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                      <td className="p-3 text-slate-700">Assignment 1: Classical Knife Cuts</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {sub.contentText}
                      </td>
                      <td className="p-3 font-bold">
                        {sub.status === "graded" ? `${sub.marksObtained}/50` : "Ungraded"}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setGradingSubId(sub.id)}
                          className="px-3 py-1 bg-editorial-dark hover:bg-black text-white font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Grade Submission
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grading Form Modal */}
            {gradingSubId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
                <div className="bg-white border-2 border-editorial-border max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-base text-editorial-dark">
                      Grade Student Submission
                    </h3>
                    <button onClick={() => setGradingSubId(null)}>
                      <X className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-semibold">Marks Awarded (out of 50):</span>
                      <input
                        type="number"
                        value={givenMarks}
                        onChange={(e) => setGivenMarks(Number(e.target.value))}
                        max={50}
                        className="w-full px-3 py-2 border border-slate-300 text-xs font-bold focus:outline-none focus:border-editorial-accent"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-semibold">Trainer Feedback & Rubric Remarks:</span>
                      <textarea
                        rows={3}
                        value={givenFeedback}
                        onChange={(e) => setGivenFeedback(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setGradingSubId(null)}
                        className="px-4 py-2 border border-slate-300 text-xs uppercase font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveGrade(gradingSubId)}
                        className="px-5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase"
                      >
                        Save Marks
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 8: CERTIFICATES ISSUANCE
           ======================================================== */}
        {adminTab === "certificates" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Accredited Digital Certificate Issuance" : "ডিজিটাল সার্টিফিকেট অনুমোদন ও ইস্যু"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Issue verified digital certificates with unique registry numbers for successful graduates." : "উত্তীর্ণ শিক্ষার্থীদের জন্য ভেরিফায়েড সার্টিফিকেট নম্বর ইস্যু করুন।"}
                </p>
              </div>
              <button
                onClick={() => setIsIssueCertOpen(true)}
                className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>{isEn ? "Issue New Certificate" : "নতুন সার্টিফিকেট ইস্যু"}</span>
              </button>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Certificate Number</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Signatory</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificatesList.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-editorial-dark">{cert.certificateNumber}</td>
                      <td className="p-3 font-semibold text-slate-900">{cert.studentName}</td>
                      <td className="p-3 text-slate-700">{cert.courseTitle}</td>
                      <td className="p-3 font-mono text-slate-500">{cert.issueDate}</td>
                      <td className="p-3 font-bold text-emerald-700">{cert.grade}</td>
                      <td className="p-3 text-slate-600">{cert.authorizedSignatory}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => window.print()}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: PAYMENTS & TRANSACTIONS
           ======================================================== */}
        {adminTab === "payments" && !isTrainer && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Financial Ledger & Payment Reconciliation" : "পেমেন্ট লেজার ও ভেরিফিকেশন"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Reconcile student bKash, Nagad, and Eastern Bank PLC deposits." : "শিক্ষার্থীদের পেমেন্ট ট্রানজেকশন যাচাই ও চূড়ান্ত অনুমোদন করুন।"}
              </p>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Invoice No.</th>
                    <th className="p-3">Student Email</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">TrxID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentsList.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-editorial-dark">{pay.invoiceNumber}</td>
                      <td className="p-3 font-mono text-slate-700">{pay.studentEmail}</td>
                      <td className="p-3 uppercase font-semibold text-slate-700">{pay.gateway}</td>
                      <td className="p-3 font-mono text-slate-600">{pay.trxId}</td>
                      <td className="p-3 font-bold text-slate-900">{formatPrice(pay.amount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          pay.status === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {pay.status !== "verified" ? (
                          <button
                            onClick={async () => {
                              try {
                                await verifyFirestorePayment(pay.id, "verified", currentUser.name);
                              } catch (err) {
                                console.warn("verifyFirestorePayment error:", err);
                              }
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase cursor-pointer"
                          >
                            Verify TrxID
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px]">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: STAFF & TRAINERS (SUPER ADMIN ONLY)
           ======================================================== */}
        {adminTab === "staff" && isSuperAdmin && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-100 text-editorial-accent text-[9px] font-mono font-bold uppercase tracking-wider">
                    Super Admin Exclusive
                  </span>
                </div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark mt-1">
                  {isEn ? "Faculty, Registrar & Staff Management" : "ফ্যাকাল্টি ও স্টাফ প্রশাসন"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn
                    ? "Security Rule #8: Only the Super Admin can provision and manage administrative accounts. Random public visitors cannot register as staff."
                    : "নিরাপত্তা বিধি: শুধুমাত্র সুপার অ্যাডমিন নতুন অ্যাডমিন ও ট্রেইনারদের অ্যাকাউন্ট তৈরি করতে পারেন।"}
                </p>
              </div>

              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>{isEn ? "Create Staff Account" : "নতুন স্টাফ নিয়োগ"}</span>
              </button>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Email & Contact</th>
                    <th className="p-3">System Role</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Creation Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList
                    .filter((u) => ["super_admin", "superadmin", "admin", "trainer", "staff"].includes(u.role || ""))
                    .map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{staff.name}</div>
                          <span className="text-[10px] font-mono text-slate-400">ID: {staff.id}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-slate-700">{staff.email}</div>
                          <div className="text-[10px] text-slate-500">{staff.phone || "—"}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                              staff.role === "super_admin" || staff.role === "superadmin"
                                ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                                : staff.role === "trainer"
                                ? "bg-teal-100 text-teal-900 border border-teal-300"
                                : staff.role === "staff"
                                ? "bg-indigo-100 text-indigo-900 border border-indigo-300"
                                : "bg-blue-100 text-blue-900 border border-blue-300"
                            }`}
                          >
                            {staff.role === "super_admin" || staff.role === "superadmin"
                              ? "SUPER ADMIN"
                              : staff.role === "trainer"
                              ? "TRAINER CHEF"
                              : staff.role === "staff"
                              ? "FACULTY STAFF"
                              : "ADMIN / REGISTRAR"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                              staff.status === "active" || staff.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {staff.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">
                          {staff.createdAt ? staff.createdAt.split("T")[0] : "2026-01-01"}
                        </td>
                        <td className="p-3 text-right">
                          {staff.role !== "superadmin" && staff.role !== "super_admin" && (
                            <div className="flex items-center justify-end gap-1.5">
                              {staff.status === "active" ? (
                                <button
                                  onClick={() => handleUpdateStudentStatus(staff.id, "suspended")}
                                  className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] uppercase cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStudentStatus(staff.id, "active")}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase cursor-pointer"
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: AUDIT LOGS (SUPER ADMIN ONLY - STEP 16)
           ======================================================== */}
        {adminTab === "audit_logs" && isSuperAdmin && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "System Audit Trail & Security Logs" : "সিস্টেম অডিট ট্রেইল ও নিরাপত্তা লগ"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn
                    ? "Immutable event log recording all privileged administrative operations and authorization actions."
                    : "প্রশাসনিক কার্যক্রম এবং অনুমোদন সংক্রান্ত সমস্ত অপরিবর্তনীয় নিরাপত্তা লগ।"}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-slate-900 text-amber-400 font-mono text-xs font-bold uppercase rounded border border-slate-700">
                {auditLogsList.length} {isEn ? "Logged Events" : "লগ রেকর্ড"}
              </span>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Operator / Actor</th>
                    <th className="p-3">Target Resource</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        {isEn ? "No audit events recorded yet." : "কোনো অডিট রেকর্ড পাওয়া যায়নি।"}
                      </td>
                    </tr>
                  ) : (
                    auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                            log.action.includes("SUPER_ADMIN")
                              ? "bg-amber-100 text-amber-900 border-amber-300 font-extrabold"
                              : log.action.includes("SUSPENDED") || log.action.includes("BLOCKED")
                              ? "bg-red-100 text-red-900 border-red-300"
                              : log.action.includes("CREATED") || log.action.includes("ACTIVATED")
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : "bg-blue-100 text-blue-900 border-blue-300"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{log.actorName}</div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{log.actorRole}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">
                          {log.targetResource || log.targetUid || "—"}
                        </td>
                        <td className="p-3 text-slate-600">
                          {log.details || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: EMAIL LOGS & GMAIL SMTP MONITOR (SUPER ADMIN ONLY)
           ======================================================== */}
        {adminTab === "email_logs" && isSuperAdmin && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Transactional Email Logs & Delivery Status" : "ট্রানজ্যাকশনাল ইমেল লগ ও ডেলিভারি স্ট্যাটাস"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn
                    ? "Official Lodonex Gmail SMTP email delivery log (lodonexcookingacademy@gmail.com). Never stores credentials."
                    : "লোডোনেক্স অফিসিয়াল জিমেইল এসটিএমপি ডেলিভারি লগ। পাসওয়ার্ড ও গোপন তথ্য সংরক্ষণ করা হয় না।"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded border ${
                  emailConfig?.configured
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-blue-50 text-blue-800 border-blue-300"
                }`}>
                  {emailConfig?.configured ? "GMAIL SMTP ACTIVE" : "SIMULATED / DEV MODE"}
                </span>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/email/logs", {
                        headers: { "x-user-role": userRole, "x-user-id": currentUser.id }
                      });
                      if (res.ok) {
                        const data = await res.json();
                        if (data.logs) setEmailLogsList(data.logs);
                      }
                    } catch (e) {}
                  }}
                  className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  title="Refresh Email Logs"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Email Statistics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Dispatches</span>
                <div className="font-serif text-2xl font-extrabold text-slate-900">{emailLogsList.length}</div>
                <p className="text-[10px] text-slate-400">All recorded transactions</p>
              </div>
              <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Delivered (Sent)</span>
                <div className="font-serif text-2xl font-extrabold text-emerald-700">
                  {emailLogsList.filter((l) => l.status === "sent").length}
                </div>
                <p className="text-[10px] text-emerald-600">Delivered via Gmail SMTP</p>
              </div>
              <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Development / Simulated</span>
                <div className="font-serif text-2xl font-extrabold text-blue-700">
                  {emailLogsList.filter((l) => l.status === "simulated").length}
                </div>
                <p className="text-[10px] text-blue-600">Pending App Password</p>
              </div>
              <div className="bg-white border border-editorial-border p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Delivery Errors</span>
                <div className="font-serif text-2xl font-extrabold text-red-700">
                  {emailLogsList.filter((l) => l.status === "failed").length}
                </div>
                <p className="text-[10px] text-red-500">Failed attempts (non-blocking)</p>
              </div>
            </div>

            {/* Email Logs Table */}
            <div className="bg-white border border-editorial-border overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Details / Message ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailLogsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        {isEn ? "No transactional emails sent yet. Dispatches will appear here in real-time." : "কোনো ইমেল লগ পাওয়া যায়নি।"}
                      </td>
                    </tr>
                  ) : (
                    emailLogsList.map((log: any) => (
                      <tr key={log.emailId} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          {log.recipient}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 font-mono text-[10px] uppercase font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {log.emailType || "general"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 max-w-xs truncate" title={log.subject}>
                          {log.subject}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold font-mono ${
                            log.status === "sent"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.status === "simulated"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={log.errorMessage || log.messageId || ""}>
                          {log.errorMessage ? (
                            <span className="text-red-600 font-semibold">{log.errorMessage}</span>
                          ) : log.messageId ? (
                            <span>{log.messageId}</span>
                          ) : (
                            <span className="text-slate-400">OK</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 10: SETTINGS & MERCHANT CREDENTIALS
           ======================================================== */}
        {adminTab === "settings" && isSuperAdmin && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "System Settings & Merchant Gateways" : "সিস্টেম সেটিংস ও পেমেন্ট গেটওয়ে"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Configure mobile banking numbers and commercial bank account information." : "মার্চেন্ট বিকাশ, নগদ ও ব্যাংক অ্যাকাউন্টের তথ্য পরিচালনা করুন।"}
              </p>
            </div>

            <div className="bg-white border border-editorial-border p-6 max-w-2xl space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-600 font-bold uppercase text-[10px]">bKash Merchant / Agent Number:</span>
                <input
                  type="text"
                  value={merchantBkash}
                  onChange={(e) => setMerchantBkash(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 font-bold uppercase text-[10px]">Nagad Merchant Number:</span>
                <input
                  type="text"
                  value={merchantNagad}
                  onChange={(e) => setMerchantNagad(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 font-bold uppercase text-[10px]">Commercial Bank Name & Branch:</span>
                <input
                  type="text"
                  value={merchantBank}
                  onChange={(e) => setMerchantBank(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 font-bold uppercase text-[10px]">Bank Account Number:</span>
                <input
                  type="text"
                  value={merchantAccNum}
                  onChange={(e) => setMerchantAccNum(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <button
                type="button"
                onClick={() => alert("Merchant payment credentials updated successfully!")}
                className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer mt-2"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          CREATE BATCH MODAL
         ======================================================== */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-editorial-dark">
                {isEn ? "Create New Training Batch" : "নতুন ব্যাচ খুলুন"}
              </h3>
              <button onClick={() => setIsAddBatchOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Batch Name:</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. LQF-1 Autumn Evening Batch #10"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Course:</span>
                <select
                  value={newBatchCourseId}
                  onChange={(e) => setNewBatchCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.titleEn}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Start Date:</span>
                  <input
                    type="date"
                    required
                    value={newBatchStartDate}
                    onChange={(e) => setNewBatchStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">End Date:</span>
                  <input
                    type="date"
                    required
                    value={newBatchEndDate}
                    onChange={(e) => setNewBatchEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Class Days:</span>
                  <input
                    type="text"
                    required
                    value={newBatchDays}
                    onChange={(e) => setNewBatchDays(e.target.value)}
                    placeholder="Sun, Tue, Thu"
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Timing:</span>
                  <input
                    type="text"
                    required
                    value={newBatchTime}
                    onChange={(e) => setNewBatchTime(e.target.value)}
                    placeholder="10:00 AM - 02:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Max Student Seats:</span>
                  <input
                    type="number"
                    required
                    value={newBatchCapacity}
                    onChange={(e) => setNewBatchCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Assigned Trainer:</span>
                  <input
                    type="text"
                    required
                    value={newBatchTrainer}
                    onChange={(e) => setNewBatchTrainer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBatchOpen(false)}
                  className="px-4 py-2 border border-slate-300 uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold uppercase tracking-wider"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ISSUE CERTIFICATE MODAL
         ======================================================== */}
      {isIssueCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-editorial-dark">
                Issue Accredited Digital Certificate
              </h3>
              <button onClick={() => setIsIssueCertOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Student Full Name:</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tasnim Rahman"
                  value={certStudentName}
                  onChange={(e) => setCertStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-bold focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Student Email:</span>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={certStudentEmail}
                  onChange={(e) => setCertStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-mono focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Completed Course:</span>
                <select
                  value={certCourseId}
                  onChange={(e) => setCertCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.titleEn}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Awarded Grade:</span>
                  <input
                    type="text"
                    required
                    value={certGrade}
                    onChange={(e) => setCertGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 font-bold text-emerald-800 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Training Hours:</span>
                  <input
                    type="text"
                    required
                    value={certHours}
                    onChange={(e) => setCertHours(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsIssueCertOpen(false)}
                  className="px-4 py-2 border border-slate-300 uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold uppercase tracking-wider"
                >
                  Issue Digital Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          STUDENT DOSSIER MODAL
         ======================================================== */}
      {selectedStudentForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-xl w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-editorial-accent font-mono uppercase font-bold">
                  APPRENTICE DOSSIER • ID: {selectedStudentForDossier.id}
                </span>
                <h3 className="font-serif font-bold text-lg text-editorial-dark mt-0.5">
                  {selectedStudentForDossier.name}
                </h3>
              </div>
              <button onClick={() => setSelectedStudentForDossier(null)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Email:</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedStudentForDossier.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Phone:</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedStudentForDossier.phone || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Status:</span>
                  <span className="font-bold uppercase text-emerald-700">{selectedStudentForDossier.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Batch:</span>
                  <span className="text-slate-700">{selectedStudentForDossier.assignedBatchId || "None"}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px]">Address:</span>
                <p className="text-slate-700">{selectedStudentForDossier.address || "House 24, Road 11, Dhanmondi, Dhaka"}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px]">Educational Background:</span>
                <p className="text-slate-700">{selectedStudentForDossier.educationalBackground || "HSC / Degree"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    handleUpdateStudentStatus(selectedStudentForDossier.id, "approved");
                    setSelectedStudentForDossier(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs uppercase"
                >
                  Approve / Activate
                </button>
                <button
                  onClick={() => {
                    handleUpdateStudentStatus(selectedStudentForDossier.id, "suspended");
                    setSelectedStudentForDossier(null);
                  }}
                  className="px-3 py-1.5 bg-red-100 text-red-800 font-bold text-xs uppercase"
                >
                  Suspend
                </button>
              </div>
              <button
                onClick={() => setSelectedStudentForDossier(null)}
                className="px-4 py-1.5 border border-slate-300 text-xs uppercase font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CREATE STAFF MODAL (SUPER ADMIN ONLY)
         ======================================================== */}
      {isAddStaffOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-editorial-accent font-mono">
                  SECURITY RULE #8: SUPER ADMIN PROVISIONING
                </span>
                <h3 className="font-serif font-bold text-base text-editorial-dark mt-0.5">
                  {isEn ? "Create Administrator / Trainer Account" : "নতুন অ্যাডমিন বা ট্রেইনার নিয়োগ"}
                </h3>
              </div>
              <button onClick={() => setIsAddStaffOpen(false)}>
                <X className="h-5 w-5 text-slate-400 hover:text-slate-800" />
              </button>
            </div>

            {newStaffError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                {newStaffError}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {isEn ? "Staff Full Name *" : "পুরো নাম *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Tanvir Ahmed"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {isEn ? "Staff Official Email *" : "অফিসিয়াল ইমেল *"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="chef.tanvir@lodonex.com"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-mono focus:outline-none focus:border-editorial-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">
                    {isEn ? "Contact Phone" : "ফোন নম্বর"}
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1711-..."
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">
                    {isEn ? "Assigned Role *" : "পদবি নির্বাচন করুন *"}
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-editorial-accent font-semibold"
                  >
                    <option value="admin">ADMIN (Administrator / Registrar)</option>
                    <option value="staff">STAFF (Faculty & Operations Staff)</option>
                    <option value="trainer">TRAINER (Executive Chef Trainer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  {isEn ? "Initial Password / Invitation Key *" : "পাসওয়ার্ড নির্ধারণ করুন *"}
                </label>
                <input
                  type="text"
                  required
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-mono focus:outline-none focus:border-editorial-accent"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  {isEn
                    ? "The user will use these credentials to log in via /admin/login."
                    : "এই পাসওয়ার্ড দিয়ে কর্মকর্তা /admin/login এ প্রবেশ করবেন।"}
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 border border-slate-300 uppercase font-semibold text-slate-600"
                >
                  {isEn ? "Cancel" : "বাতিল"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold uppercase tracking-wider"
                >
                  {isEn ? "Activate Staff User" : "অ্যাকাউন্ট চালু করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
