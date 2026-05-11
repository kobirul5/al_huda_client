import { BookOpen, Clock, Moon, MessageSquare } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Read Quran",
    desc: "Access all 114 Surahs with clear transliteration and profound translations.",
    link: "/surah/1"
  },
  {
    icon: Clock,
    title: "Prayer Times",
    desc: "Accurate daily prayer times based on your location with countdown to next prayer.",
    link: "/prayer-time"
  },
  {
    icon: Moon,
    title: "Ramadan Hub",
    desc: "Special tools for the holy month, including countdowns, Sehri & Iftar times, and Duas.",
    link: "/ramadan"
  },
  {
    icon: MessageSquare,
    title: "Islamic Blog",
    desc: "Insightful articles on faith, spirituality, and community to enrich your daily life.",
    link: "/blog"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tight">Explore Al-Huda</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
            A comprehensive digital companion designed to support and inspire your spiritual growth every day.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <Link 
              href={feature.link} 
              key={idx} 
              className="p-10 rounded-[2rem] bg-card border border-border hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-12"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
