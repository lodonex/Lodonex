import {
  Batch,
  ClassScheduleItem,
  EnrollmentApplication,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Exam,
  StudentExamSubmission,
  StudentGradeResult,
  DigitalCertificate,
  PaymentRecord,
  LMSNotification,
  UserAccount
} from "../types";

export const MOCK_BATCHES: Batch[] = [
  {
    id: "batch-101",
    name: "LQF-1 Morning Culinary Foundation #08",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    trainerId: "trainer-1",
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
    trainerId: "trainer-1",
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
    trainerId: "trainer-2",
    trainerName: "Chef Tanvir Ahmed",
    startDate: "2026-08-01",
    endDate: "2026-11-01",
    classDays: ["Sunday", "Wednesday"],
    classTime: "10:00 AM - 02:00 PM",
    maxStudents: 15,
    enrolledStudentsCount: 11,
    location: "Campus Lab C – Butchery & Sauté Pavilion",
    status: "active"
  },
  {
    id: "batch-104",
    name: "LQF-3 Executive Pastry & Viennoiserie #06",
    courseId: "course-3",
    courseTitle: "Level 3 – Lodonex Advanced Culinary Professional",
    trainerId: "trainer-3",
    trainerName: "Chef Robert Gomes",
    startDate: "2026-09-01",
    endDate: "2026-12-01",
    classDays: ["Friday", "Saturday"],
    classTime: "02:00 PM - 06:30 PM",
    maxStudents: 12,
    enrolledStudentsCount: 7,
    location: "Campus Lab D – Temperature-Controlled Marble Pastry Lab",
    status: "upcoming"
  }
];

export const MOCK_CLASS_SCHEDULE: ClassScheduleItem[] = [
  {
    id: "sched-1",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    trainerId: "trainer-1",
    trainerName: "Chef Tawhid Shekh",
    date: "2026-07-14",
    startTime: "09:30",
    endTime: "13:30",
    topic: "Precision Knife Cuts & Fundamental White/Brown Stocks",
    room: "Station 4 - Commercial Hot Kitchen",
    onlineLink: "https://meet.lodonex.com/lab-1-chef-tawhid",
    notes: "Bring sanitized Wüsthof knife kit, HACCP apron, and steel mesh cut-resistant glove.",
    status: "completed"
  },
  {
    id: "sched-2",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    trainerId: "trainer-1",
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
    trainerId: "trainer-1",
    trainerName: "Chef Tawhid Shekh",
    date: "2026-07-19",
    startTime: "09:30",
    endTime: "13:30",
    topic: "Poultry Fabrication, Trussing & Internal Critical Temperatures (HACCP 165°F)",
    room: "Butchery & Fabrication Bay",
    onlineLink: "https://meet.lodonex.com/lab-1-chef-tawhid",
    notes: "Students will perform practical breakdown of two whole broiler chickens into 8 standard culinary cuts.",
    status: "scheduled"
  },
  {
    id: "sched-4",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    batchName: "LQF-1 Morning Culinary Foundation #08",
    trainerId: "trainer-1",
    trainerName: "Chef Tawhid Shekh",
    date: "2026-07-21",
    startTime: "09:30",
    endTime: "13:30",
    topic: "Emulsion Science: Mayonnaise, Vinaigrette & Classical Salad Composition",
    room: "Garde Manger & Cold Kitchen",
    onlineLink: "https://meet.lodonex.com/lab-1-chef-tawhid",
    notes: "Hands-on continuous whisking test and acid-to-fat balance evaluation.",
    status: "scheduled"
  },
  {
    id: "sched-5",
    courseId: "course-2",
    courseTitle: "Level 2 – Lodonex Certified Culinary Professional",
    batchId: "batch-103",
    batchName: "LQF-2 Continental & Haute Cuisine #04",
    trainerId: "trainer-2",
    trainerName: "Chef Tanvir Ahmed",
    date: "2026-07-20",
    startTime: "10:00",
    endTime: "14:00",
    topic: "Sous-Vide Precision Immersion & Reverse Searing of Prime Beef Tenderloin",
    room: "Molecular & Precision Culinary Lab",
    notes: "Digital thermal probes required.",
    status: "scheduled"
  }
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
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
  },
  {
    id: "att-3",
    batchId: "batch-101",
    courseId: "course-1",
    date: "2026-07-09",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    status: "present",
    markedBy: "Chef Tawhid Shekh"
  },
  {
    id: "att-4",
    batchId: "batch-101",
    courseId: "course-1",
    date: "2026-07-07",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    status: "late",
    markedBy: "Chef Tawhid Shekh",
    remarks: "10 mins late due to Dhaka transit."
  },
  {
    id: "att-5",
    batchId: "batch-101",
    courseId: "course-1",
    date: "2026-07-02",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    status: "present",
    markedBy: "Chef Tawhid Shekh"
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-1",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    title: "Assignment 1: Classical Knife Cuts Specimen Board & Yield Calculation",
    description: "Prepare and photograph precision cuts: Julienne (1/8\" x 1/8\" x 2\"), Brunoise (1/8\" cube), Batonnet (1/4\" x 1/4\" x 2\"), and Paysanne. Calculate the edible portion yield percentage from 500g of whole carrots.",
    dueDate: "2026-07-22",
    maxMarks: 50,
    attachments: [
      { name: "LQF1_Knife_Cuts_Rubric.pdf", url: "#" },
      { name: "Kitchen_Mathematics_Yield_Formula.pdf", url: "#" }
    ],
    createdAt: "2026-07-10",
    createdBy: "Chef Tawhid Shekh"
  },
  {
    id: "assign-2",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    title: "Assignment 2: HACCP Critical Control Point (CCP) Plan for Poultry Station",
    description: "Draft a formal HACCP temperature log and sanitization schedule for commercial poultry fabrication. Include receiving temp, storage temp (<=40°F), and final internal cooking temp (>=165°F).",
    dueDate: "2026-07-28",
    maxMarks: 50,
    attachments: [
      { name: "HACCP_Poultry_Log_Template.pdf", url: "#" }
    ],
    createdAt: "2026-07-12",
    createdBy: "Chef Tawhid Shekh"
  }
];

