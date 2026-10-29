"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  CreditCard,
  Award,
  Bell,
  LogOut,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function ParentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [linkingCode, setLinkingCode] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");
  const [linking, setLinking] = useState(false);

  async function loadParentData() {
    try {
      const res = await fetch("/api/portal/parent");
      if (res.status === 401) {
        router.push("/login/parent");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to load parent portal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadParentData();
  }, []);

  async function handleLinkStudent(e: React.FormEvent) {
    e.preventDefault();
    setLinking(true);
    setLinkError("");
    setLinkSuccess("");

    try {
      const res = await fetch("/api/portal/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "LINK_STUDENT", studentCode: linkingCode }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLinkError(json.error || "Failed to link student.");
      } else {
        setLinkSuccess(json.message);
        setLinkingCode("");
        await loadParentData();
      }
    } catch {
      setLinkError("Network error while linking student.");
    } finally {
      setLinking(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login/parent");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-navy-900 font-bold">
        Loading Parent Dashboard...
      </div>
    );
  }

  const student = data?.student;
  const parent = data?.parent;
  const announcements = data?.announcements || [];

  // Attendance metrics
  const attendanceList = student?.attendance || [];
  const totalClasses = attendanceList.length;
  const presentCount = attendanceList.filter(
    (a: any) => a.status === "PRESENT" || a.status === "LATE"
  ).length;
  const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  // Fee metrics
  const feeAssignments = student?.feeAssignments || [];
  let totalAssigned = 0;
  let totalPaid = 0;
  let totalBalance = 0;
  feeAssignments.forEach((fa: any) => {
    totalAssigned += Number(fa.netAmount || fa.totalAmount || 0);
    totalPaid += Number(fa.paidAmount || 0);
    totalBalance += Number(fa.balanceAmount || 0);
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block leading-tight">
                Parent & Guardian Portal
              </span>
              <span className="text-xs text-teal-300">
                Welcome, {parent?.name || "Parent"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-300 hover:text-white hidden sm:inline"
            >
              Public Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* If no student linked yet */}
        {data?.needsLink || !student ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-navy-900">
                Link Your Child&apos;s Student Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Enter your child&apos;s Student Code or Admission Number (e.g. <code>STU-2026-1001</code>) to start tracking their attendance and marks.
              </p>
            </div>

            {linkError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {linkError}
              </div>
            )}
            {linkSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {linkSuccess}
              </div>
            )}

            <form onSubmit={handleLinkStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Code or Admission Number *
                </label>
                <input
                  type="text"
                  required
                  value={linkingCode}
                  onChange={(e) => setLinkingCode(e.target.value)}
                  placeholder="e.g. STU-2026-1001"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono uppercase focus:border-teal-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={linking}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-60"
              >
                {linking ? "Verifying..." : "Verify & Link Student"}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              Need assistance? WhatsApp the institute desk at{" "}
              <a
                href="https://wa.me/919389856883"
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 font-bold hover:underline"
              >
                +91 93898 56883
              </a>
            </div>
          </div>
        ) : (
          /* Student Academic Overview */
          <>
            {/* Header Ward Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-royal-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  {student.fullName?.[0] || "S"}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-royal-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {student.studentCode} • {student.admissionNumber}
                  </span>
                  <h1 className="text-2xl font-bold text-navy-900 mt-1">
                    {student.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Course: <strong>{student.course?.title || "Competitive Preparation"}</strong> | Status:{" "}
                    <span className="text-emerald-700 font-bold">{student.status}</span>
                  </p>
                </div>
              </div>

              {/* Batch info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shrink-0 text-xs space-y-1">
                <span className="text-slate-500 block">Allocated Batch:</span>
                <span className="font-bold text-navy-900 block text-sm">
                  {student.batches?.[0]?.batch?.name || "General Morning Batch"}
                </span>
                <span className="text-slate-600 block">
                  {student.batches?.[0]?.batch?.timing || "09:00 AM - 01:30 PM"} ({student.batches?.[0]?.batch?.days || "Mon - Sat"})
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Attendance */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Class Attendance</span>
                  <Calendar className="w-4 h-4 text-royal-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-extrabold ${attendancePct < 75 ? "text-amber-600" : "text-emerald-600"}`}>
                    {attendancePct}%
                  </span>
                  <span className="text-xs text-slate-500">
                    ({presentCount} / {totalClasses} classes)
                  </span>
                </div>
                {attendancePct < 75 ? (
                  <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Below recommended 75% target
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Consistent attendance record
                  </span>
                )}
              </div>

              {/* Metric 2: Total Fee Assigned */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Total Course Fee</span>
                  <CreditCard className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-3xl font-extrabold text-navy-900">
                  ₹{totalAssigned.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Paid: ₹{totalPaid.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Metric 3: Outstanding Due */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Outstanding Dues</span>
                  <AlertCircle className="w-4 h-4 text-royal-600" />
                </div>
                <div className={`text-3xl font-extrabold ${totalBalance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                  ₹{totalBalance.toLocaleString("en-IN")}
                </div>
                {totalBalance > 0 ? (
                  <Link
                    href="/student"
                    className="text-[11px] font-bold text-royal-700 hover:underline flex items-center gap-1"
                  >
                    Pay Installment Online →
                  </Link>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All dues cleared
                  </span>
                )}
              </div>

              {/* Metric 4: Latest Exam Result */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Latest Exam Result</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                {student.examMarks?.[0] ? (
                  <div>
                    <span className="text-2xl font-extrabold text-navy-900">
                      {student.examMarks[0].marksObtained} / {student.examMarks[0].maxMarks}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Grade: <strong>{student.examMarks[0].grade}</strong> ({student.examMarks[0].percentage}%)
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 pt-2">
                    No examination results published yet.
                  </div>
                )}
              </div>
            </div>

            {/* Attendance & Test Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Log Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-royal-600" />
                    Recent Class Attendance History
                  </h3>
                  <span className="text-xs text-slate-500">Last 30 Sessions</span>
                </div>

                {attendanceList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No attendance records marked yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700">
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Faculty Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendanceList.map((att: any) => (
                          <tr key={att.id}>
                            <td className="p-2.5 font-mono text-slate-700">{att.date}</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  att.status === "PRESENT"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : att.status === "ABSENT"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {att.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500">
                              {att.remarks || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Examination Scorecards */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Periodic Exam Scores & Percentiles
                  </h3>
                  <span className="text-xs text-slate-500">Academic Scorecards</span>
                </div>

                {(!student.examMarks || student.examMarks.length === 0) ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No exam marks recorded yet for this session.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {student.examMarks.map((m: any) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-navy-900 text-sm">
                            {m.examination?.title || m.exam?.title || "Mock Assessment"}
                          </h4>
                          <span className="font-mono font-bold text-royal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {m.marksObtained} / {m.maxMarks}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 text-[11px]">
                          <span>Score: <strong>{m.percentage}%</strong></span>
                          <span>Grade: <strong>{m.grade}</strong></span>
                          {m.rank && <span>Batch Rank: <strong>#{m.rank}</strong></span>}
                        </div>
                        {m.remarks && (
                          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                            Faculty Note: {m.remarks}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Announcements from Teachers */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-royal-600" />
                Institute & Batch Announcements for Parents
              </h3>
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No announcements at this time.</p>
              ) : (
                <div className="space-y-2.5">
                  {announcements.slice(0, 3).map((n: any) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy-900">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

