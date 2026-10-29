"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
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
        setError(json.error || "Invalid credentials.");
      } else {
        router.push("/student");
      }
    } catch {
      setError("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <section className="py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Sign In Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-royal-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-royal-600 bg-blue-50 px-2 py-0.5 rounded">
                  Student Portal
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-0.5">
                  Student Sign In
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Log in to view your batch timetable, download lecture DPPs, pay fees online, and check your test percentiles.
            </p>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
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
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Access Student Portal"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-navy-900 block">New to the Institute?</span>
                <span className="text-slate-500">Create a student account in 1 minute.</span>
              </div>
              <Link
                href="/signup/student"
                className="px-3.5 py-1.5 rounded-lg bg-royal-600 text-white font-bold hover:bg-royal-700 flex items-center gap-1 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Looking for Parent or Staff login?</span>
              <div className="flex gap-2">
                <Link href="/login/parent" className="text-royal-600 font-bold hover:underline">
                  Parent Login
                </Link>
                <span>•</span>
                <Link href="/login/admin" className="text-royal-600 font-bold hover:underline">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-royal-700 via-royal-800 to-navy-900 text-white rounded-2xl p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                Academic Student Desk
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Everything for Your Exam Prep in One Place
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Log in with your registered student credentials to monitor your academic trajectory and download study material.
              </p>

              <div className="space-y-3 pt-3 text-xs">
                <div className="flex items-center gap-2.5 text-blue-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time lecture attendance & timetable sync</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant fee installment payments via Razorpay & GST receipts</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Downloadable subject notes, formula sheets, and DPP modules</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CBT Mock Exam scorecards, ranking & faculty feedback</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-500/30 mt-6 flex items-center justify-between text-xs">
              <span className="text-blue-200">Have a Registration Number?</span>
              <Link href="/track" className="font-bold text-amber-300 hover:underline">
                Track Application →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

