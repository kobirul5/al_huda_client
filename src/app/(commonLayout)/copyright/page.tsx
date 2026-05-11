import Image from "next/image";
import { ShieldAlert, Copyright, Scale, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CopyrightPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="/assets/copyright-bg.png"
          alt="Copyright Al-Huda"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Copyright <span className="text-primary">& Policy</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 leading-relaxed font-light">
            Protecting intellectual property and ensuring the integrity of our digital sanctuary.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-stretch">
            {/* Sidebar / Quick Info */}
            <div className="lg:col-span-1 flex flex-col gap-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-8 flex-1 flex flex-col justify-center">
                <h2 className="text-3xl font-bold">Key Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Copyright className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Ownership</p>
                      <p className="text-muted-foreground">Original content is owned by Al-Huda.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Scale className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Usage Rights</p>
                      <p className="text-muted-foreground">Personal, non-commercial use only.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Strict Enforcement</p>
                      <p className="text-muted-foreground">We take copyright violations seriously.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-card border border-border shadow-sm group">
                 <h3 className="text-2xl font-bold mb-4">Legal Inquiries</h3>
                 <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                   Questions about permissions or reporting violations? Reach out to our team.
                 </p>
                 <Button variant="outline" size="lg" className="w-full h-14 rounded-xl text-lg font-semibold border-primary/20 hover:bg-primary/5" asChild>
                    <Link href="/contact-us">Contact Support</Link>
                 </Button>
              </div>
            </div>

            {/* Policy Content Area */}
            <div className="lg:col-span-2 space-y-16 animate-in fade-in slide-in-from-right-12 duration-1000">
               <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">1. Intellectual Property</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The content provided on Al-Huda, including but not limited to text, software, graphics, images, logos, and design elements, is the property of Al-Huda and is protected by copyright, trademark, and other laws. Unauthorized use of these materials is strictly prohibited.
                  </p>
               </div>

               <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">2. Limited License</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    You are granted a personal, non-exclusive, and non-transferable license to access our platform. You may use the content for:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Personal spiritual study",
                      "Educational research",
                      "Community discussions",
                      "Individual reflection"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
               </div>

               <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">3. Prohibited Conduct</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    You may not reproduce, distribute, or create derivative works from our content without express written consent. This includes any commercial exploitation of the Al-Huda platform or its data.
                  </p>
                  <div className="p-8 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-4">
                    <div className="flex items-center gap-3 text-destructive">
                      <ShieldAlert className="w-6 h-6" />
                      <h3 className="text-xl font-bold">Violation Policy</h3>
                    </div>
                    <p className="text-muted-foreground">
                      We monitor for unauthorized use of our content. Violations may result in termination of access and legal action in accordance with international intellectual property laws.
                    </p>
                  </div>
               </div>

               <div className="pt-8 border-t border-border/50">
                  <p className="text-sm text-muted-foreground italic">
                    Last updated: May 2026. Al-Huda reserves the right to update this policy at any time.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
