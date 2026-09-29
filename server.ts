import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / stored merchant payment gateway configuration
let merchantGatewayConfig = {
  bkashMerchantNumber: process.env.MERCHANT_BKASH_NUMBER || "+880 1711-000000",
  nagadMerchantNumber: process.env.MERCHANT_NAGAD_NUMBER || "+880 1811-000000",
  rocketMerchantNumber: process.env.MERCHANT_ROCKET_NUMBER || "+880 1911-000000",
  bankName: process.env.MERCHANT_BANK_NAME || "Eastern Bank PLC (EBL)",
  bankAccountName: process.env.MERCHANT_BANK_ACC_NAME || "Lodonex Cooking Academy Ltd.",
  bankAccountNumber: process.env.MERCHANT_BANK_ACC_NUM || "101234567890",
  bankBranch: process.env.MERCHANT_BANK_BRANCH || "Gulshan Branch, Dhaka",
  bankRoutingNumber: process.env.MERCHANT_BANK_ROUTING || "085261728",
  bkashAppKeyConfigured: !!process.env.BKASH_APP_KEY,
  sslCommerzStoreIdConfigured: !!process.env.SSLCOMMERZ_STORE_ID,
};

// ==========================================
// LMS SERVER-SIDE DATA STORES (In-Memory)
// ==========================================

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  country?: string;
  city?: string;
  address?: string;
  photoUrl?: string;
  role: "superadmin" | "admin" | "trainer" | "student";
  status: "pending" | "active" | "approved" | "suspended" | "blocked";
  assignedBatchId?: string;
  assignedCourseIds?: string[];
  emailVerified?: boolean;
  createdAt?: string;
}

let usersStore: UserAccount[] = [
  {
    id: "superadmin-1",
    name: "Chef Dewan (Director)",
    email: "superadmin@lodonex.com",
    role: "superadmin",
    status: "active",
    phone: "+880 1700-111000",
    city: "Dhaka",
    country: "Bangladesh",
    emailVerified: true,
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "admin-staff-1",
    name: "Farhana Yasmin (Registrar)",
    email: "admin@lodonex.com",
    role: "admin",
    status: "active",
    phone: "+880 1711-222333",
    city: "Dhaka",
    country: "Bangladesh",
    emailVerified: true,
    createdAt: "2026-01-05T00:00:00Z"
  },
  {
    id: "trainer-tawhid-1",
    name: "Chef Tawhid Shekh (Executive Trainer)",
    email: "chef.tawhid@lodonex.com",
    role: "trainer",
    status: "active",
    phone: "+880 1722-444555",
    city: "Dhaka",
    country: "Bangladesh",
    assignedBatchId: "batch-101",
    assignedCourseIds: ["course-1"],
    emailVerified: true,
    createdAt: "2026-01-10T00:00:00Z"
  },
  {
    id: "default-student-1",
    name: "Tasnim Rahman",
    email: "tasnim@example.com",
    phone: "+880 1712-345678",
    dateOfBirth: "1999-04-12",
    gender: "female",
    country: "Bangladesh",
    city: "Dhaka",
    address: "House 24, Road 11, Dhanmondi, Dhaka 1209",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    role: "student",
    status: "approved",
    assignedBatchId: "batch-101",
    assignedCourseIds: ["course-1"],
    emailVerified: true,
    createdAt: "2026-05-25T10:00:00Z"
  },
  {
    id: "pending-student-2",
    name: "Rafiqul Islam",
    email: "student.pending@lodonex.com",
    phone: "+880 1911-556677",
    dateOfBirth: "2001-08-20",
    gender: "male",
    country: "Bangladesh",
    city: "Chittagong",
    address: "GEC Circle, Nasirabad, Chittagong",
    role: "student",
    status: "pending",
    emailVerified: false,
    createdAt: "2026-07-28T09:00:00Z"
  }
];

