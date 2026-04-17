import PublicNavbar from "@/components/shared/PublicNavbar";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let user: { email?: string; id?: string; profileImage?: string | null } | null = null;
  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken);

      if (decoded && typeof decoded !== "string") {
        const payload = decoded as JwtPayload & { email?: string; id?: string };

        user = {
          id: payload.id,
          email: payload.email,
          profileImage: null,
        };
      }
    } catch (error) {
      console.error("JWT Decode Error in layout:", error);
    }
  }

  return (
    <>
      <PublicNavbar user={user} />
      {children}
    </>
  );
}
