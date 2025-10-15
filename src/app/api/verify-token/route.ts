import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const cookieHeader = request.headers.get("Cookie");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookieHeader) {
      const cookies = cookieHeader.split(";");
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith("token="));
      if (tokenCookie) {
        token = tokenCookie.split("=")[1];
      }
    }

    if (!token) {
      const body = await request.json();
      token = body.token;
    }

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message: "Token tidak ditemukan",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded){
      return NextResponse.json(
        {
          status: "error",
          message: "Token tidak valid",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Token valid",
        data: decoded,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Token tidak valid",
      },
      { status: 401 }
    );
  }
};