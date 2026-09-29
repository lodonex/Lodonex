export type Language = "en" | "bn";

export type UserRole = "superadmin" | "admin" | "trainer" | "student";
export type UserStatus = "pending" | "active" | "approved" | "suspended" | "blocked";

export interface Quiz {
  questionEn: string;
  questionBn: string;
  optionsEn: string[];
  optionsBn: string[];
  answerIndex: number;
}

export interface LessonResource {
  id: string;
  nameEn: string;
  nameBn: string;
  type: "pdf" | "recipe_doc" | "video" | "external";
  url: string;
  fileSize?: string;
}

export interface Lesson {
  id: string;
  titleEn: string;
  titleBn: string;
  duration: string;
  videoUrl: string; // Embed or simulation URL
  descriptionEn: string;
  descriptionBn: string;
  recipeNotes?: string;
  resources?: LessonResource[];
  quiz?: Quiz;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  titleEn: string;
  titleBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  lessons: Lesson[];
}

export interface CourseUpcomingBatch {
  id: string;
  name: string;
  startDate: string;
  scheduleDays: string;
  scheduleTime: string;
  seatsAvailable: number;
  maxSeats: number;
  trainerName: string;
}

export interface Course {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number; // in BDT (৳) or equivalent
  image: string;
  rating: number;
  tutor: string;
  duration: string;
  trainingHours?: string;
  levelEn: string;
  levelBn: string;
  lqfLevel: number;
  category: "baking" | "traditional" | "continental" | "chinese";
  modules?: CourseModule[];
  lessons: Lesson[];
  curriculumEn?: string[];
  curriculumBn?: string[];
  outcomesEn?: string[];
  outcomesBn?: string[];
  requirementsEn?: string[];
  requirementsBn?: string[];
  upcomingBatches?: CourseUpcomingBatch[];
}

export interface Recipe {
  id: string;
  titleEn: string;
  titleBn: string;
  categoryEn: string;
  categoryBn: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredientsEn: string[];
  ingredientsBn: string[];
  stepsEn: string[];
  stepsBn: string[];
  image: string;
  isCustom?: boolean;
}

export interface LiveClass {
  id: string;
  titleEn: string;
  titleBn: string;
  tutor: string;
  date: string; // e.g. "2026-07-10"
  time: string; // e.g. "15:00"
  dateTime: string; // ISO string or specific format for countdown
  status: "live" | "upcoming";
  image: string;
}

export interface StudentProgress {
  enrolledCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs
  quizScores: Record<string, number>; // Lesson ID -> Score
  customRecipes: Recipe[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  iconName: string;
  unlockedAt?: string;
}

export interface BlogPost {
  id: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  authorEn: string;
  authorBn: string;
  date: string;
  readTimeEn: string;
  readTimeBn: string;
  image: string;
  categoryEn: string;
  categoryBn: string;
  courseId?: string;
}

export interface UserAccount {
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
  password?: string;
  role?: UserRole;
  status: UserStatus;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  educationalBackground?: string;
  assignedBatchId?: string;
  assignedCourseIds?: string[];
  createdAt?: string;
  progress: StudentProgress;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: string; // ISO string
}

export interface LQFLevelDetails {
  level: number;
  titleEn: string;
  titleBn: string;
  careerPathEn: string;
  careerPathBn: string;
  eligibilityEn?: string;
  eligibilityBn?: string;
  experienceRequiredEn?: string;
  experienceRequiredBn?: string;
  suitableForEn?: string;
  suitableForBn?: string;
  specializationsEn?: string[];
  specializationsBn?: string[];
  workshopEn?: string;
  workshopBn?: string;
  recognitionEn?: string;
  recognitionBn?: string;
  assessmentEn?: string;
  assessmentBn?: string;
  passMarkEn?: string;
  passMarkBn?: string;
}

/* =========================================================
   LMS & STUDENT MANAGEMENT PORTAL NEW DATA CONTRACTS
   ========================================================= */

export type EnrollmentStatus =
  | "applied"
  | "pending_payment"
  | "payment_submitted"
  | "under_review"
  | "approved"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected";

export interface EnrollmentApplication {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  batchId?: string;
  batchName?: string;
  status: EnrollmentStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  paymentMethod?: string;
  transactionId?: string;
  totalFee: number;
  paidAmount: number;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseTitle: string;
  trainerId: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  classDays: string[]; // e.g. ["Sun", "Tue", "Thu"]
  classTime: string; // e.g. "10:00 AM - 01:00 PM"
  maxStudents: number;
  enrolledStudentsCount: number;
  location: string; // e.g. "Lab 1 - Commercial Hot Kitchen, Dhaka"
  status: "upcoming" | "active" | "completed" | "cancelled";
}

export interface ClassScheduleItem {
  id: string;
  courseId: string;
  courseTitle: string;
  batchId: string;
  batchName: string;
  trainerId: string;
  trainerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00"
  endTime: string; // e.g. "13:00"
  topic: string;
  room: string;
  onlineLink?: string;
  notes?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  courseId: string;
  classId?: string;
  date: string;
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy: string;
  remarks?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  batchId?: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  attachments?: { name: string; url: string }[];
  createdAt: string;
  createdBy: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  contentText: string;
  fileUrl?: string;
  fileName?: string;
  status: "submitted" | "graded" | "late";
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: "mcq" | "true_false" | "short_answer" | "written";
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  points: number;
}

export interface Exam {
  id: string;
  courseId: string;
  courseTitle: string;
  batchId?: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  questions: ExamQuestion[];
  totalPoints: number;
  isPublished: boolean;
  status: "upcoming" | "active" | "completed";
}

export interface StudentExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, any>;
  scoreObtained: number;
  totalScore: number;
  passed: boolean;
  submittedAt: string;
  status: "submitted" | "published" | "pending_review";
  feedback?: string;
}

export interface StudentGradeResult {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  batchId: string;
  batchName: string;
  assignmentMarks: number;
  maxAssignmentMarks: number;
  quizMarks: number;
  maxQuizMarks: number;
  practicalMarks: number;
  maxPracticalMarks: number;
  theoryMarks: number;
  maxTheoryMarks: number;
  finalExamMarks: number;
  maxFinalExamMarks: number;
  overallScore: number;
  maxOverallScore: number;
  grade: string; // e.g. "A+", "A", "Distinction"
  remarks?: string;
  published: boolean;
  publishedDate?: string;
}

export interface DigitalCertificate {
  id: string;
  certificateNumber: string; // e.g. "LOD-CERT-2026-0891"
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  batchName?: string;
  completionDate: string;
  issueDate: string;
  duration: string;
  trainingHours: string;
  grade: string;
  authorizedSignatory: string;
  signatoryTitle: string;
  isValid: boolean;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  totalFee: number;
  dueAmount: number;
  gateway: "bkash" | "nagad" | "rocket" | "bank" | "cash" | "card";
  trxId: string;
  status: "pending" | "submitted" | "verified" | "partially_paid" | "paid" | "refunded" | "failed";
  timestamp: string;
  verifiedBy?: string;
  verifiedAt?: string;
  invoiceNumber: string;
}

export interface LMSNotification {
  id: string;
  userId: string; // studentId or "admin" or "all"
  title: string;
  message: string;
  type: "enrollment" | "class" | "assignment" | "exam" | "payment" | "certificate" | "system";
  read: boolean;
  createdAt: string;
  actionTab?: string;
}