export const MOCK_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    studentEmail: "tasnim@example.com",
    submittedAt: "2026-07-20T14:30:00Z",
    contentText: "Submitted high-resolution photo portfolio of precision cuts using carrots and celery, along with calculated 68.4% edible yield ratio. All measurements verified with culinary ruler.",
    fileUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    fileName: "Tasnim_Rahman_LQF1_Knife_Portfolio.pdf",
    status: "graded",
    marksObtained: 48,
    feedback: "Exceptional uniformity in the Brunoise cuts. Clean dice and sharp edges indicating excellent knife maintenance. Commendable work!",
    gradedBy: "Chef Tawhid Shekh",
    gradedAt: "2026-07-21T10:15:00Z"
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: "exam-1",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    title: "Mid-Term Theoretical & Sanitation Examination (LQF Level 1)",
    description: "Evaluates kitchen safety, HACCP regulations, cross-contamination prevention, food temperatures, and classical mother sauce classifications.",
    durationMinutes: 45,
    passingScore: 75,
    scheduledDate: "2026-07-25",
    startTime: "10:00 AM",
    endTime: "10:45 AM",
    totalPoints: 100,
    isPublished: true,
    status: "active",
    questions: [
      {
        id: "q-1",
        question: "What is the official minimum internal cooking temperature for poultry, duck, and stuffing to ensure pathogen destruction according to ServSafe & HACCP?",
        type: "mcq",
        options: ["135°F (57°C)", "145°F (63°C)", "155°F (68°C)", "165°F (74°C)"],
        correctAnswerIndex: 3,
        points: 20
      },
      {
        id: "q-2",
        question: "A classic French mirepoix consists of which vegetable ratio by weight?",
        type: "mcq",
        options: [
          "50% Carrots, 25% Onions, 25% Celery",
          "50% Onions, 25% Carrots, 25% Celery",
          "33% Onions, 33% Carrots, 33% Leeks",
          "50% Celery, 25% Onions, 25% Garlic"
        ],
        correctAnswerIndex: 1,
        points: 20
      },
      {
        id: "q-3",
        question: "True or False: Hollandaise sauce is a warm emulsion of clarified butter and egg yolks that can safely be kept in the food temperature danger zone indefinitely.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswerIndex: 1,
        points: 20
      },
      {
        id: "q-4",
        question: "What are the exact dimensional measurements of a standard French Batonnet cut?",
        type: "mcq",
        options: [
          "1/8 inch x 1/8 inch x 2 inches",
          "1/4 inch x 1/4 inch x 2 inches",
          "1/2 inch x 1/2 inch x 2 inches",
          "1/16 inch x 1/16 inch x 1 inch"
        ],
        correctAnswerIndex: 1,
        points: 20
      },
      {
        id: "q-5",
        question: "Explain the biochemical role of roux (equal parts fat and flour) in thickening culinary liquids.",
        type: "written",
        correctAnswerText: "Gelatinization of starches when starch granules absorb warm liquid and swell, thickening the liquid matrix.",
        points: 20
      }
    ]
  },
  {
    id: "exam-2",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-101",
    title: "Final Comprehensive LQF-1 Guild Board Assessment",
    description: "Comprehensive testing covering knife skills theory, kitchen mathematics, temperature danger zone (40°F - 140°F), and egg cookery science.",
    durationMinutes: 60,
    passingScore: 75,
    scheduledDate: "2026-08-25",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    totalPoints: 100,
    isPublished: true,
    status: "upcoming",
    questions: [
      {
        id: "q-201",
        question: "What temperature range defines the Food Safety Danger Zone?",
        type: "mcq",
        options: ["0°F - 32°F", "40°F - 140°F (4°C - 60°C)", "100°F - 212°F", "32°F - 70°F"],
        correctAnswerIndex: 1,
        points: 25
      }
    ]
  }
];

