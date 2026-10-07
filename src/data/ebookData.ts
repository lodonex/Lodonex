import { EBookRecipe } from "../types";

export interface EBookCategoryInfo {
  id: string;
  name: string;
  recipeCount: number;
  description: string;
  icon: string;
}

export const EBOOK_METADATA = {
  productId: "lodonex-culinary-ebook" as const,
  title: "LODONEX CULINARY E-BOOK FOR STUDENTS",
  subtitle: "Recipes • Cuisines • Practical Culinary Skills",
  price: 199,
  currency: "USD",
  formattedPrice: "$199",
  badge: "OFFICIAL ACADEMY EDITION",
  recipesCount: "131+ Recipes",
  categoriesCount: "22 Cuisine & Recipe Categories",
  format: "Digital PDF & Interactive Reader",
  author: "Lodonex Professional Culinary Academy Faculty",
  pagesEstimate: "348 Pages",
  isbn: "978-984-35-2026-1",
  edition: "2026 International Student Masterclass Edition",
  description:
    "Master essential culinary knowledge with the Lodonex Culinary E-Book — a comprehensive, practical digital resource designed for aspiring and professional culinary students worldwide.",
  summary:
    "Covering foundational stocks, classical mother sauces, five continental styles, Asian masterclasses (Japanese, Chinese, Thai, Korean), Middle Eastern & Mediterranean classics, artisanal bakery, French pastry, and European desserts, this official textbook is designed for real commercial kitchen execution.",
  highlights: [
    "131+ Industry-Grade Masterclass Recipes",
    "22 World Cuisine & Technical Categories",
    "Comprehensive Ingredient Ratios with Metric & US Standard Units",
    "Step-by-Step Commercial Kitchen Procedures & Chef Tips",
    "Classical French Mother Sauces & Contemporary Emulsions",
    "Professional Bakery, Laminated Puff Pastry & Confectionery",
    "Full Kitchen Measurement & Metric Conversion Reference Guide",
    "Instant PDF Access & Verified Digital Student Diploma Material",
  ],
};

export const EBOOK_CATEGORIES: EBookCategoryInfo[] = [
  { id: "stocks", name: "Basic Stocks", recipeCount: 4, description: "Vegetable, Chicken, Beef, and Fish stocks foundations", icon: "Flame" },
  { id: "mother-sauces", name: "Mother Sauces", recipeCount: 6, description: "The 5 classical French mother sauces plus mayonnaise", icon: "Soup" },
  { id: "thai", name: "Thai Cuisine", recipeCount: 5, description: "Aromatic curries, Tom Yum, Pad Thai, and Satay", icon: "UtensilsCrossed" },
  { id: "korean", name: "Korean Cuisine", recipeCount: 5, description: "Bibimbap, fermented Kimchi, Seolleongtang, and Katsu", icon: "Sparkles" },
  { id: "continental", name: "Continental Cuisine", recipeCount: 21, description: "European bistro classics, Beef Wellington, and Salmon", icon: "ChefHat" },
  { id: "french", name: "French Cuisine", recipeCount: 4, description: "Steak au poivre, Ribeye steak, and bistro specialties", icon: "Award" },
  { id: "italian", name: "Italian Cuisine", recipeCount: 17, description: "Fresh pasta, Lasagna Bolognese, Neapolitan pizzas, Calzone", icon: "Pizza" },
  { id: "indian", name: "Indian Cuisine", recipeCount: 5, description: "Daam Pukht Biryani, Butter Chicken, Tikka, and Jarda", icon: "Flame" },
  { id: "japanese", name: "Japanese Cuisine", recipeCount: 8, description: "Sushi rolls, Teriyaki, Yakiniku, and Shrimp Tempura", icon: "Fish" },
  { id: "chinese", name: "Chinese Cuisine", recipeCount: 5, description: "Kung Pao Chicken, Beef Broccoli, Mapo Tofu, Dumplings", icon: "Utensils" },
  { id: "mexican", name: "Mexican Cuisine", recipeCount: 4, description: "Street tacos, Quesadillas, Chimichangas, and Guacamole", icon: "Coffee" },
  { id: "turkish", name: "Turkish Cuisine", recipeCount: 4, description: "Reshmi Kebab, Pide boat flatbread, Lahmacun, Adana Kebab", icon: "Flame" },
  { id: "vegetarian", name: "Vegetarian Cuisine", recipeCount: 4, description: "Palak Paneer, Sauerkraut, Vegetable Fritters", icon: "Leaf" },
  { id: "lebanese", name: "Lebanese Cuisine", recipeCount: 2, description: "Authentic Tahini Hummus and skewered Shish Tawook", icon: "ShieldCheck" },
  { id: "mediterranean", name: "Mediterranean Cuisine", recipeCount: 4, description: "Fattoush salad with sumac and spiced minced Kibbeh", icon: "Sun" },
  { id: "sri-lankan", name: "Sri Lankan Cuisine", recipeCount: 2, description: "Spicy Island Crab Curry and coastal coconut curries", icon: "Waves" },
  { id: "gastronomy", name: "Contemporary Gastronomy", recipeCount: 4, description: "Modern wraps, poached egg avocado, healthy oat bowls", icon: "Compass" },
  { id: "seafood", name: "Seafood Masterclass", recipeCount: 5, description: "Mixed seafood fried rice, crispy calamari, prawns", icon: "Fish" },
  { id: "russian", name: "Russian Cuisine", recipeCount: 2, description: "Velvet Beef Stroganoff with sour cream & mushroom", icon: "Clock" },
  { id: "baking", name: "Baking Recipes", recipeCount: 6, description: "Dinner rolls, burger buns, sandwich bread, Chelsea bun, Focaccia", icon: "Cake" },
  { id: "pastry", name: "Pastry Recipes", recipeCount: 7, description: "Puff pastry lamination, Swiss meringue buttercream, sponge cakes", icon: "HeartHandshake" },
  { id: "desserts", name: "Dessert Recipes", recipeCount: 7, description: "Tiramisu, Crème Brûlée, Baked Alaska, Cheesecake, Apple Pie", icon: "Sparkles" },
  { id: "conversions", name: "Kitchen Measurements & Conversions", recipeCount: 2, description: "Comprehensive US Standard and Metric conversion tables", icon: "Scale" },
];

