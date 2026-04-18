import React from "react";
import HadithReader from "@/components/modules/hadith/HadithReader";

export async function generateStaticParams() {
  const books = [
    "bukhari",
    "muslim",
    "tirmidhi",
    "abudawud",
    "nasai",
    "ibnmajah",
    "malik",
    "ahmed",
    "darimi",
  ];

  return books.map((bookName) => ({
    bookName,
  }));
}

async function getHadiths(bookName: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/hadith/${bookName}?page=1&limit=20`, {
    cache: "no-store", // Since we want fresh data for pagination
  });

  if (!res.ok) {
    return [];
  }

  const jsonResponse = await res.json();
  return jsonResponse.data || [];
}

export default async function HadithBookPage({ params }: { params: Promise<{ bookName: string }> }) {
  const { bookName } = await params;
  const initialHadiths = await getHadiths(bookName);

  return <HadithReader bookName={bookName} initialHadiths={initialHadiths} />;
}
