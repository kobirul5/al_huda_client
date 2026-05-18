"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Award, 
  Send, 
  Copy, 
  Check, 
  HelpCircle, 
  Loader2, 
  Languages,
  BookMarked,
  ArrowRight,
  History,
  Trash2,
  Cpu,
  BookOpenCheck,
  RefreshCw,
  Share2,
  Scale,
  MessageSquare,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface IReference {
  type: "quran" | "hadith";
  title: string;
  reference: string;
  text: string;
  explanation: string;
}

interface IAISuggestionResponse {
  prompt: string;
  suggestion: string;
  references: IReference[];
  category: string;
  createdAt: string;
}

const SUGGESTED_PROMPTS = [
  {
    icon: Compass,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    title: { en: "Caring for Parents", bn: "পিতামাতার যত্ন নেওয়া" },
    prompt: { 
      en: "What does Islam teach about taking care of parents?", 
      bn: "পিতামাতার যত্ন নেওয়ার ব্যাপারে ইসলাম কী শিক্ষা দেয়?" 
    }
  },
  {
    icon: BookOpen,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    title: { en: "Patience & Hardship", bn: "ধৈর্য ও বিপদ-আপদ" },
    prompt: { 
      en: "What is the reward and status of patience (Sabr) in times of hardship?", 
      bn: "বিপদ-আপদের সময় ধৈর্যের (সবর) গুরুত্ব এবং প্রতিদান কী?" 
    }
  },
  {
    icon: Award,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    title: { en: "Rights of Neighbors", bn: "প্রতিবেশীর অধিকার" },
    prompt: { 
      en: "What are the rights and duties towards neighbors in Islamic teachings?", 
      bn: "ইসলামের দৃষ্টিতে প্রতিবেশীর অধিকার এবং আমাদের দায়িত্ব কী কী?" 
    }
  }
];

const LOADING_STEPS = [
  { en: "Initiating Al-Huda AI Engine...", bn: "আল-হুদা এআই ইঞ্জিন চালু হচ্ছে..." },
  { en: "Analyzing query in context of Shariah...", bn: "শরীয়াহর আলোকে প্রশ্নটি বিশ্লেষণ করা হচ্ছে..." },
  { en: "Searching Quranic Verses database...", bn: "কুরআনের আয়াত অনুসন্ধান করা হচ্ছে..." },
  { en: "Searching Prophetic Hadith records...", bn: "রাসূলুল্লাহর (সা.) হাদিস রেকর্ড অনুসন্ধান করা হচ্ছে..." },
  { en: "Synthesizing authentic references & explanation...", bn: "প্রামাণিক রেফারেন্স ও ব্যাখ্যা সমন্বয় করা হচ্ছে..." },
];

