/**
 * LODONEX - UNIFIED REAL-TIME FIREBASE DASHBOARD HOOK
 * 
 * Provides live Firestore streams for Super Admin, Admin, Staff, Trainer, and Student dashboards.
 * Guarantees:
 * - Real-time onSnapshot listeners with automatic cleanup on unmount
 * - No mock data, all data derived from Firebase
 * - Real-time connectivity indicator (live / connecting / error)
 * - Last updated real timestamp
 */

import { useState, useEffect, useCallback } from "react";
import {
  UserAccount,
  Course,
  Batch,
  EnrollmentApplication,
  PaymentRecord,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Exam,
  StudentGradeResult,
  DigitalCertificate,
  LMSNotification,
  AuditLogEntry
} from "../types";
import {
  subscribeUsers,
  subscribeCourses,
  subscribeBatches,
  subscribeEnrollments,
  subscribePayments,
  subscribeAttendance,
  subscribeAssignments,
  subscribeSubmissions,
  subscribeExams,
  subscribeResults,
  subscribeCertificates,
  subscribeNotifications,
  subscribeAuditLogs,
  DateFilterType,
  isDateWithinFilter
} from "./dashboardService";

export interface DashboardOptions {
  role?: string;
  userId?: string;
  studentEmail?: string;
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  isStaff?: boolean;
  isTrainer?: boolean;
  isStudent?: boolean;
}