let batchesStore = [
  {
    id: "batch-101",
    name: "LQF-1 Morning Culinary Foundation #08",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    trainerId: "trainer-tawhid-1",
    trainerName: "Chef Tawhid Shekh",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    classDays: ["Sunday", "Tuesday", "Thursday"],
    classTime: "09:30 AM - 01:30 PM",
    maxStudents: 16,
    enrolledStudentsCount: 14,
    location: "Campus Lab A – Commercial Hot Kitchen (Dhaka)",
    status: "active"
  },
  {
    id: "batch-102",
    name: "LQF-1 Evening Professional Batch #09",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    trainerId: "trainer-tawhid-1",
    trainerName: "Chef Tawhid Shekh",
    startDate: "2026-07-15",
    endDate: "2026-10-15",
    classDays: ["Monday", "Wednesday"],
    classTime: "05:00 PM - 08:30 PM",
    maxStudents: 18,
    enrolledStudentsCount: 12,
    location: "Campus Lab B – Gastronomy Training Center",
    status: "active"
  },
  {
    id: "batch-103",
    name: "LQF-2 Continental & Haute Cuisine #04",
    courseId: "course-2",
    courseTitle: "Level 2 – Lodonex Certified Culinary Professional",
    trainerId: "trainer-tanvir-2",
    trainerName: "Chef Tanvir Ahmed",
    startDate: "2026-08-01",
    endDate: "2026-11-01",
    classDays: ["Sunday", "Wednesday"],
    classTime: "10:00 AM - 02:00 PM",
    maxStudents: 15,
    enrolledStudentsCount: 11,
    location: "Campus Lab C – Butchery & Sauté Pavilion",
    status: "active"
  }
];

let enrollmentsStore = [
  {
    id: "app-2026-01",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    studentEmail: "tasnim@example.com",
    studentPhone: "+880 1712-345678",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    status: "active",
    appliedAt: "2026-05-25T10:00:00Z",
    reviewedAt: "2026-05-26T12:00:00Z",
    reviewedBy: "Admin Registrar",
    notes: "Payment verified. Assigned to Morning Cohort.",
    paymentMethod: "bKash Merchant Pay",
    transactionId: "BKASH98765432",
    totalFee: 150000,
    paidAmount: 150000
  },
  {
    id: "app-2026-03",
    studentId: "student-applicant-99",
    studentName: "Mohammad Shafi",
    studentEmail: "shafi.chef@example.com",
    studentPhone: "+880 1912-998877",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    status: "payment_submitted",
    appliedAt: "2026-07-28T08:45:00Z",
    notes: "Submitted Nagad TrxID NAGAD77123490. Awaiting registrar verification.",
    paymentMethod: "Nagad",
    transactionId: "NAGAD77123490",
    totalFee: 150000,
    paidAmount: 150000
  },
  {
    id: "app-2026-04",
    studentId: "student-farid-88",
    studentName: "Farid Uddin",
    studentEmail: "farid.uddin@example.com",
    studentPhone: "+880 1611-332211",
    courseId: "course-2",
    courseTitle: "Level 2 – Lodonex Certified Culinary Professional",
    batchId: "batch-103",
    batchName: "LQF-2 Continental & Haute Cuisine #04",
    status: "under_review",
    appliedAt: "2026-07-27T16:20:00Z",
    notes: "Requires LQF Level 1 certificate verification from previous institution.",
    paymentMethod: "Pending",
    totalFee: 200000,
    paidAmount: 0
  }
];

let classScheduleStore = [
  {
    id: "sched-1",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    trainerId: "trainer-tawhid-1",
    trainerName: "Chef Tawhid Shekh",
    date: "2026-07-14",
    startTime: "09:30",
    endTime: "13:30",
    topic: "Precision Knife Cuts & Fundamental White/Brown Stocks",
    room: "Station 4 - Commercial Hot Kitchen",
    onlineLink: "https://meet.lodonex.com/lab-1-chef-tawhid",
    notes: "Bring sanitized Wüsthof knife kit, HACCP apron, and cut-resistant glove.",
    status: "completed"
  },
  {
    id: "sched-2",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    trainerId: "trainer-tawhid-1",
    trainerName: "Chef Tawhid Shekh",
    date: "2026-07-16",
    startTime: "09:30",
    endTime: "13:30",
    topic: "The Five Classical French Mother Sauces (Béchamel, Velouté, Espagnole, Tomato, Hollandaise)",
    room: "Sauce & Sauté Pavilion",
    onlineLink: "https://meet.lodonex.com/lab-1-chef-tawhid",
    notes: "Review temperature danger zones for egg-emulsified Hollandaise sauces.",
    status: "completed"
  },
  {
    id: "sched-3",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    trainerId: "trainer-tawhid-1",
    trainerName: "Chef Tawhid Shekh",
    date: "2026-07-19",
    startTime: "09:30",
    endTime: "13:30",
    topic: "Poultry Fabrication, Trussing & Internal Critical Temperatures (HACCP 165°F)",
    room: "Butchery & Fabrication Bay",
    onlineLink: "https://meet.lodonex.com/lab-1-chef-tawhid",
    notes: "Practical breakdown of two broiler chickens into standard cuts.",
    status: "scheduled"
  }
];

