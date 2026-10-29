import nodemailer from "nodemailer";
import { Resend } from "resend";
import { prisma } from "./prisma";

// Initialize Resend client if API key is provided
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

// SMTP Transporter configuration (optional, if custom SMTP is used)
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || "";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!user || !pass) {
    return null;
  }

  // Gmail built-in service helper
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

// Generate an ultra-professional, responsive HTML email template
export function getProfessionalOtpEmailHtml(otp: string, purpose: string = "SIGNUP"): string {
  const roleTitle =
    purpose === "ADMIN_SIGNUP"
      ? "Staff & Administrative Portal"
      : purpose === "PARENT_SIGNUP"
      ? "Parent & Guardian Portal"
      : "Student Academic Portal";

  const instituteName = process.env.NEXT_PUBLIC_INSTITUTE_NAME || "National Institute of Academic Studies";
  const whatsappNumber = "+91 93898 56883";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code - ${instituteName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <!-- Preview text visible in inbox list -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Your security verification code is ${otp}. Use this code to complete your registration for ${instituteName}.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 32px 28px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.12); padding: 6px 16px; border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 12px;">
                      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #fde047;">
                        Enterprise ERP Security
                      </span>
                    </div>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 6px; letter-spacing: -0.5px;">
                      ${instituteName}
                    </h1>
                    <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                      Official Account Verification Notice
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px;">
                Hello,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
                You are registering for access to the <strong>${roleTitle}</strong>. Please use the one-time verification code below to confirm your email identity and complete your account creation:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="background-color: #f8fafc; border: 2px dashed #93c5fd; border-radius: 14px; padding: 26px 20px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 8px;">
                      Single-Use Security Code
                    </div>
                    <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #1e3a8a; font-family: 'Courier New', Courier, monospace; padding-left: 12px;">
                      ${otp}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 10px; font-weight: 500;">
                      ⏱ Valid for 10 minutes only
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Warning Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 0 8px 8px 0;">
                    <p style="font-size: 12px; line-height: 1.5; color: #92400e; margin: 0;">
                      <strong>Security Tip:</strong> Never share this code with anyone. Institutional staff or faculty will never contact you asking for your verification code.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0 0 8px;">
                If you did not request this verification code, please ignore this email. No changes will be made to your institutional profile.
              </p>
            </td>
          </tr>

          <!-- Contact & Support Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; padding-bottom: 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size: 12px; color: #64748b; line-height: 1.5;">
                      <strong>Questions or need assistance?</strong><br>
                      Admissions Helpdesk WhatsApp: <a href="https://wa.me/919389856883" style="color: #2563eb; text-decoration: none; font-weight: 600;">${whatsappNumber}</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px; line-height: 1.4;">
                This is an automated system notification from ${instituteName} ERP System.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
                © 2026 ${instituteName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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

// Verify OTP against database
export async function verifyOtpRecord(
  email: string,
  otp: string,
  purpose: string = "SIGNUP"
): Promise<{ valid: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const record = await prisma.emailOtp.findFirst({
    where: {
      email: cleanEmail,
      otp: cleanOtp,
      purpose,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { valid: false, error: "Invalid verification code. Please check and try again." };
  }

  if (new Date() > record.expiresAt) {
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }

  await prisma.emailOtp.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return { valid: true };
}

// Send OTP Email using professional transactional email service
export async function sendOtpEmail(
  email: string,
  otp: string,
  purpose: string = "SIGNUP"
): Promise<{ sent: boolean; message: string; provider: string; code?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const html = getProfessionalOtpEmailHtml(otp, purpose);
  const subject = `Your Verification Code: ${otp} - National Institute of Academic Studies`;

  // 1. Gmail SMTP / Custom SMTP (Can send to ANY email address in the world!)
  const transporter = getMailTransporter();
  if (transporter && process.env.SMTP_USER) {
    try {
      const text = `Your verification code is: ${otp}\n\nValid for 10 minutes for National Institute of Academic Studies ERP registration.\n\nIf you did not request this code, please ignore this message.`;
      const info = await transporter.sendMail({
        from: `"National Institute ERP" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject,
        text,
        html,
      });
      console.log(`[SMTP SUCCESS] Dispatched OTP to ${cleanEmail}. MessageId: ${info.messageId}`);
      return {
        sent: true,
        message: "Verification email sent. Please check your inbox (and Spam folder).",
        provider: "gmail_smtp",
      };
    } catch (err: any) {
      console.error("[SMTP ERROR]", err.message);
    }
  }

  // 2. Resend API (Fallback if SMTP not set)
  if (resendClient) {
    try {
      const fromEmail = process.env.EMAIL_FROM || "Institute ERP <onboarding@resend.dev>";
      const { data, error } = await resendClient.emails.send({
        from: fromEmail,
        to: cleanEmail,
        subject,
        html,
      });

      if (error) {
        console.error("[RESEND ERROR]", error);
        // Resend free test domain (onboarding@resend.dev) delivers to the registered account email (akashchouhan1491112@gmail.com)
        const isSandboxRestricted = error.name === "validation_error" || (error as any).statusCode === 403;
        if (isSandboxRestricted) {
          return {
            sent: false,
            message: `Resend sandbox delivers to akashchouhan1491112@gmail.com. (Code: ${otp})`,
            provider: "resend_sandbox",
            code: otp,
          };
        }
      } else {
        console.log(`[RESEND SUCCESS] Dispatched OTP to ${cleanEmail}. Id: ${data?.id}`);
        return {
          sent: true,
          message: "Verification email sent to your inbox.",
          provider: "resend",
        };
      }
    } catch (err: any) {
      console.error("[RESEND EXCEPTION]", err.message);
    }
  }

  // 3. Fallback when neither Resend API Key nor SMTP credentials are fully connected
  console.log(`[DEV OTP NOTIFICATION] Email: ${cleanEmail} | OTP: ${otp}`);
  return {
    sent: false,
    message: "Email service provider not yet connected. For demo/testing, code is provided below.",
    provider: "local",
    code: otp,
  };
}
