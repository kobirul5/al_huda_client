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
    <div className="flex flex-col gap-1 pr-4">
      <h3 className="mb-4 flex items-center gap-2 px-2 text-lg font-bold text-primary">
        <BookOpen className="h-5 w-5" />
        Hadith Books
      </h3>
      <div className="flex flex-col gap-1">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/hadith/${book.id}`}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/5",
              bookName === book.id
                ? "bg-primary/10 font-medium text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {book.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