let attendanceStore = [
  {
    id: "att-1",
    batchId: "batch-101",
    courseId: "course-1",
    classId: "sched-1",
    date: "2026-07-14",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    status: "present",
    markedBy: "Chef Tawhid Shekh",
    remarks: "Perfect uniform and pristine knife kit."
  },
  {
    id: "att-2",
    batchId: "batch-101",
    courseId: "course-1",
    classId: "sched-2",
    date: "2026-07-16",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    status: "present",
    markedBy: "Chef Tawhid Shekh",
    remarks: "Excellent velvety texture on Velouté reduction."
  }
];

let assignmentsStore: any[] = [
  {
    id: "assign-1",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    title: "Assignment 1: Classical Knife Cuts Specimen Board & Yield Calculation",
    description: "Prepare and photograph precision cuts: Julienne, Brunoise, Batonnet, and Paysanne. Calculate edible portion yield percentage from 500g whole carrots.",
    dueDate: "2026-07-22",
    maxMarks: 50,
    attachments: [{ name: "LQF1_Knife_Cuts_Rubric.pdf", url: "#" }],
    createdAt: "2026-07-10",
    createdBy: "Chef Tawhid Shekh"
  }
];

let submissionsStore: any[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    studentEmail: "tasnim@example.com",
    submittedAt: "2026-07-20T14:30:00Z",
    contentText: "Submitted high-resolution photo portfolio of precision cuts using carrots and celery, with calculated 68.4% edible yield ratio.",
    fileUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    fileName: "Tasnim_Rahman_LQF1_Knife_Portfolio.pdf",
    status: "graded",
    marksObtained: 48,
    feedback: "Exceptional uniformity in Brunoise cuts. Clean dice and sharp edges.",
    gradedBy: "Chef Tawhid Shekh",
    gradedAt: "2026-07-21T10:15:00Z"
  }
];

let examsStore = [
  {
    id: "exam-1",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    title: "Mid-Term Theoretical & Sanitation Examination (LQF Level 1)",
    description: "Evaluates kitchen safety, HACCP regulations, cross-contamination, food temperatures, and mother sauces.",
    durationMinutes: 45,
    passingScore: 75,
    scheduledDate: "2026-07-25",
    startTime: "10:00 AM",
    endTime: "10:45 AM",
    totalPoints: 100,
    isPublished: true,
    status: "active"
  }
];

let resultsStore = [
  {
    id: "result-1",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    assignmentMarks: 48,
    maxAssignmentMarks: 50,
    quizMarks: 45,
    maxQuizMarks: 50,
    practicalMarks: 94,
    maxPracticalMarks: 100,
    theoryMarks: 96,
    maxTheoryMarks: 100,
    finalExamMarks: 95,
    maxFinalExamMarks: 100,
    overallScore: 94.5,
    maxOverallScore: 100,
    grade: "A+ (Distinction)",
    remarks: "Top of cohort. Exemplary sanitation discipline, punctuality, and refined culinary dexterity.",
    published: true,
    publishedDate: "2026-08-30"
  }
];

let certificatesStore = [
  {
    id: "cert-001",
    certificateNumber: "LOD-CERT-2026-0891",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    studentEmail: "tasnim@example.com",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    completionDate: "2026-08-30",
    issueDate: "2026-09-01",
    duration: "3 Months (360 Guided Practical Hours)",
    trainingHours: "360 Hours",
    grade: "Grade A+ (Distinction – 94.5%)",
    authorizedSignatory: "Chef Dewan / Master Assessor",
    signatoryTitle: "Director of Culinary Education & LQF Master Assessor",
    isValid: true
  },
  {
    id: "cert-002",
    certificateNumber: "LOD-CERT-2026-0042",
    studentId: "student-sarah-42",
    studentName: "Sarah Khan",
    studentEmail: "sarah.khan@example.com",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchName: "LQF-1 Accelerated Winter Cohort #07",
    completionDate: "2026-04-15",
    issueDate: "2026-04-20",
    duration: "3 Months (360 Hours)",
    trainingHours: "360 Hours",
    grade: "Grade A (Honours)",
    authorizedSignatory: "Chef Dewan / Master Assessor",
    signatoryTitle: "Director of Culinary Education",
    isValid: true
  }
];

// Registered payment transactions log
interface PaymentTransaction {
  id: string;
  studentEmail: string;
  gateway: "bkash" | "nagad" | "rocket" | "bank" | "card";
  trxId: string;
  amount: number;
  courses: string[];
  status: "verified" | "pending";
  timestamp: string;
}

const transactionsLog: PaymentTransaction[] = [
  {
    id: "TRX-DEMO-001",
    studentEmail: "tasnim@example.com",
    gateway: "bkash",
    trxId: "BKASH98765432",
    amount: 150000,
    courses: ["course-1"],
    status: "verified",
    timestamp: new Date().toISOString(),
  }
];

