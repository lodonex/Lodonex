/**
 * LODONEX - REAL-TIME TRAINER / FACULTY DASHBOARD
 * 
 * Route: /trainer/dashboard
 * Powered strictly by real-time Firestore listeners (onSnapshot).
 * NO mock data, NO fake statistics.
 */

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Plus,
  Send,
  AlertCircle,
  RefreshCw,
  Eye,
  Check,
  Search,
  ChevronRight,
  FileText
} from "lucide-react";
import {
  Language,
  UserAccount,
  Course,
  Batch,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Exam,
  StudentGradeResult
} from "../types";
import { useRealtimeDashboard } from "../services/useRealtimeDashboard";
import {
  recordFirestoreAttendance,
  submitFirestoreAssignment,
  gradeFirestoreSubmission,
  createFirestoreAssignment,
  calculateAttendanceMetrics
} from "../services/dashboardService";

interface TrainerDashboardProps {
  lang: Language;
  currentUser: UserAccount;
  onNavigate: (path: string) => void;
  onSelectCourse?: (course: Course) => void;
}

export default function TrainerDashboard({
  lang,
  currentUser,
  onNavigate,
  onSelectCourse
}: TrainerDashboardProps) {
  const isEn = lang === "en";

  // Connect to Real-time Firestore Dashboard Stream
  const {
    courses,
    batches,
    attendance,
    assignments,
    submissions,
    exams,
    results,
    users,
    notifications,
    isLoading,
    error,
    isLive,
    lastUpdated,
    retry
  } = useRealtimeDashboard({
    isTrainer: true,
    userId: currentUser.id,
    role: "trainer"
  });

  const [activeTab, setActiveTab] = useState<
    "overview" | "batches" | "attendance" | "assignments" | "exams" | "performance"
  >("overview");

  // Attendance recording modal / form state
  const [selectedBatchForAttendance, setSelectedBatchForAttendance] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, "present" | "absent" | "late" | "excused">>({});
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // New assignment modal
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignCourseId, setAssignCourseId] = useState("");
  const [assignBatchId, setAssignBatchId] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignMaxMarks, setAssignMaxMarks] = useState(50);
  const [assignDescription, setAssignDescription] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  // Grading modal state
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [marksGiven, setMarksGiven] = useState<number>(0);
  const [gradingFeedback, setGradingFeedback] = useState("");
  const [gradingSaving, setGradingSaving] = useState(false);

  // Filter trainer's assigned courses & batches
  const myAssignedBatchIds = currentUser.assignedBatchId ? [currentUser.assignedBatchId] : [];
  const myBatches = batches.filter(
    (b) =>
      b.trainerId === currentUser.id ||
      b.trainerName?.toLowerCase() === currentUser.name?.toLowerCase() ||
      myAssignedBatchIds.includes(b.id)
  );

  const assignedBatchIdsSet = new Set(myBatches.map((b) => b.id));
  const assignedCourseIdsSet = new Set(
    myBatches.map((b) => b.courseId).concat(currentUser.assignedCourseIds || [])
  );

  const myCourses = courses.filter((c) => assignedCourseIdsSet.has(c.id));

  // Assigned students: from users whose assignedBatchId is in assignedBatchIdsSet
  const myStudents = users.filter(
    (u) => u.role === "student" && (u.assignedBatchId ? assignedBatchIdsSet.has(u.assignedBatchId) : true)
  );

  // Filter attendance for trainer's batches
  const myAttendance = attendance.filter(
    (a) => !a.batchId || assignedBatchIdsSet.has(a.batchId) || a.markedBy === currentUser.id
  );

  // Submissions for trainer's assignments
  const myAssignments = assignments.filter((a) => !a.batchId || assignedBatchIdsSet.has(a.batchId));
  const myAssignmentIds = new Set(myAssignments.map((a) => a.id));
  const mySubmissions = submissions.filter((s) => myAssignmentIds.has(s.assignmentId));
  const pendingReviews = mySubmissions.filter((s) => s.status === "submitted");

  // Calculate real performance metrics
  const attendanceMetrics = calculateAttendanceMetrics(myAttendance);
  const gradedSubmissions = mySubmissions.filter((s) => s.status === "graded" && typeof s.marksObtained === "number");
  const averageSubmissionScore =
    gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce((sum, s) => sum + (s.marksObtained || 0), 0) / gradedSubmissions.length
        )
      : null;

  // Save Attendance to Firestore
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForAttendance || myStudents.length === 0) return;

    setAttendanceSaving(true);
    setAttendanceSuccess(false);

    try {
      const targetBatch = myBatches.find((b) => b.id === selectedBatchForAttendance);
      const batchStudents = myStudents.filter(
        (s) => s.assignedBatchId === selectedBatchForAttendance || myStudents.length <= 10
      );

      const records: AttendanceRecord[] = batchStudents.map((s) => ({
        id: `att-${selectedBatchForAttendance}-${s.id}-${attendanceDate}`,
        batchId: selectedBatchForAttendance,
        courseId: targetBatch?.courseId || "course-1",
        date: attendanceDate,
        studentId: s.id,
        studentName: s.name,
        status: attendanceMarks[s.id] || "present",
        markedBy: currentUser.id,
        remarks: `Recorded by Chef ${currentUser.name}`
      }));

      await recordFirestoreAttendance(records);
      setAttendanceSuccess(true);
      setTimeout(() => setAttendanceSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save attendance:", err);
    } finally {
      setAttendanceSaving(false);
    }
  };

  // Create Assignment in Firestore
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || !assignDueDate) return;

    setAssignSaving(true);
    try {
      const targetCourse = courses.find((c) => c.id === assignCourseId) || courses[0];
      await createFirestoreAssignment({
        courseId: targetCourse ? targetCourse.id : "course-1",
        courseTitle: targetCourse ? (isEn ? targetCourse.titleEn : targetCourse.titleBn) : "Culinary Arts",
        batchId: assignBatchId || undefined,
        title: assignTitle.trim(),
        description: assignDescription.trim(),
        dueDate: assignDueDate,
        maxMarks: Number(assignMaxMarks) || 50,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.name
      });
      setIsNewAssignmentOpen(false);
      setAssignTitle("");
      setAssignDescription("");
    } catch (err) {
      console.error("Create assignment error:", err);
    } finally {
      setAssignSaving(false);
    }
  };

  // Grade Submission in Firestore
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setGradingSaving(true);
    try {
      await gradeFirestoreSubmission(
        gradingSubmission.id,
        marksGiven,
        gradingFeedback,
        currentUser.name
      );
      setGradingSubmission(null);
      setGradingFeedback("");
    } catch (err) {
      console.error("Grading error:", err);
    } finally {
      setGradingSaving(false);
    }
  };

  return (
    <div id="lodonex-trainer-dashboard" className="font-sans text-slate-900 pb-16">
      {/* Top Header Banner */}
      <div className="bg-[#111111] text-white border-b-2 border-editorial-accent py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-500/20 border border-blue-400 text-blue-400 flex items-center justify-center font-bold">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  CULINARY FACULTY • TRAINER
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/90 font-mono font-bold">
                  {currentUser.name}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isEn ? "Faculty Academic & Practical Console" : "ফ্যাকাল্টি একাডেমিক ও প্র্যাকটিক্যাল কনসোল"}
              </h1>
            </div>
          </div>

          {/* Real-time Connectivity Indicator */}
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

            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="px-3.5 py-2 bg-editorial-accent hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isEn ? "Add Assignment" : "অ্যাসাইনমেন্ট দিন"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-editorial-border pb-px text-xs font-bold uppercase tracking-wider">
          {[
            { id: "overview", label: isEn ? "Overview" : "ওভারভিউ", icon: BookOpen },
            { id: "batches", label: isEn ? "Assigned Batches" : "বরাদ্দকৃত ব্যাচ", icon: Calendar },
            { id: "attendance", label: isEn ? "Mark Attendance" : "হাজিরা রেকর্ড", icon: CheckCircle },
            { id: "assignments", label: isEn ? "Assignments & Grading" : "অ্যাসাইনমেন্ট ও খাতা", icon: GraduationCap },
            { id: "exams", label: isEn ? "Exams & Results" : "পরীক্ষা ও ফলাফল", icon: Award },
            { id: "performance", label: isEn ? "Student Performance" : "শিক্ষার্থী পারফরম্যান্স", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 whitespace-nowrap border-b-2 transition cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-700 font-extrabold bg-blue-50/50"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">
              {isEn ? "Loading real-time data from Firebase..." : "ফায়ারবেস থেকে লাইভ ডাটা লোড হচ্ছে..."}
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

        {/* TAB 1: OVERVIEW */}
        {!isLoading && activeTab === "overview" && (
          <div className="space-y-6 mt-6">
            {/* KPI Cards: All Strictly from Firebase */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Assigned Courses" : "বরাদ্দকৃত কোর্স"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-blue-900">
                  {myCourses.length}
                </div>
                <p className="text-[10px] text-slate-500">{isEn ? "Curriculum Modules" : "কারিকুলাম মডিউল"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Assigned Batches" : "চলমান ব্যাচ"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-slate-900">
                  {myBatches.length}
                </div>
                <p className="text-[10px] text-slate-500">{isEn ? "Active Cohorts" : "সক্রিয় কোহর্ট"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Enrolled Apprentices" : "যুক্ত শিক্ষার্থী"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-emerald-700">
                  {myStudents.length}
                </div>
                <p className="text-[10px] text-emerald-600">{isEn ? "Under Training" : "প্রশিক্ষণার্থী"}</p>
              </div>

              <div className="bg-white border border-editorial-border p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Pending Reviews" : "মূল্যায়ন বাকি"}
                </span>
                <div className="font-serif text-2xl font-extrabold text-amber-700">
                  {pendingReviews.length}
                </div>
                <p className="text-[10px] text-amber-600">{isEn ? "Submissions Awaiting Marks" : "অ্যাসাইনমেন্ট জমা"}</p>
              </div>
            </div>

            {/* Quick Actions & Recent Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-editorial-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    {isEn ? "Submissions Requiring Faculty Evaluation" : "মূল্যায়ন অপেক্ষমাণ অ্যাসাইনমেন্ট"}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                    {pendingReviews.length} {isEn ? "Pending" : "বাকি"}
                  </span>
                </div>

                {pendingReviews.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                    {isEn ? "No data available yet. All apprentice submissions are up to date." : "এখনও কোনো তথ্য নেই। সকল অ্যাসাইনমেন্ট মূল্যায়ন সম্পন্ন।"}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingReviews.slice(0, 5).map((sub) => (
                      <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{sub.studentName}</span>
                          <span className="text-[11px] text-slate-500">
                            {sub.fileName || "Coursework Submission"} • Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setMarksGiven(sub.marksObtained || 40);
                            setGradingFeedback(sub.feedback || "");
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider"
                        >
                          {isEn ? "Evaluate & Grade" : "নম্বর দিন"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Today's Classes & Practical Modules */}
              <div className="bg-white border border-editorial-border p-5 space-y-4">
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {isEn ? "Assigned Cohorts & Classes" : "বরাদ্দকৃত কোহর্ট ও ক্লাস"}
                </h3>
                {myBatches.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    {isEn ? "No data available yet. No batches currently assigned." : "এখনও কোনো ব্যাচ বরাদ্দ করা হয়নি।"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myBatches.map((batch) => (
                      <div key={batch.id} className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">{batch.name}</span>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{batch.classDays.join(", ")}</span>
                          <span className="font-mono">{batch.classTime}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">{batch.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE RECORDING */}
        {!isLoading && activeTab === "attendance" && (
          <div className="bg-white border border-editorial-border p-6 space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {isEn ? "Daily Classroom & Lab Attendance Register" : "দৈনিক ক্লাসরুম ও ল্যাব হাজিরা খাতা"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isEn
                    ? "Select cohort batch and mark students present, absent, or late. Saves directly to Firestore."
                    : "ব্যাচ নির্বাচন করে শিক্ষার্থীদের হাজিরা দিন। সরাসরি ফায়ারবেসে সংরক্ষিত হবে।"}
                </p>
              </div>

              {attendanceSuccess && (
                <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>{isEn ? "Attendance Saved to Firebase!" : "হাজিরা সফলভাবে সংরক্ষিত হয়েছে!"}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 border border-slate-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  {isEn ? "Select Cohort Batch *" : "ব্যাচ নির্বাচন করুন *"}
                </label>
                <select
                  value={selectedBatchForAttendance}
                  onChange={(e) => setSelectedBatchForAttendance(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-300 text-xs font-bold"
                >
                  <option value="">{isEn ? "[ Select Batch ]" : "[ ব্যাচ নির্বাচন ]"}</option>
                  {myBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  {isEn ? "Date *" : "তারিখ *"}
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Students roster table for attendance */}
            {selectedBatchForAttendance && (
              <form onSubmit={handleSaveAttendance} className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Student ID</th>
                        <th className="p-3">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 font-mono text-slate-500">{s.id}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {(["present", "absent", "late", "excused"] as const).map((st) => (
                                <label key={st} className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`status-${s.id}`}
                                    value={st}
                                    checked={(attendanceMarks[s.id] || "present") === st}
                                    onChange={() =>
                                      setAttendanceMarks((prev) => ({ ...prev, [s.id]: st }))
                                    }
                                  />
                                  <span className="text-[11px] uppercase font-bold text-slate-700">
                                    {st}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={attendanceSaving}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    {attendanceSaving ? (isEn ? "Saving..." : "সংরক্ষণ হচ্ছে...") : (isEn ? "Save Attendance to Firebase" : "হাজিরা সংরক্ষণ করুন")}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS & GRADING */}
        {!isLoading && activeTab === "assignments" && (
          <div className="space-y-6 mt-6">
            <div className="bg-white border border-editorial-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {isEn ? "Coursework & Practical Assignments" : "অ্যাসাইনমেন্ট ও প্র্যাকটিক্যাল কাজ"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEn
                      ? "Create homework, knife portfolios, and evaluate apprentice submissions."
                      : "শিক্ষার্থীদের অ্যাসাইনমেন্ট দিন এবং মূল্যায়ন করুন।"}
                  </p>
                </div>
                <button
                  onClick={() => setIsNewAssignmentOpen(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider"
                >
                  + {isEn ? "Create New Assignment" : "নতুন অ্যাসাইনমেন্ট"}
                </button>
              </div>

              {myAssignments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                  {isEn ? "No data available yet. No assignments created." : "এখনও কোনো অ্যাসাইনমেন্ট তৈরি করা হয়নি।"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAssignments.map((a) => (
                    <div key={a.id} className="p-4 border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 font-bold">
                          Max: {a.maxMarks}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{a.description}</p>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span>Due: {a.dueDate}</span>
                        <span>{a.courseTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submissions Table */}
            <div className="bg-white border border-editorial-border p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {isEn ? "Apprentice Submissions Register" : "শিক্ষার্থীদের জমাকৃত কাজের খাতা"}
              </h3>
              {mySubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 text-xs">
                  {isEn ? "No data available yet. No student submissions recorded." : "এখনও কোনো অ্যাসাইনমেন্ট জমা পড়েনি।"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Assignment</th>
                        <th className="p-3">Submitted At</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Score</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mySubmissions.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{s.studentName}</td>
                          <td className="p-3 text-slate-700">{s.fileName || "Knife Cut Portfolio"}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">
                            {new Date(s.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                              s.status === "graded" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {s.marksObtained !== undefined ? `${s.marksObtained} Marks` : "-"}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setGradingSubmission(s);
                                setMarksGiven(s.marksObtained || 40);
                                setGradingFeedback(s.feedback || "");
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold uppercase"
                            >
                              {s.status === "graded" ? "Re-evaluate" : "Grade"}
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

        {/* TAB 4: STUDENT PERFORMANCE */}
        {!isLoading && activeTab === "performance" && (
          <div className="bg-white border border-editorial-border p-6 space-y-6 mt-6">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {isEn ? "Culinary Apprentice Performance & Attendance" : "শিক্ষার্থী পারফরম্যান্স ও হাজিরা পরিসংখ্যান"}
            </h3>

            {/* Performance KPIs derived strictly from real records */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Classes Logged</span>
                <div className="text-2xl font-bold font-serif text-slate-900">{attendanceMetrics.total}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Average Attendance</span>
                <div className="text-2xl font-bold font-serif text-emerald-700">
                  {attendanceMetrics.total > 0 ? `${attendanceMetrics.rate}%` : "No data yet"}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Evaluated Submissions</span>
                <div className="text-2xl font-bold font-serif text-blue-900">{gradedSubmissions.length}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Average Score</span>
                <div className="text-2xl font-bold font-serif text-indigo-900">
                  {averageSubmissionScore !== null ? `${averageSubmissionScore} / 50` : "No data yet"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Evaluation / Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 border-2 border-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-serif font-bold text-base text-slate-900">
                Evaluate Submission: {gradingSubmission.studentName}
              </h4>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Marks Given (Max 50) *</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={marksGiven}
                  onChange={(e) => setMarksGiven(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Faculty Assessment / Feedback</label>
                <textarea
                  rows={3}
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  placeholder="e.g. Excellent julienne cuts, clean seasoning."
                  className="w-full px-3 py-2 border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold uppercase text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gradingSaving}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase text-[10px]"
                >
                  {gradingSaving ? "Saving..." : "Save Grade to Firebase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {isNewAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 border-2 border-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-serif font-bold text-base text-slate-900">
                {isEn ? "Issue Coursework Assignment" : "নতুন অ্যাসাইনমেন্ট প্রদান"}
              </h4>
              <button
                onClick={() => setIsNewAssignmentOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Title *</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Five Mother Sauces Mastery & HACCP Notes"
                  className="w-full px-3 py-2 border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Course</label>
                <select
                  value={assignCourseId}
                  onChange={(e) => setAssignCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isEn ? c.titleEn : c.titleBn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Due Date *</label>
                <input
                  type="date"
                  required
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Description & Instructions</label>
                <textarea
                  rows={3}
                  value={assignDescription}
                  onChange={(e) => setAssignDescription(e.target.value)}
                  placeholder="Provide preparation details or submission guidelines..."
                  className="w-full px-3 py-2 border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold uppercase text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSaving}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase text-[10px]"
                >
                  {assignSaving ? "Publishing..." : "Publish to Firebase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
