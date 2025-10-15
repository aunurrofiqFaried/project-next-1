import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create token payload
    const payload = {
      name: body.name,
      email: body.email,
    };

    // Generate token
    const token = jwt.sign(payload, JWT_SECRET);

    // Return the token
    return NextResponse.json({ token });
  } catch (error) {
    console.error("JWT Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}