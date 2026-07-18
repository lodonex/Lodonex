import { Course, Recipe, LiveClass, Badge, BlogPost, LQFLevelDetails } from "../types";

export const LQF_LEVELS: LQFLevelDetails[] = [
  {
    level: 1,
    titleEn: "Lodonex Certified Culinary Foundation",
    titleBn: "লোডোনেক্স সার্টিফাইড কালিনারি ফাউন্ডেশন",
    careerPathEn: "Commis III",
    careerPathBn: "কমিস ৩",
    suitableForEn: "Beginners, No Experience Required",
    suitableForBn: "শিক্ষানবিস, কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই",
    eligibilityEn: "Minimum Age 18 years, no experience required",
    eligibilityBn: "ন্যূনতম বয়স ১৮ বছর, কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই",
    assessmentEn: "• Written Examination:\n  Food Safety, HACCP, Kitchen Hygiene, Knife Theory, Culinary Terminology\n• Practical Examination:\n  Knife Skills, Vegetable Cuts, Basic Stocks, Egg Cookery, Rice, Basic Sauce\n• Professional Behaviour:\n  Uniform, Time Management, Personal Hygiene",
    assessmentBn: "• লিখিত পরীক্ষা:\n  ফুড সেফটি, এইচএসিসিপি (HACCP), কিচেন হাইজিন, নাইফ থিওরি, কালিনারি টার্মিনোলজি\n• ব্যবহারিক পরীক্ষা:\n  নাইফ স্কিলস, ভেজিটেবল কাট, বেসিক স্টক, এগ কুকারি, রাইস, বেসিক সস\n• পেশাদার আচরণ:\n  ইউনিফর্ম, টাইম ম্যানেজমেন্ট, পার্সোনাল হাইজিন",
    passMarkEn: "75%",
    passMarkBn: "৭৫%"
  },
  {
    level: 2,
    titleEn: "Lodonex Certified Culinary Professional",
    titleBn: "লোডোনেক্স সার্টিফাইড কালিনারি প্রফেশনাল",
    careerPathEn: "Commis II",
    careerPathBn: "কমিস ২",
    eligibilityEn: "LQF Level 1",
    eligibilityBn: "এলকিউএফ লেভেল ১",
    experienceRequiredEn: "Not Required",
    experienceRequiredBn: "প্রয়োজন নেই"
  },
  {
    level: 3,
    titleEn: "Lodonex Advanced Culinary Professional",
    titleBn: "লোডোনেক্স অ্যাডভান্সড কালিনারি প্রফেশনাল",
    careerPathEn: "Commis I",
    careerPathBn: "কমিস ১",
    eligibilityEn: "LQF Level 2",
    eligibilityBn: "এলকিউএফ লেভেল ২",
    experienceRequiredEn: "Minimum 1 Year Job or Internship",
    experienceRequiredBn: "ন্যূনতম ১ বছরের চাকরি বা ইন্টার্নশিপ"
  },
  {
    level: 4,
    titleEn: "Lodonex Professional Diploma in Culinary Arts",
    titleBn: "লোডোনেক্স প্রফেশনাল ডিপ্লোমা ইন কালিনারি আর্টস",
    careerPathEn: "Senior Commis / Kitchen In-Charge",
    careerPathBn: "সিনিয়র কমিস / কিচেন ইন-চার্জ",
    eligibilityEn: "LQF Level 3",
    eligibilityBn: "এলকিউএফ লেভেল ৩",
    experienceRequiredEn: "Minimum Total 2 Years Job or Internship Experience",
    experienceRequiredBn: "সর্বমোট ন্যূনতম ২ বছরের চাকরি বা ইন্টার্নশিপের অভিজ্ঞতা",
    workshopEn: "7-Day Professional Workshop",
    workshopBn: "৭-দিনের প্রফেশনাল ওয়ার্কশপ"
  },
  {
    level: 5,
    titleEn: "Professional Diploma in Specialised Cuisine",
    titleBn: "প্রফেশনাল ডিপ্লোমা ইন স্পেশালাইজড কুইজিন",
    careerPathEn: "Demi Chef de Partie",
    careerPathBn: "ডেমি শেফ ডি পার্টি",
    eligibilityEn: "LQF Level 4",
    eligibilityBn: "এলকিউএফ লেভেল ৪",
    experienceRequiredEn: "Minimum 1 Year Experience in Selected Cuisine",
    experienceRequiredBn: "নির্বাচিত কুইজিনে ন্যূনতম ১ বছরের অভিজ্ঞতা",
    workshopEn: "7-Day Professional Workshop",
    workshopBn: "৭-দিনের প্রফেশনাল ওয়ার্কশপ",
    specializationsEn: ["Japanese Cuisine", "Continental Cuisine", "Indian Cuisine", "Thai Cuisine", "Chinese Cuisine", "Bakery & Pastry"],
    specializationsBn: ["জাপানি কুইজিন", "কন্টিনেন্টাল কুইজিন", "ইন্ডিয়ান কুইজিন", "থাই কুইজিন", "চাইনিজ কুইজিন", "বেকারি ও পেস্ট্রি"]
  },
  {
    level: 6,
    titleEn: "Advanced Professional Diploma in Specialized Cuisine",
    titleBn: "অ্যাডভান্সড প্রফেশনাল ডিপ্লোমা ইন স্পেশালাইজড কুইজিন",
    careerPathEn: "Sous Chef",
    careerPathBn: "সু শেফ",
    eligibilityEn: "LQF Level 5",
    eligibilityBn: "এলকিউএফ লেভেল ৫",
    experienceRequiredEn: "Minimum 1 Year Experience",
    experienceRequiredBn: "ন্যূনতম ১ বছরের অভিজ্ঞতা",
    workshopEn: "7-Day Professional Workshop",
    workshopBn: "৭-দিনের প্রফেশনাল ওয়ার্কশপ"
  },
  {
    level: 7,
    titleEn: "Lodonex Executive Diploma in Culinary Leadership",
    titleBn: "লোডোনেক্স এক্সিকিউটিভ ডিপ্লোমা ইন কালিনারি লিডারশিপ",
    careerPathEn: "Junior Sous Chef",
    careerPathBn: "জুনিয়ার সু শেফ",
    eligibilityEn: "LQF Level 6",
    eligibilityBn: "এলকিউএফ লেভেল ৬",
    experienceRequiredEn: "Minimum 1 Year Supervisory Experience",
    experienceRequiredBn: "ন্যূনতম ১ বছরের সুপারভাইজরি অভিজ্ঞতা",
    workshopEn: "Executive Leadership Workshop",
    workshopBn: "এক্সিকিউティブ লিডারশিপ ওয়ার্কশপ"
  },
  {
    level: 8,
    titleEn: "Lodonex Executive Fellowship in Culinary Leadership",
    titleBn: "লোডোনেক্স এক্সিকিউটিভ ফেলোশিপ ইন কালিনারি লিডারশিপ",
    careerPathEn: "Executive Sous Chef / Executive Chef",
    careerPathBn: "এক্সিকিউティブ সু শেফ / এক্সিকিউティブ শেফ",
    eligibilityEn: "LQF Level 7",
    eligibilityBn: "এলকিউএফ লেভেল ৭",
    experienceRequiredEn: "Minimum 1 Year Senior Leadership Experience",
    experienceRequiredBn: "ন্যূনতম ১ বছরের সিনিয়র লিডারশিপ অভিজ্ঞতা",
    workshopEn: "Executive Leadership Workshop",
    workshopBn: "এক্সিকিউティブ লিডারশিপ ওয়ার্কশপ",
    recognitionEn: "LQF Certified Master Assessor",
    recognitionBn: "এলকিউএফ সার্টিফাইড মাস্টার অ্যাসেসর"
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    titleEn: "Level 1 – Lodonex Certified Culinary Foundation",
    titleBn: "লেভেল ১ – লোডোনেক্স সার্টিফাইড কালিনারি ফাউন্ডেশন",
    descriptionEn: "Master kitchen fundamentals, knife skills, food safety, and essential culinary methods to kickstart your professional career.",
    descriptionBn: "আপনার পেশাদার কালিনারি ক্যারিয়ার শুরু করতে কিচেনের মৌলিক বিষয়াদি, নাইফ স্কিলস, ফুড সেফটি এবং রান্নার মৌলিক কলাকৌশল রপ্ত করুন।",
    price: 150000,
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tutor: "Chef Tawhid Shekh",
    duration: "3 Months (360 Hours)",
    levelEn: "LQF Level 1",
    levelBn: "এলকিউএফ লেভেল ১",
    lqfLevel: 1,
    category: "traditional",
    lessons: [
      {
        id: "c1-l1",
        titleEn: "Lodonex Certified Culinary Foundation",
        titleBn: "লোডোনেক্স সার্টিফাইড কালিনারি ফাউন্ডেশন",
        duration: "25:40",
        videoUrl: "https://www.youtube.com/embed/P-THe8A7tQA",
        descriptionEn: "Master kitchen safety, professional behavior, personal hygiene, and the core culinary concepts of LQF Level 1.",
        descriptionBn: "কিচেন সেফটি, পেশাদার আচরণ, ব্যক্তিগত পরিচ্ছন্নতা এবং এলকিউএফ লেভেল ১-এর মৌলিক কালিনারি ধারণাগুলো আয়ত্ত করুন।",
        quiz: {
          questionEn: "What is the recommended internal cooking temperature for poultry to ensure food safety?",
          questionBn: "খাদ্য নিরাপত্তা নিশ্চিত করতে মুরগির মাংসের অভ্যন্তরীণ আদর্শ রান্নার তাপমাত্রা কত হওয়া উচিত?",
          optionsEn: ["135°F (57°C)", "145°F (63°C)", "155°F (68°C)", "165°F (74°C)"],
          optionsBn: ["১৩৫°ফা (৫৭°সে)", "১৪৫°ফা (৬৩°সে)", "১৫৫°ফা (৬৮°সে)", "১৬৫°ফা (৭৪°সে)"],
          answerIndex: 3
        }
      },
      {
        id: "c1-l2",
        titleEn: "Knife Skills, Vegetable Cuts & Stocks",
        titleBn: "নাইফ স্কিলস, ভেজিটেবল কাট এবং স্টক",
        duration: "18:20",
        videoUrl: "https://www.youtube.com/embed/Y0n9W35u2Zg",
        descriptionEn: "Learn correct knife holding positions, basic French vegetable cuts (Julienne, Batonnet, Brunoise), and how to brew clear flavorful stocks.",
        descriptionBn: "সরিকভাবে ছুরি ধরার নিয়ম, ফ্রেঞ্চ ভেজিটেবল কাট (জুলিয়েন, ব্যাটোনেট, ব্রুনোয়াইজ) এবং সুস্বাদু বেসিক স্টক তৈরির প্রণালী শিখুন।",
        quiz: {
          questionEn: "Which of the following is a classic French vegetable cut measuring approximately 1/8 x 1/8 x 2 inches?",
          questionBn: "নিচের কোনটি প্রায় ১/৮ x ১/৮ x ২ ইঞ্চি পরিমাপের একটি ক্লাসিক ফ্রেঞ্চ ভেজিটেবল কাট?",
          optionsEn: ["Brunoise", "Julienne", "Batonnet", "Chiffonade"],
          optionsBn: ["ব্রুনোয়াইজ", "জুলিয়েন", "ব্যাটোনেট", "শিফনড"],
          answerIndex: 1
        }
      },
      {
        id: "c1-l3",
        titleEn: "Egg, Rice Cookery & Basic Sauces",
        titleBn: "ডিম, রাইস কুকারি এবং মৌলিক সস",
        duration: "22:15",
        videoUrl: "https://www.youtube.com/embed/P_THe8A7tQA",
        descriptionEn: "Discover the chemistry behind egg cookery, perfect rice-to-water ratios, and how to emulsify classic mother sauces.",
        descriptionBn: "ডিম রান্নার পেছনের রসায়ন, ভাতের নিখুঁত পানির অনুপাত এবং ক্লাসিক মাদার সস তৈরির কলাকৌশল উন্মোচন করুন।",
        quiz: {
          questionEn: "Which mother sauce is prepared by emulsifying egg yolks and warm melted butter?",
          questionBn: "ডিমের কুসুম এবং গলানো মাখনের ইমালসিফিকেশন দ্বারা কোন মাদার সস তৈরি করা হয়?",
          optionsEn: ["Béchamel", "Velouté", "Hollandaise", "Espagnole"],
          optionsBn: ["বেসামেল", "ভেলোতে", "হল্যান্ডাইজ", "এস্পানিওল"],
          answerIndex: 2
        }
      }
    ]
  },
  {
    id: "course-2",
    titleEn: "Level -2 Lodonex Certified Culinary Professional",
    titleBn: "লেভেল ২ – লোডোনেক্স সার্টিফাইড কালিনারি প্রফেশনাল",
    descriptionEn: "Master intermediate culinary skills, meat & poultry preparation, international cuisines, and high-value coffee & bakery competencies.",
    descriptionBn: "আপনার পেশাদার প্রোফাইল আরও উন্নত করতে ইন্টারমিডিয়েট কালিনারি স্কিলস, মিট ও পোল্ট্রি প্রিপারেশন, আন্তর্জাতিক রন্ধনশৈলী এবং কফি ও বেকিংয়ের দক্ষতা অর্জন করুন।",
    price: 162000,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tutor: "Chef Robert Gomes",
    duration: "4 Months (480 Hours)",
    levelEn: "LQF Level 2",
    levelBn: "এলকিউএফ লেভেল ২",
    lqfLevel: 2,
    category: "continental",
    lessons: [
      {
        id: "c2-l1",
        titleEn: "Lodonex Certified Culinary Professional",
        titleBn: "লোডোনেক্স সার্টিফাইড কালিনারি প্রফেশনাল",
        duration: "24:15",
        videoUrl: "https://www.youtube.com/embed/P-THe8A7tQA",
        descriptionEn: "Learn advanced knife skills, professional meat, poultry, seafood butchery and prep, plus intermediate soup and sauce production.",
        descriptionBn: "উন্নত নাইফ স্কিলস, পেশাদার মিট, পোল্ট্রি, সি-ফুড প্রিপারেশন এবং ইন্টারমিডিয়েট স্যুপ ও সস তৈরির কলাকৌশল শিখুন।",
        quiz: {
          questionEn: "Which technique is vital to poultry butchery to ensure portions are uniform and cook evenly?",
          questionBn: "মুরগির মাংস সমান অংশে কাটার এবং সমানভাবে রান্নার জন্য কোন পদ্ধতিটি অত্যন্ত গুরুত্বপূর্ণ?",
          optionsEn: ["De-boning", "Trussing", "Julienne cutting", "Marinating"],
          optionsBn: ["হাড় আলাদা করা", "ট্রাসিং (বাঁধা)", "জুলিয়েন কাট", "মেরিনেট করা"],
          answerIndex: 1
        }
      },
      {
        id: "c2-l2",
        titleEn: "International Cuisine Masterclass",
        titleBn: "আন্তর্জাতিক রন্ধনপ্রণালী মাস্টারক্লাস",
        duration: "18:30",
        videoUrl: "https://www.youtube.com/embed/Y0n9W35u2Zg",
        descriptionEn: "Master global flavor profiles: prepare classic French mother sauces, Japanese Teriyaki, Spanish Paella, and Italian Risotto.",
        descriptionBn: "বিশ্বের সেরা খাবারের রেসিপি: ক্লাসিক ফ্রেঞ্চ মাদার সস, জাপানিজ তেরিয়াকি, স্প্যানিশ পায়েল্লা এবং ইতালিয়ান রিসোতো তৈরিতে দক্ষ হোন।",
        quiz: {
          questionEn: "What is the key starch grain variety traditionally used to achieve the creamy texture of an Italian Risotto?",
          questionBn: "ইতালিয়ান রিসোতোর ক্রিমি টেক্সচার বা ঘনত্ব পেতে ঐতিহ্যগতভাবে কোন চালটি ব্যবহার করা হয়?",
          optionsEn: ["Basmati Rice", "Arborio Rice", "Jasmine Rice", "Wild Rice"],
          optionsBn: ["বাসমতি চাল", "আরবোরিও চাল", "জেসমিন চাল", "ওয়াইল্ড রাইস"],
          answerIndex: 1
        }
      },
      {
        id: "c2-l3",
        titleEn: "Value Added: Artisan Baking & Barista Skills",
        titleBn: "ভ্যালু অ্যাডেড: আর্টিসান বেকিং ও বারিস্টা স্কিলস",
        duration: "21:40",
        videoUrl: "https://www.youtube.com/embed/2FVfJTGpXnU",
        descriptionEn: "Unlock professional value-adds: sourdough bread development, coffee brewing methods, milk steaming, and latte art.",
        descriptionBn: "পেশাদার বাড়তি সুবিধা অর্জন করুন: আর্টিসান টকমিষ্টি পাউরুটি তৈরি, কফি ব্রিউইং পদ্ধতি, নিখুঁত মিল্ক স্টিমিং এবং ল্যাটে আর্ট।",
        quiz: {
          questionEn: "What temperature range is optimal for steaming milk to achieve velvet-like microfoam for lattes?",
          questionBn: "ল্যাটের জন্য ভেলভেটের মতো মসৃণ মাইক্রোফোম তৈরি করতে দুধ স্টিমিং করার সর্বোত্তম তাপমাত্রা কত?",
          optionsEn: ["100°F - 110°F", "130°F - 140°F", "150°F - 165°F (65°C - 74°C)", "180°F - 190°F"],
          optionsBn: ["১০০°ফা - ১১০°ফা", "১৩০°ফা - ১৪০°ফা", "১৫০°ফা - ১৬৫°ফা (৬৫°সে - ৭৪°সে)", "১৮০°ফা - ১৯০°ফা"],
          answerIndex: 2
        }
      }
    ]
  },
  {
    id: "course-3",
    titleEn: "Level 3 – Advanced Culinary Professional",
    titleBn: "লেভেল ৩ – অ্যাডভান্সড কালিনারি প্রফেশনাল",
    descriptionEn: "Every higher level focuses on professional development. Master leadership, menu development, cost control, and quality assurance.",
    descriptionBn: "উচ্চতর লেভেলে পেশাদারী উন্নয়ন অর্জন করুন। রান্নাঘর ব্যবস্থাপনা, মেনু পরিকল্পনা, কস্ট কন্ট্রোল ও গুণমান নিয়ন্ত্রণ শিখুন।",
    price: 120000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tutor: "Chef Tanvir Ahmed",
    duration: "15 Days (120 Hours)",
    levelEn: "LQF Level 3",
    levelBn: "এলকিউএফ লেভেল ৩",
    lqfLevel: 3,
    category: "continental",
    lessons: [
      {
        id: "c3-l1",
        titleEn: "Pan-Seared Salmon with Lemon Herb Butter",
        titleBn: "লেবু-ভেষজ মাখন দিয়ে প্যান-সিয়ারড স্যালমন",
        duration: "16:40",
        videoUrl: "https://www.youtube.com/embed/k4fL7n-C_3Y",
        descriptionEn: "Learn to get crispy skin while keeping the internal salmon succulent and moist.",
        descriptionBn: "স্যালমন মাছের ভেতরের রসালো ভাব ঠিক রেখে বাইরের চামড়া মুচমুচে করার কৌশল শিখুন।",
        quiz: {
          questionEn: "When pan-searing salmon, which side should be placed in the hot pan first?",
          questionBn: "প্যান-সিয়ার করার সময় স্যালমন মাছের কোন দিকটি প্রথমে গরম প্যানে রাখা উচিত?",
          optionsEn: ["Flesh side first", "Skin side down first", "Either side", "The sides"],
          optionsBn: ["মাংসের দিকটি প্রথমে", "চামড়ার দিকটি প্রথমে নিচের দিকে", "যেকোন এক দিক", "পার্শ্ববর্তী দিক"],
          answerIndex: 1
        }
      },
      {
        id: "c3-l2",
        titleEn: "The Art of Master Sauces: Béchamel & Velouté",
        titleBn: "মাদার সস তৈরির কলাকৌশল: বেশামেল ও ভেলুটে",
        duration: "18:00",
        videoUrl: "https://www.youtube.com/embed/A4A-mYy99L4",
        descriptionEn: "Understand Roux preparation ratios, temperature control, and modern sauce variations.",
        descriptionBn: "রুক্স (Roux) তৈরির অনুপাত, তাপমাত্রা নিয়ন্ত্রণ এবং আধুনিক সসের রূপান্তর বুঝুন।",
        quiz: {
          questionEn: "A classic Roux is made of equal parts of which two ingredients?",
          questionBn: "একটি ক্লাসিক রুক্স (Roux) কোন দুটি উপাদানের সমান অংশে তৈরি হয়?",
          optionsEn: ["Flour and Water", "Flour and Butter/Fat", "Milk and Cheese", "Butter and Garlic"],
          optionsBn: ["ময়দা এবং পানি", "ময়দা এবং মাখন/চর্বি", "দুধ এবং পনির", "মাখন এবং রসুন"],
          answerIndex: 1
        }
      }
    ]
  },
  {
    id: "course-4",
    titleEn: "Level 4 – Professional Diploma in Culinary Arts",
    titleBn: "লেভেল ৪ – প্রফেশনাল ডিপ্লোমা ইন কালিনারি আর্টস",
    descriptionEn: "Every higher level focuses on professional development.",
    descriptionBn: "প্রতিটি উচ্চতর লেভেল পেশাদার উন্নয়ন এবং কর্মক্ষেত্রে শ্রেষ্ঠত্ব অর্জনের ওপর আলোকপাত করে।",
    price: 144000,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    tutor: "Chef Bishal",
    duration: "15 Days (120 Hours)",
    levelEn: "LQF Level 4",
    levelBn: "এলকিউএফ লেভেল ৪",
    lqfLevel: 4,
    category: "chinese",
    lessons: [
      {
        id: "c4-l1",
        titleEn: "Handmade Shrimp Dumplings (Har Gow)",
        titleBn: "হাতে তৈরি চিংড়ির ডাম্পলিং (হার গাও)",
        duration: "20:10",
        videoUrl: "https://www.youtube.com/embed/i0WscWreEdo",
        descriptionEn: "Create translucent dough and make the classic pleats for steaming authentic Har Gow.",
        descriptionBn: "স্বচ্ছ ডো তৈরি এবং খাঁটি হার গাও ভাপে দেওয়ার জন্য ক্লাসিক কুঁচি বা ভাঁজ তৈরি শিখুন।",
        quiz: {
          questionEn: "What type of starch is primarily used to make the wrapper of translucent dumplings like Har Gow?",
          questionBn: "হার গাও এর মত স্বচ্ছ ডাম্পলিংয়ের র‍্যাপার তৈরি করতে মূলত কোন স্টার্চ ব্যবহৃত হয়?",
          optionsEn: ["All-purpose wheat flour", "Wheat starch and Tapioca starch", "Cornstarch only", "Rice flour"],
          optionsBn: ["সাধারণ গমের ময়দা", "গমের স্টার্চ (Wheat starch) এবং ট্যাপিওকা স্টার্চ", "শুধুমাত্র কর্নস্টার্চ", "চালের গুঁড়া"],
          answerIndex: 1
        }
      }
    ]
  },
  {
    id: "course-5",
    titleEn: "Level 5 – Professional Diploma in Specialised Cuisine",
    titleBn: "লেভেল ৫ – প্রফেশনাল ডিপ্লোমা ইন স্পেশালাইজড কুইজিন",
    descriptionEn: "Every higher level focuses on professional development.",
    descriptionBn: "প্রতিটি উচ্চতর লেভেল পেশাদার উন্নয়ন এবং কর্মক্ষেত্রে শ্রেষ্ঠত্ব অর্জনের ওপর আলোকপাত করে।",
    price: 168000,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tutor: "Chef Tanvir Ahmed",
    duration: "15 Days (120 Hours)",
    levelEn: "LQF Level 5",
    levelBn: "এলকিউএফ লেভেল ৫",
    lqfLevel: 5,
    category: "continental",
    lessons: [
      {
        id: "c5-l1",
        titleEn: "Fresh Tagliatelle & Creamy Roman Carbonara",
        titleBn: "তাজা ট্যাগলিয়াটেলে এবং রোমান কার্বিলারা",
        duration: "18:30",
        videoUrl: "https://www.youtube.com/embed/A4A-mYy99L4",
        descriptionEn: "Learn the golden egg-to-flour ratio for pasta dough and build a carbonara sauce without heavy cream.",
        descriptionBn: "পাস্তার ডো-র জন্য ডিম ও ময়দার নিখুঁত সোনালী অনুপাত জানুন এবং হেভি ক্রিম ছাড়াই কার্বিলারা তৈরি করুন।",
        quiz: {
          questionEn: "What is the traditional ingredient used as the base thickener in an authentic Roman Carbonara?",
          questionBn: "খাঁটি রোমান কার্বোনারা সসের থিকেনার বা ঘন করার জন্য ঐতিহ্যগতভাবে কোন উপাদানটি ব্যবহৃত হয়?",
          optionsEn: ["Heavy Cream", "Bechamel Sauce", "Egg Yolks and Pecorino Romano/Parmesan", "Cornstarch Slurry"],
          optionsBn: ["হেভি ক্রিম", "বেশামেল সস", "ডিমের কুসুম এবং পেকোরিনো রোমানো/পারমেসান পনির", "কর্নস্টার্চ মিশ্রণ"],
          answerIndex: 2
        }
      }
    ]
  },
  {
    id: "course-6",
    titleEn: "Level 6 – Advanced Professional Diploma in Specialized Cuisine",
    titleBn: "লেভেল ৬ – অ্যাডভান্সড প্রফেশনাল ডিপ্লোমা ইন স্পেশালাইজড কুইজিন",
    descriptionEn: "Every higher level focuses on professional development.",
    descriptionBn: "প্রতিটি উচ্চতর লেভেল পেশাদার উন্নয়ন এবং কর্মক্ষেত্রে শ্রেষ্ঠত্ব অর্জনের ওপর আলোকপাত করে।",
    price: 192000,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tutor: "Chef Robert Gomes",
    duration: "15 Days (120 Hours)",
    levelEn: "LQF Level 6",
    levelBn: "এলকিউএফ লেভেল ৬",
    lqfLevel: 6,
    category: "baking",
    lessons: [
      {
        id: "c6-l1",
        titleEn: "The Science of Tempered Chocolate",
        titleBn: "চকলেট টেম্পারিংয়ের বৈজ্ঞানিক কলাকৌশল",
        duration: "21:45",
        videoUrl: "https://www.youtube.com/embed/2FVfJTGpXnU",
        descriptionEn: "Understand crystal formations in cocoa butter to achieve a perfect snap and beautiful glossy finish.",
        descriptionBn: "কোকো বাটারের ক্রিস্টাল গঠন প্রক্রিয়াটি জানুন যাতে চকলেটে নিখুঁত ভঙ্গুরতা এবং সুন্দর চকচকে ফিনিশ আসে।",
        quiz: {
          questionEn: "Which type of fat crystals are desired when tempering chocolate to produce a stable glossy structure?",
          questionBn: "একটি স্থিতিশীল চকচকে গঠন পেতে চকলেট টেম্পারিংয়ের সময় কোন ধরনের ফ্যাট ক্রিস্টাল তৈরি করা কাম্য?",
          optionsEn: ["Beta Type V Crystals", "Alpha Type I Crystals", "Beta Prime Type IV Crystals", "Liquid Amorphous Fats"],
          optionsBn: ["বিটা টাইপ ৫ ক্রিস্টাল (Beta Type V)", "আলফা টাইপ ১ ক্রিস্টাল", "বিটা প্রাইম টাইপ ৪ ক্রিস্টাল", "তরল চর্বি কণা"],
          answerIndex: 0
        }
      }
    ]
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    titleEn: "Shorshe Ilish (Mustard Hilsa Curry)",
    titleBn: "সর্ষে ইলিশ (সরিষা ইলিশ কারি)",
    categoryEn: "Traditional Fish",
    categoryBn: "ঐতিহ্যবাহী মাছ",
    prepTime: "15 min",
    cookTime: "15 min",
    servings: 4,
    ingredientsEn: [
      "4 pieces of Hilsa fish",
      "3 tbsp yellow and black mustard seeds (ground)",
      "4-5 green chilies (slit)",
      "1/2 tsp turmeric powder",
      "3 tbsp mustard oil",
      "Salt to taste",
      "1/2 tsp kalonji (black cumin seeds)"
    ],
    ingredientsBn: [
      "৪ টুকরো ইলিশ মাছ",
      "৩ টেবিল চামচ হলুদ ও কালো সরিষা বাটা",
      "৪-৫ টি কাঁচা মরিচ (ফালি করা)",
      "১/২ চা চামচ হলুদ গুঁড়া",
      "৩ টেবিল চামচ সরিষার তেল",
      "স্বাদমতো লবণ",
      "১/২ চা চামচ কালোজিরা"
    ],
    stepsEn: [
      "Lightly coat the fish pieces with a pinch of turmeric and salt.",
      "Blend mustard seeds with one green chili and a pinch of salt with a splash of water to form a smooth paste.",
      "Heat mustard oil in a pan, add kalonji and slit green chilies.",
      "Mix mustard paste with turmeric powder, 1 cup water, and salt. Pour this mixture into the pan.",
      "Gently add the fish pieces once the mustard sauce starts to boil.",
      "Cover and cook on medium-low heat for 10-12 minutes, turning the fish once halfway.",
      "Drizzle a teaspoon of raw mustard oil and add extra slit chilies before turning off the stove. Serve with steamed rice."
    ],
    stepsBn: [
      "মাছের টুকরোগুলোকে সামান্য হলুদ ও লবণ মাখিয়ে হালকা ম্যারিনেট করে রাখুন।",
      "সরিষার দানা একটি কাঁচা মরিচ ও এক চিমটি লবণ দিয়ে মসৃণ করে বেটে নিন (এতে তেতো হবে না)।",
      "প্যানে সরিষার তেল গরম করে কালোজিরা ও কাঁচা মরিচ ফালি ফোড়ন দিন।",
      "সরিষা বাটা, হলুদ গুঁড়ো, ১ কাপ পানি এবং লবণ একসাথে মিশিয়ে প্যানে ঢালুন।",
      "সরিষা ঝোল ফুটতে শুরু করলে মাছের টুকরোগুলো সাবধানে ছেড়ে দিন।",
      "ঢাকনা দিয়ে মাঝারি-কম আঁচে ১০-১২ মিনিট রান্না করুন, মাঝপথে একবার মাছ উল্টে দিন।",
      "চুলা বন্ধ করার আগে উপর থেকে এক চামচ কাঁচা সরিষার তেল এবং কাঁচা মরিচ ছড়িয়ে দিন। গরম ভাতের সাথে পরিবেশন করুন।"
    ],
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "rec-2",
    titleEn: "Classic French Macarons",
    titleBn: "ক্লাসিক ফরাসি ম্যাক্যারন",
    categoryEn: "Baking / Dessert",
    categoryBn: "বেকিং / ডেজার্ট",
    prepTime: "35 min",
    cookTime: "15 min",
    servings: 12,
    ingredientsEn: [
      "100g almond flour (fine)",
      "100g powdered sugar",
      "70g egg whites (room temperature)",
      "90g granulated sugar",
      "1/4 tsp cream of tartar",
      "Food coloring (optional)",
      "Chocolate Ganache or Buttercream for filling"
    ],
    ingredientsBn: [
      "১০০ গ্রাম আমন্ড পাউডার (মিহি)",
      "১০০ গ্রাম আইসিং সুগার",
      "৭০ গ্রাম ডিমের কুসুমহীন সাদা অংশ",
      "৯০ গ্রাম দানাদার চিনি",
      "১/৪ চা চামচ ক্রিম অব টারটার",
      "খাবার রঙ (ঐচ্ছিক)",
      "ভরাট করার জন্য চকলেট গানাশ বা বাটারক্রিম"
    ],
    stepsEn: [
      "Sift the almond flour and powdered sugar together twice. Discard any large almond pieces.",
      "Whip egg whites on medium speed until foamy, add cream of tartar, then gradually add granulated sugar while raising speed to high.",
      "Beat until stiff, glossy peaks form. Fold in food coloring if desired.",
      "Carefully fold dry ingredients into the whipped egg whites using the fold technique (Macaronage) until batter flows like ribbon.",
      "Pipe rounds onto a baking sheet lined with parchment paper. Tap tray forcefully on the counter to release air bubbles.",
      "Let sit at room temperature for 30-40 minutes until a dry skin forms on top.",
      "Bake at 150°C (300°F) for 14-16 minutes. Let cool fully before peeling off paper and piping fillings."
    ],
    stepsBn: [
      "আমন্ড পাউডার ও আইসিং সুগার একসাথে দুইবার চেলে নিন। বড় দানাদার অংশ ফেলে দিন।",
      "ডিমের সাদা অংশ ফোম হওয়া পর্যন্ত ফেটান, ক্রিম অব টারটার দিন এবং ধীরে ধীরে দানাদার চিনি যোগ করে তীব্র গতিতে ফেটান।",
      "চকচকে ও শক্ত স্টিফ পিক তৈরি করুন। চাইলে এ সময় পছন্দমতো ফুড কালার মেশাতে পারেন।",
      "শুকনো উপাদান ডিমের ফোমের সাথে আলতো করে মেশান (ম্যাক্যারনেজ পদ্ধতি) যতক্ষণ না ব্যাটারটি ফিতার মতো মসৃণভাবে পড়ে।",
      "বেকিং ট্রে-তে পার্চমেন্ট পেপার বিছিয়ে পাইপিং ব্যাগের সাহায্যে গোল গোল করে পাইপ করুন। ভেতরে বাতাস দূর করতে ট্রে-টি কাউন্টারে জোরে ট্যাপ করুন।",
      "ঘরের তাপমাত্রায় ৩০-৪০ মিনিট রেখে দিন যেন ওপরের অংশটি শুকিয়ে শক্ত চামড়ার মতো হয়।",
      "১৫০° সে. তাপমাত্রায় ১৪-১৬ মিনিট বেক করুন। সম্পূর্ণ ঠান্ডা হওয়ার পর পেপার থেকে তুলে ক্রিম বা গানাশ দিয়ে জোড়া লাগিয়ে দিন।"
    ],
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "rec-3",
    titleEn: "Creamy Tuscan Garlic Chicken",
    titleBn: "ক্রিমি টাস্কান রসুন চিকেন",
    categoryEn: "Continental Main",
    categoryBn: "মহাদেশীয় খাবার",
    prepTime: "10 min",
    cookTime: "20 min",
    servings: 2,
    ingredientsEn: [
      "2 chicken breasts (boneless, halved)",
      "2 tbsp olive oil",
      "4 cloves garlic (minced)",
      "1/2 cup sun-dried tomatoes",
      "2 cups fresh baby spinach",
      "1 cup heavy whipping cream",
      "1/2 cup grated Parmesan cheese",
      "1 tsp Italian seasoning",
      "Salt and pepper to taste"
    ],
    ingredientsBn: [
      "২ টুকরো মুরগির বুকের মাংস (হাড়ছাড়া, ফালি করা)",
      "২ টেবিল চামচ অলিভ অয়েল",
      "৪ কোয়া রসুন (মিহি কুচি)",
      "১/২ কাপ সান-ড্রাইড টমেটো",
      "২ কাপ কচি পালং শাক",
      "১ কাপ হেভি হুইপিং ক্রিম",
      "১/২ কাপ গ্রেটেড পারমেসান পনির",
      "১ চা চামচ ইতালীয় সিজনিং/ভেষজ",
      "স্বাদমতো লবণ ও গোলমরিচ"
    ],
    stepsEn: [
      "Season chicken breasts on both sides with salt, pepper, and Italian seasoning.",
      "Heat olive oil in a large skillet over medium-high heat. Sear chicken for 5 mins each side until golden and cooked.",
      "Remove chicken from skillet and set aside on a plate.",
      "In the same skillet, add garlic and sun-dried tomatoes. Sauté for 1 minute until fragrant.",
      "Add heavy cream and bring to a simmer. Turn down heat, stir in Parmesan cheese until melted and smooth.",
      "Add baby spinach and let it wilt in the simmering cream sauce.",
      "Return chicken and accumulated juices to the pan. Spoon sauce over chicken, simmer for 2 minutes and serve warm."
    ],
    stepsBn: [
      "মুরগির মাংসের দুই পাশে লবণ, গোলমরিচ এবং ইতালীয় সিজনিং মেখে নিন।",
      "একটি প্যানে অলিভ অয়েল গরম করে মুরগির মাংস প্রতি পাশে ৫ মিনিট করে ভেজে সোনালী রঙের করুন।",
      "মাংস প্লেটে তুলে রাখুন।",
      "একই প্যানে রসুন কুচি এবং সান-ড্রাইড টমেটো দিয়ে ১ মিনিট মাঝারি আঁচে ভাজুন।",
      "হেভি ক্রিম যোগ করুন এবং ফুটিয়ে নিন। আঁচ কমিয়ে গ্রেটেড পারমেসান পনির দিয়ে গলিয়ে নিন।",
      "কচি পালং শাক যোগ করুন এবং ক্রিমের সসে শাক নরম হতে দিন।",
      "ভেজে রাখা মুরগির মাংস আবার প্যানে দিন। মাংসের ওপর সস ছড়িয়ে দিন, ২ মিনিট মৃদু আঁচে রেখে গরম গরম পরিবেশন করুন।"
    ],
    image: "https://images.unsplash.com/photo-1621510456681-23a23cfb5f57?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: "live-1",
    titleEn: "Royal Mughlai Biryani Live Masterclass",
    titleBn: "রয়্যাল মোগলাই বিরিয়ানি লাইভ মাস্টারক্লাস",
    tutor: "Chef Tanvir Ahmed",
    date: "2026-07-08",
    time: "18:00",
    dateTime: "2026-07-08T18:00:00+06:00",
    status: "live",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "live-2",
    titleEn: "Art of Plating & Commercial Kitchen Management",
    titleBn: "খাবার পরিবেশনের আর্ট এবং বাণিজ্যিক রান্নাঘর ব্যবস্থাপনা",
    tutor: "Chef Robert Gomes",
    date: "2026-07-15",
    time: "15:00",
    dateTime: "2026-07-15T15:00:00+06:00",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "live-3",
    titleEn: "Traditional Bangladeshi Sweets & Pitha Baking",
    titleBn: "ঐতিহ্যবাহী বাংলাদেশি মিষ্টি ও পিঠা তৈরি",
    tutor: "Chef Tawhid Shekh",
    date: "2026-07-22",
    time: "16:00",
    dateTime: "2026-07-22T16:00:00+06:00",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80"
  }
];

