"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
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
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-2xl relative overflow-hidden h-full">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Send a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe" 
              className="h-12 rounded-xl px-4 text-base bg-background" 
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
              className="h-12 rounded-xl px-4 text-base bg-background" 
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
            className="min-h-[120px] rounded-xl p-4 text-base bg-background resize-none" 
            required
          />
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-bold rounded-xl group bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
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
  );
}
