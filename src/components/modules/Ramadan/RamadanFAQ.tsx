import { HelpCircle } from "lucide-react";
import Image from "next/image";

const FAQS = [
  {
    q: "What breaks the fast?",
    a: "Eating, drinking, smoking, and marital relations intentionally during fasting hours break the fast."
  },
  {
    q: "Who is exempt from fasting?",
    a: "Children, the elderly, the sick, travelers, and women during menstruation or pregnancy are exempt."
  },
  {
    q: "What if I eat something by mistake?",
    a: "If you eat or drink by mistake out of forgetfulness, your fast is still valid. Simply continue fasting."
  },
  {
    q: "Can I use toothpaste while fasting?",
    a: "It is generally permissible as long as you are careful not to swallow any water or paste."
  }
];

export default function RamadanFAQ() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side - Visible on Desktop */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl hidden lg:block animate-in fade-in slide-in-from-left-12 duration-1000">
            <Image 
              src="/assets/blog-ramadan.png" 
              alt="Ramadan FAQ" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 text-white max-w-sm">
              <h3 className="text-4xl font-bold mb-4">Seeking Knowledge</h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                Understanding the rules and wisdom behind fasting is essential for a meaningful Ramadan journey.
              </p>
            </div>
          </div>

          {/* FAQ Content Side */}
          <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Questions & Answers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Ramadan FAQ</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Common questions regarding fasting, exemptions, and the practices of the holy month.
              </p>
            </div>

            <div className="space-y-6">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-3">{faq.q}</h4>
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
