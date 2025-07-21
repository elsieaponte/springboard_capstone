import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import { connect } from "@/dbConfig/dbConfig"

connect()

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const body = await request.json()
        const { parkId, parkName, imageUrl } = body

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        //avoid duplicates
        const alreadyVisited = user.visitedParks?.some((p: any) => p.parkId === parkId)
        if (alreadyVisited) {
            return NextResponse.json({ message: "Already marked as visited", success: true })
        }

        user.visitedParks = [...(user.visitedParks || []), { parkId, parkName, imageUrl }]
        await user.save()

        return NextResponse.json({ message: "Marked as visited", success: true })

    } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        return NextResponse.json({ error: message }, { status: 500 })
    }
}