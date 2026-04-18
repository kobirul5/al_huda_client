import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileForm from "@/components/modules/profile/ProfileForm";
import LogoutButton from "@/components/modules/profile/LogoutButton";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getProfile(accessToken: string) {
  const response = await fetch(`${BASE_URL}/users/profile`, {
    headers: {
      Authorization: accessToken,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load profile");
  }

  const result = await response.json();
  return result.data;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const profile = await getProfile(accessToken);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Cover Background */}
      <div className="h-30 w-full bg-linear-to-r from-primary/20 via-emerald-500/20 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>
      </div>

      <section className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex justify-start mb-6">
           <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
             <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="group-hover:-translate-x-1 transition-transform">
               <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
             Back to Home
           </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[320px_minmax(0,1fr)] items-start">
          {/* Profile Details Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-24 bg-linear-to-b from-primary/5 to-transparent"></div>
            
            <div className="relative z-10 mt-2">
              {profile.profileImage ? (
                <div className="p-1 rounded-full bg-linear-to-br from-primary to-emerald-400 mb-5 shadow-xl">
                  <Image
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-full border-4 border-card object-cover bg-card"
                  />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-linear-to-br from-primary to-emerald-400 mb-5 shadow-xl">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-card text-4xl font-bold text-primary">
                    {profile.firstName?.[0]}
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{profile.email}</p>

            <div className="mt-8 w-full space-y-4 text-sm text-left bg-muted/40 p-5 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Location
                </span>
                <span className="font-medium text-foreground">{profile.location || "Not added"}</span>
              </div>
              <div className="h-px w-full bg-border/50"></div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Account
                </span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {profile.accountType || "FREE"}
                </span>
              </div>
              <div className="h-px w-full bg-border/50"></div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Role
                </span>
                <span className="font-medium text-foreground capitalize">{profile.role?.toLowerCase()}</span>
              </div>
            </div>
            
            <LogoutButton />
          </div>

          <ProfileForm
            user={{
              firstName: profile.firstName ?? "",
              lastName: profile.lastName ?? "",
              email: profile.email ?? "",
              location: profile.location ?? "",
              profileImage: profile.profileImage ?? "",
            }}
          />
        </div>
      </section>
    </div>
  );
}
