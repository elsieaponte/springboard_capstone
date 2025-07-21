import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { error } from "console";

connect()


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        //check if user already exists
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        //save user
        const savedUser = await newUser.save()

        return NextResponse.json({
            message: "User created successfully.",
            success: true,
            savedUser
        })
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        return NextResponse.json({ error: message }, { status: 500 })
    }
} 