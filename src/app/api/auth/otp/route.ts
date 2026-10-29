import { NextRequest, NextResponse } from "next/server";
import { generateAndSaveOtp, verifyOtpRecord, sendOtpEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, otp, purpose = "SIGNUP" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. SEND OTP
    if (action === "SEND_OTP") {
      // Check if email already registered for SIGNUP
      if (purpose === "SIGNUP" || purpose === "ADMIN_SIGNUP" || purpose === "PARENT_SIGNUP") {
        const existingUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (existingUser) {
          return NextResponse.json(
            { error: "An account with this email already exists. Please sign in." },
            { status: 409 }
          );
        }
      }

      const generatedOtp = await generateAndSaveOtp(cleanEmail, purpose);
      const emailResult = await sendOtpEmail(cleanEmail, generatedOtp, purpose);

      return NextResponse.json({
        success: true,
        message: emailResult.message,
        // Include code in response when SMTP is not configured so user is never stuck
        code: process.env.SMTP_USER ? undefined : generatedOtp,
      });
    }

    // 2. VERIFY OTP
    if (action === "VERIFY_OTP") {
      if (!otp) {
        return NextResponse.json({ error: "Verification code is required." }, { status: 400 });
      }

      const verification = await verifyOtpRecord(cleanEmail, otp, purpose);
      if (!verification.valid) {
        return NextResponse.json({ error: verification.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "Email verified successfully!",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("OTP API error:", error);
    return NextResponse.json(
      { error: "Failed to process verification code." },
      { status: 500 }
    );
  }
}

