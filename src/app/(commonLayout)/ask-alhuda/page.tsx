"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Lock,
  PanelLeftClose,
  PanelLeft,
  Plus,
  ArrowUp,
  User,
  ExternalLink
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
  },
  {
    icon: Sparkles,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    title: { en: "Virtues of Sadaqah", bn: "দান ও সাদাকার ফজিলত" },
    prompt: { 
      en: "What are the spiritual benefits and rewards of giving charity (Sadaqah)?", 
      bn: "দান ও সাদাকা করার আত্মিক উপকারিতা এবং প্রতিদান কী?" 
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
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [referenceFilter, setReferenceFilter] = useState<"all" | "quran" | "hadith">("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Authentication & DB Search History States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means loading
  const [historyData, setHistoryData] = useState<IAISuggestionResponse[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Scroll to bottom on result or loading change
  useEffect(() => {
    if (result || isLoading || error) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result, isLoading, error]);

  const handleAsk = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    
    const queryPrompt = customPrompt || prompt;
    if (!queryPrompt.trim() || isLoading) return;

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
    setCategory(item.category as any || "general");
    setLanguage(item.language as any || "en");
    setResult(item);
    setError(null);
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation();
    setIsDeletingId(historyId);

    try {
      const response = await deleteAiHistoryItem(historyId);
      if (response.success) {
        setHistoryData((prev) => prev.filter((item) => item.id !== historyId));
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

  const handleCopyResponse = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.suggestion);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
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
    textareaRef.current?.focus();
  };

  // Filter references based on tab selector
  const filteredReferences = result?.references?.filter(ref => {
    if (referenceFilter === "all") return true;
    return ref.type === referenceFilter;
  }) || [];

  // 1. LOADING AUTH STATE SKELETON
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest animate-pulse">
            Connecting to Al-Huda AI Workspace...
          </p>
        </div>
      </main>
    );
  }

  // 2. UNAUTHORIZED / LOGIN REQUIRED STATE
  if (isAuthenticated === false) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden py-20 px-4 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(58%_0.14_150_/_0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] -z-10" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />

        <div className="max-w-md w-full bg-card/70 border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-500 via-primary to-emerald-600" />
          
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 shadow-inner relative">
            <Lock className="w-8 h-8 text-primary" />
            <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
            Authentication Required
          </h1>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4">
            Al-Huda AI Chat
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Please log in to access the Al-Huda AI Islamic Scholar assistant. Your chats and Shariah references are automatically saved to your private inquiry history.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login" passHref className="w-full">
              <Button className="w-full rounded-2xl h-12 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                <LogIn className="w-4 h-4" />
                <span>Log In to Continue</span>
              </Button>
            </Link>

            <Link href="/register" passHref className="w-full">
              <Button variant="outline" className="w-full rounded-2xl h-12 font-bold text-muted-foreground hover:text-foreground border-border/80">
                <span>Create a Free Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. AUTHORIZED / MODERN AI CHAT WORKSPACE (ChatGPT / Claude / Perplexity Style)
  return (
    <div className="h-[calc(100vh-65px)] bg-background flex flex-row relative overflow-hidden">
      
      {/* Background Grids & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(58%_0.14_150_/_0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(58%_0.14_150_/_0.02)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* LEFT SIDEBAR: New Chat, Focus Mode, Language & History */}
      <aside 
        className={cn(
          "bg-card/75 md:bg-card/50 border-r border-border backdrop-blur-xl flex flex-col transition-all duration-300 z-20 h-full",
          "fixed md:static inset-y-0 left-0 w-80 shadow-2xl md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:w-0 md:border-r-0 md:opacity-0 md:overflow-hidden"
        )}
      >
        <div className="p-4 border-b border-border/60 flex items-center justify-between gap-2">
          {/* Brand header in sidebar */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-foreground leading-none">Al-Huda AI</h2>
              <span className="text-[10px] text-muted-foreground font-medium">Islamic Scholar Chat</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 pb-2">
          <Button
            onClick={handleReset}
            className="w-full rounded-2xl h-11 font-bold justify-start gap-2.5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === "en" ? "New Chat" : "নতুন আলোচনা"}</span>
          </Button>
        </div>

        {/* Scrollable Configuration & History */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 green-scrollbar">
          
          {/* Query Mode / Focus Tabs */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block mb-2 px-1">
              {language === "en" ? "Knowledge Focus" : "অনুসন্ধান ফোকাস"}
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "general", label: { en: "General Guidance", bn: "সাধারণ দিকনির্দেশনা" }, icon: Compass },
                { id: "quran", label: { en: "Quran Only Focus", bn: "আল-কুরআন ফোকাস" }, icon: BookOpen },
                { id: "hadith", label: { en: "Hadith Only Focus", bn: "আল-হাদিস ফোকাস" }, icon: Award }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = category === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCategory(item.id as any)}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left border",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/20 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{language === "en" ? item.label.en : item.label.bn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Response Language Toggle */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block mb-2 px-1">
              {language === "en" ? "Response Language" : "উত্তরের ভাষা"}
            </span>
            <div className="bg-muted/40 p-1 rounded-xl border border-border/60 flex items-center gap-1">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center",
                  language === "en"
                    ? "bg-background text-primary shadow-xs border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center",
                  language === "bn"
                    ? "bg-background text-primary shadow-xs border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Chat History from Database */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                <History className="w-3 h-3" />
                <span>{language === "en" ? "Recent Queries" : "পূর্ববর্তী অনুসন্ধান"}</span>
              </span>
              {historyData.length > 0 && (
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                  {historyData.length}
                </span>
              )}
            </div>

            {historyData.length === 0 ? (
              <div className="text-center py-6 px-2 border border-dashed border-border/60 rounded-xl">
                <MessageSquare className="w-6 h-6 text-muted-foreground/30 mx-auto mb-1.5" />
                <p className="text-[11px] text-muted-foreground/70">
                  {language === "en" ? "No chats yet. Questions you ask will appear here." : "এখানে আপনার পূর্ববর্তী প্রশ্নগুলো সংরক্ষিত থাকবে।"}
                </p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 green-scrollbar">
                {historyData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleLoadHistoryItem(item);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group text-left border relative",
                      result && result.id === item.id
                        ? "bg-primary/10 text-primary font-semibold border-primary/30"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <span className="truncate pr-2 max-w-[80%]">{item.prompt}</span>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(e, item.id || "")}
                      disabled={isDeletingId === item.id}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                      title="Delete from history"
                    >
                      {isDeletingId === item.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-border/60 text-[10px] text-muted-foreground/70 text-center">
          <span>{language === "en" ? "Guided by Authentic Shariah Sources" : "প্রামাণিক শরীয়াহ ভিত্তিক রেফারেন্স"}</span>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-10 md:hidden"
        />
      )}

      {/* MAIN CHAT CANVAS */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Chat Bar */}
        <header className="h-14 border-b border-border/60 px-4 flex items-center justify-between bg-card/40 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Open Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </Button>
            )}

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-extrabold text-foreground">Al-Huda AI</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {category === "general" ? "General Guidance" : category === "quran" ? "Quran Focus" : "Hadith Focus"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="text-xs font-bold text-muted-foreground hover:text-primary px-2.5 py-1 rounded-lg border border-border/60 hover:border-primary/30 transition-all flex items-center gap-1.5"
              title="Toggle response language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === "en" ? "English" : "বাংলা"}</span>
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="rounded-xl text-xs font-bold gap-1 text-muted-foreground hover:text-foreground h-8 px-2.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === "en" ? "New Query" : "নতুন প্রশ্ন"}</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth green-scrollbar">
          <div className="max-w-3xl mx-auto w-full space-y-6 pb-6">
            
            {/* 1. EMPTY / WELCOME SCREEN (ChatGPT / Claude Style) */}
            {!result && !isLoading && !error && (
              <div className="py-12 flex flex-col items-center text-center animate-in fade-in duration-500">
                
                {/* Logo & Aura */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-primary flex items-center justify-center shadow-xl shadow-primary/20">
                    <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl -z-10 animate-ping opacity-30" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                  {language === "en" ? "As-salamu alaykum" : "আসসালামু আলাইকুম"}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-10 font-normal">
                  {language === "en" 
                    ? "What Islamic guidance or Shariah topic would you like to explore today?"
                    : "কুরআন, হাদিস বা ইসলামিক জ্ঞান সংক্রান্ত যে কোনো বিষয়ে প্রশ্ন করে প্রামাণিক উত্তর নিন।"}
                </p>

                {/* Suggested Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
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
                        className="p-4 rounded-2xl border border-border/70 hover:border-primary/40 bg-card/60 hover:bg-primary/[0.03] text-left transition-all duration-200 group flex items-start justify-between gap-3 shadow-xs hover:shadow-md"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border", item.color)}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {language === "en" ? item.title.en : item.title.bn}
                            </h3>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {itemPrompt}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 2. ACTIVE USER MESSAGE BUBBLE */}
            {(result || isLoading || error) && (
              <div className="flex items-start gap-3 justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-primary/10 border border-primary/20 rounded-3xl rounded-tr-sm px-5 py-3.5 max-w-[85%] text-foreground shadow-xs">
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-primary font-bold uppercase tracking-wider">
                    <span>{language === "en" ? "You asked" : "আপনার প্রশ্ন"}</span>
                    <span>{category === "general" ? "General" : category === "quran" ? "Quran Focus" : "Hadith Focus"}</span>
                  </div>
                  <p className="text-sm md:text-base font-normal leading-relaxed text-foreground whitespace-pre-wrap">
                    {result?.prompt || prompt}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* 3. LOADING / THINKING STATE */}
            {isLoading && (
              <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-primary flex items-center justify-center text-primary-foreground shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>

                <div className="bg-card border border-border/80 rounded-3xl rounded-tl-sm p-6 max-w-[90%] shadow-md space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      {language === "en" ? "Al-Huda AI is analyzing Shariah texts..." : "আল-হুদা এআই শরীয়াহ দলীল অনুসন্ধান করছে..."}
                    </span>
                  </div>

                  <p className="text-xs text-primary font-semibold transition-all duration-300 pl-6.5">
                    {language === "en" ? LOADING_STEPS[loadingStep].en : LOADING_STEPS[loadingStep].bn}
                  </p>

                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-500"
                      style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. ERROR STATE */}
            {error && (
              <div className="flex items-start gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shrink-0 mt-1">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-3xl rounded-tl-sm p-5 max-w-[90%] text-foreground space-y-3">
                  <h4 className="text-xs font-bold text-destructive">
                    {language === "en" ? "Consultation Failed" : "অনুসন্ধানে সমস্যা হয়েছে"}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {error}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button 
                      onClick={() => handleAsk()} 
                      size="sm" 
                      className="rounded-xl h-8 text-xs font-bold gap-1.5 bg-destructive text-white hover:bg-destructive/90"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === "en" ? "Retry" : "পুনরায় চেষ্টা করুন"}</span>
                    </Button>
                    <Button 
                      onClick={handleReset} 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-xl h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {language === "en" ? "Cancel" : "বাতিল"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. AI RESPONSE ROW (ChatGPT / Claude / Perplexity Style) */}
            {result && !isLoading && (
              <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
                
                {/* AI Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-primary flex items-center justify-center text-primary-foreground shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="space-y-6 flex-1 max-w-[92%]">
                  
                  {/* AI Response Card */}
                  <div className="bg-card/90 border border-border/80 rounded-3xl rounded-tl-sm p-6 md:p-7 shadow-lg space-y-5 backdrop-blur-sm">
                    
                    {/* Header with model status */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-foreground">Al-Huda AI</span>
                        <span className="text-[10px] text-muted-foreground/80">•</span>
                        <span className="text-[10px] font-semibold text-primary">
                          {language === "en" ? "Authentic Islamic Guidance" : "শরীয়াহ দিকনির্দেশনা"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyResponse}
                          className="rounded-lg h-7 px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground gap-1"
                          title="Copy response"
                        >
                          {copiedResponse ? (
                            <>
                              <Check className="w-3 h-3 text-primary" />
                              <span className="text-primary">{language === "en" ? "Copied" : "কপি সম্পন্ন"}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{language === "en" ? "Copy" : "কপি"}</span>
                            </>
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyFullGuide}
                          className="rounded-lg h-7 px-2.5 text-[11px] font-bold text-primary hover:bg-primary/10 gap-1"
                          title="Copy response with all citations"
                        >
                          {copiedFull ? (
                            <>
                              <Check className="w-3 h-3 text-primary" />
                              <span>{language === "en" ? "All Copied" : "সব কপি হয়েছে"}</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3 h-3" />
                              <span>{language === "en" ? "Copy Study" : "পূর্ণাঙ্গ রিপোর্ট"}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Main AI Text Content */}
                    <div className="text-foreground text-sm md:text-base leading-relaxed font-light whitespace-pre-line text-left">
                      {result.suggestion}
                    </div>

                  </div>

                  {/* REFERENCES SECTION (Perplexity AI Style Citations) */}
                  {result.references && result.references.length > 0 && (
                    <div className="space-y-4 pt-2">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span>
                            {language === "en" 
                              ? `Authentic Verification Sources (${result.references.length})` 
                              : `প্রামাণিক তথ্যসূত্রসমূহ (${result.references.length})`}
                          </span>
                        </h4>

                        {/* Filter Tabs */}
                        <div className="bg-muted/40 p-0.5 rounded-lg inline-flex items-center gap-0.5 border border-border/50 self-start sm:self-auto">
                          {[
                            { id: "all", label: language === "en" ? "All" : "সব" },
                            { id: "quran", label: language === "en" ? "Quran" : "কুরআন" },
                            { id: "hadith", label: language === "en" ? "Hadith" : "হাদিস" }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setReferenceFilter(tab.id as any)}
                              className={cn(
                                "rounded-md px-2.5 py-1 text-[10px] font-bold transition-all",
                                referenceFilter === tab.id
                                  ? "bg-background text-primary shadow-xs border border-border/40"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Reference Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredReferences.map((ref, idx) => {
                          const isQuran = ref.type === "quran";
                          const formattedRefText = `"${ref.text}"\n\n- ${ref.reference} (${ref.title})`;

                          return (
                            <div
                              key={idx}
                              className={cn(
                                "rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between group",
                                isQuran
                                  ? "bg-emerald-500/[0.02] border-emerald-500/20 hover:border-emerald-500/40"
                                  : "bg-amber-500/[0.02] border-amber-500/20 hover:border-amber-500/40"
                              )}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                    isQuran
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  )}>
                                    {isQuran ? (language === "en" ? "Quranic Verse" : "আল-কুরআন") : (language === "en" ? "Sahih Hadith" : "আল-হাদিস")}
                                  </span>

                                  <button
                                    onClick={() => handleCopy(formattedRefText, idx)}
                                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                    title="Copy reference citation"
                                  >
                                    {copiedId === idx ? (
                                      <Check className="w-3.5 h-3.5 text-primary" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>

                                <h5 className="font-extrabold text-sm text-foreground mb-2 group-hover:text-primary transition-colors">
                                  {ref.title}
                                </h5>

                                <p className={cn(
                                  "text-xs italic leading-relaxed text-foreground/90 font-light mb-3 pl-3 border-l-2",
                                  isQuran ? "border-emerald-500/40" : "border-amber-500/40"
                                )}>
                                  "{ref.text}"
                                </p>
                              </div>

                              <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                                <span className="font-semibold text-foreground/80 block mb-0.5">
                                  {language === "en" ? "Context & Meaning:" : "প্রাসঙ্গিক ব্যাখ্যা:"}
                                </span>
                                {ref.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* BOTTOM INPUT BAR (Clean In-Flow, No Blur Over Scrollbar) */}
        <div className="shrink-0 p-3 md:p-4 bg-background border-t border-border/50 z-10">
          <div className="max-w-3xl mx-auto w-full">
            
            <form 
              onSubmit={handleAsk}
              className="relative rounded-3xl border border-border/80 bg-card shadow-lg p-2.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
            >
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Ask Al-Huda AI anything about Islam, Quran, or Hadith... (Press Enter to send)"
                    : "আল-হুদা এআইকে ইসলামিক যে কোনো প্রশ্ন করুন... (এন্টার চাপলে সেন্ড হবে)"
                }
                className="w-full min-h-[50px] max-h-[160px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-foreground placeholder:text-muted-foreground/60 resize-none text-sm md:text-base leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
              />

              {/* Bottom controls inside the input container */}
              <div className="flex items-center justify-between px-2 pt-1 border-t border-border/40 mt-1">
                {/* Left quick mode badge */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/90 bg-muted/50 border border-border/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Compass className="w-3 h-3 text-primary" />
                    <span>{category === "general" ? "General" : category === "quran" ? "Quran" : "Hadith"}</span>
                  </span>
                  
                  <span className="text-[10px] font-semibold text-muted-foreground/90 bg-muted/50 border border-border/50 px-2 py-0.5 rounded-lg hidden sm:inline-flex items-center gap-1">
                    <Languages className="w-3 h-3 text-primary" />
                    <span>{language === "en" ? "EN" : "বাংলা"}</span>
                  </span>
                </div>

                {/* Right Send Button */}
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    size="icon"
                    className="rounded-full w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                    title="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Disclaimer */}
            <p className="text-[10px] text-muted-foreground/60 text-center mt-2 font-normal">
              {language === "en"
                ? "Al-Huda AI provides references based on authentic Islamic literature. Always consult qualified Islamic scholars for personal legal fatwas."
                : "আল-হুদা এআই প্রামাণিক ইসলামী সাহিত্যের ভিত্তিতে রেফারেন্স প্রদান করে। ব্যক্তিগত ফতোয়া ও মাসআলার জন্য বিজ্ঞ আলেমদের পরামর্শ নিন।"}
            </p>

          </div>
        </div>

      </main>

    </div>
  );
}
