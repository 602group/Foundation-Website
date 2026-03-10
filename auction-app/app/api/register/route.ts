import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
        }

        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error("[REGISTER ERROR]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
