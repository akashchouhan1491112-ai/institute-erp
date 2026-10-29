import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try finding the student
    let studentId = user.studentId;
    if (!studentId) {
      const guardian = await prisma.guardian.findFirst({
        where: {
          OR: [{ guardianEmail: user.email }, { guardianPhone: user.phone || "" }],
        },
      });
      if (guardian) {
        studentId = guardian.studentId;
      }
    }

    if (!studentId) {
      return NextResponse.json({
        needsLink: true,
        parent: { name: user.name, email: user.email },
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        course: { select: { id: true, title: true, code: true, duration: true } },
        batches: {
          include: {
            batch: {
              select: {
                id: true,
                name: true,
                timing: true,
                days: true,
                room: true,
              },
            },
          },
        },
        attendance: {
          orderBy: { date: "desc" },
          take: 30,
        },
        examMarks: {
          include: {
            examination: { select: { title: true, maxMarks: true, examDate: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        feeAssignments: {
          include: {
            installments: { orderBy: { installmentNo: "asc" } },
            payments: { orderBy: { paidAt: "desc" } },
          },
        },
        guardian: true,
      },
    });

    if (!student) {
      return NextResponse.json({
        needsLink: true,
        parent: { name: user.name, email: user.email },
      });
    }

    // Announcements targeted to students / all
    const announcements = await prisma.notification.findMany({
      where: {
        roleTarget: { in: ["ALL", "STUDENT", "PARENT"] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      needsLink: false,
      parent: { name: user.name, email: user.email },
      student,
      announcements,
    });
  } catch (error: any) {
    console.error("Parent portal error:", error);
    return NextResponse.json(
      { error: "Failed to load parent portal data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, studentCode } = await req.json();

    if (action === "LINK_STUDENT" && studentCode) {
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { studentCode: studentCode.trim().toUpperCase() },
            { admissionNumber: studentCode.trim().toUpperCase() },
          ],
        },
      });

      if (!student) {
        return NextResponse.json(
          { error: "No student found with this Student Code or Admission Number." },
          { status: 404 }
        );
      }

      await prisma.guardian.upsert({
        where: { studentId: student.id },
        update: {
          guardianEmail: user.email,
        },
        create: {
          studentId: student.id,
          fatherName: "Parent / Guardian",
          motherName: "Parent / Guardian",
          guardianEmail: user.email,
          guardianPhone: "",
          occupation: "Parent",
          emergencyPhone: "",
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully linked to ${student.fullName} (${student.studentCode})!`,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Parent link error:", error);
    return NextResponse.json(
      { error: "Failed to link student." },
      { status: 500 }
    );
  }
}

