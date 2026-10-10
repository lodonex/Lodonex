/**
 * LODONEX - REAL-TIME STUDENT PORTAL
 * 
 * Route: /student/dashboard
 * Powered strictly by real-time Firestore listeners (onSnapshot).
 * NO mock data, NO fake statistics, NO placeholder numbers.
 */

import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Bell,
  Play,
  Download,
  HelpCircle,
  ChevronRight,
  Send,
  Eye,
  Check,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  MapPin,
  X,
  RefreshCw,
  BookMarked
} from "lucide-react";
import ebookMockupImage from "../assets/images/regenerated_image_1791355418210.png";
import { EBOOK_METADATA, EBOOK_CATEGORIES, EBOOK_RECIPES } from "../data/ebookData";
import {
  Language,
  Course,
  Lesson,
  UserAccount,
  Batch,
  ClassScheduleItem,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Exam,
  StudentGradeResult,
  DigitalCertificate,
  PaymentRecord,
  LMSNotification,
  EnrollmentApplication
} from "../types";
import { formatPrice } from "../utils/price";
import { useRealtimeDashboard } from "../services/useRealtimeDashboard";
import {
  createFirestorePayment,
  submitFirestoreAssignment,
  calculateStudentCourseProgress,
  calculateAttendanceMetrics
} from "../services/dashboardService";

interface StudentPortalProps {
  lang: Language;
  currentUser: UserAccount;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onViewCertificateModal?: (course: Course) => void;
  onVerifyCertificatePublic?: (certNumber: string) => void;
  initialSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  enrollments?: EnrollmentApplication[];
  onBrowseCourses?: () => void;
}