export default function AskAlHudaPage() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState<"general" | "quran" | "hadith">("general");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<IAISuggestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [referenceFilter, setReferenceFilter] = useState<"all" | "quran" | "hadith">("all");

  // Load history from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("alhuda_ai_history");
      if (stored) {
        try {
          setSearchHistory(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    }
  }, []);

  // Cycle loading steps
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const saveToHistory = (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    const updated = [newPrompt, ...searchHistory.filter(p => p !== newPrompt)].slice(0, 5);
    setSearchHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("alhuda_ai_history", JSON.stringify(updated));
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, itemToDelete: string) => {
    e.stopPropagation(); // Avoid triggering search
    const updated = searchHistory.filter(p => p !== itemToDelete);
    setSearchHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("alhuda_ai_history", JSON.stringify(updated));
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("alhuda_ai_history");
    }
  };

  const handleAsk = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    
    const queryPrompt = customPrompt || prompt;
    if (!queryPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    try {
      const response = await fetch(`${apiUrl}/ai/suggestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: queryPrompt,
          category,
          language
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to retrieve guidance from OpenRouter.");
      }

      setResult(data.data);
      saveToHistory(queryPrompt);
    } catch (err: any) {
      console.error("AI Request error:", err);
      setError(err.message || "Something went wrong. Please check your connection or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFullGuide = () => {
    if (!result) return;
    
    let fullText = `### Islamic Guidance: ${result.prompt}\n\n${result.suggestion}\n\n`;
    if (result.references && result.references.length > 0) {
      fullText += `### Sources & References:\n\n`;
      result.references.forEach((ref, idx) => {
        fullText += `${idx + 1}. [${ref.type.toUpperCase()}] ${ref.title} (${ref.reference})\n`;
        fullText += `"${ref.text}"\n`;
        fullText += `Explanation: ${ref.explanation}\n\n`;
      });
    }
    
    navigator.clipboard.writeText(fullText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleReset = () => {
    setPrompt("");
    setResult(null);
    setError(null);
  };

  // Filter references based on tab selector
  const filteredReferences = result?.references?.filter(ref => {
    if (referenceFilter === "all") return true;
    return ref.type === referenceFilter;
  }) || [];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      {/* Decorative World-Class Background Grids & Blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] -z-10" />

      {/* Decorative Premium Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] -z-10 animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[200px] -z-10 animate-pulse" style={{ animationDuration: "16s" }} />

      {/* Main Grid Workspace */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel (Control Center) - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Focus category panel */}
            <div className="bg-card/75 border border-border rounded-2xl p-6 shadow-xl shadow-black/5 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mr-4 -mt-4 transition-transform duration-700 group-hover:scale-150" />
              
              {/* Language Selection */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border/50 relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-primary" />
                  <span>{language === "en" ? "Response Language" : "উত্তরের ভাষা"}</span>
                </span>
                <div className="bg-muted/50 border border-border p-0.5 rounded-lg inline-flex items-center gap-0.5 shadow-inner">
                  <button
                    onClick={() => setLanguage("en")}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold transition-all duration-200",
                      language === "en"
                        ? "bg-primary text-primary-foreground shadow-sm scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    )}
                  >
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => setLanguage("bn")}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold transition-all duration-200",
                      language === "bn"
                        ? "bg-primary text-primary-foreground shadow-sm scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    )}
                  >
                    <span>বাংলা</span>
                  </button>
                </div>
              </div>

              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-4 flex items-center gap-2 border-b border-border/50 pb-2 relative z-10">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>{language === "en" ? "Query Mode Settings" : "অনুসন্ধান মোড কনফিগার"}</span>
              </h3>
              
              <div className="flex flex-col gap-3 relative z-10">
                {[
                  { id: "general", label: { en: "General Guidance", bn: "সাধারণ সমাধান" }, desc: { en: "Balanced synthesis of Quran & Hadith insights", bn: "কুরআন ও হাদিসের সমন্বিত সমাধান" }, icon: Compass },
                  { id: "quran", label: { en: "Quran Only Focus", bn: "আল-কুরআন ফোকাস" }, desc: { en: "Direct verses, translations & tafseer", bn: "কুরআনের আয়াত, বঙ্গানুবাদ ও ব্যাখ্যা" }, icon: BookOpen },
                  { id: "hadith", label: { en: "Hadith Only Focus", bn: "আল-হাদিস ফোকাস" }, desc: { en: "Prophetic statements & sunnah guides", bn: "রাসূলুল্লাহর (সা.) বাণী ও দিকনির্দেশনা" }, icon: Award }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={cn(
                        "w-full flex items-start gap-3.5 rounded-xl p-3.5 text-left border transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5",
                        isActive 
                          ? "bg-primary/[0.04] border-primary/45 text-foreground shadow-inner" 
                          : "bg-muted/30 border-transparent hover:border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                      )}
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                        isActive ? "bg-primary border-primary/20 text-primary-foreground" : "bg-muted-foreground/10 border-border/40 text-muted-foreground"
                      )}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className={cn("text-xs font-bold flex items-center gap-1.5", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {language === "en" ? cat.label.en : cat.label.bn}
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                          )}
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                          {language === "en" ? cat.desc.en : cat.desc.bn}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Suggestions list */}
            <div className="bg-card/75 border border-border rounded-2xl p-6 shadow-xl shadow-black/5 backdrop-blur-xl group">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-4 flex items-center gap-2 border-b border-border/50 pb-2">
                <BookMarked className="w-3.5 h-3.5 text-primary" />
                <span>{language === "en" ? "Common Islamic Subjects" : "প্রস্তাবিত বিষয়সমূহ"}</span>
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {SUGGESTED_PROMPTS.map((item, idx) => {
                  const Icon = item.icon;
                  const itemPrompt = language === "en" ? item.prompt.en : item.prompt.bn;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(itemPrompt);
                        handleAsk(undefined, itemPrompt);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/20 bg-muted/20 hover:bg-primary/[0.03] text-left transition-all duration-200 group/item hover:-translate-x-0.5"
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-transparent", item.color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground group-hover/item:text-primary transition-colors line-clamp-1">
                          {language === "en" ? item.title.en : item.title.bn}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search History Panel */}
            <div className="bg-card/75 border border-border rounded-2xl p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-primary" />
                  <span>{language === "en" ? "Recent Queries" : "সাম্প্রতিক অনুসন্ধান"}</span>
                </h3>
                {searchHistory.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-[10px] font-bold text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                    title="Clear history"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {searchHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <History className="w-8 h-8 text-muted-foreground/20 mb-2" />
                  <p className="text-xs text-muted-foreground/60 italic leading-relaxed">
                    {language === "en" ? "Your recent queries will appear here." : "আপনার সাম্প্রতিক প্রশ্নগুলো এখানে থাকবে।"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {searchHistory.map((hist, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPrompt(hist);
                        handleAsk(undefined, hist);
                      }}
                      className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-primary hover:bg-primary/[0.02] px-3 py-2.5 rounded-xl border border-border/30 hover:border-primary/20 text-left transition-all duration-150 cursor-pointer group/hist"
                    >
                      <span className="truncate pr-3 font-medium">{hist}</span>
                      <button
                        onClick={(e) => deleteHistoryItem(e, hist)}
                        className="opacity-0 group-hover/hist:opacity-100 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                        title="Delete query"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel (Interactive Result Panel) - 8 Columns */}
          <div className="lg:col-span-8 space-y-6">

            {/* Main Input Form Dashboard Card - Claude/ChatGPT-like workspace */}
            <div className="bg-card/75 border border-border rounded-2xl p-6 shadow-xl shadow-black/5 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8" />
              
              <form onSubmit={handleAsk} className="relative flex flex-col gap-4">
                <div className="relative rounded-xl border border-border/80 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10 transition-all bg-background/55 p-3">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      language === "en" 
                        ? "Ask Al-Huda AI Studio... (e.g., 'What is the importance of honesty in Islam?')" 
                        : "আল-হুদা এআই স্টুডিওকে জিজ্ঞেস করুন... (যেমন: 'দান ও সাদাকার তাৎপর্য কী?')"
                    }
                    className="w-full min-h-[120px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAsk();
                      }
                    }}
                  />
                  
                  {/* Floating tags under prompt */}
                  <div className="flex flex-wrap gap-2 px-3 pb-2 pt-1">
                    <span className="text-[10px] font-semibold bg-muted/60 text-muted-foreground px-2.5 py-0.5 rounded-md border border-border/40">
                      Mode: {category === "general" ? "General Synthesis" : category === "quran" ? "Quranic Reference" : "Prophetic Hadiths"}
                    </span>
                    <span className="text-[10px] font-semibold bg-muted/60 text-muted-foreground px-2.5 py-0.5 rounded-md border border-border/40">
                      Response: {language === "en" ? "English" : "বাংলা (Bengali)"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-3 pt-3 border-t border-border/40 mt-3">
                    <span className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      {language === "en" ? "Press Enter to query OpenRouter" : "অনুসন্ধানের জন্য এন্টার চাপুন"}
                    </span>
                    <div className="flex items-center gap-2">
                      {(result || prompt.trim()) && (
                        <Button
                          type="button"
                          onClick={handleReset}
                          variant="ghost"
                          className="rounded-full px-4 h-10.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs font-bold transition-all"
                        >
                          <span>{language === "en" ? "Clear Workspace" : "মুছে ফেলুন"}</span>
                        </Button>
                      )}
                      <Button 
                        type="submit" 
                        disabled={isLoading || !prompt.trim()} 
                        className="rounded-full px-6 h-10.5 gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 font-bold"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                            <span>{language === "en" ? "Analyzing..." : "বিশ্লেষণ চলছে..."}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === "en" ? "Ask Scholar AI" : "এআই জিজ্ঞাসা করুন"}</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Dashboard Analytics & Meta Info Bar */}
            {result && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in duration-300">
                {[
                  { label: "Active Engine", val: "openrouter/free", icon: Cpu, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "Translation Language", val: language === "en" ? "English" : "বাংলা", icon: Languages, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                  { label: "Selected Category", val: category === "general" ? "General" : category === "quran" ? "Quran Focus" : "Hadith Focus", icon: Compass, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                  { label: "Verified References", val: `${result.references?.length || 0} Sources`, icon: BookOpenCheck, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-card/50 border border-border/80 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-primary/[0.02] rounded-full blur-md -mr-2 -mt-2" />
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", stat.color)}>
                      <stat.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">{stat.label}</p>
                      <p className="text-xs font-black text-foreground mt-0.5">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Shimmer Loader & Steps - Highly Premium Visuals */}
            {isLoading && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-8 shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1 animate-pulse">
                      {language === "en" ? "Consulting Al-Huda AI Assistant" : "আল-হুদা এআই সহকারীর সাথে পরামর্শ করা হচ্ছে"}
                    </h3>
                    <p className="text-xs text-primary font-bold transition-all duration-500">
                      {language === "en" ? LOADING_STEPS[loadingStep].en : LOADING_STEPS[loadingStep].bn}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="h-44 bg-muted/20 border border-border/60 rounded-2xl animate-pulse" />
                  <div className="h-44 bg-muted/20 border border-border/60 rounded-2xl animate-pulse" />
                </div>
              </div>
            )}

            {/* Error Message Dashboard Alert */}
            {error && (
              <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive-foreground shadow-lg animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full blur-xl -mr-4 -mt-4" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-destructive animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">{language === "en" ? "API Consultation Refused" : "এআই পরামর্শ প্রত্যাখ্যান"}</h3>
                    <p className="text-sm text-destructive-foreground/90 leading-relaxed">{error}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Button 
                        onClick={() => handleAsk()} 
                        size="sm" 
                        className="rounded-full bg-destructive text-white hover:bg-destructive/90 gap-1.5 text-xs font-bold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{language === "en" ? "Retry Request" : "পুনরায় চেষ্টা করুন"}</span>
                      </Button>
                      <Button 
                        onClick={handleReset} 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-full text-destructive-foreground hover:bg-destructive/10 text-xs font-bold"
                      >
                        <span>{language === "en" ? "Cancel" : "বাতিল"}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty workspace state */}
            {!result && !isLoading && !error && (
              <div className="border border-dashed border-border rounded-2xl p-16 text-center bg-card/45 backdrop-blur-md flex flex-col items-center justify-center shadow-inner animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mb-6 shadow-inner">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">
                  {language === "en" ? "Ready AI Workspace" : "এআই স্টুডিও প্রস্তুত"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed font-light">
                  {language === "en" 
                    ? "Enter your question in the text panel above or select a suggested topic from the left sidebar to generate authentic Islamic suggestions supported by Shariah proofs."
                    : "অনুগ্রহ করে উপরের প্যানেলে আপনার প্রশ্নটি লিখুন অথবা বাম পাশের প্যানেল থেকে একটি কুইক টপিক সিলেক্ট করে এআই স্টুডিওতে অনুসন্ধান শুরু করুন।"}
                </p>
              </div>
            )}

            {/* Results output */}
            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-600">
                
                {/* Result Suggestion Card */}
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-xs">
                  {/* Decorative glowing border effect */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-primary to-emerald-600" />
                  
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8.5 h-8.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xs">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary block leading-none">
                          {language === "en" ? "Authentic Islamic Guidance" : "শরীয়াহ দিকনির্দেশনা"}
                        </span>
                        <span className="text-[9px] text-muted-foreground mt-0.5 block leading-none">
                          {language === "en" ? "Shariah Synthesis" : "শরীয়াহ ব্যাখ্যা"}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleCopyFullGuide}
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full gap-1.5 text-xs text-primary hover:bg-primary/10 px-4 h-9"
                    >
                      {copiedFull ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-primary animate-scale" />
                          <span className="font-bold">{language === "en" ? "Copied Study!" : "কপি সম্পন্ন!"}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="font-bold">{language === "en" ? "Copy Complete Guide" : "পূর্ণাঙ্গ কপি"}</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Suggestion Text with beautiful typography */}
                  <div className="text-foreground text-lg leading-relaxed font-light whitespace-pre-line text-justify md:text-left">
                    {result.suggestion}
                  </div>
                </div>

                {/* References Layout with filtering tabs */}
                {result.references && result.references.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary animate-pulse" />
                        <span>
                          {language === "en" 
                            ? `Authentic Verification References (${result.references.length})` 
                            : `প্রামাণিক তথ্যসূত্রসমূহ (${result.references.length})`}
                        </span>
                      </h3>

                      {/* Tab Filter */}
                      <div className="bg-muted/40 p-0.5 rounded-lg inline-flex items-center gap-0.5 border border-border/50">
                        {[
                          { id: "all", label: language === "en" ? "All Sources" : "সব রেফারেন্স" },
                          { id: "quran", label: language === "en" ? "Quran" : "কুরআন" },
                          { id: "hadith", label: language === "en" ? "Hadith" : "হাদিস" }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setReferenceFilter(tab.id as any)}
                            className={cn(
                              "rounded-md px-3 py-1 text-[10px] font-bold transition-all duration-150",
                              referenceFilter === tab.id
                                ? "bg-background text-primary shadow-xs border border-border/30"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reference items list */}
                    {filteredReferences.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-xl">
                        <p className="text-xs text-muted-foreground italic">
                          {language === "en" ? "No sources of this type found." : "এই টাইপের কোনো রেফারেন্স পাওয়া যায়নি।"}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredReferences.map((ref, idx) => {
                          const isQuran = ref.type === "quran";
                          const formattedRefText = `"${ref.text}"\n\n- ${ref.reference} (${ref.title})`;
                          
                          return (
                            <div 
                              key={idx}
                              className={cn(
                                "rounded-2xl border flex flex-col justify-between p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:-translate-y-0.5",
                                isQuran 
                                  ? "bg-emerald-500/[0.01] dark:bg-emerald-500/[0.02] hover:bg-emerald-500/[0.03] border-emerald-500/15 hover:border-emerald-500/35" 
                                  : "bg-amber-500/[0.01] dark:bg-amber-500/[0.02] hover:bg-amber-500/[0.03] border-amber-500/15 hover:border-amber-500/35"
                              )}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-4 mb-4">
                                  <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                                    isQuran 
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  )}>
                                    {isQuran ? (language === "en" ? "Quranic Verse" : "আল-কুরআন") : (language === "en" ? "Sahih Hadith" : "আল-হাদিস")}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(formattedRefText, idx)}
                                    className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 border border-border/40"
                                    title="Copy reference citation"
                                  >
                                    {copiedId === idx ? (
                                      <Check className="w-3.5 h-3.5 text-primary animate-scale" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>

                                <h4 className="font-extrabold text-base text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                                  {ref.title}
                                </h4>

                                <p className={cn(
                                  "text-sm italic leading-relaxed text-foreground/90 font-light mb-4 relative pl-3.5 border-l-2",
                                  isQuran ? "border-emerald-500/35" : "border-amber-500/35"
                                )}>
                                  "{ref.text}"
                                </p>
                              </div>

                              <div className="mt-4 pt-4 border-t border-border/50">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                                  {language === "en" ? "Shariah Context & Application" : "দলীল ভিত্তিক ব্যাখ্যা ও বাস্তবায়ন"}
                                </span>
                                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                                  {ref.explanation}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </section>
    </main>
  );
}
