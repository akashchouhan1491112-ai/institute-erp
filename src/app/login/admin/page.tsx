"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  Users,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

export default function AdminLoginPage() {
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
        const userRole = json.user?.role;
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "TEACHER") {
          router.push("/teacher");
        } else {
          setError("This account is not authorized for the Administration Portal.");
        }
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
              <div className="w-12 h-12 rounded-xl bg-navy-900 text-amber-400 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Staff & Leadership
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-0.5">
                  Admin & Faculty Login
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Secure entrance for Institute Directors, Academic Staff, and Faculty Members to manage batches, attendance, and admissions.
            </p>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@institute.edu.in"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Account Password
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
                className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Sign In to Administration"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Admin Sign Up Card */}
            <div className="p-4 rounded-xl bg-navy-50/80 border border-navy-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-navy-900 block">
                  New Admin or Staff Member?
                </span>
                <span className="text-slate-600">
                  Register with Email OTP & institute key.
                </span>
              </div>
              <Link
                href="/signup/admin"
                className="px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-amber-300 font-bold flex items-center gap-1.5 transition text-xs shrink-0 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Admin Sign Up
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Are you a student or parent?</span>
              <div className="flex gap-2">
                <Link href="/login/student" className="text-royal-600 font-bold hover:underline">
                  Student Login
                </Link>
                <span>•</span>
                <Link href="/login/parent" className="text-royal-600 font-bold hover:underline">
                  Parent Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-navy-900 to-navy-800 text-white rounded-2xl p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                Enterprise ERP Access
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Centralized Institute Command Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Authorized staff members can oversee real-time student lifecycle workflows from a single unified workspace.
              </p>

              <div className="space-y-3 pt-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>18 Integrated Administrative ERP Modules</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated Batch Capacity & Schedule Enforcement</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cryptographic Server-Verified Audit Trails</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-navy-700/60 mt-6">
              <span className="text-xs text-slate-400 block">Default Super Admin Bootstrap:</span>
              <span className="text-xs font-mono font-bold text-amber-300">admin@institute.edu.in</span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