export const MOCK_STUDENT_EXAM_SUBMISSIONS: StudentExamSubmission[] = [
  {
    id: "exam-sub-1",
    examId: "exam-1",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    answers: {
      "q-1": 3,
      "q-2": 1,
      "q-3": 1,
      "q-4": 1,
      "q-5": "Starch granules swell and burst upon heat application, absorbing liquids to form a stable viscous matrix."
    },
    scoreObtained: 96,
    totalScore: 100,
    passed: true,
    submittedAt: "2026-07-25T10:38:00Z",
    status: "published",
    feedback: "Outstanding command of food safety fundamentals and culinary chemistry."
  }
];

export const MOCK_STUDENT_GRADE_RESULTS: StudentGradeResult[] = [
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

export const MOCK_DIGITAL_CERTIFICATES: DigitalCertificate[] = [
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
  },
  {
    id: "cert-003",
    certificateNumber: "LOD-CERT-2026-0105",
    studentId: "student-tanvir-105",
    studentName: "Tanvir Hasan",
    studentEmail: "tanvir.hasan@example.com",
    courseId: "course-2",
    courseTitle: "Level 2 – Lodonex Certified Culinary Professional",
    batchName: "LQF-2 Continental Cuisine Cohort #03",
    completionDate: "2026-05-10",
    issueDate: "2026-05-15",
    duration: "6 Months (720 Hours)",
    trainingHours: "720 Hours",
    grade: "Grade A+ (Distinction)",
    authorizedSignatory: "Chef Dewan / Master Assessor",
    signatoryTitle: "Director of Culinary Education",
    isValid: true
  }
];

export const MOCK_PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: "pay-1001",
    studentId: "default-student-1",
    studentName: "Tasnim Rahman",
    studentEmail: "tasnim@example.com",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    amount: 150000,
    totalFee: 150000,
    dueAmount: 0,
    gateway: "bkash",
    trxId: "BKASH98765432",
    status: "verified",
    timestamp: "2026-06-01T09:15:00Z",
    verifiedBy: "Farhana Yasmin (Registrar)",
    verifiedAt: "2026-06-01T09:30:00Z",
    invoiceNumber: "LOD-INV-2026-00812"
  },
  {
    id: "pay-1002",
    studentId: "student-sarah-42",
    studentName: "Sarah Khan",
    studentEmail: "sarah.khan@example.com",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    amount: 75000,
    totalFee: 150000,
    dueAmount: 75000,
    gateway: "bank",
    trxId: "EBL-DEP-490219",
    status: "partially_paid",
    timestamp: "2026-06-15T11:20:00Z",
    verifiedBy: "Farhana Yasmin (Registrar)",
    verifiedAt: "2026-06-15T12:00:00Z",
    invoiceNumber: "LOD-INV-2026-00845"
  },
  {
    id: "pay-1003",
    studentId: "student-applicant-99",
    studentName: "Mohammad Shafi",
    studentEmail: "shafi.chef@example.com",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    amount: 150000,
    totalFee: 150000,
    dueAmount: 0,
    gateway: "nagad",
    trxId: "NAGAD77123490",
    status: "submitted",
    timestamp: "2026-07-28T08:45:00Z",
    invoiceNumber: "LOD-INV-2026-00911"
  }
];

