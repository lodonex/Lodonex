import React, { useState } from "react";
import { Search, Clock, Utensils, Plus, Trash, Check, X, BookOpen, ChefHat, Heart, Sparkles } from "lucide-react";
import { Language, Recipe, StudentProgress } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";

interface RecipeManagerProps {
  lang: Language;
  progress: StudentProgress;
  onAddCustomRecipe: (recipe: Recipe) => void;
  onDeleteCustomRecipe: (recipeId: string) => void;
  defaultRecipes: Recipe[];
}

export default function RecipeManager({
  lang,
  progress,
  onAddCustomRecipe,
  onDeleteCustomRecipe,
  defaultRecipes,
}: RecipeManagerProps) {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"all" | "academy" | "custom">("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Custom recipe form state
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [catEn, setCatEn] = useState("");
  const [catBn, setCatBn] = useState("");
  const [prep, setPrep] = useState("");
  const [cook, setCook] = useState("");
  const [servings, setServings] = useState(2);
  const [image, setImage] = useState("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"); // default healthy plate

  const [ingredientsEn, setIngredientsEn] = useState<string[]>([]);
  const [ingredientsBn, setIngredientsBn] = useState<string[]>([]);
  const [stepsEn, setStepsEn] = useState<string[]>([]);
  const [stepsBn, setStepsBn] = useState<string[]>([]);

  const [newIngEn, setNewIngEn] = useState("");
  const [newIngBn, setNewIngBn] = useState("");
  const [newStepEn, setNewStepEn] = useState("");
  const [newStepBn, setNewStepBn] = useState("");

  const allRecipes = [...defaultRecipes, ...progress.customRecipes];

  // Filtering
  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.titleBn.includes(searchQuery) ||
      recipe.categoryEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.categoryBn.includes(searchQuery);

    const isCustom = recipe.isCustom;
    if (activeFilter === "academy" && isCustom) return false;
    if (activeFilter === "custom" && !isCustom) return false;

    return matchesSearch;
  });

  // Dynamic adds
  const handleAddIngredient = () => {
    if (newIngEn.trim() && newIngBn.trim()) {
      setIngredientsEn([...ingredientsEn, newIngEn.trim()]);
      setIngredientsBn([...ingredientsBn, newIngBn.trim()]);
      setNewIngEn("");
      setNewIngBn("");
    }
  };

  const handleAddStep = () => {
    if (newStepEn.trim() && newStepBn.trim()) {
      setStepsEn([...stepsEn, newStepEn.trim()]);
      setStepsBn([...stepsBn, newStepBn.trim()]);
      setNewStepEn("");
      setNewStepBn("");
    }
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleBn.trim() || ingredientsEn.length === 0 || stepsEn.length === 0) return;

    const newRecipe: Recipe = {
      id: `custom-rec-${Date.now()}`,
      titleEn: titleEn.trim(),
      titleBn: titleBn.trim(),
      categoryEn: catEn.trim() || "Student Creation",
      categoryBn: catBn.trim() || "শিক্ষার্থীর রান্না",
      prepTime: prep.trim() || "15 min",
      cookTime: cook.trim() || "15 min",
      servings: servings,
      ingredientsEn,
      ingredientsBn,
      stepsEn,
      stepsBn,
      image,
      isCustom: true,
    };

    onAddCustomRecipe(newRecipe);

    // Reset Form
    setTitleEn("");
    setTitleBn("");
    setCatEn("");
    setCatBn("");
    setPrep("");
    setCook("");
    setServings(2);
    setIngredientsEn([]);
    setIngredientsBn([]);
    setStepsEn([]);
    setStepsBn([]);
    setIsCreating(false);
  };

  return (
    <div id="recipe-journal" className="space-y-6 py-6">
      {/* Title Header with Clean Borders */}
      <div id="recipe-header" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border text-left">
        <div className="text-left">
          <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-extrabold text-slate-400 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-editorial-accent" />
            {t.recipeJournal}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            {lang === "en"
              ? "Browse verified recipe formulations or write and persist your own creative culinary formulas."
              : "ভেরিফাইড রেসিপি ফর্মুলা ব্রাউজ করুন অথবা আপনার নিজস্ব সৃজনশীল রন্ধন ফর্মুলা লিখুন ও সংরক্ষণ করুন।"}
          </p>
        </div>

        <button
          id="open-create-recipe-btn"
          onClick={() => setIsCreating(true)}
          className="px-5 py-3 bg-[#1A1A1A] hover:bg-slate-850 text-white rounded-none text-xs font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-editorial-accent" />
          {t.addNewRecipe}
        </button>
      </div>

      {/* Main Area */}
      {!isCreating ? (
        <>
          {/* Controls Bar */}
          <div
            id="recipe-controls"
            className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-none border border-editorial-border"
          >
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="recipe-search"
                type="text"
                placeholder={t.searchRecipes}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:border-editorial-dark text-slate-950 font-sans"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: "all", label: lang === "en" ? "All Recipes" : "সব রেসিপি" },
                { id: "academy", label: lang === "en" ? "Academy Directives" : "একাডেমি নির্দেশিকা" },
                { id: "custom", label: lang === "en" ? "My Innovations" : "আমার উদ্ভাবন" },
              ].map((filt) => (
                <button
                  key={filt.id}
                  id={`recipe-filter-${filt.id}`}
                  onClick={() => setActiveFilter(filt.id as any)}
                  className={`px-4 py-2 rounded-none text-xs font-bold transition uppercase tracking-wider border whitespace-nowrap cursor-pointer ${
                    activeFilter === filt.id
                      ? "bg-[#1A1A1A] text-white border-editorial-dark"
                      : "bg-white text-slate-500 border-editorial-border hover:bg-[#F7F5F0] hover:text-editorial-dark"
                  }`}
                >
                  {filt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Cards Grid */}
          {filteredRecipes.length === 0 ? (
            <div id="recipe-empty" className="text-center py-12 rounded-none border border-dashed border-editorial-border bg-white font-sans w-full">
              <ChefHat className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-xs sm:text-sm text-slate-500">{t.noCustomRecipes}</p>
            </div>
          ) : (
            <div id="recipe-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  id={`recipe-card-${recipe.id}`}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="cursor-pointer overflow-hidden rounded-none border border-editorial-border bg-white shadow-xs flex flex-col justify-between hover:border-editorial-dark transition-colors text-left"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-editorial-border">
                    <img
                      src={recipe.image}
                      alt={recipe.titleEn}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102 font-sans"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#FDFCF9]/95 border border-editorial-border text-[9px] font-sans font-bold text-editorial-dark uppercase tracking-wider">
                      {lang === "en" ? recipe.categoryEn : recipe.categoryBn}
                    </div>
                    {recipe.isCustom && (
                      <div className="absolute top-2 right-2 bg-editorial-accent text-white border border-red-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {t.studentCreation}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <h3 className="font-serif font-bold text-base text-editorial-dark leading-tight hover:text-editorial-accent transition-colors">
                      {lang === "en" ? recipe.titleEn : recipe.titleBn}
                    </h3>

                    <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-editorial-border font-sans font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-editorial-accent" />
                        {recipe.prepTime} Prep
                      </span>
                      <span className="flex items-center gap-1">
                        <Utensils className="h-3.5 w-3.5 text-editorial-accent" />
                        {recipe.servings} Servings
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Create Custom Recipe Multi-field Form */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          id="create-recipe-form-card"
          className="bg-white rounded-none border border-editorial-border p-5 sm:p-8 shadow-xs text-left"
        >
          <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-6">
            <h3 className="font-serif font-bold text-lg text-editorial-dark flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-editorial-accent animate-pulse" />
              {t.addNewRecipe}
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1.5 border border-editorial-border bg-[#F7F5F0] text-slate-500 hover:text-editorial-dark hover:bg-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSaveRecipe} className="space-y-6">
            {/* Title Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.recipeTitleEn} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Chef Beef Bhuna"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:bg-white text-slate-950 font-sans"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.recipeTitleBn} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঐতিহ্যবাহী গরুর ভুনা মাংস"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:bg-white text-slate-950 font-sans"
                />
              </div>
            </div>

            {/* Category and Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.categoryEn}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Curry"
                  value={catEn}
                  onChange={(e) => setCatEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:bg-white text-slate-950"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.categoryBn}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঐতিহ্যবাহী কারি"
                  value={catBn}
                  onChange={(e) => setCatBn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:bg-white text-slate-950"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.prepTime}
                </label>
                <input
                  type="text"
                  placeholder="15 min"
                  value={prep}
                  onChange={(e) => setPrep(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:bg-white text-slate-950"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {t.servings}
                </label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-editorial-border rounded-none focus:outline-none focus:bg-white text-slate-950"
                />
              </div>
            </div>

            {/* Custom Picture Pickers */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                {lang === "en" ? "Select Culinary Visual Theme" : "রন্ধনসম্পর্কীয় ছবি থিম নির্বাচন করুন"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: "curry", name: "Bengali Curry", url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80" },
                  { id: "cake", name: "Baking Dessert", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
                  { id: "salmon", name: "Continental Salmon", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
                  { id: "dumpling", name: "Chinese Dumplings", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80" }
                ].map((pImg) => (
                  <button
                    key={pImg.id}
                    type="button"
                    onClick={() => setImage(pImg.url)}
                    className={`p-1.5 rounded-none border text-left overflow-hidden transition relative cursor-pointer ${
                      image === pImg.url ? "border-[#1A1A1A] bg-[#F7F5F0]" : "border-editorial-border bg-white"
                    }`}
                  >
                    <img src={pImg.url} alt={pImg.name} className="h-16 w-full object-cover rounded-none" />
                    <span className="text-[10px] font-bold text-slate-600 mt-1.5 block truncate font-sans uppercase tracking-wider">{pImg.name}</span>
                    {image === pImg.url && (
                      <div className="absolute top-2 right-2 bg-[#1A1A1A] border border-editorial-border text-white p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Ingredient Builder */}
            <div className="p-5 bg-[#F7F5F0] rounded-none border border-editorial-border space-y-4">
              <h4 className="font-serif font-bold text-editorial-dark text-sm italic">
                {t.ingredients} ({ingredientsEn.length} added)
              </h4>

              {ingredientsEn.length > 0 && (
                <ul className="text-xs space-y-2 list-disc pl-5 max-h-[120px] overflow-y-auto font-sans">
                  {ingredientsEn.map((ing, idx) => (
                    <li key={idx} className="text-slate-700">
                      <span className="font-bold text-editorial-dark">{ing}</span> — <span className="text-slate-500">{ingredientsBn[idx]}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ingredient in English (e.g. 2 tbsp Salt)"
                  value={newIngEn}
                  onChange={(e) => setNewIngEn(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-editorial-border rounded-none focus:outline-none text-slate-950 font-sans"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="উপাদান বাংলায় (যেমন: ২ চামচ লবণ)"
                    value={newIngBn}
                    onChange={(e) => setNewIngBn(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-editorial-border rounded-none focus:outline-none text-slate-950 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-slate-800 text-white rounded-none transition cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Steps Builder */}
            <div className="p-5 bg-[#F7F5F0] rounded-none border border-editorial-border space-y-4 font-sans">
              <h4 className="font-serif font-bold text-editorial-dark text-sm italic">
                {t.prepSteps} ({stepsEn.length} added)
              </h4>

              {stepsEn.length > 0 && (
                <ol className="text-xs space-y-3 list-decimal pl-5 max-h-[140px] overflow-y-auto">
                  {stepsEn.map((step, idx) => (
                    <li key={idx} className="text-[#1A1A1A]">
                      <div className="font-bold text-editorial-dark">{step}</div>
                      <div className="text-slate-500 mt-0.5">{stepsBn[idx]}</div>
                    </li>
                  ))}
                </ol>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Step in English (e.g. Sift the flour twice)"
                  value={newStepEn}
                  onChange={(e) => setNewStepEn(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-editorial-border rounded-none focus:outline-none text-slate-950 font-sans"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ধাপ বাংলায় (যেমন: ময়দা দুইবার চালুন)"
                    value={newStepBn}
                    onChange={(e) => setNewStepBn(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-editorial-border rounded-none focus:outline-none text-slate-950 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-slate-800 text-white rounded-none transition cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-editorial-border">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-3 text-xs font-bold uppercase tracking-widest bg-white border border-editorial-border text-slate-600 hover:bg-[#F7F5F0] rounded-none transition cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                id="submit-new-recipe-btn"
                disabled={!titleEn.trim() || !titleBn.trim() || ingredientsEn.length === 0 || stepsEn.length === 0}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-[#1A1A1A] hover:bg-slate-800 text-white rounded-none shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {t.saveRecipe}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Recipe Detail Modal overlay with Editorial Journal Aesthetic */}
      <AnimatePresence>
        {selectedRecipe && (
          <div
            id="recipe-detail-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white border border-editorial-dark rounded-none overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-left"
            >
              {/* Cover Image */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden flex-shrink-0 border-b border-editorial-border">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.titleEn}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 h-8 w-8 bg-[#1A1A1A] text-white hover:text-editorial-accent rounded-none border border-editorial-border flex items-center justify-center transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/95 border border-editorial-border px-3 py-1 rounded-none">
                  <span className="text-[10px] uppercase font-bold text-editorial-accent tracking-widest font-sans">
                    {lang === "en" ? selectedRecipe.categoryEn : selectedRecipe.categoryBn}
                  </span>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 bg-[#FDFCF9]">
                <div>
                  <h3 className="text-xl sm:text-3xl font-serif font-bold text-editorial-dark leading-tight italic">
                    {lang === "en" ? selectedRecipe.titleEn : selectedRecipe.titleBn}
                  </h3>
                  {selectedRecipe.isCustom && (
                    <span className="inline-flex items-center gap-1.5 bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 px-2.5 py-0.5 rounded-none text-[9px] font-bold uppercase tracking-widest mt-3">
                      <Sparkles className="h-3 w-3" />
                      {t.studentCreation}
                    </span>
                  )}
                </div>

                {/* Quick Info bar */}
                <div className="grid grid-cols-3 gap-1 bg-[#F7F5F0] border border-editorial-border p-4 rounded-none text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-sans">{lang === "en" ? "Prep Time" : "প্রস্তুতির সময়"}</span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-editorial-dark">{selectedRecipe.prepTime}</span>
                  </div>
                  <div className="border-x border-editorial-border">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-sans">{lang === "en" ? "Cook Time" : "রান্নার সময়"}</span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-editorial-dark">{selectedRecipe.cookTime}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider font-sans">{lang === "en" ? "Servings" : "পরিবেশন"}</span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-editorial-dark">{selectedRecipe.servings} Servings</span>
                  </div>
                </div>

                {/* Ingredients Column */}
                <div className="space-y-3">
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-400 uppercase tracking-[0.2em]">
                    {t.ingredients}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm list-inside list-disc text-slate-700 font-sans border-t border-editorial-border pt-3">
                    {(lang === "en" ? selectedRecipe.ingredientsEn : selectedRecipe.ingredientsBn).map((ing, idx) => (
                      <li key={idx} className="leading-relaxed font-semibold text-editorial-dark">
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps Column */}
                <div className="space-y-4">
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-400 uppercase tracking-[0.2em]">
                    {t.prepSteps}
                  </h4>
                  <ol className="space-y-4 text-xs sm:text-sm border-t border-editorial-border pt-4 font-sans">
                    {(lang === "en" ? selectedRecipe.stepsEn : selectedRecipe.stepsBn).map((step, idx) => (
                      <li key={idx} className="flex gap-4 items-start leading-relaxed text-slate-700">
                        <span className="font-serif font-bold text-xs text-white bg-editorial-accent h-6 w-6 flex items-center justify-center flex-shrink-0 rounded-none border border-red-700">
                          {idx + 1}
                        </span>
                        <p className="text-slate-800 pt-0.5 font-medium">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 sm:px-6 border-t border-editorial-border flex justify-between bg-[#F7F5F0] flex-shrink-0">
                {selectedRecipe.isCustom ? (
                  <button
                    id={`delete-recipe-btn-${selectedRecipe.id}`}
                    onClick={() => {
                      onDeleteCustomRecipe(selectedRecipe.id);
                      setSelectedRecipe(null);
                    }}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-editorial-accent hover:bg-red-50 hover:text-white rounded-none border border-editorial-accent/30 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                    {lang === "en" ? "Delete Innovation" : "রেসিপিটি মুছুন"}
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  id="close-recipe-modal-btn"
                  onClick={() => setSelectedRecipe(null)}
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-none transition cursor-pointer"
                >
                  {lang === "en" ? "Close Journal" : "বন্ধ করুন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
