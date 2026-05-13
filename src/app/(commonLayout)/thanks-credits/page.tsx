import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Database,
  ExternalLink,
  Globe2,
  HeartHandshake,
  Library,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const creditGroups = [
  {
    icon: Library,
    title: "Quran Resources",
    description:
      "Gratitude to the scholars, translators, reciters, and open knowledge projects that make Quran study more accessible for the Ummah.",
  },
  {
    icon: BookOpen,
    title: "Hadith References",
    description:
      "Thanks to the teams preserving and organizing Hadith collections so readers can explore Islamic knowledge with care and context.",
  },
  {
    icon: Globe2,
    title: "Prayer Time Data",
    description:
      "Appreciation for reliable calculation methods and public prayer time services that help support daily worship routines.",
  },
  {
    icon: Code2,
    title: "Open Source Tools",
    description:
      "Built with modern open source libraries, frameworks, and community-maintained packages that help Al-Huda stay fast and dependable.",
  },
];

const technologyCredits = [
  "Next.js, React, and TypeScript",
  "Tailwind CSS and Radix UI primitives",
  "Lucide React icons",
  "Express.js, Prisma, and MongoDB",
  "Community APIs and public Islamic data sources",
  "Open source design and development tooling",
];

const acknowledgements = [
  "Everyone who reads, tests, and shares feedback",
  "Families and teachers who encourage Islamic learning",
  "Developers who maintain the tools behind this platform",
  "Knowledge projects that keep authentic resources accessible",
];

export default function ThanksCreditsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative flex h-[48vh] min-h-96 w-full items-center justify-center overflow-hidden">
        <Image
          src="/assets/footer1.png"
          alt="Thanks and credits for Al-Huda"
          fill
          className="object-cover brightness-[0.55]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/40 to-black/15" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-primary backdrop-blur-sm">
            <HeartHandshake className="h-8 w-8" />
          </div>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-7xl">
            Thanks <span className="text-primary">& Credits</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-white/90 md:text-2xl">
            Al-Huda exists through the blessing of Allah, the effort of many knowledge keepers, and the generosity of open source communities.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {creditGroups.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="mb-3 text-xl font-bold">{item.title}</h2>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-10">
              <section className="rounded-2xl border border-primary/10 bg-primary/5 p-8 md:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="mb-5 text-3xl font-bold md:text-4xl">A Note of Gratitude</h2>
                <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Al-Huda is designed as a calm digital companion for Quran reading, Hadith browsing, prayer time awareness, Ramadan preparation, and daily reflection.
                  </p>
                  <p>
                    We are grateful to every scholar, teacher, developer, designer, tester, and user whose work or feedback helps make this platform more useful and respectful.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-6 text-3xl font-bold">Technology Credits</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {technologyCredits.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="font-medium text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-6 text-3xl font-bold">Special Thanks</h2>
                <div className="space-y-4">
                  {acknowledgements.map((item) => (
                    <div key={item} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                      <p className="text-lg leading-relaxed text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Database className="h-7 w-7" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Credit Policy</h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  If your project, dataset, content, or library helped Al-Huda and needs clearer attribution, please contact us.
                </p>
                <Button asChild size="lg" className="h-12 w-full rounded-xl font-semibold">
                  <Link href="/contact-us" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8">
                <h3 className="mb-4 text-2xl font-bold">Explore Al-Huda</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Continue with the core reading experience and explore the Quran reader.
                </p>
                <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-xl font-semibold">
                  <Link href="/surah/1" className="flex items-center gap-2">
                    Read Quran
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