export const MOCK_ENROLLMENT_APPLICATIONS: EnrollmentApplication[] = [
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
    id: "app-2026-02",
    studentId: "student-sarah-42",
    studentName: "Sarah Khan",
    studentEmail: "sarah.khan@example.com",
    studentPhone: "+880 1819-876543",
    courseId: "course-1",
    courseTitle: "Level 1 – Lodonex Certified Culinary Foundation",
    batchId: "batch-102",
    batchName: "LQF-1 Evening Professional Batch #09",
    status: "active",
    appliedAt: "2026-06-10T08:30:00Z",
    reviewedAt: "2026-06-11T09:15:00Z",
    reviewedBy: "Admin Registrar",
    notes: "Installment plan 1/2 approved. Course access active.",
    paymentMethod: "Eastern Bank PLC",
    transactionId: "EBL-DEP-490219",
    totalFee: 150000,
    paidAmount: 75000
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

export const MOCK_NOTIFICATIONS: LMSNotification[] = [
  {
    id: "notif-1",
    userId: "default-student-1",
    title: "Official Grade Published",
    message: "Your LQF-1 Mid-Term Examination score (96%) and marks have been published to your student gradebook.",
    type: "exam",
    read: false,
    createdAt: "2026-07-26T12:00:00Z",
    actionTab: "results"
  },
  {
    id: "notif-2",
    userId: "default-student-1",
    title: "Upcoming Practical Class",
    message: "Reminder: Poultry Fabrication & HACCP Standards lab is scheduled for Sunday at 09:30 AM in Commercial Hot Kitchen.",
    type: "class",
    read: false,
    createdAt: "2026-07-18T10:00:00Z",
    actionTab: "classes"
  },
  {
    id: "notif-3",
    userId: "default-student-1",
    title: "Official Digital Certificate Issued",
    message: "Congratulations! Your digital certificate LOD-CERT-2026-0891 has been issued with Distinction honors.",
    type: "certificate",
    read: true,
    createdAt: "2026-09-01T08:00:00Z",
    actionTab: "certificates"
  },
  {
    id: "notif-admin-1",
    userId: "admin",
    title: "New Enrollment Payment Submitted",
    message: "Applicant Mohammad Shafi submitted ৳1,50,000 via Nagad TrxID: NAGAD77123490 for Level 1 Culinary Foundation.",
    type: "payment",
    read: false,
    createdAt: "2026-07-28T08:46:00Z",
    actionTab: "enrollments"
  }
];

export const INITIAL_LMS_USERS: UserAccount[] = [
  {
    id: "admin-staff-1",
    name: "Farhana Yasmin (Registrar)",
    email: "admin@lodonex.com",
    password: "AdminStaff@2026",
    role: "admin",
    status: "active",
    phone: "+880 1711-222333",
    city: "Dhaka",
    country: "Bangladesh",
    emailVerified: true,
    createdAt: "2026-01-05T00:00:00Z",
    progress: {
      enrolledCourses: [],
      completedLessons: [],
      quizScores: {},
      customRecipes: [],
      badges: []
    }
  },
  {
    id: "trainer-tawhid-1",
    name: "Chef Tawhid Shekh (Executive Trainer)",
    email: "chef.tawhid@lodonex.com",
    password: "TrainerChef@2026",
    role: "trainer",
    status: "active",
    phone: "+880 1722-444555",
    city: "Dhaka",
    country: "Bangladesh",
    assignedBatchId: "batch-101",
    assignedCourseIds: ["course-1"],
    emailVerified: true,
    createdAt: "2026-01-10T00:00:00Z",
    progress: {
      enrolledCourses: ["course-1"],
      completedLessons: ["c1-l1", "c1-l2"],
      quizScores: {},
      customRecipes: [],
      badges: []
    }
  },
  {
    id: "default-student-1",
    name: "Tasnim Rahman",
    email: "tasnim@example.com",
    password: "StudentPass@2026",
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
    twoFactorEnabled: false,
    emergencyContact: {
      name: "Mahmud Rahman",
      relationship: "Father",
      phone: "+880 1819-001122"
    },
    educationalBackground: "Bachelor in Hospitality Management, University of Dhaka",
    createdAt: "2026-05-25T10:00:00Z",
    progress: {
      enrolledCourses: ["course-1"],
      completedLessons: ["c1-l1", "c1-l2", "c1-l3"],
      quizScores: { "c1-l1": 100, "c1-l2": 100 },
      customRecipes: [],
      badges: []
    }
  },
  {
    id: "pending-student-2",
    name: "Rafiqul Islam",
    email: "student.pending@lodonex.com",
    password: "StudentPass@2026",
    phone: "+880 1911-556677",
    dateOfBirth: "2001-08-20",
    gender: "male",
    country: "Bangladesh",
    city: "Chittagong",
    address: "GEC Circle, Nasirabad, Chittagong",
    role: "student",
    status: "pending",
    emailVerified: false,
    educationalBackground: "HSC Graduate, Chittagong College",
    createdAt: "2026-07-28T09:00:00Z",
    progress: {
      enrolledCourses: [],
      completedLessons: [],
      quizScores: {},
      customRecipes: [],
      badges: []
    }
  }
];
