import { NextResponse } from "next/server";

export function middleware(req) {
    if (req.method === "OPTIONS") {
        return NextResponse.json({});
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};