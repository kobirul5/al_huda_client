"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/services/profile";

interface ProfileFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    location?: string | null;
    profileImage?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [objectPreviewUrl, setObjectPreviewUrl] = useState<string | null>(null);
  const previewImage = selectedPreviewImage || user.profileImage || null;

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile updated", {
        description: state.message || "Your profile has been updated.",
      });
      router.refresh();
    } else if (state?.success === false && state?.message) {
      toast.error("Update failed", {
        description: state.message,
      });
    }
  }, [router, state]);

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) {
        URL.revokeObjectURL(objectPreviewUrl);
      }
    };
  }, [objectPreviewUrl]);

  const getErrors = (fieldName: string) => {
    if (!state || !("errors" in state) || !state.errors) return [];
    return state.errors.filter((error: { field: PropertyKey; message: string }) => error.field === fieldName);
  };

  return (
    <form action={formAction} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Update Profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep your personal details up to date.
        </p>
      </div>

      <FieldGroup className="gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <FieldContent>
              <Input name="firstName" defaultValue={user.firstName} disabled={isPending} className="h-11 rounded-xl bg-white" />
            </FieldContent>
            <FieldError errors={getErrors("firstName")} />
          </Field>

          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <FieldContent>
              <Input name="lastName" defaultValue={user.lastName} disabled={isPending} className="h-11 rounded-xl bg-white" />
            </FieldContent>
            <FieldError errors={getErrors("lastName")} />
          </Field>
        </div>

        <Field>
          <FieldLabel>Profile Image</FieldLabel>
          {previewImage && (
            <div className="mb-3">
              <Image
                src={previewImage}
                alt="Profile preview"
                width={88}
                height={88}
                className="h-22 w-22 rounded-2xl border border-border object-cover"
              />
            </div>
          )}
          <FieldContent>
            <Input
              name="profileImage"
              type="file"
              accept="image/*"
              disabled={isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  if (objectPreviewUrl) {
                    URL.revokeObjectURL(objectPreviewUrl);
                    setObjectPreviewUrl(null);
                  }
                  setSelectedPreviewImage(null);
                  return;
                }

                if (objectPreviewUrl) {
                  URL.revokeObjectURL(objectPreviewUrl);
                }
                const objectUrl = URL.createObjectURL(file);
                setObjectPreviewUrl(objectUrl);
                setSelectedPreviewImage(objectUrl);
              }}
              className="h-11 rounded-xl bg-white file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary"
            />
          </FieldContent>
          <p className="text-xs text-muted-foreground">
            Upload a new image only if you want to replace the current one.
          </p>
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input name="email" type="email" defaultValue={user.email} disabled={isPending} className="h-11 rounded-xl bg-white" />
          </FieldContent>
          <FieldError errors={getErrors("email")} />
        </Field>

        <Field>
          <FieldLabel>Location</FieldLabel>
          <FieldContent>
            <Input name="location" defaultValue={user.location ?? ""} disabled={isPending} placeholder="City, Country" className="h-11 rounded-xl bg-white" />
          </FieldContent>
          <FieldError errors={getErrors("location")} />
        </Field>

        <Button type="submit" disabled={isPending} className="mt-2 h-11 rounded-xl">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </FieldGroup>
    </form>
  );
}
