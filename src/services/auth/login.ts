/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import z from "zod";
import { parse } from "cookie";
import { cookies } from "next/headers";

const loginValidationZodSchema = z.object({
    email: z.email({
        error: "Invalid email address",
    }),
    password: z.string().min(4, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
})

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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


export const loginUser = async (_currentState: any, formData: any): Promise<any> => {

    // let accessTokenObj: null | any = null;
    // let refreshTokenObj: null | any = null;

    try {
        const loginData = {
            email: formData.get("email"),
            password: formData.get("password"),
        }

        const valiDatedField = loginValidationZodSchema.safeParse(loginData);
        if (!valiDatedField.success) {
            return {
                success: false,
                errors: valiDatedField.error.issues.map((issue) => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                }),
            }
        }

        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const result = await res.json()

        if (!result.success) {
            return result;
        }

        const cookieHeader = res.headers.getSetCookie();
        await persistAuthToken(cookieHeader, result?.data?.token);

        return result

    } catch (error) {
        console.log(error, "User login failed");
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
}