export const KITCHEN_CONVERSIONS = [
  { unit: "1 tablespoon (tbsp)", usStandard: "3 teaspoons (tsp)", metric: "15 ml" },
  { unit: "1/8 cup", usStandard: "2 tablespoons", metric: "30 ml" },
  { unit: "1/4 cup", usStandard: "4 tablespoons", metric: "60 ml" },
  { unit: "1/3 cup", usStandard: "5 tablespoons + 1 teaspoon", metric: "80 ml" },
  { unit: "1/2 cup", usStandard: "8 tablespoons", metric: "120 ml" },
  { unit: "1 cup", usStandard: "16 tablespoons", metric: "240 ml" },
  { unit: "1 pint", usStandard: "2 cups", metric: "480 ml" },
  { unit: "1 quart", usStandard: "4 cups", metric: "950 ml" },
  { unit: "1 gallon", usStandard: "4 quarts", metric: "3.8 liters" },
  { unit: "1 ounce (oz)", usStandard: "Weight measurement", metric: "≈ 28.35 grams (g)" },
  { unit: "1 pound (lb)", usStandard: "16 ounces", metric: "≈ 454 grams (0.454 kg)" },
  { unit: "2.2 pounds (lb)", usStandard: "Weight measurement", metric: "≈ 1.0 kilogram (kg)" },
  { unit: "1 fluid ounce (fl oz)", usStandard: "Volume measurement", metric: "≈ 29.57 milliliters (ml)" },
];

