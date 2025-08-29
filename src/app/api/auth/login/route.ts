import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth-service";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await AuthService.authenticateAdmin(email, password);

    if (result.success && result.token) {
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      // Set HTTP-only cookie
      response.cookies.set("admin-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: result.message || "Login failed" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
