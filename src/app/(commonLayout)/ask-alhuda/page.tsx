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
  AlertCircle,
  LogIn,
  UserCheck,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  askAlHudaAI, 
  getAiHistory, 
  deleteAiHistoryItem, 
  checkAiAuth 
} from "@/services/ai";

interface IReference {
  type: "quran" | "hadith";
  title: string;
  reference: string;
  text: string;
  explanation: string;
}

interface IAISuggestionResponse {
  id?: string;
  prompt: string;
  suggestion: string;
  references: IReference[];
  category: string;
  language?: string;
  createdAt: string | Date;
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
  const [referenceFilter, setReferenceFilter] = useState<"all" | "quran" | "hadith">("all");

  // Authentication & DB Search History States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means loading
  const [historyData, setHistoryData] = useState<IAISuggestionResponse[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Initialize Authentication Check and Fetch History from DB
  useEffect(() => {
    const initAuthAndHistory = async () => {
      try {
        const authCheck = await checkAiAuth();
        if (!authCheck.success) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
        
        // Fetch Search History directly from DB
        const response = await getAiHistory();
        if (response.success && Array.isArray(response.data)) {
          setHistoryData(response.data);
        }
      } catch (err) {
        console.error("Auth and history init error:", err);
        setIsAuthenticated(false);
      }
    };
    initAuthAndHistory();
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

  const handleAsk = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    
    const queryPrompt = customPrompt || prompt;
    if (!queryPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await askAlHudaAI(queryPrompt, category, language);

      if (!response.success) {
        throw new Error(response.message || "Failed to retrieve guidance.");
      }

      setResult(response.data);
      
      // Auto refresh search history from DB to show the new item immediately
      const histResponse = await getAiHistory();
      if (histResponse.success && Array.isArray(histResponse.data)) {
        setHistoryData(histResponse.data);
      }
    } catch (err: any) {
      console.error("AI Request error:", err);
      setError(err.message || "Something went wrong. Please check your connection or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load a saved query response from search history instantly without calling API
  const handleLoadHistoryItem = (item: IAISuggestionResponse) => {
    setPrompt(item.prompt);
    setCategory(item.category as any);
    setLanguage(item.language as any || "en");
    setResult(item);
    setError(null);
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation(); // Stop parent click trigger
    setIsDeletingId(historyId);

    try {
      const response = await deleteAiHistoryItem(historyId);
      if (response.success) {
        // Filter out deleted item from history list state
        setHistoryData((prev) => prev.filter((item) => item.id !== historyId));
        
        // If current result belongs to deleted item, clear results
        if (result && result.id === historyId) {
          handleReset();
        }
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
    } finally {
      setIsDeletingId(null);
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

  // 1. LOADING AUTH STATE SKELETON
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden pb-24 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest animate-pulse">
            Authenticating AI Studio Workspace...
          </p>
        </div>
      </main>
    );
  }

  // 2. UNAUTHORIZED / LOGIN REQUIRED STATE
  if (isAuthenticated === false) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden py-20 px-4 flex items-center justify-center">
        {/* World-Class Background Grids & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] -z-10" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 animate-pulse" />

        <div className="max-w-md w-full bg-card/70 border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-500 via-primary to-emerald-600" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mr-4 -mt-4" />
          
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 shadow-inner relative">
            <Lock className="w-8 h-8 text-primary" />
            <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-foreground mb-2">
            Authentication Required
          </h1>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4">
            Al-Huda AI Scholar Workspace
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            The Islamic AI Studio is a premium scholar workspace reserved for registered members. 
            Logging in protects your spiritual queries and securely saves your Shariah suggestions directly to a personal search history database.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login" passHref className="w-full">
              <Button className="w-full rounded-full h-11 font-bold gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                <LogIn className="w-4 h-4" />
                <span>Log In to Continue</span>
              </Button>
            </Link>

            <Link href="/register" passHref className="w-full">
              <Button variant="outline" className="w-full rounded-full h-11 font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/80 transition-all duration-200">
                <span>Create a Free Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. AUTHORIZED / MAIN WORKSPACE STATE
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

            {/* Database Search History Panel */}
            <div className="bg-card/75 border border-border rounded-2xl p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-primary" />
                  <span>{language === "en" ? "Saved AI History" : "সংরক্ষিত এআই ইতিহাস"}</span>
                </h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-extrabold uppercase">
                  Database
                </span>
              </div>

              {historyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UserCheck className="w-8 h-8 text-muted-foreground/20 mb-2" />
                  <p className="text-xs text-muted-foreground/60 italic leading-relaxed px-4">
                    {language === "en" 
                      ? "Shariah consultations you search will be saved in your database." 
                      : "আপনার করা সকল শরীয়াহ আলোচনা ডাটাবেজে সংরক্ষণ করা হবে।"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {historyData.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistoryItem(item)}
                      className={cn(
                        "w-full flex items-center justify-between text-xs text-muted-foreground hover:text-primary hover:bg-primary/[0.02] px-3.5 py-3 rounded-xl border transition-all duration-200 cursor-pointer group/hist relative",
                        result && result.id === item.id 
                          ? "bg-primary/[0.03] border-primary/35 text-foreground font-semibold" 
                          : "border-border/40 hover:border-primary/20"
                      )}
                    >
                      {result && result.id === item.id && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
                      )}
                      <span className="truncate pr-3 font-medium max-w-[85%]">{item.prompt}</span>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(e, item.id || "")}
                        disabled={isDeletingId === item.id}
                        className="opacity-0 group-hover/hist:opacity-100 p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                        title="Delete query from database"
                      >
                        {isDeletingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
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
