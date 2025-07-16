import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.PARKS_API_AUTH;
        const baseUrl = process.env.PARKS_URI;
        const allParks: any[] = [];

        let start = 0;
        const limit = 50;
        let total = 1;

        while (start < total) {
            const response = await axios.get(`${baseUrl}?start=${start}&limit=${limit}`, {
                headers: {
                    'X-Api-Key': apiKey,
                },
            });

            const data = response.data;
            allParks.push(...data.data);
            total = parseInt(data.total, 10);
            start += limit;
        }

        return NextResponse.json({ data: allParks });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}