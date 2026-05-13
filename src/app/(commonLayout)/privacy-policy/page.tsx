import Image from "next/image";
import Link from "next/link";
import {
  Cookie,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const privacyHighlights = [
  {
    icon: UserCheck,
    title: "Account Data",
    description: "We use basic profile details to keep your account secure and personalized.",
  },
  {
    icon: Database,
    title: "Saved Activity",
    description: "Bookmarks and preferences help restore your reading experience across visits.",
  },
  {
    icon: Lock,
    title: "Protected Access",
    description: "Authentication data is handled carefully and used only for secure access.",
  },
];

const policySections = [
  {
    title: "1. Information We Collect",
    body:
      "Al-Huda may collect information that you provide directly, such as your name, email address, profile details, contact messages, saved bookmarks, and account preferences. We may also collect limited technical data such as device type, browser information, and usage activity to improve reliability and performance.",
  },
  {
    title: "2. How We Use Information",
    body:
      "We use your information to provide account access, personalize Quran and Hadith reading features, save bookmarks, respond to support requests, improve prayer time and learning tools, prevent abuse, and keep the platform stable and secure.",
  },
  {
    title: "3. Authentication and Security",
    body:
      "We use authentication methods such as tokens, OTP verification, and password reset flows to protect your account. While no digital service can guarantee absolute security, we design our systems to reduce unauthorized access and protect sensitive information.",
  },
  {
    title: "4. Cookies and Local Storage",
    body:
      "Al-Huda may use cookies or browser storage to remember theme settings, reading preferences, bookmarks, session status, and similar app behavior. These tools help the platform feel consistent when you return.",
  },
  {
    title: "5. Sharing and Disclosure",
    body:
      "We do not sell personal information. We may share limited information only when needed to operate the service, comply with legal obligations, protect users, investigate abuse, or work with trusted infrastructure providers.",
  },
  {
    title: "6. Your Choices",
    body:
      "You can update your profile information, remove saved bookmarks, log out of your account, or contact us about privacy questions. Some technical data may remain in security logs for a limited period when required for safety and service integrity.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative flex h-[46vh] min-h-90 w-full items-center justify-center overflow-hidden">
        <Image
          src="/assets/copyright-bg.png"
          alt="Al-Huda privacy policy"
          fill
          className="object-cover brightness-[0.62]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/35 to-black/10" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-primary backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-7xl">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-white/90 md:text-2xl">
            Clear, respectful data practices for your Al-Huda account, reading preferences, bookmarks, and spiritual learning experience.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {privacyHighlights.map((item) => (
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

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="h-7 w-7" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Policy Summary</h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  This page explains what data Al-Huda collects, why it is used, and how you can contact us about privacy concerns.
                </p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Eye className="h-4 w-4 text-primary" />
                    <span>No sale of personal data</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Cookie className="h-4 w-4 text-primary" />
                    <span>Preferences stored for convenience</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Security-focused account access</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h3 className="mb-3 text-2xl font-bold">Privacy Questions?</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Contact our support team for questions about your account data or this policy.
                </p>
                <Button asChild size="lg" className="h-12 w-full rounded-xl font-semibold">
                  <Link href="/contact-us" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </aside>

            <div className="space-y-8">
              {policySections.map((section) => (
                <section key={section.title} className="border-b border-border/70 pb-8 last:border-b-0">
                  <h2 className="mb-4 text-2xl font-bold md:text-3xl">{section.title}</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">{section.body}</p>
                </section>
              ))}

              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Last updated: May 13, 2026. Al-Huda may update this Privacy Policy as the platform grows. Continued use of the service means you accept the updated policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
