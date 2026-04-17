"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Enter a valid email address."),
  location: z.string().optional().or(z.literal("")),
});

export async function updateProfile(_currentState: unknown, formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Please login first.",
    };
  }

  const rawData = {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    email: String(formData.get("email") || ""),
    location: String(formData.get("location") || ""),
  };
  const profileImage = formData.get("profileImage");

  const validated = profileUpdateSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    };
  }

  try {
    const payload = new FormData();

    if (profileImage instanceof File && profileImage.size > 0) {
      payload.append("image", profileImage);
    }

    payload.append("data", JSON.stringify(validated.data));

    const response = await fetch(`${BASE_URL}/users/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: accessToken,
      },
      body: payload,
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update profile.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      message: result?.message || "Profile updated successfully.",
      data: result?.data,
    };
  } catch (error) {
    console.error("Profile update failed:", error);
    return {
      success: false,
      message: "Something went wrong while updating your profile.",
    };
  }
}