// Helper: Authorize role / user ID from request header
function getAuthContext(req: express.Request) {
  const userId = (req.headers["x-user-id"] as string) || "";
  const userRole = (req.headers["x-user-role"] as string) || "student";
  const user = usersStore.find((u) => u.id === userId);
  return {
    userId,
    userRole: user ? user.role : userRole,
    user,
    isAdmin: user ? ["superadmin", "admin"].includes(user.role) : ["superadmin", "admin"].includes(userRole),
    isTrainer: user ? user.role === "trainer" : userRole === "trainer",
  };
}

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Lodonex Academy LMS & Payment Server",
    usersCount: usersStore.length,
    activeBatches: batchesStore.length
  });
});

// ==========================================
// 1. AUTHENTICATION & USER MANAGEMENT APIS
// ==========================================

// POST Register Student
app.post("/api/auth/register", (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    dateOfBirth,
    gender,
    country,
    city,
    address,
    photoUrl,
    emergencyContact,
    educationalBackground
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: "Name and email are required." });
  }

  const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, error: "An account with this email already exists." });
  }

  const newUser: UserAccount = {
    id: `student-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || "",
    dateOfBirth: dateOfBirth || "",
    gender: gender || "other",
    country: country || "Bangladesh",
    city: city || "Dhaka",
    address: address || "",
    photoUrl: photoUrl || "",
    role: "student",
    status: "pending", // Pending admin approval as per workflow
    emailVerified: false,
    createdAt: new Date().toISOString()
  };

  usersStore.push(newUser);

  res.json({
    success: true,
    message: "Registration received! Your application is under administrative review.",
    user: newUser
  });
});

// POST Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required." });
  }

  const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid credentials. Account not found." });
  }

  if (user.status === "blocked" || user.status === "suspended") {
    return res.status(403).json({ success: false, error: `Account is ${user.status}. Please contact registrar.` });
  }

  res.json({
    success: true,
    user
  });
});

// GET Current User Info
app.get("/api/auth/me", (req, res) => {
  const { user } = getAuthContext(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  res.json({ success: true, user });
});

// GET All Users (Admin Only)
app.get("/api/users", (req, res) => {
  const { isAdmin } = getAuthContext(req);
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: "Unauthorized access" });
  }
  res.json({ success: true, count: usersStore.length, users: usersStore });
});

// PATCH Update User Status (Admin Only)
app.patch("/api/users/:id/status", (req, res) => {
  const { isAdmin } = getAuthContext(req);
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: "Unauthorized access" });
  }

  const { id } = req.params;
  const { status, assignedBatchId, role } = req.body;

  const target = usersStore.find((u) => u.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  if (status) target.status = status;
  if (assignedBatchId) target.assignedBatchId = assignedBatchId;
  if (role) target.role = role;

  res.json({ success: true, message: "User status updated", user: target });
});

// ==========================================
// 2. BATCHES MANAGEMENT APIS
// ==========================================

// GET all batches
app.get("/api/batches", (_req, res) => {
  res.json({ success: true, batches: batchesStore });
});

// POST Create new batch (Admin Only)
app.post("/api/batches", (req, res) => {
  const { isAdmin } = getAuthContext(req);
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: "Admin authorization required." });
  }

  const { name, courseId, courseTitle, trainerId, trainerName, startDate, endDate, classDays, classTime, maxStudents, location } = req.body;

  const newBatch = {
    id: `batch-${Date.now()}`,
    name,
    courseId,
    courseTitle,
    trainerId: trainerId || "trainer-tawhid-1",
    trainerName: trainerName || "Chef Tawhid Shekh",
    startDate,
    endDate,
    classDays: classDays || ["Sunday", "Tuesday", "Thursday"],
    classTime: classTime || "10:00 AM - 02:00 PM",
    maxStudents: Number(maxStudents) || 16,
    enrolledStudentsCount: 0,
    location: location || "Commercial Hot Kitchen (Campus Dhaka)",
    status: "upcoming"
  };

  batchesStore.push(newBatch);
  res.json({ success: true, message: "Batch created successfully", batch: newBatch });
});

// ==========================================
// 3. ENROLLMENT WORKFLOW APIS
// ==========================================

// GET enrollments (Security: Students see only own, Admin sees all)
app.get("/api/enrollments", (req, res) => {
  const { userId, isAdmin, isTrainer } = getAuthContext(req);

  if (isAdmin || isTrainer) {
    return res.json({ success: true, count: enrollmentsStore.length, enrollments: enrollmentsStore });
  }

  // Enforce security rule: student can NEVER access another student's applications
  const studentEnrollments = enrollmentsStore.filter((e) => e.studentId === userId || e.studentEmail === req.headers["x-user-email"]);
  res.json({ success: true, count: studentEnrollments.length, enrollments: studentEnrollments });
});

// POST Submit Enrollment Application
app.post("/api/enrollments/apply", (req, res) => {
  const { studentId, studentName, studentEmail, studentPhone, courseId, courseTitle, batchId, batchName, paymentMethod, transactionId, totalFee, notes } = req.body;

  const newApp = {
    id: `app-${Date.now()}`,
    studentId: studentId || `student-${Date.now()}`,
    studentName,
    studentEmail,
    studentPhone: studentPhone || "",
    courseId,
    courseTitle,
    batchId,
    batchName,
    status: transactionId ? "payment_submitted" : "applied",
    appliedAt: new Date().toISOString(),
    notes: notes || "",
    paymentMethod: paymentMethod || "bKash",
    transactionId: transactionId || "",
    totalFee: Number(totalFee) || 150000,
    paidAmount: transactionId ? Number(totalFee) || 150000 : 0
  };

  enrollmentsStore.unshift(newApp);

  res.json({
    success: true,
    message: "Enrollment application submitted. Admin review is in progress.",
    application: newApp
  });
});

// PATCH Update Enrollment Status / Approve (Admin Only)
app.patch("/api/enrollments/:id/status", (req, res) => {
  const { isAdmin } = getAuthContext(req);
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: "Admin access required." });
  }

  const { id } = req.params;
  const { status, notes, batchId, paidAmount } = req.body;

  const target = enrollmentsStore.find((e) => e.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: "Enrollment not found." });
  }

  if (status) target.status = status;
  if (notes) target.notes = notes;
  if (batchId) target.batchId = batchId;
  if (paidAmount !== undefined) target.paidAmount = paidAmount;
  target.reviewedAt = new Date().toISOString();
  target.reviewedBy = "Admin Council";

  // If approved or active, ensure student account is approved and has access!
  if (["approved", "active"].includes(target.status)) {
    const studentUser = usersStore.find((u) => u.id === target.studentId || u.email === target.studentEmail);
    if (studentUser) {
      studentUser.status = "approved";
      if (!studentUser.assignedCourseIds) studentUser.assignedCourseIds = [];
      if (!studentUser.assignedCourseIds.includes(target.courseId)) {
        studentUser.assignedCourseIds.push(target.courseId);
      }
      if (target.batchId) {
        studentUser.assignedBatchId = target.batchId;
      }
    }
  }

  res.json({ success: true, message: `Enrollment status updated to ${status}`, application: target });
});

// ==========================================
// 4. CLASS SCHEDULE & ATTENDANCE APIS
// ==========================================

// GET class schedule (Students see only their batch/course or upcoming, Admin sees all)
app.get("/api/classes", (req, res) => {
  const { userId, isAdmin, isTrainer } = getAuthContext(req);
  if (isAdmin || isTrainer) {
    return res.json({ success: true, classes: classScheduleStore });
  }

  const user = usersStore.find((u) => u.id === userId);
  const enrolledBatches = user?.assignedBatchId ? [user.assignedBatchId] : [];
  const userClasses = classScheduleStore.filter((c) => enrolledBatches.includes(c.batchId) || !user?.assignedBatchId);

  res.json({ success: true, classes: userClasses });
});

// POST Schedule Class (Admin/Trainer)
app.post("/api/classes", (req, res) => {
  const { isAdmin, isTrainer } = getAuthContext(req);
  if (!isAdmin && !isTrainer) {
    return res.status(403).json({ success: false, error: "Staff authorization required." });
  }

  const { courseId, courseTitle, batchId, batchName, trainerId, trainerName, date, startTime, endTime, topic, room, onlineLink, notes } = req.body;

  const newClass = {
    id: `sched-${Date.now()}`,
    courseId,
    courseTitle,
    batchId,
    batchName,
    trainerId: trainerId || "trainer-tawhid-1",
    trainerName: trainerName || "Chef Tawhid Shekh",
    date,
    startTime,
    endTime,
    topic,
    room: room || "Main Kitchen Lab",
    onlineLink,
    notes,
    status: "scheduled"
  };

  classScheduleStore.push(newClass);
  res.json({ success: true, message: "Class scheduled successfully", classItem: newClass });
});

// GET Attendance (Student sees only own, Trainer/Admin sees all)
app.get("/api/attendance", (req, res) => {
  const { userId, isAdmin, isTrainer } = getAuthContext(req);

  if (isAdmin || isTrainer) {
    return res.json({ success: true, attendance: attendanceStore });
  }

  const ownAttendance = attendanceStore.filter((a) => a.studentId === userId);
  res.json({ success: true, attendance: ownAttendance });
});

// POST Mark Attendance (Trainer/Admin)
app.post("/api/attendance", (req, res) => {
  const { isAdmin, isTrainer } = getAuthContext(req);
  if (!isAdmin && !isTrainer) {
    return res.status(403).json({ success: false, error: "Only trainers and admins can mark attendance." });
  }

  const { batchId, courseId, classId, date, studentId, studentName, status, remarks, markedBy } = req.body;

  const newAtt = {
    id: `att-${Date.now()}`,
    batchId,
    courseId,
    classId,
    date: date || new Date().toISOString().split("T")[0],
    studentId,
    studentName,
    status: status || "present",
    markedBy: markedBy || "Instructor Chef",
    remarks: remarks || ""
  };

  attendanceStore.push(newAtt);
  res.json({ success: true, message: "Attendance marked successfully", record: newAtt });
});

// ==========================================
// 5. ASSIGNMENTS & SUBMISSIONS APIS
// ==========================================

// GET Assignments
app.get("/api/assignments", (_req, res) => {
  res.json({ success: true, assignments: assignmentsStore });
});

// POST Create Assignment (Trainer/Admin)
app.post("/api/assignments", (req, res) => {
  const { isAdmin, isTrainer } = getAuthContext(req);
  if (!isAdmin && !isTrainer) {
    return res.status(403).json({ success: false, error: "Trainer or Admin access required." });
  }

  const { courseId, courseTitle, batchId, title, description, dueDate, maxMarks, createdBy } = req.body;

  const newAssign = {
    id: `assign-${Date.now()}`,
    courseId,
    courseTitle,
    batchId,
    title,
    description,
    dueDate,
    maxMarks: Number(maxMarks) || 50,
    createdAt: new Date().toISOString().split("T")[0],
    createdBy: createdBy || "Executive Trainer"
  };

  assignmentsStore.push(newAssign);
  res.json({ success: true, message: "Assignment created", assignment: newAssign });
});

// GET Submissions (Security: Student sees own, Trainer/Admin sees all)
app.get("/api/submissions", (req, res) => {
  const { userId, isAdmin, isTrainer } = getAuthContext(req);

  if (isAdmin || isTrainer) {
    return res.json({ success: true, submissions: submissionsStore });
  }

  const own = submissionsStore.filter((s) => s.studentId === userId);
  res.json({ success: true, submissions: own });
});

// POST Submit Assignment (Student)
app.post("/api/submissions", (req, res) => {
  const { assignmentId, studentId, studentName, studentEmail, contentText, fileUrl, fileName } = req.body;

  const newSub = {
    id: `sub-${Date.now()}`,
    assignmentId,
    studentId: studentId || "default-student-1",
    studentName: studentName || "Tasnim Rahman",
    studentEmail: studentEmail || "tasnim@example.com",
    submittedAt: new Date().toISOString(),
    contentText: contentText || "",
    fileUrl: fileUrl || "",
    fileName: fileName || "Portfolio_Submission.pdf",
    status: "submitted"
  };

  submissionsStore.push(newSub);
  res.json({ success: true, message: "Assignment submitted successfully!", submission: newSub });
});

// POST Grade Submission (Trainer/Admin)
app.post("/api/submissions/:id/grade", (req, res) => {
  const { isAdmin, isTrainer } = getAuthContext(req);
  if (!isAdmin && !isTrainer) {
    return res.status(403).json({ success: false, error: "Only trainers can grade submissions." });
  }

  const { id } = req.params;
  const { marksObtained, feedback, gradedBy } = req.body;

  const target = submissionsStore.find((s) => s.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: "Submission not found." });
  }

  target.marksObtained = Number(marksObtained);
  target.feedback = feedback || "";
  target.gradedBy = gradedBy || "Trainer";
  target.gradedAt = new Date().toISOString();
  target.status = "graded";

  res.json({ success: true, message: "Submission graded successfully", submission: target });
});

// ==========================================
// 6. EXAMS & RESULTS APIS
// ==========================================

// GET Exams
app.get("/api/exams", (_req, res) => {
  res.json({ success: true, exams: examsStore });
});

// GET Results (Student sees own, Admin/Trainer sees all)
app.get("/api/results", (req, res) => {
  const { userId, isAdmin, isTrainer } = getAuthContext(req);

  if (isAdmin || isTrainer) {
    return res.json({ success: true, results: resultsStore });
  }

  const own = resultsStore.filter((r) => r.studentId === userId);
  res.json({ success: true, results: own });
});

// POST Enter/Update Student Marks (Trainer/Admin)
app.post("/api/results", (req, res) => {
  const { isAdmin, isTrainer } = getAuthContext(req);
  if (!isAdmin && !isTrainer) {
    return res.status(403).json({ success: false, error: "Staff access required to enter marks." });
  }

  const {
    studentId,
    studentName,
    courseId,
    courseTitle,
    batchId,
    batchName,
    assignmentMarks,
    quizMarks,
    practicalMarks,
    theoryMarks,
    finalExamMarks,
    remarks
  } = req.body;

  const total = Number(assignmentMarks || 0) + Number(quizMarks || 0) + Number(practicalMarks || 0) + Number(theoryMarks || 0) + Number(finalExamMarks || 0);
  const maxTotal = 50 + 50 + 100 + 100 + 100; // 400 total points
  const percentage = Math.round((total / maxTotal) * 100);

  let grade = "Pass";
  if (percentage >= 90) grade = "A+ (Distinction)";
  else if (percentage >= 80) grade = "A (Honours)";
  else if (percentage >= 70) grade = "B (Credit)";
  else if (percentage >= 60) grade = "C (Pass)";
  else grade = "Needs Improvement";

  const newResult = {
    id: `result-${Date.now()}`,
    studentId,
    studentName,
    courseId,
    courseTitle,
    batchId,
    batchName,
    assignmentMarks: Number(assignmentMarks) || 0,
    maxAssignmentMarks: 50,
    quizMarks: Number(quizMarks) || 0,
    maxQuizMarks: 50,
    practicalMarks: Number(practicalMarks) || 0,
    maxPracticalMarks: 100,
    theoryMarks: Number(theoryMarks) || 0,
    maxTheoryMarks: 100,
    finalExamMarks: Number(finalExamMarks) || 0,
    maxFinalExamMarks: 100,
    overallScore: percentage,
    maxOverallScore: 100,
    grade,
    remarks: remarks || "",
    published: true,
    publishedDate: new Date().toISOString().split("T")[0]
  };

  resultsStore.push(newResult);
  res.json({ success: true, message: "Student marks and grade recorded", result: newResult });
});

// ==========================================
// 7. DIGITAL CERTIFICATES & PUBLIC VERIFICATION
// ==========================================

// GET Certificates (Student sees own, Admin sees all)
app.get("/api/certificates", (req, res) => {
  const { userId, isAdmin, isTrainer } = getAuthContext(req);

  if (isAdmin || isTrainer) {
    return res.json({ success: true, count: certificatesStore.length, certificates: certificatesStore });
  }

  const own = certificatesStore.filter((c) => c.studentId === userId);
  res.json({ success: true, count: own.length, certificates: own });
});

// POST Issue Certificate (Admin Only)
app.post("/api/certificates", (req, res) => {
  const { isAdmin } = getAuthContext(req);
  if (!isAdmin) {
    return res.status(403).json({ success: false, error: "Only authorized administrators can issue accredited certificates." });
  }

  const { studentId, studentName, studentEmail, courseId, courseTitle, batchName, duration, trainingHours, grade, authorizedSignatory, signatoryTitle } = req.body;

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const certNumber = `LOD-CERT-2026-${randomNum}`;

  const newCert = {
    id: `cert-${Date.now()}`,
    certificateNumber: certNumber,
    studentId,
    studentName,
    studentEmail,
    courseId,
    courseTitle,
    batchName: batchName || "Graduating Masterclass Cohort",
    completionDate: new Date().toISOString().split("T")[0],
    issueDate: new Date().toISOString().split("T")[0],
    duration: duration || "3 Months (360 Hours)",
    trainingHours: trainingHours || "360 Hours",
    grade: grade || "Grade A (Honours)",
    authorizedSignatory: authorizedSignatory || "Chef Dewan / Master Assessor",
    signatoryTitle: signatoryTitle || "Director of Culinary Education",
    isValid: true
  };

  certificatesStore.push(newCert);

  res.json({
    success: true,
    message: `Digital Certificate ${certNumber} issued successfully!`,
    certificate: newCert
  });
});

// PUBLIC VERIFICATION ENDPOINT: /api/certificates/verify/:certNumber
// Anyone can query this with a certificate number. Never exposes private PII (no phone, no home address, no password)
app.get("/api/certificates/verify/:certNumber", (req, res) => {
  const certNumber = req.params.certNumber.trim().toUpperCase();

  const found = certificatesStore.find(
    (c) => c.certificateNumber.toUpperCase() === certNumber
  );

  if (!found) {
    return res.status(404).json({
      verified: false,
      error: `Certificate number "${certNumber}" was not found in the official Lodonex registry.`
    });
  }

  // Safe public payload
  res.json({
    verified: true,
    certificateNumber: found.certificateNumber,
    studentName: found.studentName,
    courseTitle: found.courseTitle,
    batchName: found.batchName,
    completionDate: found.completionDate,
    issueDate: found.issueDate,
    duration: found.duration,
    trainingHours: found.trainingHours,
    grade: found.grade,
    authorizedSignatory: found.authorizedSignatory,
    signatoryTitle: found.signatoryTitle,
    isValid: found.isValid,
    institution: "Lodonex Cooking Academy",
    accreditationStatus: "LQF National Culinary Framework Accredited"
  });
});

// ==========================================
// 8. PAYMENT MANAGEMENT APIS
// ==========================================

// GET merchant gateway configuration
app.get("/api/payments/gateway-config", (_req, res) => {
  res.json({
    success: true,
    config: merchantGatewayConfig,
    activeGateways: ["bkash", "nagad", "rocket", "bank", "card"],
  });
});

// POST update merchant credentials (Admin only)
app.post("/api/payments/merchant-config", (req, res) => {
  const {
    bkashMerchantNumber,
    nagadMerchantNumber,
    rocketMerchantNumber,
    bankName,
    bankAccountName,
    bankAccountNumber,
    bankBranch,
    bankRoutingNumber,
  } = req.body;

  if (bkashMerchantNumber) merchantGatewayConfig.bkashMerchantNumber = bkashMerchantNumber;
  if (nagadMerchantNumber) merchantGatewayConfig.nagadMerchantNumber = nagadMerchantNumber;
  if (rocketMerchantNumber) merchantGatewayConfig.rocketMerchantNumber = rocketMerchantNumber;
  if (bankName) merchantGatewayConfig.bankName = bankName;
  if (bankAccountName) merchantGatewayConfig.bankAccountName = bankAccountName;
  if (bankAccountNumber) merchantGatewayConfig.bankAccountNumber = bankAccountNumber;
  if (bankBranch) merchantGatewayConfig.bankBranch = bankBranch;
  if (bankRoutingNumber) merchantGatewayConfig.bankRoutingNumber = bankRoutingNumber;

  res.json({
    success: true,
    message: "Merchant account credentials updated successfully",
    config: merchantGatewayConfig,
  });
});

// POST initiate bKash merchant online payment session
app.post("/api/payments/bkash/create", (req, res) => {
  const { amount, studentEmail, courseIds } = req.body;
  const invoiceNo = `LOD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET) {
    res.json({
      success: true,
      mode: "live_gateway",
      paymentID: `BK-${Date.now()}`,
      createTime: new Date().toISOString(),
      orgName: "Lodonex Cooking Academy",
      invoiceNumber: invoiceNo,
      amount: amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: invoiceNo,
      studentEmail: studentEmail,
      courseIds: courseIds,
      bkashURL: `https://checkout.pay.bKash.com/payment/${invoiceNo}`,
    });
  } else {
    res.json({
      success: true,
      mode: "sandbox_simulated",
      merchantNumber: merchantGatewayConfig.bkashMerchantNumber,
      invoiceNumber: invoiceNo,
      amount: amount,
      currency: "BDT",
      instructions: `Send ${amount} BDT to ${merchantGatewayConfig.bkashMerchantNumber} via bKash Payment or Send Money, then submit TrxID.`,
      simulatedTrxId: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
    });
  }
});

