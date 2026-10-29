"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  Users,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

export default function ParentLoginPage() {
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
        router.push("/parent");
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
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Guardian Portal
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-0.5">
                  Parent Portal Sign In
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Track your child&apos;s daily attendance, view periodic exam percentiles, review teacher feedback, and clear fee dues online.
            </p>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@gmail.com"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-teal-600 focus:outline-none"
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
                    className="text-xs text-teal-600 hover:underline"
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
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Access Parent Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-navy-900 block">First time here?</span>
                <span className="text-slate-500">Create a parent account & link your child.</span>
              </div>
              <Link
                href="/signup/parent"
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 flex items-center gap-1 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Looking for Student or Admin portal?</span>
              <div className="flex gap-2">
                <Link href="/login/student" className="text-royal-600 font-bold hover:underline">
                  Student Login
                </Link>
                <span>•</span>
                <Link href="/login/admin" className="text-royal-600 font-bold hover:underline">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-teal-800 via-teal-900 to-navy-950 text-white rounded-2xl p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-teal-300 uppercase">
                Parent & Guardian Connect
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Complete Transparency on Your Child&apos;s Academic Progress
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                Stay updated on daily lecture attendance, upcoming test schedules, installment reminders, and teacher notes.
              </p>

              <div className="space-y-3 pt-3 text-xs">
                <div className="flex items-center gap-2.5 text-teal-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time SMS & In-app attendance alerts</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure online fee installment payment via Razorpay UPI/Cards</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download official GST payment receipts instantly</span>
                </div>
                <div className="flex items-center gap-2.5 text-teal-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Monthly Parent-Teacher academic performance reviews</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-teal-700/50 mt-6 flex items-center justify-between text-xs">
              <span className="text-teal-200">Need help linking your ward?</span>
              <a
                href="https://wa.me/919389856883"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-amber-300 hover:underline"
              >
                WhatsApp Desk: 9389856883 →
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

