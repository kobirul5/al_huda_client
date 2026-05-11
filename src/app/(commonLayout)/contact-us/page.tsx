"use client";

import Image from "next/image";
import { Mail, MessageCircle, Send, MapPin, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Missing fields", {
        description: "Please fill in all the fields before sending.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${baseUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Message sent successfully!", {
          description: "Thank you for reaching out. We will get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message", {
          description: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Network error", {
        description: "Could not connect to the server. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-8">
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

            {/* Contact Form */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="p-8 md:p-12 rounded-2xl bg-card border border-border shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                
                <h2 className="text-3xl md:text-4xl font-bold mb-10">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        className="h-14 rounded-xl px-5 text-lg bg-background" 
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        className="h-14 rounded-xl px-5 text-lg bg-background" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-base font-semibold">Subject</Label>
                    <Input 
                      id="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Feedback or Inquiry" 
                      className="h-14 rounded-xl px-5 text-lg bg-background" 
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-base font-semibold">Message</Label>
                    <Textarea 
                      id="message" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?" 
                      className="min-h-[180px] rounded-xl p-5 text-lg bg-background resize-none" 
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 text-xl font-bold rounded-xl group bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-6 h-6 ml-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
