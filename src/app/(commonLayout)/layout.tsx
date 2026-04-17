import PublicNavbar from "@/components/shared/PublicNavbar";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getCurrentUser(accessToken: string) {
  const response = await fetch(`${BASE_URL}/users/profile`, {
    headers: {
      Authorization: accessToken,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  return result.data ?? null;
}

export default async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let user: { email?: string; id?: string; profileImage?: string | null } | null = null;
  if (accessToken) {
    try {
      const profile = await getCurrentUser(accessToken);
      if (profile) {
        user = {
          id: profile.id,
          email: profile.email,
          profileImage: profile.profileImage || null,
        };
      }
    } catch (error) {
      console.error("Profile fetch error in layout:", error);
    }
  }

  return (
    <>
      <PublicNavbar user={user} />
      {children}
    </>
  );
}
