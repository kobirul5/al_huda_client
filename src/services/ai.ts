"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

// Check if user is logged in
export async function checkAiAuth(): Promise<{ success: boolean; message?: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, message: "Please login first." };
  }
  return { success: true };
}

// Ask Scholar AI (Protected)
export async function askAlHudaAI(
  prompt: string,
  category: string,
  language: string
): Promise<any> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, message: "Please login first." };
  }

  try {
    const res = await fetch(`${BASE_URL}/ai/suggestion`, {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, category, language }),
      cache: "no-store"
    });

    const result = await res.json();

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to retrieve guidance from OpenRouter."
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("AI service fetch failed:", error);
    return { success: false, message: "Something went wrong while connecting to the AI engine." };
  }
}

// Retrieve AI Search History from DB (Protected)
export async function getAiHistory(): Promise<any> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, message: "Please login first." };
  }

  try {
    const res = await fetch(`${BASE_URL}/ai/history`, {
      method: "GET",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    const result = await res.json();

    if (!res.ok || !result?.success) {
      return { success: false, message: result?.message || "Failed to load history." };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Get AI history failed:", error);
    return { success: false, message: "Something went wrong while loading history." };
  }
}

// Delete single AI History item from DB (Protected)
export async function deleteAiHistoryItem(historyId: string): Promise<any> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, message: "Please login first." };
  }

  try {
    const res = await fetch(`${BASE_URL}/ai/history/${historyId}`, {
      method: "DELETE",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result?.success) {
      return { success: false, message: result?.message || "Failed to delete history item." };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete AI history item failed:", error);
    return { success: false, message: "Something went wrong while deleting history item." };
  }
}
