import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white mt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/footer.png" 
          alt="Footer Background" 
          fill 
          className="object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-black text-primary tracking-tighter">Al-Huda</h2>
            </Link>
            <p className="text-white/70 leading-relaxed max-w-xs">
              Your digital companion for a serene Islamic lifestyle. Accurate prayer times, Quranic resources, and community insights at your fingertips.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all shadow-sm">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all shadow-sm">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all shadow-sm">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-primary/30 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-4 text-white/70">
              <li><Link href="/surah/1" className="hover:text-primary transition-colors">Surah List</Link></li>
              <li><Link href="/prayer-time" className="hover:text-primary transition-colors">Prayer Times</Link></li>
              <li><Link href="/ramadan" className="hover:text-primary transition-colors">Ramadan Hub</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Our Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-primary/30 pb-2 inline-block">Support</h3>
            <ul className="space-y-4 text-white/70">
              <li><Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/copyright" className="hover:text-primary transition-colors">Copyright & Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-primary/30 pb-2 inline-block">Contact Info</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <span>support@al-huda.com</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Al-Huda. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