export function useRealtimeDashboard(options: DashboardOptions) {
  const { role, userId, isSuperAdmin, isAdmin, isStaff, isTrainer, isStudent } = options;

  // Real-time collections
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentApplication[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<StudentGradeResult[]>([]);
  const [certificates, setCertificates] = useState<DigitalCertificate[]>([]);
  const [notifications, setNotifications] = useState<LMSNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Status & metadata
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>("all");

  const markUpdated = useCallback(() => {
    setLastUpdated(new Date());
    setIsLive(true);
    setIsLoading(false);
  }, []);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const unsubs: (() => void)[] = [];

    try {
      // 1. Courses & Batches are needed across all dashboards
      unsubs.push(
        subscribeCourses(
          (data) => {
            setCourses(data);
            markUpdated();
          },
          (err) => {
            console.error("Courses sub error:", err);
            setError("Unable to load real-time courses from Firebase.");
          }
        )
      );

      unsubs.push(
        subscribeBatches(
          isTrainer ? userId || null : null,
          (data) => {
            setBatches(data);
            markUpdated();
          },
          (err) => {
            console.error("Batches sub error:", err);
          }
        )
      );

      // 2. Role-specific Subscriptions:
      // A. Super Admin & Admin & Staff: Full access to users, audit logs, all enrollments, all payments
      if (isSuperAdmin || isAdmin || isStaff) {
        unsubs.push(
          subscribeUsers(
            (data) => {
              setUsers(data);
              markUpdated();
            },
            (err) => {
              console.error("Users sub error:", err);
              setError("Unable to load real-time user records.");
            }
          )
        );

        unsubs.push(
          subscribeEnrollments(
            null,
            (data) => {
              setEnrollments(data);
              markUpdated();
            },
            (err) => console.error("Enrollments sub error:", err)
          )
        );

        unsubs.push(
          subscribePayments(
            null,
            (data) => {
              setPayments(data);
              markUpdated();
            },
            (err) => console.error("Payments sub error:", err)
          )
        );

        unsubs.push(
          subscribeAttendance(
            null,
            (data) => {
              setAttendance(data);
              markUpdated();
            },
            (err) => console.error("Attendance sub error:", err)
          )
        );

        unsubs.push(
          subscribeAssignments(
            null,
            (data) => {
              setAssignments(data);
              markUpdated();
            },
            (err) => console.error("Assignments sub error:", err)
          )
        );

        unsubs.push(
          subscribeSubmissions(
            null,
            (data) => {
              setSubmissions(data);
              markUpdated();
            },
            (err) => console.error("Submissions sub error:", err)
          )
        );

        unsubs.push(
          subscribeExams(
            (data) => {
              setExams(data);
              markUpdated();
            },
            (err) => console.error("Exams sub error:", err)
          )
        );

        unsubs.push(
          subscribeResults(
            null,
            (data) => {
              setResults(data);
              markUpdated();
            },
            (err) => console.error("Results sub error:", err)
          )
        );

        unsubs.push(
          subscribeCertificates(
            null,
            (data) => {
              setCertificates(data);
              markUpdated();
            },
            (err) => console.error("Certificates sub error:", err)
          )
        );

        unsubs.push(
          subscribeAuditLogs(
            50,
            (data) => {
              setAuditLogs(data);
              markUpdated();
            },
            (err) => console.error("Audit logs sub error:", err)
          )
        );
      } else if (isTrainer) {
        // B. Trainer: course assignments, batches, attendance, submissions, exams, results
        unsubs.push(
          subscribeEnrollments(
            null,
            (data) => {
              setEnrollments(data);
              markUpdated();
            },
            (err) => console.error("Trainer enrollments sub error:", err)
          )
        );

        unsubs.push(
          subscribeAttendance(
            null,
            (data) => {
              setAttendance(data);
              markUpdated();
            },
            (err) => console.error("Trainer attendance sub error:", err)
          )
        );

        unsubs.push(
          subscribeAssignments(
            null,
            (data) => {
              setAssignments(data);
              markUpdated();
            },
            (err) => console.error("Trainer assignments sub error:", err)
          )
        );

        unsubs.push(
          subscribeSubmissions(
            null,
            (data) => {
              setSubmissions(data);
              markUpdated();
            },
            (err) => console.error("Trainer submissions sub error:", err)
          )
        );

        unsubs.push(
          subscribeExams(
            (data) => {
              setExams(data);
              markUpdated();
            },
            (err) => console.error("Trainer exams sub error:", err)
          )
        );

        unsubs.push(
          subscribeResults(
            null,
            (data) => {
              setResults(data);
              markUpdated();
            },
            (err) => console.error("Trainer results sub error:", err)
          )
        );
      } else if (isStudent) {
        // C. Student: only own enrollments, payments, attendance, submissions, results, certificates
        if (userId) {
          unsubs.push(
            subscribeEnrollments(
              { studentId: userId },
              (data) => {
                setEnrollments(data);
                markUpdated();
              },
              (err) => console.error("Student enrollments sub error:", err)
            )
          );

          unsubs.push(
            subscribePayments(
              userId,
              (data) => {
                setPayments(data);
                markUpdated();
              },
              (err) => console.error("Student payments sub error:", err)
            )
          );

          unsubs.push(
            subscribeAttendance(
              { studentId: userId },
              (data) => {
                setAttendance(data);
                markUpdated();
              },
              (err) => console.error("Student attendance sub error:", err)
            )
          );

          unsubs.push(
            subscribeAssignments(
              null,
              (data) => {
                setAssignments(data);
                markUpdated();
              },
              (err) => console.error("Student assignments sub error:", err)
            )
          );

          unsubs.push(
            subscribeSubmissions(
              { studentId: userId },
              (data) => {
                setSubmissions(data);
                markUpdated();
              },
              (err) => console.error("Student submissions sub error:", err)
            )
          );

          unsubs.push(
            subscribeExams(
              (data) => {
                setExams(data);
                markUpdated();
              },
              (err) => console.error("Student exams sub error:", err)
            )
          );

          unsubs.push(
            subscribeResults(
              userId,
              (data) => {
                setResults(data);
                markUpdated();
              },
              (err) => console.error("Student results sub error:", err)
            )
          );

          unsubs.push(
            subscribeCertificates(
              userId,
              (data) => {
                setCertificates(data);
                markUpdated();
              },
              (err) => console.error("Student certificates sub error:", err)
            )
          );
        }
      }

      // 3. Notifications subscription for all authenticated users
      unsubs.push(
        subscribeNotifications(
          userId || null,
          role || null,
          (data) => {
            setNotifications(data);
            markUpdated();
          },
          (err) => console.error("Notifications sub error:", err)
        )
      );
    } catch (err: any) {
      console.error("useRealtimeDashboard init error:", err);
      setError("Unable to connect to real-time Firebase streams.");
      setIsLoading(false);
    }

    return () => {
      // Clean up all subscriptions on unmount
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {}
      });
      setIsLive(false);
    };
  }, [role, userId, isSuperAdmin, isAdmin, isStaff, isTrainer, isStudent, markUpdated, refreshTrigger]);

  // Apply Date and Course Filters to datasets
  const filteredUsers = users.filter((u) => isDateWithinFilter(u.createdAt, dateFilter));
  
  const filteredEnrollments = enrollments.filter((e) => {
    const matchesDate = isDateWithinFilter(e.appliedAt, dateFilter);
    const matchesCourse = selectedCourseFilter === "all" || e.courseId === selectedCourseFilter;
    const matchesBatch = selectedBatchFilter === "all" || e.batchId === selectedBatchFilter;
    return matchesDate && matchesCourse && matchesBatch;
  });

  const filteredPayments = payments.filter((p) => {
    const matchesDate = isDateWithinFilter(p.timestamp, dateFilter);
    const matchesCourse = selectedCourseFilter === "all" || p.courseId === selectedCourseFilter;
    return matchesDate && matchesCourse;
  });

  const filteredAttendance = attendance.filter((a) => {
    const matchesDate = isDateWithinFilter(a.date, dateFilter);
    const matchesCourse = selectedCourseFilter === "all" || a.courseId === selectedCourseFilter;
    const matchesBatch = selectedBatchFilter === "all" || a.batchId === selectedBatchFilter;
    return matchesDate && matchesCourse && matchesBatch;
  });

  const filteredCertificates = certificates.filter((c) => {
    const matchesDate = isDateWithinFilter(c.issueDate, dateFilter);
    const matchesCourse = selectedCourseFilter === "all" || c.courseId === selectedCourseFilter;
    return matchesDate && matchesCourse;
  });

  return {
    // Live Datasets
    users,
    filteredUsers,
    courses,
    batches,
    enrollments,
    filteredEnrollments,
    payments,
    filteredPayments,
    attendance,
    filteredAttendance,
    assignments,
    submissions,
    exams,
    results,
    certificates,
    filteredCertificates,
    notifications,
    auditLogs,

    // Status
    isLoading,
    error,
    lastUpdated,
    isLive,
    retry,

    // Filters & Setters
    dateFilter,
    setDateFilter,
    selectedCourseFilter,
    setSelectedCourseFilter,
    selectedBatchFilter,
    setSelectedBatchFilter
  };
}
