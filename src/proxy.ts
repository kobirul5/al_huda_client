
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const accessToken = request.cookies.get("accessToken")?.value;

    const isAuthPage = pathname === "/login" || pathname === "/register";

    // If user is logged in and tries to access login/register
    if (accessToken && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url)); // dashboard/home এ পাঠাও
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};