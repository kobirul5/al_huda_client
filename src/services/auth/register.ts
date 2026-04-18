/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import z from "zod";
import { parse } from "cookie";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const registerValidationZodSchema = z.object({
    email: z.string().email({
        message: "Invalid email address",
    }),
    firstName: z.string().min(1, "First Name is required").max(32, "First Name must be at most 32 characters"),
    lastName: z.string().min(1, "Last Name is required").max(32, "Last Name must be at most 32 characters"),
    location: z.string().optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const persistAuthToken = async (cookieHeader: string[], tokenFromBody?: string) => {
    const cookieStore = await cookies();
    let savedToken = tokenFromBody;

    if (cookieHeader && cookieHeader.length > 0) {
        cookieHeader.forEach((cookie) => {
            const parsedCookie = parse(cookie);
            const cookieName = Object.keys(parsedCookie)[0];
            const cookieValue = parsedCookie[cookieName];

            if ((cookieName === "token" || cookieName === "accessToken") && cookieValue) {
                savedToken = cookieValue;
            }
        });
    }

    if (savedToken) {
        cookieStore.set("accessToken", savedToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }
};


export const registerUser = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
        const rawData = {
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            location: formData.get("location"),
        };

        const validatedField = registerValidationZodSchema.safeParse(rawData);

        if (!validatedField.success) {
            return {
                success: false,
                errors: validatedField.error.issues.map((issue) => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                }),
            }
        }

        const payload = {
            email: rawData.email,
            password: rawData.password,
            firstName: rawData.firstName,
            lastName: rawData.lastName,
            location: rawData.location,
        };

        console.log("Registering user with payload:", payload);
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            body: JSON.stringify({ data: payload }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        console.log("API Response Status:", res);
        const result = await res.json();

        if (!result.success) {
            return result;
        }

        // Handle cookies for session persistence
        const cookieHeader = res.headers.getSetCookie();
        await persistAuthToken(cookieHeader, result?.data?.token);

        return result;

    } catch (error) {
        console.error("User registration failed", error);
        return { success: false, message: "Internal server error" };
    }
}
