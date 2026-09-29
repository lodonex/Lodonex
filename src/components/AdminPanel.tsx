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
  GraduationCap
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
  PaymentRecord
} from "../types";
import { formatPrice } from "../utils/price";
import {
  MOCK_BATCHES,
  MOCK_CLASS_SCHEDULE,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_ASSIGNMENTS,
  MOCK_ASSIGNMENT_SUBMISSIONS,
  MOCK_EXAMS,
  MOCK_STUDENT_GRADE_RESULTS,
  MOCK_DIGITAL_CERTIFICATES,
  MOCK_PAYMENT_RECORDS,
  MOCK_ENROLLMENT_APPLICATIONS,
  INITIAL_LMS_USERS
} from "../data/lmsMockData";

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
  const isSuperAdmin = userRole === "superadmin";
  const isTrainer = userRole === "trainer";

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
    | "settings"
  >("overview");

  // Stores
  const [usersList, setUsersList] = useState<UserAccount[]>(initialUsers || INITIAL_LMS_USERS);
  const [enrollmentsList, setEnrollmentsList] = useState<EnrollmentApplication[]>(initialEnrollments || MOCK_ENROLLMENT_APPLICATIONS);

  React.useEffect(() => {
    if (initialEnrollments) {
      setEnrollmentsList(initialEnrollments);
    }
  }, [initialEnrollments]);

  React.useEffect(() => {
    if (initialUsers) {
      setUsersList(initialUsers);
    }
  }, [initialUsers]);
  const [batchesList, setBatchesList] = useState<Batch[]>(MOCK_BATCHES);
  const [certificatesList, setCertificatesList] = useState<DigitalCertificate[]>(MOCK_DIGITAL_CERTIFICATES);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_RECORDS);
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [submissionsList, setSubmissionsList] = useState<AssignmentSubmission[]>(MOCK_ASSIGNMENT_SUBMISSIONS);
  const [resultsList, setResultsList] = useState<StudentGradeResult[]>(MOCK_STUDENT_GRADE_RESULTS);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>(MOCK_PAYMENT_RECORDS);

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
  const [newStaffRole, setNewStaffRole] = useState<"admin" | "trainer">("admin");
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

  // Quick Approve Enrollment Application
  const handleApproveEnrollment = (appId: string) => {
    if (onApproveEnrollmentGlobal) {
      onApproveEnrollmentGlobal(appId);
    }
    const updated = enrollmentsList.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          status: "active" as const,
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser.name
        };
      }
      return app;
    });

    setEnrollmentsList(updated);

    // Call backend API in parallel
    fetch(`/api/enrollments/${appId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-role": userRole },
      body: JSON.stringify({ status: "active" })
    }).catch(() => {});

    // Ensure student user account status is approved as well
    const targetApp = enrollmentsList.find((a) => a.id === appId);
    if (targetApp) {
      setUsersList((prev) =>
        prev.map((u) => {
          if (u.id === targetApp.studentId || u.email === targetApp.studentEmail) {
            return {
              ...u,
              status: "approved",
              assignedBatchId: targetApp.batchId || u.assignedBatchId,
              assignedCourseIds: [...(u.assignedCourseIds || []), targetApp.courseId]
            };
          }
          return u;
        })
      );
    }
  };

  // Change User Status (Approve, Suspend, Block, Activate)
  const handleUpdateStudentStatus = (userId: string, newStatus: "active" | "approved" | "suspended" | "blocked") => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    fetch(`/api/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-role": userRole },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  // Handle Create Batch
  const handleCreateBatch = (e: React.FormEvent) => {
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

    setBatchesList([newBatch, ...batchesList]);
    setIsAddBatchOpen(false);
    setNewBatchName("");

    fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": userRole },
      body: JSON.stringify(newBatch)
    }).catch(() => {});
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

  // Handle Issue Digital Certificate
  const handleIssueCertificate = (e: React.FormEvent) => {
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

    setCertificatesList([newCert, ...certificatesList]);
    setIsIssueCertOpen(false);
    setCertStudentName("");
    setCertStudentEmail("");

    fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": userRole },
      body: JSON.stringify(newCert)
    }).catch(() => {});
  };

  // Handle Mark Attendance
  const handleToggleAttendance = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    const student = usersList.find((u) => u.id === studentId);
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      batchId: "batch-101",
      courseId: "course-1",
      date: new Date().toISOString().split("T")[0],
      studentId,
      studentName: student ? student.name : "Apprentice",
      status,
      markedBy: currentUser.name
    };

    setAttendanceList([newRecord, ...attendanceList]);

    fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": userRole },
      body: JSON.stringify(newRecord)
    }).catch(() => {});
  };

  // Handle Grade Submission
  const handleSaveGrade = (subId: string) => {
    setSubmissionsList((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          return {
            ...s,
            status: "graded",
            marksObtained: Number(givenMarks),
            feedback: givenFeedback,
            gradedBy: currentUser.name,
            gradedAt: new Date().toISOString()
          };
        }
        return s;
      })
    );
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
                <span className="px-2 py-0.5 bg-editorial-accent text-white font-mono text-[9px] font-extrabold uppercase tracking-widest">
                  {userRole.toUpperCase()} ACCESS
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/70 font-mono">Operator: {currentUser.name}</span>
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
        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-editorial-border pb-px text-xs font-bold uppercase tracking-wider">
          {[
            { id: "overview", label: isEn ? "KPI Dashboard" : "ড্যাশবোর্ড", icon: ShieldCheck, show: true },
            { id: "enrollments", label: isEn ? "Enrollments" : "ভর্তি আবেদন", icon: UserCheck, show: true },
            { id: "students", label: isEn ? "Student Roster" : "শিক্ষার্থী তালিকা", icon: Users, show: true },
            { id: "batches", label: isEn ? "Batches" : "ব্যাচসমূহ", icon: Calendar, show: true },
            { id: "courses", label: isEn ? "Courses" : "কোর্সসমূহ", icon: BookOpen, show: true },
            { id: "attendance", label: isEn ? "Attendance" : "হাজিরা খাতা", icon: CheckCircle, show: true },
            { id: "schedule", label: isEn ? "Class Schedule" : "ক্লাস সিডিউল", icon: Clock, show: true },
            { id: "assignments", label: isEn ? "Assignments & Work" : "অ্যাসাইনমেন্ট", icon: GraduationCap, show: true },
            { id: "results", label: isEn ? "Gradebook & Marks" : "গ্রেড ও নম্বর", icon: Award, show: true },
            { id: "certificates", label: isEn ? "Certificates" : "সার্টিফিকেট", icon: Shield, show: true },
            { id: "payments", label: isEn ? "Payments & Trx" : "পেমেন্ট লগ", icon: DollarSign, show: !isTrainer },
            { id: "staff", label: isEn ? "Staff / Trainers" : "স্টাফ ও ট্রেইনার", icon: Users, show: isSuperAdmin },
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
            TAB 1: OVERVIEW DASHBOARD
           ======================================================== */}
        {adminTab === "overview" && (
          <div className="space-y-8 mt-6">
            {/* KPI Metrics Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Total Registered Students" : "নিবন্ধিত শিক্ষার্থী"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-editorial-dark">
                  {usersList.filter((u) => u.role === "student").length}
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold">Active & Pending Apprentices</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Pending Admissions" : "অপেক্ষমাণ আবেদন"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-amber-700">
                  {enrollmentsList.filter((e) => ["applied", "under_review", "payment_submitted"].includes(e.status)).length}
                </div>
                <p className="text-[11px] text-slate-500">{isEn ? "Requires registrar review" : "রিভিউ প্রয়োজন"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Active Batches" : "চলমান ব্যাচসমূহ"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-editorial-accent">
                  {batchesList.filter((b) => b.status === "active").length}
                </div>
                <p className="text-[11px] text-slate-500">{batchesList.length} Total Cohorts</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Total Tuitions Logged" : "মোট সংগৃহীত ফি"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-slate-800">
                  {formatPrice(paymentsList.filter((p) => p.status === "verified").reduce((a, b) => a + b.amount, 0))}
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold">{isEn ? "Verified Receipts" : "যাচাইকৃত রসিদ"}</p>
              </div>
            </div>

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
                    {enrollmentsList.slice(0, 5).map((app) => (
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
                          onClick={() => {
                            const updated = enrollmentsList.map((e) =>
                              e.id === app.id ? { ...e, status: "rejected" as const } : e
                            );
                            setEnrollmentsList(updated);
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
                            onClick={() => {
                              const updated = paymentsList.map((p) =>
                                p.id === pay.id ? { ...p, status: "verified" as const } : p
                              );
                              setPaymentsList(updated);
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
                    .filter((u) => ["superadmin", "admin", "trainer"].includes(u.role || ""))
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
                              staff.role === "superadmin"
                                ? "bg-purple-100 text-purple-900 border border-purple-300"
                                : staff.role === "trainer"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-blue-100 text-blue-900 border border-blue-300"
                            }`}
                          >
                            {staff.role === "superadmin"
                              ? "SUPER ADMIN"
                              : staff.role === "trainer"
                              ? "TRAINER CHEF"
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
                          {staff.role !== "superadmin" && (
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
                    <option value="admin">ADMIN / REGISTRAR STAFF</option>
                    <option value="trainer">TRAINER CHEF</option>
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
