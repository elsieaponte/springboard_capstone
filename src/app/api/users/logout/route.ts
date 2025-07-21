import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true,
        }
        )
        response.cookies.set("token", "",
            {
                httpOnly: true,
                expires: new Date(0)
            });

        return response;

    } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        return NextResponse.json({ error: message }, { status: 500 })
    }
}