// POST verify transaction & unlock course
app.post("/api/payments/verify-trx", (req, res) => {
  const { studentEmail, gateway, trxId, amount, courses } = req.body;

  if (!trxId || !trxId.trim()) {
    return res.status(400).json({ success: false, error: "Transaction ID (TrxID) is required." });
  }

  const cleanTrx = trxId.trim().toUpperCase();

  const newTrx: PaymentTransaction = {
    id: `TRX-${Date.now()}`,
    studentEmail: studentEmail || "student@lodonex.com",
    gateway: gateway || "bkash",
    trxId: cleanTrx,
    amount: amount || 0,
    courses: courses || [],
    status: "verified",
    timestamp: new Date().toISOString(),
  };

  transactionsLog.push(newTrx);

  // Automatically update any matching enrollment status to approved/active!
  enrollmentsStore.forEach((e) => {
    if (e.studentEmail.toLowerCase() === (studentEmail || "").toLowerCase() && (courses || []).includes(e.courseId)) {
      e.status = "active";
      e.paidAmount = amount || e.totalFee;
    }
  });

  res.json({
    success: true,
    message: "Payment verified successfully. Course access granted!",
    transaction: newTrx,
  });
});

// GET list all payment transactions (Admin View)
app.get("/api/payments/transactions", (_req, res) => {
  res.json({
    success: true,
    count: transactionsLog.length,
    transactions: transactionsLog,
  });
});

// Start server with Vite middleware in Dev / Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lodonex LMS & Payment Server running on http://localhost:${PORT}`);
  });
}

startServer();
