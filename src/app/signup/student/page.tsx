"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  BookOpen,
  MapPin,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function StudentSignupPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    courseId: "",
    qualification: "Class 11 / 12 Appearing",
    city: "",
    state: "Delhi NCR",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/overview")
      .then((r) => r.json())
      .then((res) => {
        if (res?.courses?.length > 0) {
          setCourses(res.courses);
          setForm((prev) => ({ ...prev, courseId: res.courses[0].id }));
        }
      })
      .catch(console.error);
  }, []);

  async function handleSendOtp() {
    if (!form.email || !form.email.includes("@")) {
      setError("Please enter a valid student email address first.");
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
          purpose: "SIGNUP",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to send OTP.");
      } else {
        setOtpSent(true);
        if (json.code) {
          setOtpHint(`Demo Mode Code: ${json.code} (Enter this code or configure Resend/SMTP)`);
          setForm((prev) => ({ ...prev, otp: json.code }));
        } else {
          setOtpHint("Verification email sent to your inbox. Please check your email for the 6-digit code.");
          setForm((prev) => ({ ...prev, otp: "" }));
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
        body: JSON.stringify({
          role: "STUDENT",
          ...form,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to create account.");
      } else {
        setSuccess(
          `Account created successfully! Your Student ID is ${json.studentCode}. Redirecting to Student Portal...`
        );
        setTimeout(() => {
          router.push("/student");
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
              <div className="w-12 h-12 rounded-xl bg-royal-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-royal-600 bg-blue-50 px-2 py-0.5 rounded">
                  New Student Registration
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-0.5">
                  Create Student Portal Account
                </h1>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login/student" className="text-royal-600 font-bold hover:underline">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email & OTP Send Button */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs transition disabled:opacity-60"
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

            {/* OTP & Password */}
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
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono tracking-widest uppercase focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password *
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
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Course / Competitive Exam
                </label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:border-royal-600 focus:outline-none"
                >
                  {courses.length === 0 ? (
                    <option value="">General Academic Preparation</option>
                  ) : (
                    courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.duration})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Qualification / Class
                </label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  placeholder="e.g. Class 11 / Class 12 / Dropper"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="e.g. Delhi NCR / Uttar Pradesh"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm focus:border-royal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-60"
              >
                {loading ? "Creating Student Account..." : "Verify OTP & Access Student Portal"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Are you a Parent or Staff member?</span>
            <div className="flex gap-2">
              <Link href="/signup/parent" className="text-royal-600 font-bold hover:underline">
                Parent Sign Up
              </Link>
              <span>•</span>
              <Link href="/signup/admin" className="text-navy-900 font-bold hover:underline">
                Admin Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
