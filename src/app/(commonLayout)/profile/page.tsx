import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileForm from "@/components/modules/profile/ProfileForm";

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
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-foreground">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            View your account details and update them anytime.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-8 md:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          {profile.profileImage ? (
            <Image
              src={profile.profileImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {profile.firstName?.[0]}
            </div>
          )}
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground">Location</p>
              <p className="text-muted-foreground">{profile.location || "Not added yet"}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Account Type</p>
              <p className="text-muted-foreground">{profile.accountType || "FREE"}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Role</p>
              <p className="text-muted-foreground">{profile.role}</p>
            </div>
          </div>
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
      </section>
    </div>
  );
}