export const EBOOK_RECIPES: EBookRecipe[] = [
  // 1. BASIC STOCKS
  {
    id: "stock-veg",
    title: "Basic Vegetable Stock",
    cuisine: "Continental",
    category: "Basic Stocks",
    pageNumber: 1,
    components: [
      {
        componentName: "Stock Ingredients",
        ingredients: [
          { name: "Water", quantity: "5 L" },
          { name: "Carrot (Mirepoix rough cut)", quantity: "200 g" },
          { name: "Onion (Mirepoix rough cut)", quantity: "200 g" },
          { name: "Celery (Mirepoix rough cut)", quantity: "100 g" },
          { name: "Bay Leaf", quantity: "3-5 pcs" },
          { name: "Whole Black Peppercorns", quantity: "5-10 pcs" },
        ],
      },
    ],
    procedure: [
      "Wash, peel, and cut all vegetables as Mirepoix (rough, uniform cuts).",
      "Add all the vegetables and aromatics (bay leaf, peppercorns) to a heavy-bottomed stockpot.",
      "Add all cold water and bring to a rapid boil over high heat.",
      "Once boiling is reached, reduce the heat to maintain a gentle simmering temperature (avoid rapid boiling to keep stock clear).",
      "Simmer uncovered for 1.5 to 2 hours, skimming any foam from the surface.",
      "Strain the stock liquid through a fine chinois or sieve, cool down quickly, and store appropriately.",
    ],
    notes: [
      "Do NOT add salt to basic vegetable stock; it must remain neutral for reductions.",
      "Garlic is excluded to maintain an all-purpose neutral flavor profile.",
    ],
  },
  {
    id: "stock-chicken",
    title: "Basic Chicken Stock",
    cuisine: "Continental",
    category: "Basic Stocks",
    pageNumber: 2,
    components: [
      {
        componentName: "Stock Ingredients",
        ingredients: [
          { name: "Water", quantity: "5 L" },
          { name: "Chicken Bones (cleaned & rinsed)", quantity: "500 g" },
          { name: "Carrot (Mirepoix cut)", quantity: "100 g" },
          { name: "Celery (Mirepoix cut)", quantity: "50 g" },
          { name: "Onion (Mirepoix cut)", quantity: "100 g" },
          { name: "Garlic (crushed)", quantity: "15 g" },
          { name: "Vinegar (white)", quantity: "15 ml" },
          { name: "Cooking Oil", quantity: "30 ml" },
          { name: "Bay Leaf", quantity: "3-5 pcs" },
          { name: "Whole Black Pepper", quantity: "5-10 pcs" },
        ],
      },
    ],
    procedure: [
      "Wash, peel, and cut all vegetables as Mirepoix. Wash and prepare chicken bones thoroughly.",
      "Heat cooking oil in a large stockpot over medium heat.",
      "Add chicken bones, carrot, celery, and onion. Sauté over medium heat until light golden brown.",
      "Add the crushed garlic, bay leaves, and whole black peppercorns.",
      "Pour cold water into the pot, add vinegar to aid collagen breakdown, and bring to a boil over high heat.",
      "Reduce heat to a low simmer. Simmer gently for 4 to 6 hours.",
      "Strain through a fine mesh sieve and reserve the golden broth.",
    ],
    notes: ["Skim impurities regularly during the first 30 minutes of simmering."],
  },
  {
    id: "stock-beef",
    title: "Basic Beef Brown Stock",
    cuisine: "Continental",
    category: "Basic Stocks",
    pageNumber: 3,
    components: [
      {
        componentName: "Brown Stock Ingredients",
        ingredients: [
          { name: "Water", quantity: "5 L" },
          { name: "Beef Bones", quantity: "500 g" },
          { name: "Carrot", quantity: "100 g" },
          { name: "Celery", quantity: "50 g" },
          { name: "Onion", quantity: "100 g" },
          { name: "Garlic", quantity: "15 g" },
          { name: "Vinegar", quantity: "15 ml" },
          { name: "Tomato Paste", quantity: "1 tbsp" },
          { name: "Cooking Oil", quantity: "30 ml" },
          { name: "Bay Leaf", quantity: "3-5 pcs" },
          { name: "Whole Black Pepper", quantity: "5-10 pcs" },
        ],
      },
    ],
    procedure: [
      "Wash and prepare beef bones. Cut carrots, celery, and onions into mirepoix.",
      "Heat oil in a stockpot. Add beef bones and mirepoix, sautéing until deep golden brown.",
      "Stir in tomato paste and garlic, cooking until fragrant and caramelized.",
      "Add water and vinegar. Bring to a boil, then reduce heat to a low simmer.",
      "Simmer gently for 6 to 8 hours, skimming surface fat periodically.",
      "Strain stock and cool before refrigerating.",
    ],
  },
  {
    id: "stock-fish",
    title: "Basic Fish Stock",
    cuisine: "Continental",
    category: "Basic Stocks",
    pageNumber: 4,
    components: [
      {
        componentName: "Fish Stock Ingredients",
        ingredients: [
          { name: "Water", quantity: "5 L" },
          { name: "Fish Bones + Head (no gills/stomach)", quantity: "500 g" },
          { name: "Carrot", quantity: "50 g" },
          { name: "Celery", quantity: "50 g" },
          { name: "Onion", quantity: "50 g" },
          { name: "Garlic", quantity: "10 g" },
          { name: "Lemon Juice / Vinegar", quantity: "15 ml" },
          { name: "Cooking Oil", quantity: "30 ml" },
          { name: "Bay Leaf", quantity: "1-3 pcs" },
          { name: "Whole Black Pepper", quantity: "3-5 pcs" },
        ],
      },
    ],
    procedure: [
      "Clean fish bones thoroughly and discard gills and stomach to avoid bitterness.",
      "Heat oil over medium heat. Sauté bones and vegetables until fragrant without browning.",
      "Add lemon juice, bay leaf, pepper, and cold water. Bring to a boil.",
      "Reduce heat to a simmer and cook for 1.5 to 2 hours maximum (fish bones turn bitter if simmered longer).",
      "Strain and reserve.",
    ],
  },

  // 2. MOTHER SAUCES
  {
    id: "sauce-tomato",
    title: "Classic Tomato Mother Sauce",
    cuisine: "French / Classical",
    category: "Mother Sauces",
    pageNumber: 8,
    components: [
      {
        componentName: "Sauce Ingredients",
        ingredients: [
          { name: "Tomato (blanched, skinned, pureed)", quantity: "4 pcs" },
          { name: "Tomato Paste", quantity: "1 tbsp" },
          { name: "Carrot (Mirepoix)", quantity: "20 g" },
          { name: "Celery (Mirepoix)", quantity: "20 g" },
          { name: "Onion (Mirepoix)", quantity: "20 g" },
          { name: "Dried Oregano", quantity: "1 pinch" },
          { name: "Olive Oil", quantity: "30 ml" },
          { name: "Salt, Black Pepper, Sugar", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Heat olive oil in a saucepan over medium heat.",
      "Sauté mirepoix (carrot, celery, onion) until soft and light golden brown.",
      "Add tomato paste and cook until fragrant.",
      "Add pureed tomatoes and dried oregano. Simmer on low heat for 10-12 minutes until thick.",
      "Season with salt, black pepper, and sugar to balance acidity.",
    ],
  },
  {
    id: "sauce-espagnole",
    title: "Espagnole Mother Sauce (Brown Sauce)",
    cuisine: "French / Classical",
    category: "Mother Sauces",
    pageNumber: 9,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Beef Stock", quantity: "500 ml" },
          { name: "Butter", quantity: "1 tbsp" },
          { name: "Flour", quantity: "1 tbsp" },
          { name: "Carrot (finely chopped)", quantity: "20 g" },
          { name: "Celery (finely chopped)", quantity: "20 g" },
          { name: "Onion (finely chopped)", quantity: "20 g" },
          { name: "Tomato Paste", quantity: "1 tbsp" },
          { name: "Bouquet Garni (Thyme, Parsley, Bay Leaf)", quantity: "1 pc" },
          { name: "Salt, Sugar, Black Pepper", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Melt butter in saucepan, sauté mirepoix until soft.",
      "Add flour and cook roux until deep brown (brown roux).",
      "Stir in tomato paste, then slowly whisk in warm beef stock until free of lumps.",
      "Add bouquet garni and simmer for 10-15 minutes until velvety and glossy.",
      "Season to taste and discard bouquet garni.",
    ],
  },
  {
    id: "sauce-veloute",
    title: "Velouté Mother Sauce",
    cuisine: "French / Classical",
    category: "Mother Sauces",
    pageNumber: 10,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Chicken or Fish Stock", quantity: "500 ml" },
          { name: "Butter", quantity: "1 tbsp" },
          { name: "Flour", quantity: "1 tbsp" },
          { name: "Carrot, Celery, Onion", quantity: "20 g each" },
          { name: "Dried Oregano", quantity: "1 pinch" },
          { name: "Salt & White Pepper", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Sauté vegetables in butter until soft. Whisk in flour to form a blonde roux.",
      "Gradually whisk in white stock. Simmer for 10 minutes until sauce coats the back of a spoon (nappe consistency).",
      "Season with salt and white pepper.",
    ],
  },
  {
    id: "sauce-bechamel",
    title: "Béchamel Mother Sauce (White Sauce)",
    cuisine: "French / Classical",
    category: "Mother Sauces",
    pageNumber: 11,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Flour", quantity: "2 tbsp" },
          { name: "Butter", quantity: "2 tbsp" },
          { name: "Full Fat Milk", quantity: "2 cups (500 ml)" },
          { name: "Salt & White Pepper", quantity: "To taste" },
          { name: "Nutmeg (freshly grated)", quantity: "1 pinch" },
        ],
      },
    ],
    procedure: [
      "Melt butter in saucepan over medium-low heat. Add flour and cook white roux for 2 minutes without browning.",
      "Gradually pour warm milk into the roux while whisking continuously to prevent lumps.",
      "Simmer on low heat until creamy and thickened.",
      "Season with salt, white pepper, and a pinch of ground nutmeg.",
    ],
  },
  {
    id: "sauce-hollandaise",
    title: "Hollandaise Mother Sauce",
    cuisine: "French / Classical",
    category: "Mother Sauces",
    pageNumber: 12,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Egg Yolks", quantity: "4 pcs" },
          { name: "Clarified Butter (melted, warm)", quantity: "4-5 tbsp" },
          { name: "Lemon Juice (fresh)", quantity: "1 tbsp" },
          { name: "Salt & White Pepper", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Whisk egg yolks and lemon juice in a bowl set over a double boiler (bain-marie) at 63°C-70°C.",
      "Slowly drizzle in warm clarified butter in a thin stream while whisking vigorously to create an emulsion.",
      "Whisk until sauce thickens and doubles in volume. Season with salt and white pepper.",
    ],
  },
  {
    id: "sauce-mayo",
    title: "Classical Mayonnaise Mother Sauce",
    cuisine: "Classical Emulsion",
    category: "Mother Sauces",
    pageNumber: 13,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Egg", quantity: "1 pc" },
          { name: "Lemon Juice", quantity: "1 tbsp" },
          { name: "Dijon Mustard", quantity: "1 tsp" },
          { name: "Garlic (finely chopped)", quantity: "1 clove" },
          { name: "Vegetable Oil", quantity: "1 cup (240 ml)" },
          { name: "Salt", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Place egg, lemon juice, Dijon mustard, and garlic into a blender jar.",
      "Blend at low speed until smooth.",
      "With blender running, slowly drizzle vegetable oil drop-by-drop then in a thin stream until emulsified and thick.",
      "Season with salt and chill before serving.",
    ],
  },

  // 3. THAI CUISINE
  {
    id: "thai-thick-soup",
    title: "Thai Thick Seafood Soup",
    cuisine: "Thai",
    category: "Thai Cuisine",
    pageNumber: 5,
    components: [
      {
        componentName: "Soup Base",
        ingredients: [
          { name: "Chicken Stock", quantity: "1 L" },
          { name: "Chicken (cubed)", quantity: "150 g" },
          { name: "Prawns (cleaned)", quantity: "7-8 pcs" },
          { name: "Mushrooms (sliced)", quantity: "2 pcs" },
          { name: "Galangal / Ginger (sliced)", quantity: "2 inch" },
          { name: "Lemongrass (bruised)", quantity: "4 pcs" },
          { name: "Bird's Eye Chili", quantity: "2-3 pcs" },
          { name: "Egg Yolks", quantity: "5 pcs" },
          { name: "Tomato Ketchup & Chili Sauce", quantity: "½ cup each" },
          { name: "Corn Starch", quantity: "2 tbsp" },
          { name: "Butter", quantity: "½ tbsp" },
          { name: "Lemon Juice", quantity: "2 tbsp" },
        ],
      },
    ],
    procedure: [
      "In a small bowl, whisk egg yolks with 2 tbsp ketchup, 2 tbsp chili sauce, and cornstarch.",
      "Bring chicken stock to simmer with lemongrass, galangal, and chilies.",
      "Stir egg-yolk mixture into simmering stock, whisking continuously to thicken.",
      "Add chicken and mushrooms; cook for 1 minute.",
      "Add prawns with lemon juice and remaining sauces. Simmer until prawns turn orange.",
      "Finish with butter and season to taste.",
    ],
  },
  {
    id: "thai-tom-yum",
    title: "Tom Yum Gai with Prawns",
    cuisine: "Thai",
    category: "Thai Cuisine",
    pageNumber: 97,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Chicken (cubed)", quantity: "100 g" },
          { name: "Prawns (deveined)", quantity: "80 g" },
          { name: "Chicken Stock", quantity: "500 ml" },
          { name: "Thai Chili Paste (Nam Prik Pao)", quantity: "2 tbsp" },
          { name: "Lime / Lemon Juice", quantity: "30 ml" },
          { name: "Kaffir Lime Leaves", quantity: "3-4 pcs" },
          { name: "Lemongrass", quantity: "10 g" },
          { name: "Bird's Eye Chili", quantity: "10 g" },
          { name: "Galangal", quantity: "10 g" },
          { name: "Fish Sauce & Salt", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Bring stock to rolling boil. Add bruised lemongrass, galangal, lime leaves, and crushed chilies; boil 3 minutes.",
      "Add chicken and prawns. Simmer gently until chicken is cooked through.",
      "Stir in chili paste until broth turns vibrant orange.",
      "Turn off heat, stir in fresh lime juice and fish sauce, and serve immediately.",
    ],
  },
  {
    id: "thai-pad-thai",
    title: "Authentic Wok-Tossed Pad Thai",
    cuisine: "Thai",
    category: "Thai Cuisine",
    pageNumber: 98,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Pad Thai Rice Noodles (soaked)", quantity: "300 g" },
          { name: "Prawns & Chicken (cubed)", quantity: "100 g each" },
          { name: "Garlic & Onion", quantity: "10 g each" },
          { name: "Capsicum", quantity: "60 g" },
          { name: "Pad Thai Sauce (Chili Sauce, Soy, Palm Sugar)", quantity: "2 tbsp" },
          { name: "Roasted Crushed Peanuts", quantity: "50 g" },
          { name: "Lemongrass & Galangal", quantity: "10 g each" },
        ],
      },
    ],
    procedure: [
      "Soak dry noodles in room-temperature water for 45 minutes until flexible.",
      "Sear chicken and prawns in wok over smoking-hot oil for 1 minute; set aside.",
      "Sauté garlic, onion, and aromatics. Add noodles and pour in sauce.",
      "Toss vigorously to absorb sauce. Return meat and fold in crushed peanuts.",
    ],
  },

  // 4. ITALIAN CUISINE
  {
    id: "italian-lasagna",
    title: "Classic Beef Lasagna Bolognese",
    cuisine: "Italian",
    category: "Italian Cuisine",
    pageNumber: 56,
    components: [
      {
        componentName: "Bolognese Sauce",
        ingredients: [
          { name: "Ground Beef (70:30 lean:fat)", quantity: "300 g" },
          { name: "Olive Oil", quantity: "30 ml" },
          { name: "Onion / Shallot & Garlic", quantity: "60 g onion, 10 g garlic" },
          { name: "Marinara / Tomato Sauce", quantity: "500 g" },
          { name: "Rosemary & Oregano", quantity: "1 pinch each" },
        ],
      },
      {
        componentName: "Lasagna Sheets & Assembly",
        ingredients: [
          { name: "Fresh Lasagna Sheets (parboiled)", quantity: "200 g" },
          { name: "Béchamel White Sauce", quantity: "2 cups" },
          { name: "Mozzarella Cheese (grated)", quantity: "200 g" },
        ],
      },
    ],
    procedure: [
      "Prepare Bolognese: Sauté onion and garlic in olive oil, brown ground beef, add marinara and herbs, simmer 20 minutes.",
      "Coat a glass baking dish with olive oil. Spoon bolognese sauce across bottom.",
      "Layer parboiled pasta sheets, coat with béchamel, and top with bolognese.",
      "Repeat alternating layers, finishing with generous béchamel and shredded mozzarella on top.",
      "Bake at 180°C for 15-20 minutes until bubbly and golden brown on top.",
    ],
  },
  {
    id: "italian-pizza-dough",
    title: "Neapolitan Artisanal Pizza Dough",
    cuisine: "Italian",
    category: "Italian Cuisine",
    pageNumber: 88,
    components: [
      {
        componentName: "Dough",
        ingredients: [
          { name: "High-Gluten White Flour", quantity: "800 g" },
          { name: "Instant / Active Dry Yeast", quantity: "10 g" },
          { name: "Fine Sea Salt", quantity: "20 g" },
          { name: "Extra Virgin Olive Oil", quantity: "30 ml" },
          { name: "Water (lukewarm)", quantity: "400 ml" },
        ],
      },
    ],
    procedure: [
      "Whisk flour and yeast. Add salt separately to prevent killing yeast.",
      "Add water and knead into a cohesive dough. Knead in olive oil until smooth and elastic.",
      "Cover and rest for 20 minutes. Divide into 4 equal dough balls (approx. 250g each).",
      "Proof in olive-oil coated bowls for 1-2 hours until doubled. Hand-stretch into 12-inch rounds.",
    ],
  },

  // 5. CONTINENTAL CUISINE
  {
    id: "cont-beef-wellington",
    title: "Beef Wellington with Mushroom Duxelles",
    cuisine: "Continental",
    category: "Continental Cuisine",
    pageNumber: 28,
    components: [
      {
        componentName: "Components",
        ingredients: [
          { name: "Center-cut Sirloin / Tenderloin", quantity: "250 g" },
          { name: "Bacon Slices (thinly sliced)", quantity: "80 g" },
          { name: "Mushrooms (minced duxelles)", quantity: "80 g" },
          { name: "Fresh Spinach Leaves", quantity: "100 g" },
          { name: "Dijon Mustard", quantity: "1 tbsp" },
          { name: "Laminated Puff Pastry Sheet", quantity: "1 sheet" },
          { name: "Egg Wash", quantity: "1 egg beaten" },
        ],
      },
    ],
    procedure: [
      "Tie beef, sear rapidly on high heat until browned outside (raw center). Brush generously with Dijon mustard.",
      "Sauté minced mushrooms, garlic, and onions until all moisture evaporates (duxelles).",
      "Blanch spinach and squeeze completely dry.",
      "Lay plastic wrap, arrange bacon, layer spinach and mushroom duxelles, place beef, and roll tightly into a cylinder. Chill 30 minutes.",
      "Roll puff pastry, wrap around chilled beef parcel, seal edges, brush with egg wash, and score decoratively.",
      "Bake at 180°C until internal temperature reaches 54°C (Medium-Rare). Rest 10 minutes before carving.",
    ],
  },
  {
    id: "cont-salmon-lemon",
    title: "Pan-Seared Salmon with Lemon-Butter Sauce",
    cuisine: "Continental",
    category: "Continental Cuisine",
    pageNumber: 19,
    components: [
      {
        componentName: "Salmon & Sauce",
        ingredients: [
          { name: "Salmon Fillet (skin-on)", quantity: "200 g" },
          { name: "Fresh Lemon Juice", quantity: "30 ml" },
          { name: "Mustard Paste", quantity: "1 tsp" },
          { name: "Garlic (minced)", quantity: "10 g" },
          { name: "Butter & Flour", quantity: "1 tbsp each" },
          { name: "Milk", quantity: "200 ml" },
        ],
      },
    ],
    procedure: [
      "Marinate salmon with salt and mustard paste for 15 minutes.",
      "Sear skin-side down in hot oil for 4-5 minutes until crispy. Flip and cook 3 minutes; rest on serving plate.",
      "Make sauce: Melt butter, whisk in flour, pour in milk to make light velouté, stir in lemon juice, salt, and white pepper.",
      "Spoon velvety lemon-butter sauce alongside salmon.",
    ],
  },

  // 6. INDIAN CUISINE
  {
    id: "ind-dum-biryani",
    title: "Royal Daam Pukht Mutton Biryani",
    cuisine: "Indian / Mughlai",
    category: "Indian Cuisine",
    pageNumber: 58,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Mutton (bone-in)", quantity: "1 kg" },
          { name: "Basmati Rice (aged)", quantity: "1 kg" },
          { name: "Fried Onions (Beresta)", quantity: "80 g" },
          { name: "Ginger & Garlic Paste", quantity: "2 tbsp each" },
          { name: "Garam Masala & Biryani Spices", quantity: "1 tsp each" },
          { name: "Plain Yogurt", quantity: "1 tbsp" },
          { name: "Pure Ghee", quantity: "2 tbsp" },
          { name: "Flour Dough (for airtight lid seal)", quantity: "As required" },
        ],
      },
    ],
    procedure: [
      "Marinate mutton with ginger-garlic paste, yogurt, powdered spices, half beresta, and ghee for at least 2 hours.",
      "Boil basmati rice with whole spices until 70% cooked. Drain and cool.",
      "Layer marinated meat in heavy pot, top with fried onions and parboiled rice, drizzle ghee.",
      "Roll dough rope, seal pot lid completely airtight.",
      "Place on high heat on a hot tawa for 5 minutes, then reduce to lowest heat to cook on dum for 45-60 minutes.",
      "Rest 15 minutes before gently folding rice with flat spoon.",
    ],
  },
  {
    id: "ind-butter-chicken",
    title: "Authentic Murgh Makhani (Butter Chicken)",
    cuisine: "Indian",
    category: "Indian Cuisine",
    pageNumber: 61,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Chicken (cubed, marinated & seared)", quantity: "200 g" },
          { name: "Tomato Puree", quantity: "100 g" },
          { name: "Cashew Nut Puree", quantity: "30 g" },
          { name: "Ginger & Garlic", quantity: "10 g each" },
          { name: "Cooking Cream", quantity: "1 tbsp" },
          { name: "Kasuri Methi (dried fenugreek)", quantity: "1 tsp" },
          { name: "Shahi Jeera & Garam Masala", quantity: "1 tsp each" },
        ],
      },
    ],
    procedure: [
      "Sear yogurt-marinated chicken until charred; set aside.",
      "Sauté onions, ginger, and garlic in oil. Add tomato puree and cashew nut paste; simmer 10 minutes.",
      "Whisk in cream on low heat to create silky makhani gravy.",
      "Fold in seared chicken, crush kasuri methi between palms and sprinkle over curry. Simmer 3 minutes.",
    ],
  },

  // 7. JAPANESE CUISINE
  {
    id: "jap-teriyaki",
    title: "Glazed Chicken Teriyaki",
    cuisine: "Japanese",
    category: "Japanese Cuisine",
    pageNumber: 63,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Chicken Thigh / Breast (skin-on)", quantity: "300 g" },
          { name: "Light Soy Sauce", quantity: "30 ml" },
          { name: "Mirin", quantity: "1 tbsp" },
          { name: "Oyster Sauce", quantity: "1 tbsp" },
          { name: "Brown Sugar", quantity: "1 tbsp" },
          { name: "Sesame Oil", quantity: "1 tsp" },
          { name: "Ginger & Garlic", quantity: "5 g each" },
        ],
      },
    ],
    procedure: [
      "Whisk soy sauce, mirin, brown sugar, garlic, and ginger until sugar dissolves.",
      "Sear chicken skin-side down in hot grill pan for 2 minutes until browned.",
      "Flip and brush repeatedly with teriyaki glaze while cooking until glossy and caramelized.",
      "Drizzle with toasted sesame oil and slice into strips.",
    ],
  },
  {
    id: "jap-california-roll",
    title: "Classic California Uramaki Sushi Roll",
    cuisine: "Japanese",
    category: "Japanese Cuisine",
    pageNumber: 69,
    components: [
      {
        componentName: "Sushi Ingredients",
        ingredients: [
          { name: "Sushi Rice (seasoned with rice vinegar)", quantity: "1 cup cooked" },
          { name: "Nori Sheet (halved)", quantity: "1 pc" },
          { name: "Avocado (thinly sliced)", quantity: "½ pc" },
          { name: "Cucumber & Carrot (julienned)", quantity: "30 g each" },
          { name: "Toasted Sesame Seeds", quantity: "1 tbsp" },
        ],
      },
    ],
    procedure: [
      "Spread seasoned sushi rice across nori sheet on bamboo mat. Sprinkle sesame seeds.",
      "Flip nori over so rice faces down onto plastic wrap.",
      "Place avocado slices and julienned vegetables horizontally across center.",
      "Roll forward firmly with bamboo mat to form tight cylinder.",
      "Slice into 8 clean rounds using a wet sharp chef's knife.",
    ],
  },

  // 8. CHINESE CUISINE
  {
    id: "chn-kung-pao",
    title: "Sichuan Kung Pao Chicken",
    cuisine: "Chinese",
    category: "Chinese Cuisine",
    pageNumber: 72,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Chicken (cubed)", quantity: "200 g" },
          { name: "Roasted Peanuts", quantity: "50 g" },
          { name: "Dry Red Chilies (sliced)", quantity: "15 g" },
          { name: "Scallions / Green Onions", quantity: "30 g" },
          { name: "Light & Dark Soy Sauce", quantity: "1 tbsp each" },
          { name: "Sesame Oil & Brown Sugar", quantity: "1 tbsp each" },
        ],
      },
    ],
    procedure: [
      "Toss chicken with light soy and cornstarch; marinate 20 minutes.",
      "Sear chicken in smoking wok for 1 minute; push to side.",
      "Sauté dried chilies, garlic, and scallions in center until fragrant.",
      "Pour in dark soy and sugar sauce; toss over high heat until bubbly and glazed.",
      "Fold in roasted peanuts and butter before serving.",
    ],
  },
  {
    id: "chn-dumplings",
    title: "Handcrafted Steamed Chicken Dumplings",
    cuisine: "Chinese",
    category: "Chinese Cuisine",
    pageNumber: 75,
    components: [
      {
        componentName: "Wrapper & Filling",
        ingredients: [
          { name: "Flour & Cornflour", quantity: "100 g flour, 50 g cornflour" },
          { name: "Minced Chicken", quantity: "80 g" },
          { name: "Finely Chopped Onion & Garlic", quantity: "20 g onion, 10 g garlic" },
          { name: "Dried Red Chili & Salt", quantity: "To taste" },
        ],
      },
    ],
    procedure: [
      "Mix minced chicken with aromatics and seasonings.",
      "Knead flour and water into smooth dough; divide and roll into thin circular wrappers.",
      "Place 1 tbsp filling in center, moisten edges with water.",
      "Fold in half and create 3-4 crescent pleats on one side, pressing against flat back.",
      "Steam in bamboo steamer over boiling water for 12-15 minutes.",
    ],
  },

  // 9. MEXICAN CUISINE
  {
    id: "mex-chimichanga",
    title: "Golden Crispy Chicken Chimichangas",
    cuisine: "Mexican",
    category: "Mexican Cuisine",
    pageNumber: 103,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Shredded Spiced Chicken", quantity: "150 g" },
          { name: "Kidney Beans & Sweet Corn", quantity: "80 g beans, 50 g corn" },
          { name: "Green Chilies & Chili Sauce", quantity: "10 g chili, 2 tbsp sauce" },
          { name: "Mexican Spice Mix (cumin, oregano, paprika)", quantity: "1 tsp" },
          { name: "Large Flour Tortillas", quantity: "As required" },
        ],
      },
    ],
    procedure: [
      "Mix shredded chicken with kidney beans, corn, chilies, and Mexican spice mix.",
      "Place filling in center of tortilla, fold sides in, and roll into a tightly sealed rectangular parcel.",
      "Seal seam with flour-water slurry paste.",
      "Deep-fry seam-side down in 180°C oil for 2-3 minutes until deep golden-brown and crispy.",
      "Drain on wire rack and serve with salsa and guacamole.",
    ],
  },

  // 10. TURKISH CUISINE
  {
    id: "turk-pide",
    title: "Traditional Turkish Pide Boat Flatbread",
    cuisine: "Turkish",
    category: "Turkish Cuisine",
    pageNumber: 80,
    components: [
      {
        componentName: "Dough & Topping",
        ingredients: [
          { name: "Bread Flour & Yeast", quantity: "200 g flour, 5 g yeast" },
          { name: "Minced Chicken / Lamb", quantity: "120 g" },
          { name: "Turkish Spice Mix & Paprika", quantity: "1 tsp each" },
          { name: "Fresh Mint & Green Chili", quantity: "5 g each" },
        ],
      },
    ],
    procedure: [
      "Knead flour, yeast, and water for 8 minutes; proof 1 hour until doubled.",
      "Knead minced meat with spices, mint, and chilies.",
      "Roll dough into long 30cm oval. Spread spiced meat leaving a 2cm border.",
      "Fold edges inward and pinch ends tightly into pointed bow and stern to form traditional boat shape.",
      "Bake in 230°C hot oven for 12-15 minutes until crust is browned and crisp.",
    ],
  },

  // 11. BAKING & PASTRY
  {
    id: "bake-focaccia",
    title: "Artisanal Rosemary & Sea Salt Italian Focaccia",
    cuisine: "Italian Baking",
    category: "Baking Recipes",
    pageNumber: 130,
    components: [
      {
        componentName: "Dough & Topping",
        ingredients: [
          { name: "Bread Flour", quantity: "1 kg" },
          { name: "Instant Yeast", quantity: "15 g" },
          { name: "Cold Water", quantity: "550 ml" },
          { name: "Fine Sea Salt", quantity: "10 g" },
          { name: "Extra Virgin Olive Oil", quantity: "60 ml for dough + topping" },
          { name: "Fresh Rosemary, Garlic, Cherry Tomatoes, Flaky Sea Salt", quantity: "As required" },
        ],
      },
    ],
    procedure: [
      "Mix flour, yeast, salt, water, and olive oil into a wet, hydrated dough.",
      "Rest covered for 1.5 hours until bubbly and airy.",
      "Transfer to oiled baking tray. Dimple surface deeply with oiled fingertips to create pockets.",
      "Top with rosemary sprigs, halved cherry tomatoes, and flaky sea salt.",
      "Bake at 220°C for 20-25 minutes until golden brown and crusty.",
    ],
  },
  {
    id: "pastry-puff",
    title: "Classical Laminated Puff Pastry (Feuilletage)",
    cuisine: "French Pastry",
    category: "Pastry Recipes",
    pageNumber: 134,
    components: [
      {
        componentName: "Détrempe & Butter Block",
        ingredients: [
          { name: "All-Purpose Flour", quantity: "500 g" },
          { name: "Ice-Cold Water", quantity: "250 ml" },
          { name: "Fine Salt", quantity: "10 g" },
          { name: "European High-Fat Butter (Beurre de Tourage)", quantity: "350 g" },
        ],
      },
    ],
    procedure: [
      "Make détrempe dough with flour, salt, and water. Shape into flat square; chill 1 hour.",
      "Pound cold butter block into a 15cm pliable square.",
      "Roll dough into 25cm square, place butter block diagonally, fold corners like an envelope to encase butter.",
      "Roll into 45cm rectangle, fold in thirds like a letter (1st Single Turn). Rotate 90 degrees.",
      "Perform a total of 6 Single Turns, resting in chiller for 30 minutes every 2 turns.",
      "Chill overnight before rolling and baking.",
    ],
  },

  // 12. DESSERT RECIPES
  {
    id: "dessert-tiramisu",
    title: "Authentic Venetian Tiramisù",
    cuisine: "Italian Dessert",
    category: "Dessert Recipes",
    pageNumber: 46,
    components: [
      {
        componentName: "Ingredients",
        ingredients: [
          { name: "Savoiardi Ladyfingers", quantity: "200 g" },
          { name: "Mascarpone Cheese", quantity: "250 g" },
          { name: "Whipping Cream (35% fat)", quantity: "250 ml" },
          { name: "Granulated Sugar", quantity: "100 g" },
          { name: "Strong Espresso (chilled)", quantity: "240 ml" },
          { name: "Dutch-Processed Cocoa Powder", quantity: "As required" },
          { name: "Vanilla Extract", quantity: "1 tsp" },
        ],
      },
    ],
    procedure: [
      "Whisk mascarpone cheese, sugar, and vanilla until smooth.",
      "Whip heavy cream to medium-stiff peaks; gently fold into mascarpone in 3 batches.",
      "Quickly dip ladyfingers into chilled espresso for 1 second each.",
      "Arrange single layer of soaked ladyfingers in dish, spread half mascarpone cream, repeat second layer.",
      "Refrigerate for at least 6 hours (preferably overnight).",
      "Dust generously with unsweetened cocoa powder through a fine sieve before slicing.",
    ],
  },
  {
    id: "dessert-creme-brulee",
    title: "Vanilla Bean Crème Brûlée",
    cuisine: "French Dessert",
    category: "Dessert Recipes",
    pageNumber: 52,
    components: [
      {
        componentName: "Custard & Crust",
        ingredients: [
          { name: "Heavy Cream (35% fat)", quantity: "500 ml" },
          { name: "Egg Yolks", quantity: "6 pcs" },
          { name: "Granulated Sugar (for custard)", quantity: "50 g" },
          { name: "Vanilla Bean (split and scraped)", quantity: "1 pod" },
          { name: "Granulated Sugar (for caramelized crust)", quantity: "3-4 tbsp" },
        ],
      },
    ],
    procedure: [
      "Simmer heavy cream with split vanilla bean and seeds. Rest 5 minutes.",
      "Whisk egg yolks with 50g sugar until pale.",
      "Slowly temper warm cream into yolks; strain through fine sieve.",
      "Divide into ramekins, place in water bath (bain-marie) filled halfway with boiling water.",
      "Bake at 150°C for 30-35 minutes until edges set with slight center jiggle. Chill 4 hours.",
      "Sprinkle thin layer of sugar over chilled custard and caramelize with blowtorch until deep amber.",
    ],
  },
];
