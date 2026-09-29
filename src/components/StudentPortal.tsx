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
  X
} from "lucide-react";
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
  StudentExamSubmission,
  StudentGradeResult,
  DigitalCertificate,
  PaymentRecord,
  LMSNotification,
  EnrollmentApplication
} from "../types";
import { formatPrice } from "../utils/price";
import {
  MOCK_BATCHES,
  MOCK_CLASS_SCHEDULE,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_ASSIGNMENTS,
  MOCK_ASSIGNMENT_SUBMISSIONS,
  MOCK_EXAMS,
  MOCK_STUDENT_EXAM_SUBMISSIONS,
  MOCK_STUDENT_GRADE_RESULTS,
  MOCK_DIGITAL_CERTIFICATES,
  MOCK_PAYMENT_RECORDS,
  MOCK_NOTIFICATIONS
} from "../data/lmsMockData";

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
  courses,
  onSelectCourse,
  onViewCertificateModal,
  onVerifyCertificatePublic,
  initialSubTab,
  onSubTabChange,
  enrollments = [],
  onBrowseCourses
}: StudentPortalProps) {
  const isEn = lang === "en";

  // Map initialSubTab (e.g. from /student/dashboard or /student/courses) to valid tab
  const getValidTab = (tabName?: string): any => {
    const valid = ["overview", "courses", "classes", "calendar", "attendance", "assignments", "exams", "results", "payments", "certificates", "notifications", "profile", "support"];
    if (tabName && valid.includes(tabName)) return tabName;
    return "overview";
  };

  // Active navigation tab inside Student Panel
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "courses"
    | "classes"
    | "calendar"
    | "attendance"
    | "assignments"
    | "exams"
    | "results"
    | "payments"
    | "certificates"
    | "notifications"
    | "profile"
    | "support"
  >(getValidTab(initialSubTab));

  // Sync activeTab when initialSubTab changes via router
  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(getValidTab(initialSubTab));
    }
  }, [initialSubTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    setViewingCourse(null);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  // State stores for student interactions
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(MOCK_ASSIGNMENT_SUBMISSIONS);
  const [activeAssignmentToSubmit, setActiveAssignmentToSubmit] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFile, setSubmissionFile] = useState("");

  // Exam taker modal state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, any>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState<number | null>(null);

  // Payment submission state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payGateway, setPayGateway] = useState<"bkash" | "nagad" | "bank">("bkash");
  const [payTrxId, setPayTrxId] = useState("");
  const [payAmount, setPayAmount] = useState(50000);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>(MOCK_PAYMENT_RECORDS);

  // Lesson viewer state inside My Courses
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(
    currentUser.progress.completedLessons || []
  );

  // Strict Course Access Control: Only courses with approved / active enrollment
  // Never default unapproved users to course-1!
  const enrolledCourseIds = currentUser.assignedCourseIds || currentUser.progress.enrolledCourses || [];
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  // Student's applications list
  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === currentUser.id || e.studentEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Attendance statistics
  const studentAttendance = MOCK_ATTENDANCE_RECORDS.filter(
    (a) => a.studentId === currentUser.id || a.studentName === currentUser.name
  );
  const totalClasses = studentAttendance.length || 6;
  const attendedClasses = studentAttendance.filter((a) => a.status === "present" || a.status === "late").length || 5;
  const attendanceRate = Math.round((attendedClasses / Math.max(totalClasses, 1)) * 100);

  // Pending assignments count
  const pendingAssignments = MOCK_ASSIGNMENTS.filter(
    (a) => !submissions.some((s) => s.assignmentId === a.id)
  );

  // Certificates for this student
  const studentCerts = MOCK_DIGITAL_CERTIFICATES.filter(
    (c) => c.studentId === currentUser.id || c.studentName === currentUser.name
  );

  // Payments for this student
  const studentPayments = paymentsList.filter(
    (p) => p.studentId === currentUser.id || p.studentEmail === currentUser.email
  );
  const totalPaid = studentPayments.filter((p) => p.status === "verified").reduce((acc, p) => acc + p.amount, 0);
  const totalFees = enrolledCourses.reduce((acc, c) => acc + c.price, 0) || 150000;
  const totalDue = Math.max(0, totalFees - totalPaid);

  // Helper to toggle lesson completion
  const handleToggleLessonComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(completedLessonIds.filter((id) => id !== lessonId));
    } else {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
    }
  };

  // Handle assignment submission
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignmentToSubmit) return;

    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: activeAssignmentToSubmit.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      submittedAt: new Date().toISOString(),
      contentText: submissionContent,
      fileUrl: submissionFile || "https://example.com/knife_portfolio.pdf",
      fileName: submissionFile ? "Student_Submission.pdf" : "Precision_Cuts_Document.pdf",
      status: "submitted"
    };

    setSubmissions([newSub, ...submissions]);
    setActiveAssignmentToSubmit(null);
    setSubmissionContent("");
    setSubmissionFile("");
  };

  // Handle Exam Submission
  const handleFinishExam = () => {
    if (!activeExam) return;
    let earnedPoints = 0;
    activeExam.questions.forEach((q) => {
      if (q.type === "mcq" || q.type === "true_false") {
        if (examAnswers[q.id] === q.correctAnswerIndex) {
          earnedPoints += q.points;
        }
      } else {
        earnedPoints += q.points; // automatic partial credit for written questions
      }
    });

    setExamScore(earnedPoints);
    setExamSubmitted(true);
  };

  // Handle payment submission
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTrxId) return;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      courseId: enrolledCourses[0]?.id || "course-1",
      courseTitle: enrolledCourses[0]?.titleEn || "Culinary Foundation",
      amount: Number(payAmount),
      totalFee: totalFees,
      dueAmount: Math.max(0, totalDue - Number(payAmount)),
      gateway: payGateway,
      trxId: payTrxId.toUpperCase(),
      status: "submitted",
      timestamp: new Date().toISOString(),
      invoiceNumber: `LOD-INV-${Date.now().toString().slice(-5)}`
    };

    setPaymentsList([newPayment, ...paymentsList]);
    setIsPaymentModalOpen(false);
    setPayTrxId("");
  };

  return (
    <div id="lodonex-student-portal" className="font-sans text-slate-900 pb-16">
      {/* Student Panel Top Banner */}
      <div className="bg-editorial-dark text-white border-b-2 border-editorial-accent py-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 border-2 border-white/20 p-1 flex items-center justify-center shrink-0">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-white/80" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                  {isEn ? "Authorized Apprentice" : "অনুমোদিত শিক্ষার্থী"}
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/70 font-mono">ID: {currentUser.id}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {isEn ? `Welcome, ${currentUser.name}` : `স্বাগতম, ${currentUser.name}`}
              </h1>
              <p className="text-xs text-white/60">
                {currentUser.assignedBatchId ? `Enrolled in ${currentUser.assignedBatchId}` : "Lodonex Culinary Arts Cohort"}
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("courses")}
              className="px-3.5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{isEn ? "Resume Learning" : "পড়াশোনা শুরু করুন"}</span>
            </button>
            <button
              onClick={() => setActiveTab("classes")}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{isEn ? "Class Schedule" : "ক্লাস রুটিন"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-editorial-border pb-px text-xs font-bold uppercase tracking-wider">
          {[
            { id: "overview", label: isEn ? "Dashboard" : "ড্যাশবোর্ড", icon: BookOpen },
            { id: "courses", label: isEn ? "My Courses" : "আমার কোর্স", icon: GraduationCap },
            { id: "classes", label: isEn ? "Schedule" : "ক্লাস সিডিউল", icon: Clock },
            { id: "calendar", label: isEn ? "Calendar" : "ক্যালেন্ডার", icon: Calendar },
            { id: "attendance", label: isEn ? "Attendance" : "উপস্থিতি", icon: CheckCircle },
            { id: "assignments", label: isEn ? "Assignments" : "অ্যাসাইনমেন্ট", icon: FileText },
            { id: "exams", label: isEn ? "Exams & Quizzes" : "পরীক্ষা ও কুইজ", icon: Sparkles },
            { id: "results", label: isEn ? "Results / Grades" : "ফলাফল ও গ্রেড", icon: Award },
            { id: "payments", label: isEn ? "Payments" : "পেমেন্ট", icon: DollarSign },
            { id: "certificates", label: isEn ? "Certificates" : "সার্টিফিকেট", icon: ShieldCheck },
            { id: "notifications", label: isEn ? "Notifications" : "নোটিফিকেশন", icon: Bell },
            { id: "profile", label: isEn ? "Profile" : "প্রোফাইল", icon: User },
            { id: "support", label: isEn ? "Helpdesk" : "সহায়তা", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
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
        {activeTab === "overview" && (
          <div className="space-y-8 mt-6">
            {/* KPI Cards Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-editorial-border p-4 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Active Courses" : "সক্রিয় কোর্স"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-editorial-dark">{enrolledCourses.length}</div>
                <p className="text-[11px] text-emerald-700 font-semibold">{isEn ? "All Verified" : "সবগুলো অনুমোদিত"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Attendance Rate" : "হাজিরার হার"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-editorial-accent">{attendanceRate}%</div>
                <p className="text-[11px] text-slate-500">{attendedClasses} of {totalClasses} classes attended</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Pending Tasks" : "বাকি অ্যাসাইনমেন্ট"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-amber-700">{pendingAssignments.length}</div>
                <p className="text-[11px] text-slate-500">{isEn ? "Due this week" : "এই সপ্তাহে জমা দিতে হবে"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Accredited Diplomas" : "অর্জিত ডিপ্লোমা"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-slate-800">{studentCerts.length}</div>
                <p className="text-[11px] text-emerald-700 font-semibold">{isEn ? "Verifiable Online" : "অনলাইনে যাচাইযোগ্য"}</p>
              </div>
            </div>

            {/* Middle Section: Next Live Class & Enrolled Courses preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Col 1 & 2: Enrolled Courses List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-editorial-dark">
                    {isEn ? "My Active Enrolled Programs" : "আমার অনুমোদিত প্রোগ্রামসমূহ"}
                  </h3>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="text-xs font-bold text-editorial-accent hover:underline uppercase tracking-wider"
                  >
                    {isEn ? "View All Modules" : "সকল মডিউল দেখুন"} →
                  </button>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const completedInCourse = course.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                    const progressPct = course.lessons.length
                      ? Math.round((completedInCourse / course.lessons.length) * 100)
                      : 0;

                    return (
                      <div
                        key={course.id}
                        className="bg-white border border-editorial-border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={course.image}
                            alt={course.titleEn}
                            className="h-16 w-20 object-cover border border-editorial-border shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-wider">
                              {course.levelEn} • {course.duration}
                            </span>
                            <h4 className="font-serif font-bold text-base text-slate-900">
                              {isEn ? course.titleEn : course.titleBn}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {isEn ? "Instructor:" : "প্রশিক্ষক:"} {course.tutor}
                            </p>
                          </div>
                        </div>

                        <div className="w-full sm:w-48 space-y-2 text-right">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-500">{isEn ? "Syllabus Progress" : "অগ্রগতি"}</span>
                            <span className="text-editorial-accent">{progressPct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-editorial-accent transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <button
                            onClick={() => {
                              setViewingCourse(course);
                              setActiveLesson(course.lessons[0] || null);
                              setActiveTab("courses");
                            }}
                            className="w-full py-1.5 bg-editorial-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                          >
                            {isEn ? "Access Classroom" : "ক্লাসরুমে যান"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Col 3: Upcoming Scheduled Class Box */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-editorial-dark">
                  {isEn ? "Next Practical Class" : "পরবর্তী ব্যবহারিক ক্লাস"}
                </h3>
                <div className="bg-[#FCFBF8] border border-editorial-border p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-editorial-accent uppercase tracking-wider">
                    <Clock className="h-4 w-4" />
                    <span>Sunday, 09:30 AM - 01:30 PM</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-editorial-dark">
                      Precision Knife Cuts & Fundamental Stocks
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hands-on practical breakdown of French vegetable cuts and white veal stock preparation.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-editorial-border space-y-1 text-xs text-slate-600">
                    <p>📍 <strong>Station:</strong> Commercial Hot Kitchen Bay 4</p>
                    <p>👨‍🍳 <strong>Trainer:</strong> Chef Tawhid Shekh</p>
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 border border-amber-200 mt-2">
                      ⚠️ Note: Sanitize knife kit and cut-resistant gloves before entering.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("classes")}
                    className="w-full py-2 bg-white border border-editorial-border hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    {isEn ? "View Complete Schedule" : "সম্পূর্ণ রুটিন দেখুন"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MY COURSES & INTERACTIVE LESSON VIEWER
           ======================================================== */}
        {activeTab === "courses" && (
          <div className="mt-6 space-y-6">
            {!viewingCourse ? (
              /* Enrolled Courses Grid */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                      {isEn ? "My Enrolled Culinary Courses" : "আমার এনরোলকৃত কোর্সসমূহ"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isEn
                        ? "Only courses with approved admission and active tuition status appear here."
                        : "শুধুমাত্র অনুমোদিত ও সক্রিয় কোর্সগুলো এখানে দেখা যাবে।"}
                    </p>
                  </div>
                </div>

                {enrolledCourses.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-editorial-border p-8 text-center space-y-4 max-w-2xl mx-auto">
                    <div className="h-12 w-12 bg-amber-50 text-editorial-accent border border-amber-200 flex items-center justify-center mx-auto">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-lg text-editorial-dark">
                        {isEn ? "No Active Course Access Granted Yet" : "এখনও কোনো কোর্স অনুমোদিত হয়নি"}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        {isEn
                          ? "Course access is strictly controlled by enrollment approval. Browse our professional culinary qualifications, submit an enrollment application, and once approved by the registrar, your course materials and kitchen labs will unlock here."
                          : "কোর্স অ্যাক্সেস শুধুমাত্র অনুমোদিত শিক্ষার্থীদের জন্য উন্মুক্ত। কোর্সে ভর্তির আবেদন জমা দিন, অ্যাডমিন ভেরিফিকেশনের পর কোর্সটি এখানে চালু হবে।"}
                      </p>
                    </div>

                    {/* Show any pending applications submitted by this student */}
                    {studentEnrollments.length > 0 && (
                      <div className="p-4 bg-amber-50/90 border border-amber-300 text-left space-y-2 mt-4 text-xs">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                          Submitted Applications Under Review:
                        </span>
                        {studentEnrollments.map((app) => (
                          <div key={app.id} className="p-2.5 bg-white border border-amber-200 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">{app.courseTitle}</div>
                              <div className="text-[10px] text-slate-500 font-mono">App ID: {app.id} • Applied: {app.appliedAt.split("T")[0]}</div>
                            </div>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                              {app.status === "payment_submitted" ? "Payment Under Review" : "Pending Approval"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={onBrowseCourses}
                        className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        {isEn ? "Browse Courses & Apply Now" : "কোর্স দেখুন ও আবেদন করুন"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((c) => {
                      const completedCount = c.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                      const percent = c.lessons.length ? Math.round((completedCount / c.lessons.length) * 100) : 0;

                      return (
                        <div key={c.id} className="bg-white border border-editorial-border overflow-hidden shadow-xs hover:shadow-md transition">
                          <img src={c.image} alt={c.titleEn} className="h-48 w-full object-cover" />
                          <div className="p-6 space-y-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-wider">
                                {c.levelEn} • {c.duration}
                              </span>
                              <h3 className="font-serif font-bold text-lg text-editorial-dark">
                                {isEn ? c.titleEn : c.titleBn}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {isEn ? c.descriptionEn : c.descriptionBn}
                              </p>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-500">{isEn ? "Progress" : "অগ্রগতি"}</span>
                                <span className="text-editorial-accent">{percent}% Complete ({completedCount}/{c.lessons.length})</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100">
                                <div className="h-full bg-editorial-accent" style={{ width: `${percent}%` }} />
                              </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                              <button
                                onClick={() => {
                                  setViewingCourse(c);
                                  setActiveLesson(c.lessons[0] || null);
                                }}
                                className="flex-1 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                              >
                                <Play className="h-4 w-4" />
                                <span>{isEn ? "Open Classroom" : "ক্লাসরুমে প্রবেশ করুন"}</span>
                              </button>
                              <button
                                onClick={() => onSelectCourse(c)}
                                className="px-3 py-2.5 border border-slate-300 hover:border-slate-800 text-slate-700 text-xs font-bold uppercase transition cursor-pointer"
                              >
                                {isEn ? "Syllabus" : "সিলেবাস"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : !enrolledCourses.some((c) => c.id === viewingCourse.id) ? (
              <div className="bg-red-50 border-2 border-red-300 p-8 text-center space-y-4 max-w-xl mx-auto my-8">
                <div className="h-12 w-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto font-mono font-bold text-xl">
                  403
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-red-900">
                    {isEn ? "Course Access Restricted (403 Forbidden)" : "কোর্স অ্যাক্সেস সীমাবদ্ধ (৪০৩)"}
                  </h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    {isEn
                      ? `Security Policy Rule #5: You do not have an approved enrollment for "${viewingCourse.titleEn}". Only students with APPROVED or ACTIVE admission can access kitchen lessons and laboratory materials.`
                      : `নিরাপত্তা বিধি: "${viewingCourse.titleBn}" কোর্সে আপনার ভর্তি এখনও অনুমোদিত হয়নি। শুধুমাত্র অনুমোদিত শিক্ষার্থীরা এই পাঠ্যক্রম দেখতে পারবেন।`}
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setViewingCourse(null)}
                    className="px-4 py-2 bg-white border border-slate-300 text-xs uppercase font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
                  >
                    {isEn ? "Back to My Courses" : "আমার কোর্সে ফেরত যান"}
                  </button>
                  <button
                    onClick={onBrowseCourses}
                    className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white text-xs uppercase font-bold cursor-pointer"
                  >
                    {isEn ? "Browse & Apply" : "কোর্স তালিকা ও আবেদন"}
                  </button>
                </div>
              </div>
            ) : (
              /* Course Classroom Viewer */
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-editorial-border">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewingCourse(null)}
                      className="px-3 py-1.5 border border-editorial-border bg-white text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
                    >
                      ← {isEn ? "Back to Courses" : "কোর্সে ফেরত যান"}
                    </button>
                    <h2 className="font-serif font-bold text-xl text-editorial-dark">
                      {isEn ? viewingCourse.titleEn : viewingCourse.titleBn}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Video Player & Recipe Material */}
                  <div className="lg:col-span-2 space-y-4">
                    {activeLesson ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-black border border-editorial-border overflow-hidden">
                          <iframe
                            src={activeLesson.videoUrl}
                            title={activeLesson.titleEn}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        <div className="bg-white border border-editorial-border p-6 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-wider">
                                {isEn ? "Interactive Tutorial" : "ইন্টারেক্টিভ টিউটোরিয়াল"} • {activeLesson.duration}
                              </span>
                              <h3 className="font-serif font-bold text-xl text-editorial-dark mt-1">
                                {isEn ? activeLesson.titleEn : activeLesson.titleBn}
                              </h3>
                            </div>
                            <button
                              onClick={() => handleToggleLessonComplete(activeLesson.id)}
                              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                                completedLessonIds.includes(activeLesson.id)
                                  ? "bg-emerald-700 text-white"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              }`}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>
                                {completedLessonIds.includes(activeLesson.id)
                                  ? (isEn ? "Completed" : "সম্পন্ন হয়েছে")
                                  : (isEn ? "Mark as Done" : "সম্পন্ন চিহ্নিত করুন")}
                              </span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {isEn ? activeLesson.descriptionEn : activeLesson.descriptionBn}
                          </p>

                          {/* Recipe and Laboratory Notes */}
                          <div className="bg-[#F7F5F0] p-4 border border-editorial-border space-y-2 text-xs">
                            <h4 className="font-serif font-bold text-sm text-editorial-dark">
                              {isEn ? "Master Chef Laboratory Notes & Rubric:" : "শেফ ল্যাবরেটরি নোট ও নির্দেশিকা:"}
                            </h4>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                              Always adhere strictly to HACCP critical control temperatures (below 40°F cold holding; 165°F or higher poultry core). Perform precision cuts on dry cutting boards with damp towels underneath to ensure absolute knife stability.
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="px-2 py-0.5 bg-white border border-editorial-border text-[10px] font-mono">
                                PDF: Culinary_Lesson_Guide.pdf
                              </span>
                              <span className="px-2 py-0.5 bg-white border border-editorial-border text-[10px] font-mono">
                                Rubric: HACCP_Standard_Temp_Matrix.xlsx
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center bg-white border border-editorial-border text-slate-500">
                        {isEn ? "Select a lesson from the syllabus" : "সিলেবাস থেকে একটি পাঠ নির্বাচন করুন"}
                      </div>
                    )}
                  </div>

                  {/* Right: Modules & Lessons Playlist */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-base text-editorial-dark">
                      {isEn ? "Course Curriculum & Lessons" : "কোর্স পাঠতালিকা ও মডিউল"}
                    </h3>
                    <div className="bg-white border border-editorial-border divide-y divide-editorial-border">
                      {viewingCourse.lessons.map((lesson, idx) => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        const isCurrent = activeLesson?.id === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full p-4 text-left transition flex items-start gap-3 cursor-pointer ${
                              isCurrent ? "bg-amber-50/70" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500">
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-semibold text-xs text-slate-900 leading-snug">
                                {isEn ? lesson.titleEn : lesson.titleBn}
                              </h4>
                              <p className="text-[11px] text-slate-500">{lesson.duration}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: CLASSES & SCHEDULE
           ======================================================== */}
        {activeTab === "classes" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Class Schedule & Room Allocation" : "ক্লাস রুটিন ও ল্যাব বণ্টন"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Upcoming physical practical masterclasses and live interactive sessions." : "আসন্ন ব্যবহারিক মাস্টারক্লাস ও লাইভ সেশনের তালিকা।"}
              </p>
            </div>

            <div className="space-y-4">
              {MOCK_CLASS_SCHEDULE.map((item) => (
                <div key={item.id} className="bg-white border border-editorial-border p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase font-mono">
                        {item.date} • {item.startTime} - {item.endTime}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-editorial-dark">
                      {item.topic}
                    </h3>
                    <p className="text-xs text-slate-600">
                      📍 <strong>Location:</strong> {item.room} • 👨‍🍳 <strong>Trainer:</strong> {item.trainerName}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.onlineLink && (
                      <a
                        href={item.onlineLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>{isEn ? "Online Link" : "অনলাইন লিংক"}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: CALENDAR
           ======================================================== */}
        {activeTab === "calendar" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Culinary Academic Calendar" : "একাডেমিক ক্যালেন্ডার"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Monthly overview of masterclass labs, assignment deadlines, and final board exams." : "মাস্টারক্লাস, অ্যাসাইনমেন্ট জমা ও বোর্ড পরীক্ষার পূর্ণাঙ্গ ক্যালেন্ডার।"}
              </p>
            </div>

            {/* Calendar Grid Representation */}
            <div className="bg-white border border-editorial-border p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <h3 className="font-serif font-bold text-lg text-editorial-dark">
                  July 2026 Cohort Calendar
                </h3>
                <span className="text-xs text-slate-500 font-mono">LQF-1 Morning Foundation #08</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-100">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Sample dates */}
              <div className="grid grid-cols-7 gap-2 text-xs">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const hasClass = [7, 9, 14, 16, 19, 21, 23].includes(day);
                  const hasAssignment = day === 22 || day === 28;
                  const hasExam = day === 25;

                  return (
                    <div
                      key={day}
                      className={`min-h-[70px] p-1.5 border text-left flex flex-col justify-between ${
                        hasExam
                          ? "bg-red-50 border-red-300"
                          : hasClass
                          ? "bg-amber-50/50 border-amber-200"
                          : hasAssignment
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-slate-100"
                      }`}
                    >
                      <span className="font-mono font-bold text-[11px] text-slate-700">{day}</span>
                      <div className="space-y-0.5">
                        {hasClass && (
                          <span className="block text-[9px] bg-amber-600 text-white px-1 font-bold truncate">
                            Practical Lab
                          </span>
                        )}
                        {hasAssignment && (
                          <span className="block text-[9px] bg-blue-600 text-white px-1 font-bold truncate">
                            Due: Knife Cuts
                          </span>
                        )}
                        {hasExam && (
                          <span className="block text-[9px] bg-red-600 text-white px-1 font-bold truncate">
                            Exam (Midterm)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ATTENDANCE
           ======================================================== */}
        {activeTab === "attendance" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Attendance Record & Punctuality" : "উপস্থিতি ও সময়ানুবর্তিতা"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "Minimum 80% attendance is strictly required for official certificate eligibility." : "সার্টিফিকেট অর্জনের জন্য ন্যূনতম ৮০% উপস্থিতি বাধ্যতামূলক।"}
                </p>
              </div>
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                {isEn ? "Official Status:" : "বর্তমান স্ট্যাটাস:"} {attendanceRate}% (Eligible)
              </div>
            </div>

            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
                    <th className="p-3">Date</th>
                    <th className="p-3">Course / Batch</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Marked By</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_ATTENDANCE_RECORDS.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold">{rec.date}</td>
                      <td className="p-3">LQF-1 Morning Foundation</td>
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
                      <td className="p-3 text-slate-600">{rec.markedBy}</td>
                      <td className="p-3 text-slate-500 italic">{rec.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: ASSIGNMENTS
           ======================================================== */}
        {activeTab === "assignments" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Culinary Assignments & Portfolios" : "অ্যাসাইনমেন্ট ও পোর্টফোলিও"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Submit practical knife cuts portfolios, yield calculations, and HACCP plans." : "ব্যবহারিক নাইফ কাট পোর্টফোলিও ও এইচএসিসিপি প্ল্যান জমা দিন।"}
              </p>
            </div>

            <div className="space-y-4">
              {MOCK_ASSIGNMENTS.map((assign) => {
                const sub = submissions.find((s) => s.assignmentId === assign.id);

                return (
                  <div key={assign.id} className="bg-white border border-editorial-border p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-wider font-mono">
                          Due Date: {assign.dueDate} • Max Marks: {assign.maxMarks}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-editorial-dark mt-0.5">
                          {assign.title}
                        </h3>
                      </div>
                      <div>
                        {sub ? (
                          <span className={`px-3 py-1 text-xs font-bold uppercase ${
                            sub.status === "graded" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {sub.status === "graded" ? `Graded (${sub.marksObtained}/${assign.maxMarks})` : "Submitted"}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                            Pending Submission
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {assign.description}
                    </p>

                    {/* Graded Feedback if available */}
                    {sub && sub.status === "graded" && (
                      <div className="bg-[#F7F5F0] p-4 border border-editorial-border space-y-1 text-xs">
                        <span className="font-bold text-slate-800">{isEn ? "Trainer Evaluation & Feedback:" : "প্রশিক্ষকের মন্তব্য:"}</span>
                        <p className="text-slate-600 italic leading-relaxed">"{sub.feedback}"</p>
                        <p className="text-[10px] text-slate-400">Graded by {sub.gradedBy} on {sub.gradedAt?.split("T")[0]}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    {!sub && (
                      <button
                        onClick={() => setActiveAssignmentToSubmit(assign)}
                        className="px-4 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isEn ? "Upload Submission" : "অ্যাসাইনমেন্ট জমা দিন"}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: EXAMS & QUIZZES
           ======================================================== */}
        {activeTab === "exams" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Examinations & Theoretical Assessments" : "পরীক্ষা ও মূল্যায়ন"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Formal examinations testing food safety, knife terminology, mother sauces, and cooking chemistry." : "খাদ্য নিরাপত্তা ও কালিনারি থিওরির আনুষ্ঠানিক পরীক্ষা।"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_EXAMS.map((exam) => {
                const sub = MOCK_STUDENT_EXAM_SUBMISSIONS.find((s) => s.examId === exam.id);

                return (
                  <div key={exam.id} className="bg-white border border-editorial-border p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase font-mono">
                          {exam.durationMinutes} Mins • Pass: {exam.passingScore}%
                        </span>
                        {sub ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                            Passed ({sub.scoreObtained}%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-lg text-editorial-dark">
                        {exam.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {exam.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold">
                        {exam.questions.length} Questions ({exam.totalPoints} pts)
                      </span>
                      <button
                        onClick={() => {
                          setActiveExam(exam);
                          setExamAnswers({});
                          setExamSubmitted(false);
                          setExamScore(null);
                        }}
                        className="px-4 py-2 bg-editorial-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        {sub ? (isEn ? "Retake / Review" : "রিভিউ করুন") : (isEn ? "Start Exam" : "পরীক্ষা দিন")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: RESULTS & GRADEBOOK
           ======================================================== */}
        {activeTab === "results" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Student Academic Transcript & Gradebook" : "একাডেমিক ট্রান্সক্রিপ্ট ও গ্রেডবুক"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Verified evaluation breakdown across practical execution, theory examinations, and assignments." : "ব্যবহারিক দক্ষতা, তাত্ত্বিক পরীক্ষা ও অ্যাসাইনমেন্টের সমন্বিত ফলাফল।"}
              </p>
            </div>

            <div className="space-y-4">
              {MOCK_STUDENT_GRADE_RESULTS.map((res) => (
                <div key={res.id} className="bg-white border-2 border-editorial-border p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-editorial-accent font-mono tracking-wider">
                        TRANSCRIPT REF: {res.id} • {res.batchName}
                      </span>
                      <h3 className="font-serif font-extrabold text-xl text-editorial-dark">
                        {res.courseTitle}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">{isEn ? "Awarded Grade" : "অর্জিত গ্রেড"}</span>
                      <span className="font-serif font-extrabold text-2xl text-emerald-700">{res.grade}</span>
                    </div>
                  </div>

                  {/* Marks Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">{isEn ? "Assignments" : "অ্যাসাইনমেন্ট"}</span>
                      <span className="font-mono font-bold text-base text-slate-900">{res.assignmentMarks} / {res.maxAssignmentMarks}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">{isEn ? "Quizzes" : "কুইজ"}</span>
                      <span className="font-mono font-bold text-base text-slate-900">{res.quizMarks} / {res.maxQuizMarks}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">{isEn ? "Practical Cooking" : "ব্যবহারিক রান্না"}</span>
                      <span className="font-mono font-bold text-base text-slate-900">{res.practicalMarks} / {res.maxPracticalMarks}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">{isEn ? "Theory Board" : "থিওরি পরীক্ষা"}</span>
                      <span className="font-mono font-bold text-base text-slate-900">{res.theoryMarks} / {res.maxTheoryMarks}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase text-emerald-800 font-bold block">{isEn ? "Overall Score" : "মোট নম্বর"}</span>
                      <span className="font-mono font-extrabold text-base text-emerald-800">{res.overallScore}%</span>
                    </div>
                  </div>

                  {res.remarks && (
                    <div className="bg-[#F7F5F0] p-4 border border-editorial-border text-xs space-y-1">
                      <span className="font-bold text-slate-800">{isEn ? "Master Assessor Remarks:" : "প্রধান পরীক্ষকের মন্তব্য:"}</span>
                      <p className="text-slate-700 italic">"{res.remarks}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: PAYMENTS
           ======================================================== */}
        {activeTab === "payments" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Tuition & Payment Management" : "টিউশন ফি ও পেমেন্ট ম্যানেজমেন্ট"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEn ? "View installment schedules, submission logs, and official tax receipts." : "ইনস্টলমেন্ট রসিদ ও ভেরিফাইড পেমেন্টের বিবরণ।"}
                </p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <DollarSign className="h-4 w-4" />
                <span>{isEn ? "Submit Payment TrxID" : "পেমেন্ট TrxID জমা দিন"}</span>
              </button>
            </div>

            {/* Balances Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">{isEn ? "Total Program Tuition" : "মোট কোর্স ফি"}</span>
                <div className="font-serif text-2xl font-bold text-editorial-dark">{formatPrice(totalFees)}</div>
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

            {/* Transactions Log Table */}
            <div className="bg-white border border-editorial-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-editorial-border uppercase font-bold text-[10px] text-slate-600 tracking-wider">
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
                      <td className="p-3 font-mono font-bold text-editorial-dark">{p.invoiceNumber}</td>
                      <td className="p-3 uppercase font-semibold text-slate-700">{p.gateway}</td>
                      <td className="p-3 font-mono text-slate-600">{p.trxId}</td>
                      <td className="p-3 font-bold text-slate-900">{formatPrice(p.amount)}</td>
                      <td className="p-3 text-slate-500 font-mono">{p.timestamp.split("T")[0]}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          p.status === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 10: CERTIFICATES
           ======================================================== */}
        {activeTab === "certificates" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Digital Accredited Certificates" : "ডিজিটাল অ্যাক্রেডিটেড সার্টিফিকেট"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn
                  ? "Every issued diploma features a cryptographic verification ID and is publicly registered."
                  : "প্রতিটি সার্টিফিকেটে একটি অনন্য নম্বর রয়েছে যা অনলাইনে যেকোনো স্থান থেকে যাচাই করা সম্ভব।"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentCerts.map((cert) => (
                <div key={cert.id} className="bg-[#FCFBF8] border-2 border-editorial-border p-6 space-y-4 relative shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-editorial-accent font-mono">
                        {cert.certificateNumber}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-editorial-dark">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Completed on {cert.completionDate} • Grade: <strong className="text-emerald-700">{cert.grade}</strong>
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-amber-600 shrink-0" />
                  </div>

                  <div className="pt-4 border-t border-editorial-border flex items-center justify-between text-xs">
                    {onVerifyCertificatePublic && (
                      <button
                        onClick={() => onVerifyCertificatePublic(cert.certificateNumber)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{isEn ? "Verify Credential" : "যাচাই করুন"}</span>
                      </button>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:text-black font-semibold text-[11px] transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isEn ? "Print / Save PDF" : "প্রিন্ট / পিডিএফ"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 11: NOTIFICATIONS
           ======================================================== */}
        {activeTab === "notifications" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Notifications & Academic Bulletins" : "বিজ্ঞপ্তি ও বুলেটিন"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Official announcements from registrar and head chefs." : "রেজিস্ট্রার ও প্রশিক্ষকদের অফিসিয়াল ঘোষণা।"}
              </p>
            </div>

            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="bg-white border border-editorial-border p-4 flex items-start gap-4">
                  <div className="h-9 w-9 bg-red-50 text-editorial-accent flex items-center justify-center shrink-0 border border-editorial-border">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.createdAt.split("T")[0]}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 12: PROFILE
           ======================================================== */}
        {activeTab === "profile" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Student Dossier & Personal Profile" : "শিক্ষার্থী প্রোফাইল"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Keep your contact info and emergency numbers updated." : "আপনার যোগাযোগের ঠিকানা ও জরুরি নম্বর আপডেট রাখুন।"}
              </p>
            </div>

            <div className="bg-white border border-editorial-border p-6 space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">{isEn ? "Full Name" : "পুরো নাম"}</span>
                  <p className="font-bold text-sm text-slate-900">{currentUser.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">{isEn ? "Email" : "ইমেল"}</span>
                  <p className="font-mono text-sm text-slate-900">{currentUser.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">{isEn ? "Phone" : "ফোন"}</span>
                  <p className="font-mono text-sm text-slate-900">{currentUser.phone || "+880 1712-345678"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">{isEn ? "Location" : "শহর"}</span>
                  <p className="text-sm text-slate-900">{currentUser.city || "Dhaka"}, {currentUser.country || "Bangladesh"}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">{isEn ? "Residential Address" : "ঠিকানা"}</span>
                  <p className="text-sm text-slate-900">{currentUser.address || "House 24, Road 11, Dhanmondi, Dhaka 1209"}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">{isEn ? "Educational Background" : "শিক্ষাগত যোগ্যতা"}</span>
                  <p className="text-sm text-slate-900">{currentUser.educationalBackground || "Bachelor in Hospitality Management, University of Dhaka"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 13: SUPPORT / HELPDESK
           ======================================================== */}
        {activeTab === "support" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="font-serif font-extrabold text-2xl text-editorial-dark">
                {isEn ? "Student Helpdesk & Academic Inquiries" : "শিক্ষার্থী হেল্পডেস্ক ও সহায়তা"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn ? "Contact the administration regarding batch rescheduling, uniform kits, or knife maintenance." : "ব্যাচ পরিবর্তন, ইউনিফর্ম কিট বা ছুরির ধার সংক্রান্ত যেকোনো প্রয়োজনে যোগাযোগ করুন।"}
              </p>
            </div>

            <div className="bg-white border border-editorial-border p-6 max-w-2xl space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isEn ? "Inquiry Subject:" : "বিষয়:"}</span>
                <input
                  type="text"
                  placeholder="e.g. Request for Saturday lab makeup session"
                  className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isEn ? "Message Body:" : "বার্তার বিবরণ:"}</span>
                <textarea
                  rows={4}
                  placeholder="Describe your inquiry..."
                  className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent"
                />
              </div>
              <button
                type="button"
                onClick={() => alert(isEn ? "Inquiry dispatched to registrar!" : "বার্তাটি রেজিস্ট্রারের নিকট পাঠানো হয়েছে!")}
                className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                {isEn ? "Submit Inquiry" : "বার্তা পাঠান"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          SUBMIT ASSIGNMENT MODAL
         ======================================================== */}
      {activeAssignmentToSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-editorial-dark">
                {isEn ? "Submit Assignment" : "অ্যাসাইনমেন্ট জমা দিন"}
              </h3>
              <button onClick={() => setActiveAssignmentToSubmit(null)} className="text-slate-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-editorial-accent font-bold uppercase">{activeAssignmentToSubmit.title}</span>
              <p className="text-xs text-slate-600">{activeAssignmentToSubmit.description}</p>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isEn ? "Submission Notes / Recipe Formulation:" : "নোট বা রেসিপি ফরমালিশন:"}</span>
                <textarea
                  rows={3}
                  required
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Enter details of your practical execution and yield..."
                  className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isEn ? "Attachment URL or Photo Drive Link:" : "ফটো বা ড্রাইভ লিংক:"}</span>
                <input
                  type="url"
                  value={submissionFile}
                  onChange={(e) => setSubmissionFile(e.target.value)}
                  placeholder="https://drive.google.com/portfolio.pdf"
                  className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent text-slate-900"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAssignmentToSubmit(null)}
                  className="px-4 py-2 border border-slate-300 text-xs uppercase font-semibold cursor-pointer"
                >
                  {isEn ? "Cancel" : "বাতিল"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-editorial-accent hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isEn ? "Confirm Submission" : "নিশ্চিত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EXAM TAKER MODAL
         ======================================================== */}
      {activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-[#FDFCF9] border-2 border-editorial-border max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-editorial-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-widest font-mono">
                  {activeExam.durationMinutes} MINUTES TIMER • {activeExam.totalPoints} TOTAL POINTS
                </span>
                <h3 className="font-serif font-extrabold text-xl text-editorial-dark mt-0.5">
                  {activeExam.title}
                </h3>
              </div>
              <button onClick={() => setActiveExam(null)} className="text-slate-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                {activeExam.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white border border-editorial-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-editorial-accent">Question {idx + 1} of {activeExam.questions.length}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{q.points} Points</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                      {q.question}
                    </h4>

                    {q.options && q.options.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`p-2.5 border text-xs cursor-pointer transition flex items-center gap-2.5 ${
                              examAnswers[q.id] === optIdx
                                ? "border-editorial-accent bg-red-50/50 font-bold"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={examAnswers[q.id] === optIdx}
                              onChange={() => setExamAnswers({ ...examAnswers, [q.id]: optIdx })}
                              className="accent-editorial-accent"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === "written" && (
                      <textarea
                        rows={3}
                        placeholder="Write your explanation here..."
                        onChange={(e) => setExamAnswers({ ...examAnswers, [q.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:border-editorial-accent"
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-editorial-border flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Answered {Object.keys(examAnswers).length} of {activeExam.questions.length} questions
                  </span>
                  <button
                    onClick={handleFinishExam}
                    className="px-6 py-2.5 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-xs"
                  >
                    {isEn ? "Submit Exam Answers" : "উত্তরপত্র জমা দিন"}
                  </button>
                </div>
              </div>
            ) : (
              /* Exam Result View */
              <div className="p-8 text-center space-y-4 bg-white border border-editorial-border">
                <div className="h-16 w-16 mx-auto bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h4 className="font-serif font-extrabold text-2xl text-editorial-dark">
                  {isEn ? "Exam Successfully Submitted!" : "পরীক্ষা সফলভাবে সম্পন্ন হয়েছে!"}
                </h4>
                <div className="inline-block px-6 py-3 bg-emerald-50 border border-emerald-300 text-emerald-900 font-serif font-extrabold text-3xl">
                  {examScore} / {activeExam.totalPoints} PTS ({Math.round(((examScore || 0) / activeExam.totalPoints) * 100)}%)
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {isEn
                    ? "Your score has been logged to your academic transcript. Great work on adhering to safety and sanitation standards!"
                    : "আপনার নম্বরটি প্রাতিষ্ঠানিক ট্রান্সক্রিপ্টে রেকর্ড করা হয়েছে।"}
                </p>
                <button
                  onClick={() => setActiveExam(null)}
                  className="px-6 py-2 bg-editorial-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isEn ? "Close Assessment" : "বন্ধ করুন"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          PAYMENT SUBMISSION MODAL
         ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-editorial-border max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-editorial-dark">
                {isEn ? "Submit Tuition Payment" : "টিউশন ফি পেমেন্ট জমা দিন"}
              </h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-600 font-semibold">{isEn ? "Payment Method:" : "পেমেন্ট মাধ্যম:"}</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["bkash", "nagad", "bank"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayGateway(m)}
                      className={`py-2 text-center font-bold uppercase text-[11px] border cursor-pointer ${
                        payGateway === m ? "border-editorial-accent bg-red-50 text-editorial-accent" : "border-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 font-semibold">{isEn ? "Amount (BDT ৳):" : "পরিমাণ (টাকা):"}</span>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 font-bold focus:outline-none focus:border-editorial-accent text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-600 font-semibold">{isEn ? "Transaction ID (TrxID):" : "ট্রানজেকশন আইডি (TrxID):"}</span>
                <input
                  type="text"
                  required
                  value={payTrxId}
                  onChange={(e) => setPayTrxId(e.target.value)}
                  placeholder="e.g. BKASH98765432"
                  className="w-full px-3 py-2 border border-slate-300 font-mono uppercase focus:outline-none focus:border-editorial-accent text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 uppercase font-semibold cursor-pointer"
                >
                  {isEn ? "Cancel" : "বাতিল"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isEn ? "Submit TrxID" : "জমা দিন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
