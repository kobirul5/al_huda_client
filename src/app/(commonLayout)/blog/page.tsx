"use client";

import Image from "next/image";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Preparing Your Heart for Ramadan",
    excerpt: "Discover spiritual and practical ways to prepare for the blessed month of Ramadan and maximize its benefits. Learn how to set goals and build habits.",
    category: "Ramadan",
    author: "Sheikh Ahmed",
    date: "March 10, 2026",
    image: "/assets/blog-ramadan.png",
  },
  {
    id: 2,
    title: "The Essence of Khushu in Prayer",
    excerpt: "Learn how to achieve deeper concentration and tranquility in your daily prayers through mindful practices and understanding the meanings.",
    category: "Spirituality",
    author: "Zainab Ali",
    date: "March 05, 2026",
    image: "/assets/blog-prayer.png",
  },
  {
    id: 3,
    title: "Authentic Hadith in the Digital Age",
    excerpt: "How technology is helping us preserve and verify the prophetic traditions for future generations through advanced verification algorithms.",
    category: "Technology",
    author: "Dr. Omar",
    date: "Feb 28, 2026",
    image: "/assets/blog-hero.png",
  },
  {
    id: 4,
    title: "The Power of Community Charity",
    excerpt: "Exploring the impact of collective Zakat and Sadaqah on local communities and how it fosters social justice and empathy.",
    category: "Community",
    author: "Mariam Khan",
    date: "Feb 20, 2026",
    image: "/assets/about-us-hero.png",
  }
];

const CATEGORIES = ["All", "Spirituality", "Ramadan", "Technology", "Community"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src="/assets/blog-hero.png"
          alt="Al-Huda Blog"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Islamic <span className="text-primary">Insights</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 leading-relaxed font-light">
            Deepen your knowledge and find inspiration through our curated articles on faith, technology, and community.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
      </section>

      {/* Filters & Search */}
      <section className="py-12 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === category 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-12 h-12 rounded-full bg-muted/30 border-border focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <article 
                  key={post.id} 
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-bold group/btn" asChild>
                      <Link href={`/blog/${post.id}`} className="flex items-center gap-2">
                        Read Full Article 
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No articles found</h2>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              <Button 
                variant="link" 
                className="mt-4 text-primary font-bold"
                onClick={() => {setActiveCategory("All"); setSearchQuery("");}}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Load More Button (Mock) */}
          {filteredPosts.length > 0 && (
            <div className="mt-20 text-center">
              <Button size="lg" variant="outline" className="rounded-full px-12 h-14 font-bold border-primary/20 hover:bg-primary/5">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
