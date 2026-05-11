import { Star, Heart, BookOpen, Users } from "lucide-react";

const VIRTUES = [
  {
    icon: Star,
    title: "Multiplied Rewards",
    desc: "Good deeds performed during Ramadan are rewarded up to 70 times more than in other months."
  },
  {
    icon: Heart,
    title: "Self-Purification",
    desc: "Fasting helps in cleansing the soul and developing self-discipline and empathy for others."
  },
  {
    icon: BookOpen,
    title: "Month of the Quran",
    desc: "Ramadan is the month in which the Holy Quran was first revealed as a guidance for mankind."
  },
  {
    icon: Users,
    title: "Community Spirit",
    desc: "A time for increased congregational prayers, shared Iftars, and supporting one another."
  }
];

export default function VirtuesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Virtues of Ramadan</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the immense spiritual benefits and blessings of this holy month.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VIRTUES.map((virtue, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <virtue.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{virtue.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{virtue.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
