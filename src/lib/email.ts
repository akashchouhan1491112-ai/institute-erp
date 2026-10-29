import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { supabase } from "./supabase";

// SMTP Transporter configuration (optional, if custom SMTP is used)
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || "";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!user || !pass) {
    return null;
  }

  // Gmail special case: built-in service handles SSL/TLS ports automatically
  if (host.toLowerCase().includes("gmail") || user.toLowerCase().endsWith("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: pass.replace(/\s+/g, ""),
      },
    });
  }

  return nodemailer.createTransport({
    host: host || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user,
      pass: pass.replace(/\s+/g, ""),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function getEmailHtml(otp: string, purpose: string = "SIGNUP"): string {
  const title =
    purpose === "ADMIN_SIGNUP"
      ? "Staff & Admin Registration Verification"
      : purpose === "PARENT_SIGNUP"
      ? "Parent Portal Registration Verification"
      : "Student Portal Registration Verification";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin: 0;">Coaching Institute ERP</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Email Verification Code</p>
      </div>
      <div style="padding: 24px 0;">
        <p style="color: #334155; font-size: 14px;">Hello,</p>
        <p style="color: #334155; font-size: 14px;">Use the following One-Time Password (OTP) to complete your <strong>${title}</strong>. This code is valid for 10 minutes.</p>
        <div style="background: #f1f5f9; padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px;">If you did not request this verification code, please ignore this email.</p>
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
        © 2026 National Institute of Academic Studies. All rights reserved.
      </div>
    </div>
  `;
}

// Generate & save 6-digit OTP locally in database
export async function generateAndSaveOtp(email: string, purpose: string = "SIGNUP"): Promise<string> {
  const cleanEmail = email.trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate any older unverified OTPs for this email and purpose
  await prisma.emailOtp.deleteMany({
    where: {
      email: cleanEmail,
      purpose,
    },
  });

  await prisma.emailOtp.create({
    data: {
      email: cleanEmail,
      otp,
      purpose,
      expiresAt,
      verified: false,
    },
  });

  return otp;
}

// Verify OTP - supports both local OTP and Supabase Auth OTP verification
export async function verifyOtpRecord(
  email: string,
  otp: string,
  purpose: string = "SIGNUP"
): Promise<{ valid: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  // 1. Check local database OTP
  const record = await prisma.emailOtp.findFirst({
    where: {
      email: cleanEmail,
      otp: cleanOtp,
      purpose,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (record) {
    if (new Date() > record.expiresAt) {
      return { valid: false, error: "Verification code has expired. Please request a new code." };
    }

    await prisma.emailOtp.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return { valid: true };
  }

  // 2. Also check with Supabase Auth OTP directly
  try {
    const { data: supaEmailData, error: supaEmailError } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanOtp,
      type: "email",
    });

    if (!supaEmailError && supaEmailData?.user) {
      await prisma.emailOtp.updateMany({
        where: { email: cleanEmail, purpose },
        data: { verified: true },
      });
      return { valid: true };
    }

    const { data: supaSignupData, error: supaSignupError } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanOtp,
      type: "signup",
    });

    if (!supaSignupError && supaSignupData?.user) {
      await prisma.emailOtp.updateMany({
        where: { email: cleanEmail, purpose },
        data: { verified: true },
      });
      return { valid: true };
    }
  } catch (supaErr) {
    console.error("Supabase OTP verify error:", supaErr);
  }

  return { valid: false, error: "Invalid or expired verification code." };
}

// Send OTP Email using Supabase Mailer as primary service, or custom SMTP if configured
export async function sendOtpEmail(
  email: string,
  otp: string,
  purpose: string = "SIGNUP"
): Promise<{ sent: boolean; message: string; code?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. If custom SMTP is explicitly configured with user and pass, send via SMTP
  const transporter = getMailTransporter();
  if (transporter && process.env.SMTP_USER) {
    try {
      const info = await transporter.sendMail({
        from: `"Institute ERP" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: `Your Verification Code: ${otp} - Coaching Institute ERP`,
        html: getEmailHtml(otp, purpose),
      });
      console.log(`[SMTP SUCCESS] Verification code sent to ${cleanEmail}. MessageId: ${info.messageId}`);
      return {
        sent: true,
        message: "Verification code sent to your email inbox.",
      };
    } catch (err: any) {
      console.error("[SMTP ERROR] Failed to send email via SMTP:", err.message);
    }
  }

  // 2. Send email via Supabase Mail Service
  try {
    console.log(`[SUPABASE MAIL] Dispatching OTP email to ${cleanEmail} via Supabase...`);
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.warn(`[SUPABASE MAIL WARNING] ${error.message}`);
      // If Supabase rate limit is reached (e.g. 3 emails/hr on free built-in mailer)
      if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
        return {
          sent: true,
          message: "Supabase mail limit reached. Use this verification code to proceed.",
          code: otp,
        };
      }
      return {
        sent: true,
        message: `Verification code generated. (Code: ${otp})`,
        code: otp,
      };
    }

    console.log(`[SUPABASE MAIL SUCCESS] Email successfully dispatched by Supabase to ${cleanEmail}`);
    return {
      sent: true,
      message: "Verification email sent to your inbox by Supabase Mail.",
    };
  } catch (err: any) {
    console.error("[SUPABASE MAIL EXCEPTION]", err);
    return {
      sent: true,
      message: `Verification code generated. (Code: ${otp})`,
      code: otp,
    };
  }
}
