import Image from "next/image";
import { Mail, MessageCircle, MapPin, Globe } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="/assets/contact-us-bg.png"
          alt="Contact Al-Huda"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 leading-relaxed font-light">
            Have questions or feedback? We'd love to hear from you. Our team is dedicated to supporting your spiritual journey.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-stretch">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 flex flex-col gap-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-8 flex-1 flex flex-col justify-center">
                <h2 className="text-3xl font-bold">Contact Info</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Email Us</p>
                      <p className="text-muted-foreground">support@al-huda.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Live Support</p>
                      <p className="text-muted-foreground">Available on our mobile app</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Social Connect</p>
                      <p className="text-muted-foreground">@alhuda_app</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-card border border-border shadow-sm group">
                 <h3 className="text-2xl font-bold mb-6">Our Location</h3>
                 <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Dhaka, Bangladesh<br />
                      Gulshan 2, Al-Huda Hub
                    </p>
                 </div>
              </div>
            </div>

            {/* Contact Form Component */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-12 duration-1000">
               <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