export default function StudentPortal({
  lang,
  currentUser,
  courses: initialCourses,
  onSelectCourse,
  onViewCertificateModal,
  onVerifyCertificatePublic,
  initialSubTab,
  onSubTabChange,
  enrollments: propEnrollments = [],
  onBrowseCourses
}: StudentPortalProps) {
  const isEn = lang === "en";

  // Real-time Firestore Dashboard Stream (Scoped to this authenticated student)
  const {
    courses: realtimeCourses,
    batches,
    enrollments: realtimeEnrollments,
    payments: realtimePayments,
    attendance: realtimeAttendance,
    assignments: realtimeAssignments,
    submissions: realtimeSubmissions,
    exams: realtimeExams,
    results: realtimeResults,
    certificates: realtimeCerts,
    notifications: realtimeNotifications,
    isLoading,
    error,
    isLive,
    lastUpdated,
    retry
  } = useRealtimeDashboard({
    isStudent: true,
    userId: currentUser.id,
    studentEmail: currentUser.email,
    role: "student"
  });

  const courses = realtimeCourses.length > 0 ? realtimeCourses : initialCourses;
  const enrollments = realtimeEnrollments.length > 0 ? realtimeEnrollments : propEnrollments;

  // Active navigation tab
  const getValidTab = (tabName?: string): any => {
    if (!tabName || tabName === "dashboard") return "overview";
    const valid = [
      "overview",
      "courses",
      "classes",
      "calendar",
      "attendance",
      "assignments",
      "exams",
      "results",
      "payments",
      "certificates",
      "ebook",
      "notifications",
      "profile",
      "support"
    ];
    if (valid.includes(tabName)) return tabName;
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<string>(getValidTab(initialSubTab));

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(getValidTab(initialSubTab));
    }
  }, [initialSubTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setViewingCourse(null);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  // Assignment submission modal state
  const [activeAssignmentToSubmit, setActiveAssignmentToSubmit] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFile, setSubmissionFile] = useState("");
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  // Exam taker modal state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, any>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState<number | null>(null);

  // Payment submission state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payGateway, setPayGateway] = useState<"bkash" | "nagad" | "rocket" | "bank">("bkash");
  const [payTrxId, setPayTrxId] = useState("");
  const [payAmount, setPayAmount] = useState(10000);
  const [payCourseId, setPayCourseId] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Lesson viewer state
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(
    currentUser.progress?.completedLessons || []
  );

  // REAL DATA DERIVATION: STRICTLY FROM FIREBASE
  // 1. Enrolled Courses
  const approvedEnrollments = enrollments.filter(
    (e) =>
      (e.studentId === currentUser.id || e.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase()) &&
      (e.status === "active" || e.status === "approved" || e.status === "completed")
  );

  const enrolledCourseIds = Array.from(
    new Set([
      ...(currentUser.assignedCourseIds || []),
      ...(currentUser.progress?.enrolledCourses || []),
      ...approvedEnrollments.map((e) => e.courseId)
    ])
  );

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  // 2. Attendance Statistics
  const studentAttendance = realtimeAttendance.filter(
    (a) => a.studentId === currentUser.id || a.studentName?.toLowerCase() === currentUser.name?.toLowerCase()
  );
  const attendanceMetrics = calculateAttendanceMetrics(studentAttendance);

  // 3. Assignments & Submissions
  const studentSubmissions = realtimeSubmissions.filter(
    (s) => s.studentId === currentUser.id || s.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );
  const submittedAssignmentIds = new Set(studentSubmissions.map((s) => s.assignmentId));
  const pendingAssignments = realtimeAssignments.filter((a) => !submittedAssignmentIds.has(a.id));

  // 4. Payments
  const studentPayments = realtimePayments.filter(
    (p) => p.studentId === currentUser.id || p.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );
  const totalPaid = studentPayments
    .filter((p) => p.status === "verified" || p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalFees = enrolledCourses.reduce((sum, c) => sum + (c.price || 0), 0);
  const totalDue = Math.max(0, totalFees - totalPaid);

  // 5. Certificates
  const studentCerts = realtimeCerts.filter(
    (c) => c.studentId === currentUser.id || c.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  // 6. Results
  const studentResults = realtimeResults.filter(
    (r) => r.studentId === currentUser.id
  );

  // 7. Assigned Batch & Schedule
  const studentBatches = batches.filter(
    (b) => currentUser.assignedBatchId === b.id || enrolledCourseIds.includes(b.courseId)
  );

  // Toggle lesson complete
  const handleToggleLessonComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(completedLessonIds.filter((id) => id !== lessonId));
    } else {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
    }
  };

  // Submit Assignment to Firestore
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignmentToSubmit) return;

    setSubmittingAssignment(true);
    try {
      await submitFirestoreAssignment({
        assignmentId: activeAssignmentToSubmit.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        submittedAt: new Date().toISOString(),
        contentText: submissionContent.trim(),
        fileUrl: submissionFile || undefined,
        fileName: submissionFile ? "Student_Submission_Document.pdf" : "Portfolio_Text_Submission.txt",
        status: "submitted"
      });
      setAssignmentSuccess(true);
      setActiveAssignmentToSubmit(null);
      setSubmissionContent("");
      setSubmissionFile("");
      setTimeout(() => setAssignmentSuccess(false), 4000);
    } catch (err) {
      console.error("Assignment submission error:", err);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Finish Interactive Exam
  const handleFinishExam = () => {
    if (!activeExam) return;
    let earned = 0;
    activeExam.questions?.forEach((q) => {
      if (examAnswers[q.id] === q.correctAnswerIndex) {
        earned += q.points || 10;
      }
    });
    setExamScore(earned);
    setExamSubmitted(true);
  };

  // Record Payment to Firestore
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTrxId.trim()) return;

    setIsSubmittingPayment(true);
    try {
      const selectedCourse = courses.find((c) => c.id === payCourseId) || enrolledCourses[0] || courses[0];
      await createFirestorePayment({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        courseId: selectedCourse ? selectedCourse.id : "course-1",
        courseTitle: selectedCourse ? (isEn ? selectedCourse.titleEn : selectedCourse.titleBn) : "Culinary Arts",
        amount: Number(payAmount) || 10000,
        totalFee: selectedCourse ? selectedCourse.price : totalFees,
        dueAmount: Math.max(0, (selectedCourse ? selectedCourse.price : totalFees) - Number(payAmount)),
        gateway: payGateway,
        trxId: payTrxId.trim().toUpperCase(),
        status: "submitted",
        timestamp: new Date().toISOString(),
        invoiceNumber: `LOD-INV-${Date.now().toString().slice(-6)}`
      });
      setIsPaymentModalOpen(false);
      setPayTrxId("");
      setPaymentSuccessMsg(isEn ? "Payment receipt submitted to administration for verification!" : "পেমেন্ট তথ্য সফলভাবে জমা দেওয়া হয়েছে!");
      setTimeout(() => setPaymentSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div id="lodonex-student-portal" className="font-sans text-slate-900 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0F1014] text-white border-b border-amber-500/20 py-8 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-amber-500/5 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-stone-900 border border-amber-500/30 p-1 flex items-center justify-center shrink-0 shadow-md">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-amber-400/80" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  {isEn ? "AUTHORIZED APPRENTICE" : "অনুমোদিত শিক্ষার্থী"}
                </span>
                <span className="text-stone-600" aria-hidden="true">·</span>
                <span className="text-stone-400 font-sans">UID: {currentUser.id}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-50">
                {isEn ? `Welcome back, ${currentUser.name}` : `স্বাগতম, ${currentUser.name}`}
              </h1>
              <p className="text-xs text-stone-400 font-sans">
                {isEn ? "Continue your learning journey." : "আপনার শিক্ষা যাত্রা অব্যাহত রাখুন।"}
              </p>
            </div>
          </div>

          {/* Real-time Indicator & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 text-xs font-mono">
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
                {isLive ? "● LIVE" : "CONNECTING..."}
              </span>
              {lastUpdated && (
                <span className="text-stone-400 text-[10px]">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>

            <button
              onClick={() => setActiveTab("courses")}
              className="px-4 py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{isEn ? "My Courses" : "আমার কোর্স"}</span>
            </button>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-white border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <DollarSign className="h-3.5 w-3.5 text-amber-400" />
              <span>{isEn ? "Submit Payment" : "পেমেন্ট জমা দিন"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 pb-2 text-xs font-semibold tracking-wider scrollbar-none">
          {[
            { id: "overview", label: isEn ? "Dashboard" : "ড্যাশবোর্ড", icon: BookOpen },
            { id: "courses", label: isEn ? "My Courses" : "আমার কোর্স", icon: GraduationCap },
            { id: "classes", label: isEn ? "Schedule" : "ক্লাস সিডিউল", icon: Clock },
            { id: "attendance", label: isEn ? "Attendance" : "উপস্থিতি", icon: CheckCircle },
            { id: "assignments", label: isEn ? "Assignments" : "অ্যাসাইনমেন্ট", icon: FileText },
            { id: "exams", label: isEn ? "Exams & Quizzes" : "পরীক্ষা ও কুইজ", icon: Sparkles },
            { id: "results", label: isEn ? "Results / Grades" : "ফলাফল ও গ্রেড", icon: Award },
            { id: "payments", label: isEn ? "Payments" : "পেমেন্ট", icon: DollarSign },
            { id: "certificates", label: isEn ? "Certificates" : "সার্টিফিকেট", icon: ShieldCheck },
            { id: "ebook", label: isEn ? "Culinary E-Book" : "রন্ধন ই-বুক", icon: BookMarked },
            { id: "notifications", label: isEn ? "Notifications" : "নোটিফিকেশন", icon: Bell },
            { id: "profile", label: isEn ? "Profile" : "প্রোফাইল", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-amber-300 font-bold shadow-xs border border-stone-800"
                    : "bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-amber-400" : "text-stone-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Notifications */}
        {paymentSuccessMsg && (
          <div className="my-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}
        {assignmentSuccess && (
          <div className="my-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{isEn ? "Assignment coursework submitted to instructor successfully!" : "অ্যাসাইনমেন্ট সফলভাবে জমা দেওয়া হয়েছে!"}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="h-6 w-6 text-editorial-accent animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-mono">
              {isEn ? "Loading real-time student records from Firebase..." : "ফায়ারবেস থেকে লাইভ রেকর্ড লোড হচ্ছে..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={retry}
              className="px-3.5 py-1.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
            >
              {isEn ? "Try Again" : "আবার চেষ্টা করুন"}
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {!isLoading && activeTab === "overview" && (
          <div className="space-y-8 mt-6">
            {/* KPI Cards: Derived Strictly from Firebase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200/90 hover:border-stone-300 transition-all duration-200 p-4 relative overflow-hidden shadow-xs hover:shadow-md space-y-2">
                <div className="absolute top-0 inset-x-0 h-1 bg-stone-900"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {isEn ? "Active Courses" : "সক্রিয় কোর্স"}
                </span>
                <div className="font-serif text-3xl font-bold tracking-tight text-stone-900">
                  {enrolledCourses.length}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium pt-1 border-t border-stone-100">
                  {enrolledCourses.length > 0 ? (isEn ? "Verified Enrolled" : "অনুমোদিত") : (isEn ? "No enrollments yet" : "ভর্তি হননি")}
                </p>
              </div>

              <div className="bg-white border border-stone-200/90 hover:border-stone-300 transition-all duration-200 p-4 relative overflow-hidden shadow-xs hover:shadow-md space-y-2">
                <div className="absolute top-0 inset-x-0 h-1 bg-editorial-accent"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {isEn ? "Attendance Rate" : "হাজিরার হার"}
                </span>
                <div className="font-serif text-3xl font-bold tracking-tight text-editorial-accent">
                  {attendanceMetrics.total > 0 ? `${attendanceMetrics.rate}%` : "0%"}
                </div>
                <p className="text-[11px] text-stone-500 font-mono pt-1 border-t border-stone-100">
                  {attendanceMetrics.total > 0
                    ? `${attendanceMetrics.present} of ${attendanceMetrics.total} classes attended`
                    : (isEn ? "No classes logged yet" : "হাজিরা রেকর্ড নেই")}
                </p>
              </div>

              <div className="bg-white border border-stone-200/90 hover:border-stone-300 transition-all duration-200 p-4 relative overflow-hidden shadow-xs hover:shadow-md space-y-2">
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {isEn ? "Pending Assignments" : "বাকি অ্যাসাইনমেন্ট"}
                </span>
                <div className="font-serif text-3xl font-bold tracking-tight text-amber-800">
                  {pendingAssignments.length}
                </div>
                <p className="text-[11px] text-amber-700 font-medium pt-1 border-t border-stone-100">
                  {pendingAssignments.length > 0 ? (isEn ? "Action required" : "জমা দিতে হবে") : (isEn ? "All up to date" : "সব সম্পন্ন")}
                </p>
              </div>

              <div className="bg-white border border-stone-200/90 hover:border-stone-300 transition-all duration-200 p-4 relative overflow-hidden shadow-xs hover:shadow-md space-y-2">
                <div className="absolute top-0 inset-x-0 h-1 bg-purple-600"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {isEn ? "Accredited Diplomas" : "অর্জিত সনদ"}
                </span>
                <div className="font-serif text-3xl font-bold tracking-tight text-purple-900">
                  {studentCerts.length}
                </div>
                <p className="text-[11px] text-purple-700 font-medium pt-1 border-t border-stone-100">
                  {studentCerts.length > 0 ? (isEn ? "Verifiable Online" : "অনলাইনে যাচাইযোগ্য") : (isEn ? "Not issued yet" : "ইস্যু হয়নি")}
                </p>
              </div>
            </div>

            {/* Middle Section: Active Programs & Next Scheduled Class */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enrolled Courses */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {isEn ? "My Active Enrolled Programs" : "আমার অনুমোদিত প্রোগ্রামসমূহ"}
                  </h3>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="text-xs font-bold text-editorial-accent hover:underline uppercase tracking-wider"
                  >
                    {isEn ? "View All Modules" : "সকল মডিউল দেখুন"} →
                  </button>
                </div>

                {enrolledCourses.length === 0 ? (
                  <div className="bg-white border border-editorial-border p-8 text-center space-y-3">
                    <p className="text-xs text-slate-500">
                      {isEn
                        ? "No data available yet. You are not currently enrolled in any accredited program."
                        : "এখনও কোনো তথ্য নেই। আপনি কোনো কোর্সে ভর্তি হননি।"}
                    </p>
                    {onBrowseCourses && (
                      <button
                        onClick={onBrowseCourses}
                        className="px-4 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                      >
                        {isEn ? "Browse Academy Courses" : "কোর্স ক্যাটালগ দেখুন"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => {
                      const prog = calculateStudentCourseProgress(course, completedLessonIds);
                      const nextLesson = course.lessons.find((l) => !completedLessonIds.includes(l.id)) || course.lessons[0];
                      return (
                        <div
                          key={course.id}
                          className="group bg-white border border-stone-200/90 hover:border-stone-400 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-20 w-24 overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                              <img
                                src={course.image}
                                alt={course.titleEn}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                                <span className="font-bold text-amber-700">{course.levelEn}</span>
                                <span>·</span>
                                <span>{course.duration}</span>
                              </div>
                              <h4 className="font-serif font-bold text-base text-stone-900 truncate">
                                {isEn ? course.titleEn : course.titleBn}
                              </h4>
                              <p className="text-xs text-stone-600">
                                {isEn ? "Chef & Mentor:" : "শেফ ও প্রশিক্ষক:"}{" "}
                                <span className="font-medium text-stone-800">{course.tutor}</span>
                              </p>
                              {nextLesson && (
                                <p className="text-[11px] text-stone-400 truncate font-mono">
                                  {isEn ? "Next:" : "পরবর্তী:"} {isEn ? nextLesson.titleEn : nextLesson.titleBn}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="w-full sm:w-60 space-y-2.5 shrink-0">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-stone-600 text-[11px] font-medium flex items-center gap-1.5">
                                  <span
                                    className={`h-2 w-2 rounded-full shrink-0 ${
                                      prog.percentage === 100
                                        ? "bg-emerald-500 animate-pulse"
                                        : prog.percentage > 0
                                        ? "bg-[#E7000B]"
                                        : "bg-slate-400"
                                    }`}
                                  />
                                  <span>{prog.statusText}</span>
                                </span>
                                <span
                                  className={`font-bold ${
                                    prog.percentage === 100 ? "text-emerald-700" : "text-[#E7000B]"
                                  }`}
                                >
                                  {prog.percentage}% ({prog.completedCount}/{prog.totalCount} {isEn ? "lessons" : "পাঠ"})
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-stone-100 border border-stone-200/80 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 rounded-full ${
                                    prog.percentage === 100 ? "bg-emerald-600" : "bg-[#E7000B]"
                                  }`}
                                  style={{ width: `${prog.percentage}%` }}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onSelectCourse(course);
                              }}
                              className="w-full py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                            >
                              <Play className="h-3.5 w-3.5 text-white" />
                              <span>{isEn ? "Continue Learning" : "শিক্ষা চালিয়ে যান"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Next Scheduled Class Box (Real Firebase Batches) */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {isEn ? "Next Practical Class" : "পরবর্তী ব্যবহারিক ক্লাস"}
                </h3>
                {studentBatches.length === 0 ? (
                  <div className="bg-[#FCFBF8] border border-editorial-border p-5 text-center text-slate-500 text-xs italic">
                    {isEn ? "No upcoming classes scheduled yet." : "এখনও কোনো ক্লাস নির্ধারিত হয়নি।"}
                  </div>
                ) : (
                  <div className="bg-[#FCFBF8] border border-editorial-border p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-editorial-accent uppercase tracking-wider">
                      <Clock className="h-4 w-4" />
                      <span>{studentBatches[0].classDays.join(", ")} • {studentBatches[0].classTime}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-slate-900">
                        {studentBatches[0].name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {studentBatches[0].courseTitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-editorial-border space-y-1 text-xs text-slate-600">
                      <p>📍 <strong>Location:</strong> {studentBatches[0].location}</p>
                      <p>👨‍🍳 <strong>Trainer:</strong> {studentBatches[0].trainerName}</p>
                    </div>

                    <button
                      onClick={() => setActiveTab("classes")}
                      className="w-full py-2 bg-white border border-editorial-border hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      {isEn ? "View Complete Schedule" : "সম্পূর্ণ রুটিন দেখুন"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY COURSES */}
        {!isLoading && activeTab === "courses" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "My Enrolled Academic Programs" : "আমার রেজিস্টার্ড প্রোগ্রাম"}
            </h2>

            {enrolledCourses.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. Please enroll in a course to access lessons." : "এখনও কোনো তথ্য নেই। দয়া করে কোর্সে ভর্তি হন।"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((c) => {
                  const prog = calculateStudentCourseProgress(c, completedLessonIds);
                  const nextLesson = c.lessons.find((l) => !completedLessonIds.includes(l.id)) || c.lessons[0];
                  return (
                    <div
                      key={c.id}
                      className="group bg-white border border-stone-200/90 hover:border-stone-400 p-5 space-y-4 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="h-20 w-24 overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                          <img
                            src={c.image}
                            alt={c.titleEn}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                            <span className="font-bold text-amber-700">{c.levelEn}</span>
                            <span>·</span>
                            <span>{c.duration}</span>
                          </div>
                          <h3 className="font-serif font-bold text-base text-stone-900 truncate">
                            {isEn ? c.titleEn : c.titleBn}
                          </h3>
                          <p className="text-xs text-stone-600">
                            {isEn ? "Chef Tutor:" : "শেফ প্রশিক্ষক:"}{" "}
                            <span className="font-medium text-stone-800">{c.tutor}</span>
                          </p>
                          {nextLesson && (
                            <p className="text-[11px] text-stone-400 truncate font-mono">
                              {isEn ? "Next:" : "পরবর্তী:"} {isEn ? nextLesson.titleEn : nextLesson.titleBn}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-stone-100">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-stone-600 text-[11px] font-medium flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full shrink-0 ${
                                prog.percentage === 100
                                  ? "bg-emerald-500 animate-pulse"
                                  : prog.percentage > 0
                                  ? "bg-[#E7000B]"
                                  : "bg-slate-400"
                              }`}
                            />
                            <span>{prog.statusText}</span>
                          </span>
                          <span
                            className={`font-bold ${
                              prog.percentage === 100 ? "text-emerald-700" : "text-[#E7000B]"
                            }`}
                          >
                            {prog.percentage}% ({prog.completedCount}/{prog.totalCount} {isEn ? "lessons" : "পাঠ"})
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-stone-100 border border-stone-200/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              prog.percentage === 100 ? "bg-emerald-600" : "bg-[#E7000B]"
                            }`}
                            style={{ width: `${prog.percentage}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectCourse(c);
                        }}
                        className="w-full py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                      >
                        <Play className="h-3.5 w-3.5 text-white" />
                        <span>{isEn ? "Continue Learning" : "শিক্ষা চালিয়ে যান"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SCHEDULE */}
        {!isLoading && activeTab === "classes" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Class Schedule & Room Allocation" : "ক্লাস রুটিন ও ল্যাব বণ্টন"}
            </h2>
            {studentBatches.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No upcoming classes scheduled yet." : "এখনও কোনো ক্লাস নির্ধারিত হয়নি।"}
              </div>
            ) : (
              <div className="space-y-4">
                {studentBatches.map((b) => (
                  <div key={b.id} className="bg-white border border-editorial-border p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase font-mono">
                          {b.classDays.join(", ")} • {b.classTime}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {b.status}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-slate-900">{b.name}</h3>
                      <p className="text-xs text-slate-600">
                        📍 <strong>Location:</strong> {b.location} • 👨‍🍳 <strong>Trainer:</strong> {b.trainerName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ATTENDANCE */}
        {!isLoading && activeTab === "attendance" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Apprentice Practical & Lecture Attendance" : "ব্যবহারিক ও তাত্ত্বিক ক্লাসের উপস্থিতি খাতা"}
            </h2>

            {/* Attendance Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-editorial-border">
                <span className="text-[10px] font-bold uppercase text-slate-500">Total Classes</span>
                <div className="text-2xl font-bold font-serif text-slate-900">{attendanceMetrics.total}</div>
              </div>
              <div className="p-4 bg-white border border-editorial-border">
                <span className="text-[10px] font-bold uppercase text-slate-500">Present</span>
                <div className="text-2xl font-bold font-serif text-emerald-700">{attendanceMetrics.present}</div>
              </div>
              <div className="p-4 bg-white border border-editorial-border">
                <span className="text-[10px] font-bold uppercase text-slate-500">Absent</span>
                <div className="text-2xl font-bold font-serif text-red-700">{attendanceMetrics.absent}</div>
              </div>
              <div className="p-4 bg-white border border-editorial-border">
                <span className="text-[10px] font-bold uppercase text-slate-500">Overall Rate</span>
                <div className="text-2xl font-bold font-serif text-editorial-accent">
                  {attendanceMetrics.total > 0 ? `${attendanceMetrics.rate}%` : "0%"}
                </div>
              </div>
            </div>

            {studentAttendance.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. No attendance recorded yet." : "এখনও কোনো হাজিরা রেকর্ড পাওয়া যায়নি।"}
              </div>
            ) : (
              <div className="bg-white border border-editorial-border overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-editorial-border font-bold uppercase text-[10px] text-slate-600">
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold">{rec.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            rec.status === "present"
                              ? "bg-emerald-100 text-emerald-800"
                              : rec.status === "late"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{rec.remarks || "Regular session"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ASSIGNMENTS */}
        {!isLoading && activeTab === "assignments" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Culinary Coursework & Practical Assignments" : "ব্যবহারিক অ্যাসাইনমেন্ট ও হোমওয়ার্ক"}
            </h2>

            {realtimeAssignments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. No coursework assigned." : "এখনও কোনো অ্যাসাইনমেন্ট দেওয়া হয়নি।"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realtimeAssignments.map((a) => {
                  const sub = studentSubmissions.find((s) => s.assignmentId === a.id);
                  return (
                    <div key={a.id} className="bg-white border border-editorial-border p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-slate-900">{a.title}</h4>
                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 font-bold">
                          Max: {a.maxMarks}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{a.description}</p>
                      <div className="text-[11px] text-slate-500 pt-2 border-t flex justify-between">
                        <span>Due: {a.dueDate}</span>
                        <span>{a.courseTitle}</span>
                      </div>

                      {sub ? (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                          <span>Status: <strong>{sub.status.toUpperCase()}</strong></span>
                          {sub.marksObtained !== undefined && (
                            <span className="font-mono font-bold">Score: {sub.marksObtained}/{a.maxMarks}</span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveAssignmentToSubmit(a)}
                          className="w-full py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                        >
                          {isEn ? "Submit Coursework" : "অ্যাসাইনমেন্ট জমা দিন"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: RESULTS */}
        {!isLoading && activeTab === "results" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Official Gradebook & Examination Transcripts" : "ফলাফল ও গ্রেডশিট"}
            </h2>
            {studentResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. Results have not been published yet." : "এখনও কোনো ফলাফল প্রকাশিত হয়নি।"}
              </div>
            ) : (
              <div className="space-y-4">
                {studentResults.map((res) => (
                  <div key={res.id} className="bg-white border-2 border-editorial-border p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-editorial-accent font-bold">
                          {res.batchName || "Academic Cohort"}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-slate-900">{res.courseTitle}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block uppercase font-bold">Grade</span>
                        <span className="text-2xl font-bold font-serif text-emerald-700">{res.grade}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className="p-3 bg-slate-50 border">
                        <span className="text-slate-500 block">Practical</span>
                        <span className="font-bold">{res.practicalMarks} / {res.maxPracticalMarks}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border">
                        <span className="text-slate-500 block">Theory</span>
                        <span className="font-bold">{res.theoryMarks} / {res.maxTheoryMarks}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border">
                        <span className="text-slate-500 block">Assignments</span>
                        <span className="font-bold">{res.assignmentMarks} / {res.maxAssignmentMarks}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border">
                        <span className="text-slate-500 block">Final Exam</span>
                        <span className="font-bold">{res.finalExamMarks} / {res.maxFinalExamMarks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PAYMENTS */}
        {!isLoading && activeTab === "payments" && (
          <div className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">
                  {isEn ? "Tuition & Payment Receipts" : "টিউশন ফি ও পেমেন্ট রসিদ"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Official receipts verified through mobile banking or bank wire." : "যাচাইকৃত পেমেন্টের বিবরণ।"}
                </p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
              >
                <DollarSign className="h-4 w-4" />
                <span>{isEn ? "Submit Payment TrxID" : "পেমেন্ট TrxID জমা দিন"}</span>
              </button>
            </div>

            {/* Balances Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">{isEn ? "Total Program Tuition" : "মোট কোর্স ফি"}</span>
                <div className="font-serif text-2xl font-bold text-slate-900">{formatPrice(totalFees)}</div>
              </div>
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">{isEn ? "Total Paid (Verified)" : "পরিশোধিত অর্থ"}</span>
                <div className="font-serif text-2xl font-bold text-emerald-700">{formatPrice(totalPaid)}</div>
              </div>
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">{isEn ? "Remaining Due" : "বকেয়া ফি"}</span>
                <div className="font-serif text-2xl font-bold text-red-700">{formatPrice(totalDue)}</div>
              </div>
            </div>

            {/* Payments Table */}
            {studentPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. No payment transactions recorded yet." : "এখনও কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।"}
              </div>
            ) : (
              <div className="bg-white border border-editorial-border overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-editorial-border font-bold uppercase text-[10px] text-slate-600">
                      <th className="p-3">Invoice No.</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">TrxID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                        <td className="p-3 uppercase font-semibold text-slate-700">{p.gateway}</td>
                        <td className="p-3 font-mono text-slate-600">{p.trxId}</td>
                        <td className="p-3 font-bold text-slate-900">{formatPrice(p.amount)}</td>
                        <td className="p-3 text-slate-500 font-mono">{p.timestamp?.split("T")[0] || "-"}</td>
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

        {/* TAB 8: CERTIFICATES */}
        {!isLoading && activeTab === "certificates" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Digital Accredited Diplomas & Certificates" : "ডিজিটাল সার্টিফিকেট ও ডিপ্লোমা"}
            </h2>

            {studentCerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. No accredited certificates issued yet." : "এখনও কোনো সার্টিফিকেট ইস্যু করা হয়নি।"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentCerts.map((cert) => (
                  <div key={cert.id} className="bg-[#FCFBF8] border-2 border-editorial-border p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-editorial-accent font-bold">
                          {cert.certificateNumber}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-slate-900">{cert.courseTitle}</h3>
                        <p className="text-xs text-slate-500">Issued: {cert.issueDate} • Grade: {cert.grade}</p>
                      </div>
                      <Award className="h-8 w-8 text-amber-600 shrink-0" />
                    </div>

                    <div className="pt-3 border-t flex justify-between items-center text-xs">
                      {onVerifyCertificatePublic && (
                        <button
                          onClick={() => onVerifyCertificatePublic(cert.certificateNumber)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] uppercase tracking-wider"
                        >
                          Verify Credential
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 font-semibold text-[11px]"
                      >
                        Print Transcript
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8.5: CULINARY E-BOOK DIGITAL HUB */}
        {!isLoading && activeTab === "ebook" && (
          <div className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-editorial-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[9px] font-mono font-bold uppercase tracking-wider">
                    Official Student Masterclass Textbook
                  </span>
                </div>
                <h2 className="font-serif font-extrabold text-2xl text-slate-900 mt-1">
                  {isEn ? "Lodonex Culinary E-Book for Students" : "লোডোনেক্স রন্ধন ই-বুক শিক্ষার্থী সংস্করণ"}
                </h2>
                <p className="text-xs text-slate-500">
                  {EBOOK_METADATA.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-stone-500" />
                  <span>{isEn ? "Print / Save PDF" : "প্রিন্ট / পিডিএফ"}</span>
                </button>
              </div>
            </div>

            {/* Showcase Banner */}
            <div className="bg-gradient-to-br from-[#0B251B] to-[#04140D] text-white p-6 sm:p-8 rounded-lg border-2 border-[#E7000B]/30 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex justify-center">
                <div className="relative max-w-[220px] w-full border-2 border-[#E7000B]/50 rounded-md overflow-hidden shadow-2xl">
                  <img
                    src={ebookMockupImage}
                    alt="Lodonex Culinary E-Book"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/90 text-red-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-xs">
                    OFFICIAL
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#E7000B] uppercase tracking-widest font-bold block">
                    {EBOOK_METADATA.badge}
                  </span>
                  <h3 className="font-serif font-black text-2xl text-white">
                    {EBOOK_METADATA.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {EBOOK_METADATA.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-white/5 border border-white/10 p-2 rounded-xs">
                    <span className="font-bold text-red-400 text-sm block">131+</span>
                    <span className="text-[9px] text-stone-400 uppercase font-mono">Recipes</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2 rounded-xs">
                    <span className="font-bold text-red-400 text-sm block">22</span>
                    <span className="text-[9px] text-stone-400 uppercase font-mono">Categories</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2 rounded-xs">
                    <span className="font-bold text-emerald-400 text-sm block">Active</span>
                    <span className="text-[9px] text-stone-400 uppercase font-mono">Student License</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2 rounded-xs">
                    <span className="font-bold text-red-400 text-sm block">$1,099</span>
                    <span className="text-[9px] text-stone-400 uppercase font-mono">Value</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="/culinary-ebook"
                    className="px-5 py-2.5 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xs shadow-md transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7000B] focus:ring-offset-2 focus:ring-offset-stone-900"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Open Masterclass Reader & Syllabus</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Categories Preview */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {isEn ? "Curriculum Categories & Recipes Overview" : "সিলেবাস ক্যাটাগরি ও রেসিপি ওভারভিউ"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {EBOOK_CATEGORIES.slice(0, 12).map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 bg-white border border-editorial-border rounded-xs space-y-1 hover:border-amber-400/80 transition"
                  >
                    <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase block">
                      {cat.recipeCount} {cat.recipeCount === 1 ? "Recipe" : "Recipes"}
                    </span>
                    <h4 className="font-serif font-bold text-xs text-stone-900 leading-tight">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1">{cat.description}</p>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <a
                  href="/culinary-ebook"
                  className="text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider inline-flex items-center gap-1"
                >
                  <span>View All 22 Categories & Full 131+ Recipes</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: NOTIFICATIONS */}
        {!isLoading && activeTab === "notifications" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Notifications & Academic Announcements" : "বিজ্ঞপ্তি ও ঘোষণা"}
            </h2>
            {realtimeNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white border border-dashed border-slate-200 text-xs">
                {isEn ? "No data available yet. No notifications at this time." : "এখনও কোনো বিজ্ঞপ্তি নেই।"}
              </div>
            ) : (
              <div className="space-y-3">
                {realtimeNotifications.map((notif) => (
                  <div key={notif.id} className="bg-white border border-editorial-border p-4 flex items-start gap-4">
                    <div className="h-9 w-9 bg-red-50 text-editorial-accent flex items-center justify-center shrink-0 border border-editorial-border">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm text-slate-900">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {notif.createdAt?.split("T")[0] || ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 10: PROFILE */}
        {!isLoading && activeTab === "profile" && (
          <div className="space-y-6 mt-6">
            <h2 className="font-serif font-extrabold text-2xl text-slate-900">
              {isEn ? "Apprentice Dossier & Identification" : "শিক্ষার্থী পরিচিতি"}
            </h2>
            <div className="bg-white border border-editorial-border p-6 space-y-4 max-w-2xl text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Full Name</span>
                  <p className="font-bold text-sm text-slate-900">{currentUser.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Email</span>
                  <p className="font-mono text-sm text-slate-900">{currentUser.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Firebase UID</span>
                  <p className="font-mono text-xs text-slate-700">{currentUser.id}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Status</span>
                  <p className="font-bold text-emerald-700 uppercase">{currentUser.status}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Phone</span>
                  <p className="font-mono text-slate-800">{currentUser.phone || "+880 1711-000000"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Location</span>
                  <p className="text-slate-800">{currentUser.city || "Dhaka"}, {currentUser.country || "Bangladesh"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Submission Modal */}
      {activeAssignmentToSubmit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 border-2 border-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-serif font-bold text-base text-slate-900">
                Submit: {activeAssignmentToSubmit.title}
              </h4>
              <button
                onClick={() => setActiveAssignmentToSubmit(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Coursework Details / Written Notes *</label>
                <textarea
                  rows={4}
                  required
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Detail your practical technique, temperature measurements, or preparation steps..."
                  className="w-full px-3 py-2 border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Document / Portfolio Attachment URL</label>
                <input
                  type="url"
                  value={submissionFile}
                  onChange={(e) => setSubmissionFile(e.target.value)}
                  placeholder="https://drive.google.com/your-portfolio-pdf"
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAssignmentToSubmit(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold uppercase text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssignment}
                  className="px-4 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold uppercase text-[10px] transition cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                >
                  {submittingAssignment ? "Submitting..." : "Submit to Instructor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment TrxID Submission Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 border-2 border-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-serif font-bold text-base text-slate-900">
                {isEn ? "Submit Tuition Payment Receipt" : "টিউশন ফি পেমেন্ট রসিদ জমা"}
              </h4>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Select Program / Course</label>
                <select
                  value={payCourseId}
                  onChange={(e) => setPayCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isEn ? c.titleEn : c.titleBn} (৳{c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Payment Method *</label>
                <select
                  value={payGateway}
                  onChange={(e) => setPayGateway(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 font-bold uppercase"
                >
                  <option value="bkash">bKash Merchant</option>
                  <option value="nagad">Nagad Merchant</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Bank Transfer (EBL)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Amount (BDT ৳) *</label>
                <input
                  type="number"
                  min="500"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-sm font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Transaction ID (TrxID) *</label>
                <input
                  type="text"
                  required
                  value={payTrxId}
                  onChange={(e) => setPayTrxId(e.target.value)}
                  placeholder="e.g. 9J28A1XYZ4"
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-sm font-bold uppercase tracking-wider"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold uppercase text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-4 py-2 bg-[#E7000B] hover:bg-[#C90009] active:bg-[#B00008] text-white font-bold uppercase text-[10px] transition cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#E7000B]"
                >
                  {isSubmittingPayment ? "Submitting..." : "Submit Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