export const BADGES: Badge[] = [
  {
    id: "badge-first",
    titleEn: "Gastronomy Pioneer",
    titleBn: "রন্ধনশিল্পের অগ্রদূত",
    descriptionEn: "Enrolled in your first culinary course at the academy.",
    descriptionBn: "একাডেমিতে আপনার প্রথম রান্নার কোর্সে ভর্তি হয়েছেন।",
    iconName: "Compass"
  },
  {
    id: "badge-quiz",
    titleEn: "Culinary Theorist",
    titleBn: "রন্ধন তত্ত্ববিদ",
    descriptionEn: "Scored a perfect 100% on any lesson culinary quiz.",
    descriptionBn: "যেকোনো পাঠের রন্ধন কুইজে শতভাগ (১০০%) নম্বর পেয়েছেন।",
    iconName: "Award"
  },
  {
    id: "badge-recipe",
    titleEn: "Creative Alchemist",
    titleBn: "সৃজনশীল রন্ধনশিল্পী",
    descriptionEn: "Created and logged a unique custom recipe in your management portal.",
    descriptionBn: "রেসিপি ম্যানেজমেন্ট পোর্টালে নিজস্ব একটি কাস্টম রেসিপি তৈরি ও সংরক্ষণ করেছেন।",
    iconName: "Sparkles"
  },
  {
    id: "badge-graduate",
    titleEn: "Master Chef Graduate",
    titleBn: "মাস্টার শেফ গ্র্যাজুয়েট",
    descriptionEn: "Completed all video tutorials and modules of at least one core course.",
    descriptionBn: "অন্তত একটি কোর কোর্সের সমস্ত ভিডিও টিউটোরিয়াল এবং মডিউল সম্পন্ন করেছেন।",
    iconName: "GraduationCap"
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    titleEn: "The Art of Sourdough: Science, Hydration & Wild Yeasts",
    titleBn: "টকমিষ্টি পাউরুটির শিল্প: বিজ্ঞান, হাইড্রেশন এবং ওয়াইল্ড ঈস্ট",
    excerptEn: "Explore the fascinating bio-chemistry of sourdough baking, from cultivating wild starters to obtaining the perfect crispy crust.",
    excerptBn: "ওয়াইল্ড স্টার্টার চাষ থেকে শুরু করে নিখুঁত ক্রিস্পি ক্রাস্ট পাওয়ার জন্য টকমিষ্টি পাউরুটি বেকিংয়ের আকর্ষণীয় রসায়ন অন্বেষণ করুন।",
    contentEn: "Sourdough baking is as much a science as it is an art. Unlike commercial bread which relies on processed baker's yeast, sourdough utilizes a wild culture of natural yeasts and lactobacilli. The process begins with 'hydration'—the ratio of water to flour. A higher hydration (75-80%) results in a more open, airy crumb structure but requires experienced handling. During fermentation, lactobacilli produce lactic and acetic acids, giving the bread its signature tangy flavor and improving digestibility. To achieve the coveted blistered, golden crust, professional bakers inject steam into the oven during the first 10 minutes of baking, which gelatinizes starches on the dough surface.",
    contentBn: "টকমিষ্টি পাউরুটি বেকিং যতটা শিল্প, ততটাই বিজ্ঞান। বাণিজ্যিক রুটির মতো প্রক্রিয়াজাত ঈস্টের ওপর নির্ভর না করে, এটি প্রাকৃতিক ঈস্ট এবং ল্যাকটোব্যাসিলাইয়ের বন্য সংস্কৃতির সাহায্য নেয়। প্রক্রিয়াটি শুরু হয় 'হাইড্রেশন' বা আটা-পানির অনুপাত দিয়ে। উচ্চতর হাইড্রেশন (৭৫-৮০%) রুটির ভেতরের অংশকে বেশি নরম এবং ফাঁপা করে তোলে। গাঁজন বা ফারমেন্টেশন প্রক্রিয়ার সময়, ল্যাকটোব্যাসিলাই ল্যাকটিক এবং অ্যাসিটিক অ্যাসিড তৈরি করে, যা রুটিকে তার পরিচিত টক স্বাদ দেয় এবং হজম ক্ষমতা বাড়ায়। চমৎকার কুড়কুড়ে সোনালী ক্রাস্ট বা ওপরের আবরণ পেতে পেশাদার বেকিংয়ে প্রথম ১০ মিনিট ওভেনে বাষ্প চালনা করা হয়।",
    authorEn: "Chef Robert Gomes",
    authorBn: "শেফ রবার্ট গোমেজ",
    date: "2026-06-25",
    readTimeEn: "5 min read",
    readTimeBn: "৫ মিনিট পাঠ",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    categoryEn: "Baking",
    categoryBn: "বেকিং"
  },
  {
    id: "blog-2",
    titleEn: "The Five Mother Sauces Every Culinary Student Must Master",
    titleBn: "পাঁচটি মাদার সস যা প্রতিটি রন্ধন শিক্ষার্থীর শেখা উচিত",
    excerptEn: "Deep dive into the classical French foundations of gastronomy: Béchamel, Velouté, Espagnole, Tomato, and Hollandaise.",
    excerptBn: "ধ্রুপদী ফরাসি রন্ধনশৈলীর ভিত্তি পাঁচটি প্রধান সস সম্পর্কে বিস্তারিত জানুন: বেশামেল, ভেলুটে, এস্পানিওল, টমেটো এবং হল্যান্ডাইজ।",
    contentEn: "In the 19th century, Marie-Antoine Carême codified the foundational sauces of French cuisine, which Auguste Escoffier later refined. These are known as the 'Mother Sauces' because they serve as starting points for hundreds of derivative sauces. Béchamel starts with a white roux and milk, creating a rich base for gratins. Velouté uses a blond roux and light stock (chicken or fish). Espagnole is a rich brown sauce made from brown stock, mirepoix, and dark roux. Tomato sauce relies on pork fat, aromatic vegetables, and tomatoes simmered slowly. Finally, Hollandaise is a warm emulsion of egg yolks, acid (lemon juice or white wine reduction), and clarified butter, requiring precise heat control to prevent curdling.",
    contentBn: "১৯ শতকে মেরি-অ্যান্টোইন কারেম ফরাসি রন্ধনশৈলীর মৌলিক সসগুলোকে শ্রেণীবদ্ধ করেছিলেন, যা পরবর্তীতে অগাস্ট এসকফিয়ার আরও পরিমার্জিত করেন। এগুলোকে 'মাদার সস' বলা হয় কারণ এগুলো শত শত সসের প্রারম্ভিক বিন্দু হিসেবে কাজ করে। বেশামেল শুরু হয় সাদা রুক্স এবং দুধ দিয়ে, যা গ্র্যাটিনের জন্য একটি সমৃদ্ধ বেস তৈরি করে। ভেলুটে হালকা স্টক (মুরগি বা মাছ) এবং হালকা বাদামী রুক্স ব্যবহার করে। এস্পানিওল হলো বাদামী স্টক, মিরপোয়া এবং গাঢ় রুক্স থেকে তৈরি একটি সমৃদ্ধ বাদামী সস। টমেটো সস শুকরের চর্বি, সুগন্ধি শাকসবজি এবং ধীরে ধীরে সেদ্ধ করা টমেটোর ওপর নির্ভর করে। সবশেষে, হল্যান্ডাইজ হলো ডিমের কুসুম, লেবুর রস এবং গলানো মাখনের একটি উষ্ণ ইমালশন, যা জমাট বাঁধা রোধ করতে সূক্ষ্ম তাপমাত্রা নিয়ন্ত্রণের প্রয়োজন হয়।",
    authorEn: "Chef Tanvir Ahmed",
    authorBn: "শেফ তানভীর আহমেদ",
    date: "2026-07-01",
    readTimeEn: "6 min read",
    readTimeBn: "৬ মিনিট পাঠ",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    categoryEn: "Continental",
    categoryBn: "মহাদেশীয় রান্না"
  },
  {
    id: "blog-3",
    titleEn: "Demystifying Panch Phoron: The Bengali Five-Spice Blend",
    titleBn: "পাঁচফোড়ন রহস্যভেদ: বাঙালি পাঁচ-মশলার জাদুকরী মিশ্রণ",
    excerptEn: "Unlock the aromatic power of Eastern India and Bangladesh's signature whole-spice blend and learn the art of tempering ('Phoron').",
    excerptBn: "পূর্ব ভারত ও বাংলাদেশের সিগনেচার মশলার মিশ্রণ পাঁচফোড়নের সুগন্ধি শক্তি এবং ফোড়ন দেওয়ার রন্ধনশৈলী জানুন।",
    contentEn: "Panch Phoron is the absolute aromatic core of Bengali vegetarian and lentil cooking. Unlike powdered spice blends like Garam Masala, Panch Phoron is always used as whole seeds and consists of equal parts of five distinct seeds: Fenugreek (methi), Nigella (kalo jeera), Cumin (jeera), Radhuni (wild celery seed, often substituted with fennel), and Fennel (mouri). The magic of Panch Phoron lies in the technique of tempering (known as 'Tarka' or 'Chhnok'). When roasted in hot mustard oil or ghee, the seeds pop and release essential oils into the fat, creating a deeply aromatic foundation that elevates simple lentils, potatoes, or seasonal vegetables into masterpiece dishes.",
    contentBn: "পাঁচফোড়ন হলো বাঙালি নিরামিষ এবং ডাল রান্নার মূল সুগন্ধি ভিত্তি। গরম মশলার মতো গুঁড়ো মশলার মিশ্রণের বিপরীতে, পাঁচফোড়ন সবসময় আস্ত বীজ হিসেবে ব্যবহৃত হয় এবং এতে পাঁচটি ভিন্ন বীজের সমান অংশ থাকে: মেথি, কালোজিরা, জিরা, রাধুনী এবং মৌরি। পাঁচফোড়নের আসল জাদু লুকিয়ে আছে ফোড়ন দেওয়ার কৌশলের মধ্যে। গরম সরিষার তেল বা ঘিয়ে যখন এই বীজগুলো ভাজা হয়, তখন বীজগুলো ফুটে উঠে চর্বিতে সুগন্ধি তেল মুক্ত করে, যা সাধারণ ডাল বা তরকারিকে এক অসাধারণ স্বাদের খাবারে পরিণত করে।",
    authorEn: "Chef Tawhid Shekh",
    authorBn: "শেফ তৌহিদ শেখ",
    date: "2026-07-03",
    readTimeEn: "4 min read",
    readTimeBn: "৪ মিনিট পাঠ",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
    categoryEn: "Traditional Bengali",
    categoryBn: "ঐতিহ্যবাহী বাঙালি"
  }
];
