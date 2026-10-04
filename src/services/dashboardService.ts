/**
 * LODONEX COOKING ACADEMY - REAL-TIME FIREBASE DASHBOARD SERVICE
 * 
 * Production-ready Firestore data access layer using onSnapshot() real-time listeners.
 * Strictly adheres to real Firebase records:
 * - NO mock data, NO fake statistics, NO placeholder numbers
 * - Clean unsubscribe handles to prevent memory leaks
 * - Role-based scoping and query filters
 */

import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";
import { db, auth } from "../utils/firebase";
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
  AuditLogEntry,
  ClassScheduleItem
} from "../types";

export type DateFilterType = "today" | "week" | "month" | "last_month" | "year" | "all";

// ==========================================
// 1. REAL-TIME SUBSCRIPTION METHODS
// ==========================================

/**
 * Subscribe to all users in Firestore (Super Admin & Admin)
 */
export function subscribeUsers(
  onData: (users: UserAccount[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "users"));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const users: UserAccount[] = [];
        snapshot.forEach((d) => {
          users.push({ id: d.id, ...(d.data() as any) } as UserAccount);
        });
        onData(users);
      },
      (error) => {
        console.error("Firestore subscribeUsers error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup users subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to all courses in Firestore
 */
export function subscribeCourses(
  onData: (courses: Course[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "courses"));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const courses: Course[] = [];
        snapshot.forEach((d) => {
          courses.push({ id: d.id, ...(d.data() as any) } as Course);
        });
        onData(courses);
      },
      (error) => {
        console.error("Firestore subscribeCourses error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup courses subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to batches in Firestore (Optional trainer filter)
 */
export function subscribeBatches(
  filterTrainerId: string | null,
  onData: (batches: Batch[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "batches"));
    if (filterTrainerId) {
      q = query(collection(db, "batches"), where("trainerId", "==", filterTrainerId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const batches: Batch[] = [];
        snapshot.forEach((d) => {
          batches.push({ id: d.id, ...(d.data() as any) } as Batch);
        });
        onData(batches);
      },
      (error) => {
        console.error("Firestore subscribeBatches error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup batches subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to course enrollments in Firestore
 * - Super Admin / Admin / Staff: all enrollments
 * - Student: filtered by studentId or studentEmail
 * - Trainer: optionally filtered by courseId/batchId
 */
export function subscribeEnrollments(
  filter: {
    studentId?: string;
    studentEmail?: string;
    courseId?: string;
    batchId?: string;
  } | null,
  onData: (enrollments: EnrollmentApplication[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "enrollments"));
    if (filter?.studentId) {
      q = query(collection(db, "enrollments"), where("studentId", "==", filter.studentId));
    } else if (filter?.courseId) {
      q = query(collection(db, "enrollments"), where("courseId", "==", filter.courseId));
    } else if (filter?.batchId) {
      q = query(collection(db, "enrollments"), where("batchId", "==", filter.batchId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: EnrollmentApplication[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as EnrollmentApplication);
        });
        // Sort in memory by appliedAt descending
        list.sort((a, b) => new Date(b.appliedAt || 0).getTime() - new Date(a.appliedAt || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeEnrollments error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup enrollments subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to payments in Firestore
 * - Super Admin / Admin / Staff: all payments
 * - Student: filtered by studentId
 */
export function subscribePayments(
  filterStudentId: string | null,
  onData: (payments: PaymentRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "payments"));
    if (filterStudentId) {
      q = query(collection(db, "payments"), where("studentId", "==", filterStudentId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: PaymentRecord[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as PaymentRecord);
        });
        list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribePayments error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup payments subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to attendance records in Firestore
 * - Student: filtered by studentId
 * - Trainer: filtered by batchId or courseId
 * - Admin: all attendance
 */
export function subscribeAttendance(
  filter: { studentId?: string; batchId?: string; courseId?: string } | null,
  onData: (records: AttendanceRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "attendance"));
    if (filter?.studentId) {
      q = query(collection(db, "attendance"), where("studentId", "==", filter.studentId));
    } else if (filter?.batchId) {
      q = query(collection(db, "attendance"), where("batchId", "==", filter.batchId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: AttendanceRecord[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as AttendanceRecord);
        });
        list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeAttendance error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup attendance subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to assignments in Firestore
 */
export function subscribeAssignments(
  filterCourseId: string | null,
  onData: (assignments: Assignment[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "assignments"));
    if (filterCourseId) {
      q = query(collection(db, "assignments"), where("courseId", "==", filterCourseId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: Assignment[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as Assignment);
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeAssignments error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup assignments subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to assignment submissions in Firestore
 * - Student: filtered by studentId
 * - Trainer / Admin: all or filtered by assignmentId
 */
export function subscribeSubmissions(
  filter: { studentId?: string; assignmentId?: string } | null,
  onData: (submissions: AssignmentSubmission[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "submissions"));
    if (filter?.studentId) {
      q = query(collection(db, "submissions"), where("studentId", "==", filter.studentId));
    } else if (filter?.assignmentId) {
      q = query(collection(db, "submissions"), where("assignmentId", "==", filter.assignmentId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: AssignmentSubmission[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as AssignmentSubmission);
        });
        list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeSubmissions error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup submissions subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to exams in Firestore
 */
export function subscribeExams(
  onData: (exams: Exam[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "exams"));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: Exam[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as Exam);
        });
        list.sort((a, b) => new Date(b.scheduledDate || 0).getTime() - new Date(a.scheduledDate || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeExams error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup exams subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to results/grades in Firestore
 * - Student: filtered by studentId
 * - Trainer / Admin: all results
 */
export function subscribeResults(
  filterStudentId: string | null,
  onData: (results: StudentGradeResult[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "results"));
    if (filterStudentId) {
      q = query(collection(db, "results"), where("studentId", "==", filterStudentId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: StudentGradeResult[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as StudentGradeResult);
        });
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeResults error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup results subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to certificates in Firestore
 * - Student: filtered by studentId
 * - Admin: all certificates
 */
export function subscribeCertificates(
  filterStudentId: string | null,
  onData: (certs: DigitalCertificate[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    let q = query(collection(db, "certificates"));
    if (filterStudentId) {
      q = query(collection(db, "certificates"), where("studentId", "==", filterStudentId));
    }
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: DigitalCertificate[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as DigitalCertificate);
        });
        list.sort((a, b) => new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeCertificates error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup certificates subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to notifications in Firestore
 */
export function subscribeNotifications(
  userId: string | null,
  userRole: string | null,
  onData: (notifications: LMSNotification[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "notifications"), limit(50));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: LMSNotification[] = [];
        snapshot.forEach((d) => {
          const item = { id: d.id, ...(d.data() as any) } as LMSNotification;
          // Filter in memory for authorized recipient:
          // Matches user's exact UID, 'all', or matching role group (e.g. 'student', 'trainer', 'staff')
          if (
            !userId ||
            item.userId === userId ||
            item.userId === "all" ||
            item.userId === userRole ||
            (userRole === "super_admin" || userRole === "admin")
          ) {
            list.push(item);
          }
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeNotifications error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup notifications subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to immutable audit logs in Firestore (Super Admin & Admin)
 */
export function subscribeAuditLogs(
  limitCount: number = 50,
  onData: (logs: AuditLogEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const q = query(collection(db, "audit_logs"), limit(limitCount));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: AuditLogEntry[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) } as AuditLogEntry);
        });
        list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
        onData(list);
      },
      (error) => {
        console.error("Firestore subscribeAuditLogs error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup audit logs subscription:", err);
    if (onError) onError(err);
    return () => {};
  }
}

// ==========================================
// 2. FIRESTORE MUTATOR METHODS
// ==========================================

export async function createFirestoreEnrollment(enrollment: Omit<EnrollmentApplication, "id"> & { id?: string }): Promise<string> {
  const id = enrollment.id || `enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanData: EnrollmentApplication = {
    ...enrollment,
    id,
    appliedAt: enrollment.appliedAt || new Date().toISOString()
  };
  await setDoc(doc(db, "enrollments", id), cleanData);
  
  // Log audit action
  await logAuditAction({
    actorUid: auth.currentUser?.uid || enrollment.studentId,
    actorName: enrollment.studentName,
    actorRole: "student",
    action: "COURSE_CREATED",
    targetUid: id,
    targetResource: "enrollments",
    details: `Enrollment application submitted for ${enrollment.courseTitle} by ${enrollment.studentName}.`
  });

  return id;
}

export async function updateFirestoreEnrollmentStatus(
  enrollmentId: string,
  status: EnrollmentApplication["status"],
  reviewerName: string = "Admin"
): Promise<void> {
  const ref = doc(db, "enrollments", enrollmentId);
  await updateDoc(ref, {
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName
  });

  // Log audit action
  await logAuditAction({
    actorUid: auth.currentUser?.uid || "admin",
    actorName: reviewerName,
    actorRole: "admin",
    action: "ROLE_CHANGED",
    targetUid: enrollmentId,
    targetResource: "enrollments",
    details: `Enrollment ${enrollmentId} status updated to ${status} by ${reviewerName}.`
  });
}

export async function createFirestorePayment(payment: Omit<PaymentRecord, "id"> & { id?: string }): Promise<string> {
  const id = payment.id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanData: PaymentRecord = {
    ...payment,
    id,
    timestamp: payment.timestamp || new Date().toISOString()
  };
  await setDoc(doc(db, "payments", id), cleanData);

  await logAuditAction({
    actorUid: auth.currentUser?.uid || payment.studentId,
    actorName: payment.studentName,
    actorRole: "student",
    action: "PAYMENT_VERIFIED",
    targetUid: id,
    targetResource: "payments",
    details: `Payment submitted: ৳${payment.amount} for ${payment.courseTitle} (TrxID: ${payment.trxId}).`
  });

  return id;
}

export async function verifyFirestorePayment(
  paymentId: string,
  status: PaymentRecord["status"],
  verifiedByName: string
): Promise<void> {
  const ref = doc(db, "payments", paymentId);
  await updateDoc(ref, {
    status,
    verifiedBy: verifiedByName,
    verifiedAt: new Date().toISOString()
  });

  await logAuditAction({
    actorUid: auth.currentUser?.uid || "admin",
    actorName: verifiedByName,
    actorRole: "admin",
    action: "PAYMENT_VERIFIED",
    targetUid: paymentId,
    targetResource: "payments",
    details: `Payment ${paymentId} status verified as ${status} by ${verifiedByName}.`
  });
}

export async function recordFirestoreAttendance(records: AttendanceRecord[]): Promise<void> {
  for (const r of records) {
    const id = r.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await setDoc(doc(db, "attendance", id), { ...r, id });
  }
}

export async function createFirestoreAssignment(assignment: Omit<Assignment, "id"> & { id?: string }): Promise<string> {
  const id = assignment.id || `assign-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanData: Assignment = {
    ...assignment,
    id
  };
  await setDoc(doc(db, "assignments", id), cleanData);
  return id;
}

export async function submitFirestoreAssignment(submission: Omit<AssignmentSubmission, "id"> & { id?: string }): Promise<string> {
  const id = submission.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanData: AssignmentSubmission = {
    ...submission,
    id,
    submittedAt: submission.submittedAt || new Date().toISOString()
  };
  await setDoc(doc(db, "submissions", id), cleanData);
  return id;
}

export async function gradeFirestoreSubmission(
  submissionId: string,
  marksObtained: number,
  feedback: string,
  graderName: string
): Promise<void> {
  const ref = doc(db, "submissions", submissionId);
  await updateDoc(ref, {
    marksObtained,
    feedback,
    status: "graded",
    gradedBy: graderName,
    gradedAt: new Date().toISOString()
  });
}

export async function createFirestoreBatch(batch: Omit<Batch, "id"> & { id?: string }): Promise<string> {
  const id = batch.id || `batch-${Date.now()}`;
  await setDoc(doc(db, "batches", id), { ...batch, id });
  return id;
}

export async function createFirestoreCourse(course: Course): Promise<string> {
  await setDoc(doc(db, "courses", course.id), course);
  return course.id;
}

export async function updateFirestoreUser(userId: string, data: Partial<UserAccount>): Promise<void> {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteFirestoreUser(userId: string): Promise<void> {
  const ref = doc(db, "users", userId);
  await deleteDoc(ref);
}

export async function createFirestoreExam(exam: Omit<Exam, "id"> & { id?: string }): Promise<string> {
  const id = exam.id || `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  await setDoc(doc(db, "exams", id), { ...exam, id });
  return id;
}

export async function recordFirestoreExamResult(result: Omit<StudentGradeResult, "id"> & { id?: string }): Promise<string> {
  const id = result.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  await setDoc(doc(db, "results", id), {
    ...result,
    id,
    gradedAt: result.gradedAt || new Date().toISOString()
  });
  return id;
}

export async function deleteFirestoreBatch(batchId: string): Promise<void> {
  await deleteDoc(doc(db, "batches", batchId));
}

export async function deleteFirestoreCourse(courseId: string): Promise<void> {
  await deleteDoc(doc(db, "courses", courseId));
}

export async function deleteFirestoreEnrollment(enrollmentId: string): Promise<void> {
  await deleteDoc(doc(db, "enrollments", enrollmentId));
}

export async function deleteFirestoreCertificate(certId: string): Promise<void> {
  await deleteDoc(doc(db, "certificates", certId));
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCsv = (val: string | number) => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCsv).join(","),
    ...rows.map((r) => r.map(escapeCsv).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function issueFirestoreCertificate(cert: DigitalCertificate): Promise<string> {
  await setDoc(doc(db, "certificates", cert.id), cert);
  await logAuditAction({
    actorUid: auth.currentUser?.uid || "admin",
    actorName: cert.authorizedSignatory || "Academic Registrar",
    actorRole: "admin",
    action: "CERTIFICATE_ISSUED",
    targetUid: cert.id,
    targetResource: "certificates",
    details: `Accredited culinary certificate ${cert.certificateNumber} issued to ${cert.studentName} for ${cert.courseTitle}.`
  });
  return cert.id;
}

export async function logAuditAction(entry: Omit<AuditLogEntry, "id" | "timestamp"> & { id?: string; timestamp?: string }): Promise<void> {
  try {
    const id = entry.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const log: AuditLogEntry = {
      ...entry,
      id,
      timestamp: entry.timestamp || new Date().toISOString()
    };
    await setDoc(doc(db, "audit_logs", id), log);
  } catch (err) {
    console.warn("Audit log creation note:", err);
  }
}

// ==========================================
// 3. STATISTICAL & FILTER CALCULATION HELPERS
// ==========================================

export function isDateWithinFilter(dateString: string | undefined | null, filter: DateFilterType): boolean {
  if (!dateString || filter === "all") return true;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return true;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === "today") {
    return d >= startOfToday;
  }
  if (filter === "week") {
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 7);
    return d >= startOfWeek;
  }
  if (filter === "month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return d >= startOfMonth;
  }
  if (filter === "last_month") {
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  }
  if (filter === "year") {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return d >= startOfYear;
  }
  return true;
}

/**
 * Calculate Student Course Progress accurately without hardcoded numbers.
 * Returns percentage (0-100) or null if course has 0 lessons.
 */
export function calculateStudentCourseProgress(
  course: Course,
  completedLessonIds: string[] = []
): { percentage: number; completedCount: number; totalCount: number; statusText: string } {
  const total = course.lessons?.length || 0;
  if (total === 0) {
    return { percentage: 0, completedCount: 0, totalCount: 0, statusText: "No lessons available" };
  }
  const courseLessonIds = new Set(course.lessons.map((l) => l.id));
  const completedInCourse = completedLessonIds.filter((id) => courseLessonIds.has(id)).length;
  const percentage = Math.round((completedInCourse / total) * 100);

  let statusText = "In Progress";
  if (completedInCourse === 0) statusText = "Not Started";
  else if (completedInCourse >= total) statusText = "Completed";

  return {
    percentage,
    completedCount: completedInCourse,
    totalCount: total,
    statusText
  };
}

/**
 * Calculate Student Attendance Summary accurately from records.
 */
export function calculateAttendanceMetrics(records: AttendanceRecord[]): {
  total: number;
  present: number;
  absent: number;
  late: number;
  rate: number;
} {
  const total = records.length;
  if (total === 0) {
    return { total: 0, present: 0, absent: 0, late: 0, rate: 0 };
  }
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  // Standard academic formula: (present + late * 0.5) / total * 100
  const rate = Math.round(((present + late * 0.5) / total) * 100);
  return { total, present, absent, late, rate };
}

/**
 * Sync initial accredited courses to Firestore if the collection has 0 items
 */
export async function syncInitialCoursesIfEmpty(initialCourses: Course[]): Promise<number> {
  try {
    const snap = await getDocs(query(collection(db, "courses"), limit(1)));
    if (snap.empty) {
      console.log("Seeding official courses into empty Firestore collection...");
      for (const c of initialCourses) {
        await setDoc(doc(db, "courses", c.id), c);
      }
      return initialCourses.length;
    }
    return 0;
  } catch (err) {
    console.warn("syncInitialCoursesIfEmpty note:", err);
    return 0;
  }
}
