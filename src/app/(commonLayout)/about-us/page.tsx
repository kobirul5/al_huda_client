import Image from "next/image";
import { Info, Heart, Target, Lightbulb, Users, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="/assets/about-us-hero.png"
          alt="About Al-Huda"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            About Al-Huda
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 leading-relaxed font-light">
            Guided by Faith, Driven by Technology. We are dedicated to providing the most serene digital experience for your spiritual journey.
          </p>
        </div>
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-card/50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                <Info className="w-4 h-4" />
                <span>Our Story</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Connecting Hearts to <span className="text-primary">Divine Guidance</span>
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Al-Huda was born out of a simple vision: to make authentic Islamic knowledge and essential daily tools accessible to everyone, everywhere. In an increasingly digital world, we saw the need for a premium, distraction-free platform that seamlessly integrates into a modern lifestyle.
                </p>
                <p>
                  Our journey began with a small team of passionate developers and scholars who shared a common goal: to bridge the gap between tradition and technology. We believe that technology should serve faith, not distract from it.
                </p>
                <p>
                  Today, Al-Huda serves thousands of users worldwide, providing accurate prayer times, Quranic resources, and spiritual insights, all wrapped in a beautiful, user-centric interface.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-12 duration-1000 group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Heart className="w-16 h-16 text-primary animate-pulse" />
                  </div>
               </div>
               {/* Decorative floating elements */}
               <div className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
               <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
         
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all group duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Target className="w-32 h-32 text-primary" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To empower Muslims globally by providing high-quality digital tools and resources that facilitate spiritual growth, education, and community connection through elegant and reliable technology.
              </p>
            </div>
            <div className="p-10 rounded-2xl bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-all group duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Lightbulb className="w-32 h-32 text-secondary-foreground" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To become the most trusted and widely used digital companion for the global Muslim community, recognized for our commitment to excellence, innovation, and unwavering authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            The principles that guide everything we build and every decision we make.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Authenticity", desc: "Verifying every piece of information with trusted sources and scholars." },
              { icon: Heart, title: "Excellence", desc: "Striving for perfection in design, technology, and overall user experience." },
              { icon: Users, title: "Community", desc: "Building a supportive, inclusive environment for Muslims of all backgrounds." },
              { icon: Lightbulb, title: "Innovation", desc: "Constantly evolving and improving through creative digital solutions." },
            ].map((value, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-bold mb-3">{value.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl bg-primary overflow-hidden p-12 md:p-20 text-center text-primary-foreground shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Join Our Growing Community</h2>
              <p className="text-primary-foreground/90 mb-12 text-xl leading-relaxed">
                Experience the beauty of faith through a modern digital lens. Start your journey with Al-Huda today and be part of something meaningful.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" variant="secondary" asChild className="rounded-full px-10 h-14 text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                  <Link href="/register">Join Now</Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10 rounded-full px-10 h-14 text-lg group" asChild>
                  <Link href="/surah/1" className="flex items-center gap-2">
                    Read Quran <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
