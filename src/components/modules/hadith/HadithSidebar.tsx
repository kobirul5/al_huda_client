"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

const books = [
  { id: "bukhari", name: "Sahih al-Bukhari" },
  { id: "muslim", name: "Sahih Muslim" },
  { id: "tirmidhi", name: "Jami' at-Tirmidhi" },
  { id: "abudawud", name: "Sunan Abi Dawud" },
  { id: "nasai", name: "Sunan an-Nasa'i" },
  { id: "ibnmajah", name: "Sunan Ibn Majah" },
  { id: "malik", name: "Muwatta Malik" },
  { id: "ahmed", name: "Musnad Ahmed" },
  { id: "darimi", name: "Sunan ad-Darimi" },
];

export default function HadithSidebar() {
  const { bookName } = useParams();

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:p-5">
      <h3 className="mb-4 flex items-center gap-2 border-b border-border pb-4 text-lg font-bold text-primary">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-5 w-5" />
        </span>
        <span>Hadith Books</span>
      </h3>
      <div className="flex flex-col gap-1.5">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/hadith/${book.id}`}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all",
              bookName === book.id
                ? "border-primary/20 bg-primary/10 font-semibold text-primary shadow-sm"
                : "border-transparent text-muted-foreground hover:border-primary/10 hover:bg-primary/5 hover:text-primary"
            )}
          >
            <span className="truncate">{book.name}</span>
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full transition",
                bookName === book.id ? "bg-primary" : "bg-border"
              )}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
