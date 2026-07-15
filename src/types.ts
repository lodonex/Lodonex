export type Language = "en" | "bn";

export interface Quiz {
  questionEn: string;
  questionBn: string;
  optionsEn: string[];
  optionsBn: string[];
  answerIndex: number;
}

export interface Lesson {
  id: string;
  titleEn: string;
  titleBn: string;
  duration: string;
  videoUrl: string; // Embed or simulation URL
  descriptionEn: string;
  descriptionBn: string;
  quiz?: Quiz;
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
  levelEn: string;
  levelBn: string;
  lqfLevel: number;
  category: "baking" | "traditional" | "continental" | "chinese";
  lessons: Lesson[];
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
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved";
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


