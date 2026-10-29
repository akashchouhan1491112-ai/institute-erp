"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Users,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("role") || "STUDENT";

  const [activeRole, setActiveRole] = useState<"STUDENT" | "PARENT" | "ADMIN">(
    defaultTab === "admin"
      ? "ADMIN"
      : defaultTab === "parent"
      ? "PARENT"
      : "STUDENT"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Invalid email or password.");
      } else {
        const userRole = json.user?.role;
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "TEACHER") {
          router.push("/teacher");
        } else if (userRole === "PARENT") {
          router.push("/parent");
        } else {
          router.push("/student");
        }
      }
    } catch {
      setError("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 lg:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-royal-600 bg-blue-50 px-3 py-1 rounded-full">
            Institutional Portal Access
          </span>
          <h1 className="text-3xl font-extrabold text-navy-900">
            Sign In to Your ERP Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Select your role below to access dedicated dashboards for Students, Parents, or Administration.
          </p>
        </div>

        {/* 3 Quick Role Switcher Cards / Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveRole("STUDENT");
              setError("");
            }}
            className={`p-5 rounded-2xl border text-left transition-all ${
              activeRole === "STUDENT"
                ? "border-royal-600 bg-blue-50/50 shadow-md ring-2 ring-royal-600/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-royal-600 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              {activeRole === "STUDENT" && (
                <span className="text-[11px] font-bold text-royal-700 bg-white px-2 py-0.5 rounded-full border border-royal-200">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-navy-900">Student Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Class timetable, tests, DPP downloads & online fee payments.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole("PARENT");
              setError("");
            }}
            className={`p-5 rounded-2xl border text-left transition-all ${
              activeRole === "PARENT"
                ? "border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-600/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              {activeRole === "PARENT" && (
                <span className="text-[11px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-navy-900">Parent / Guardian</h2>
            <p className="text-xs text-slate-500 mt-1">
              Daily attendance logs, scorecards & fee installment dues.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole("ADMIN");
              setError("");
            }}
            className={`p-5 rounded-2xl border text-left transition-all ${
              activeRole === "ADMIN"
                ? "border-navy-900 bg-navy-50/50 shadow-md ring-2 ring-navy-900/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {activeRole === "ADMIN" && (
                <span className="text-[11px] font-bold text-navy-900 bg-white px-2 py-0.5 rounded-full border border-navy-300">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-navy-900">Admin & Faculty</h2>
            <p className="text-xs text-slate-500 mt-1">
              Institute management, admissions, batch roster & marks entry.
            </p>
          </button>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
              {activeRole === "STUDENT"
                ? "Student Portal Sign In"
                : activeRole === "PARENT"
                ? "Parent Portal Sign In"
                : "Staff & Admin Command Login"}
            </span>
            <h2 className="text-xl font-bold text-navy-900 mt-1">
              Enter Your Account Credentials
            </h2>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeRole === "ADMIN"
                  ? "Staff / Admin Email"
                  : activeRole === "PARENT"
                  ? "Registered Parent Email"
                  : "Registered Student Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeRole === "ADMIN"
                      ? "admin@institute.edu.in"
                      : activeRole === "PARENT"
                      ? "parent@gmail.com"
                      : "student@gmail.com"
                  }
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-royal-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60 ${
                activeRole === "ADMIN"
                  ? "bg-navy-900 hover:bg-navy-800 text-amber-300"
                  : activeRole === "PARENT"
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-royal-600 hover:bg-royal-700"
              }`}
            >
              {loading
                ? "Signing In..."
                : activeRole === "ADMIN"
                ? "Access Administration"
                : activeRole === "PARENT"
                ? "Access Parent Dashboard"
                : "Access Student Portal"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sign Up Link for Students & Parents */}
          {activeRole !== "ADMIN" ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-navy-900 block">
                  Don&apos;t have an account yet?
                </span>
                <span className="text-slate-500">
                  {activeRole === "STUDENT"
                    ? "Register as a student in 1 minute."
                    : "Register as a parent & link your child."}
                </span>
              </div>
              <Link
                href={activeRole === "STUDENT" ? "/signup/student" : "/signup/parent"}
                className={`px-3.5 py-1.5 rounded-lg text-white font-bold flex items-center gap-1 transition ${
                  activeRole === "PARENT"
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-royal-600 hover:bg-royal-700"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span>Super Administrator bootstrap credentials: </span>
              <code className="font-mono font-bold text-navy-900">admin@institute.edu.in</code>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link href="/signup" className="text-xs text-royal-600 font-semibold hover:underline">
              View All Account Options & Sign-Up Hub →
            </Link>
          </div>
        </div>
      </section>
  );
}

export default function LoginPage() {
  return (
    <PublicLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-bold text-navy-900">
            Loading Portal...
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </PublicLayout>
  );
}
