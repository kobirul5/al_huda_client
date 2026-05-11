import { Quote } from "lucide-react";

export default function DailyHadith() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-y border-border/50">
      {/* Very subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Clean, minimal badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mb-10 border border-border">
            <Quote className="w-3 h-3 text-primary" />
            <span>Daily Inspiration</span>
          </div>

          {/* Typographic Focus */}
          <div className="relative mb-10">
            <span className="absolute -top-12 -left-4 text-[120px] text-primary/5 font-serif select-none pointer-events-none">“</span>
            
            <blockquote className="text-2xl md:text-4xl font-medium leading-snug text-foreground/90 italic relative z-10 px-6">
              "The best among you are those who learn the Quran and teach it."
            </blockquote>

            <span className="absolute -bottom-24 -right-4 text-[120px] text-primary/5 font-serif select-none pointer-events-none">”</span>
          </div>

          {/* Author/Source */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-0.5 bg-primary/20 mb-4 rounded-full" />
            <p className="text-lg font-bold text-muted-foreground/80 tracking-tight">Sahih al-Bukhari</p>
          </div>
        </div>
      </div>
    </section>
  );
}
