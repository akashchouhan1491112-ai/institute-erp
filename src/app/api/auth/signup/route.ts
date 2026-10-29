import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
  logAudit,
  SessionUser,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role = "STUDENT",
      name,
      email,
      phone,
      password,
      // Student-specific fields
      courseId,
      qualification,
      city,
      state,
      // Parent-specific fields
      studentCode,
      relation,
    } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Name, email, phone number, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, "").slice(-10);

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const mainBranch = await prisma.branch.findFirst({ where: { isMain: true } });

    // 1. STUDENT SIGNUP
    if (role === "STUDENT") {
      const studentCount = await prisma.student.count();
      const codeSuffix = 1000 + studentCount + 1;
      const genStudentCode = `STU-2026-${codeSuffix}`;
      const genAdmissionNumber = `ADM-2026-${codeSuffix}`;

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash,
          role: "STUDENT",
          student: {
            create: {
              studentCode: genStudentCode,
              admissionNumber: genAdmissionNumber,
              fullName: name.trim(),
              dob: "2008-01-01",
              gender: "MALE",
              phone: cleanPhone,
              email: cleanEmail,
              address: city ? `${city}, ${state || "India"}` : "Main Campus City",
              city: city?.trim() || "New Delhi",
              state: state?.trim() || "Delhi",
              pinCode: "110001",
              qualification: qualification || "Class 10 / 12",
              previousSchool: "Senior Secondary School",
              branchId: mainBranch?.id || null,
              courseId: courseId || null,
              status: "ACTIVE",
            },
          },
        },
        include: {
          student: true,
        },
      });

      const sessionUser: SessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "STUDENT",
        studentId: user.student?.id || null,
      };

      const token = await createSessionToken(sessionUser);

      await logAudit({
        actorId: user.id,
        actorName: user.name,
        actorRole: "STUDENT",
        action: "STUDENT_SIGNUP",
        entityType: "USER",
        entityId: user.id,
        details: `Student ${user.name} registered successfully with code ${genStudentCode}`,
      });

      const response = NextResponse.json({
        success: true,
        message: "Student account created successfully!",
        user: sessionUser,
        studentCode: genStudentCode,
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. PARENT SIGNUP
    if (role === "PARENT") {
      // Find linked student if code provided
      let linkedStudentId: string | null = null;
      let linkedStudentName = "";

      if (studentCode) {
        const student = await prisma.student.findFirst({
          where: {
            OR: [
              { studentCode: studentCode.trim().toUpperCase() },
              { admissionNumber: studentCode.trim().toUpperCase() },
            ],
          },
        });
        if (student) {
          linkedStudentId = student.id;
          linkedStudentName = student.fullName;
        }
      }

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash,
          role: "PARENT",
        },
      });

      // If linked student found, create/update guardian entry
      if (linkedStudentId) {
        await prisma.guardian.upsert({
          where: { studentId: linkedStudentId },
          update: {
            guardianEmail: cleanEmail,
            guardianPhone: cleanPhone,
          },
          create: {
            studentId: linkedStudentId,
            fatherName: relation === "MOTHER" ? "Guardian" : name.trim(),
            motherName: relation === "MOTHER" ? name.trim() : "Guardian",
            guardianEmail: cleanEmail,
            guardianPhone: cleanPhone,
            occupation: "Parent / Professional",
            emergencyPhone: cleanPhone,
          },
        });
      }

      const sessionUser: SessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "PARENT",
        studentId: linkedStudentId,
      };

      const token = await createSessionToken(sessionUser);

      await logAudit({
        actorId: user.id,
        actorName: user.name,
        actorRole: "PARENT",
        action: "PARENT_SIGNUP",
        entityType: "USER",
        entityId: user.id,
        details: `Parent ${user.name} created account${linkedStudentName ? ` linked to student ${linkedStudentName}` : ""}`,
      });

      const response = NextResponse.json({
        success: true,
        message: linkedStudentName
          ? `Parent account created and linked to student ${linkedStudentName}!`
          : "Parent account created successfully!",
        user: sessionUser,
        linkedStudentName,
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid role specified for signup." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please check your details and try again." },
      { status: 500 }
    );
  }
}

