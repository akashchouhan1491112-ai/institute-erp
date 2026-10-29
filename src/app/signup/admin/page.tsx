"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "ADMIN",
    designation: "Academic Administrator",
    department: "Admissions & ERP Operations",
    accessCode: "ADMIN2026",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSendOtp() {
    if (!form.email || !form.email.includes("@")) {
      setError("Please enter a valid email address first.");
      return;
    }
    setError("");
    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_OTP",
          email: form.email,
          purpose: "ADMIN_SIGNUP",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to send OTP.");
      } else {
        setOtpSent(true);
        if (json.code) {
          setOtpHint(`Verification Code: ${json.code}`);
        } else {
          setOtpHint("Verification code sent to your email.");
        }
      }
    } catch {
      setError("Network error sending OTP.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!form.otp || form.otp.length < 6) {
      setError("Please enter the 6-digit email verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to register administrative account.");
      } else {
        setSuccess(
          `${form.role === "TEACHER" ? "Faculty" : "Administrator"} account created successfully! Redirecting...`
        );
        setTimeout(() => {
          if (form.role === "TEACHER") {
            router.push("/teacher");
          } else {
            router.push("/admin");
          }
        }, 1500);
      }
    } catch {
      setError("Network error while creating account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy-900 text-amber-400 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
                  Staff & Leadership Registration
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-0.5">
                  Admin & Faculty Account Sign Up
                </h1>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login/admin" className="text-royal-600 font-bold hover:underline">
                Sign In here
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Verma"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-navy-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email & OTP Send Button */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@institute.edu.in"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs transition disabled:opacity-60"
                >
                  {otpLoading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send Email OTP"}
                </button>
              </div>
            </div>

            {otpHint && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center justify-between">
                <span>{otpHint}</span>
              </div>
            )}

            {/* OTP Code & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6-Digit Email OTP *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono tracking-widest uppercase focus:border-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-navy-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Role & Access Key */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role / Position
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                      designation:
                        e.target.value === "TEACHER"
                          ? "Senior Subject Faculty"
                          : "Academic Administrator",
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:border-navy-900 focus:outline-none"
                >
                  <option value="ADMIN">Administrative Officer / Staff</option>
                  <option value="TEACHER">Faculty Member / Teacher</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Institute Access Key *
                  </label>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                    Default: ADMIN2026
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={form.accessCode}
                  onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
                  placeholder="e.g. ADMIN2026"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm font-mono tracking-wider focus:border-navy-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60"
              >
                {loading ? "Registering Staff..." : "Create Staff / Admin Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Are you a student or parent?</span>
            <div className="flex gap-2">
              <Link href="/signup/student" className="text-royal-600 font-bold hover:underline">
                Student Sign Up
              </Link>
              <span>•</span>
              <Link href="/signup/parent" className="text-royal-600 font-bold hover:underline">
                Parent Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

