import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.PARKS_API_AUTH;
        const baseUrl = process.env.PARKS_URI;

        const { searchParams } = new URL(request.url)
        const parkCode = searchParams.get("parkCode");

        if (!parkCode) {
            return NextResponse.json(
                { error: "Missing required query param: parkCode" },
                { status: 400 }
            )
        }

        const response = await axios.get(`${baseUrl}?parkCode=${parkCode}`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });

        const parkData = response.data;

        return NextResponse.json({ data: parkData });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}