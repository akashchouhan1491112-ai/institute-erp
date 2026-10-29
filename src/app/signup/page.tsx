"use client";

import React from "react";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SignupHubPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-royal-700 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
            Online Registration & ERP Accounts
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Create Your Account with Email OTP Verification
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto">
            Choose your portal role below to sign up as an enrolled Student, a Parent/Guardian, or an Institute Administrator.
          </p>
        </div>
      </section>

      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Student Account */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-royal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-royal-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Student Portal
                </span>
                <h2 className="text-xl font-bold text-navy-900 mt-2">
                  Student Sign Up
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  For students preparing for competitive entrance exams or foundation classes.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verify with 6-digit email OTP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access daily batch timetable & notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CBT mock tests & online fee payments</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                href="/signup/student"
                className="w-full py-3 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
              >
                Sign Up as Student
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                Already registered?{" "}
                <Link href="/login/student" className="text-royal-600 font-bold hover:underline">
                  Student Login
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Parent Account */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                  Guardian Portal
                </span>
                <h2 className="text-xl font-bold text-navy-900 mt-2">
                  Parent / Guardian Sign Up
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  For parents to monitor daily attendance, scorecards, and pay fee installments.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verify with 6-digit email OTP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Daily presence & absence updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Direct link to student profile</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                href="/signup/parent"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
              >
                Sign Up as Parent
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                Already registered?{" "}
                <Link href="/login/parent" className="text-teal-600 font-bold hover:underline">
                  Parent Login
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Admin / Staff Account */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-900 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                  Staff & Leadership
                </span>
                <h2 className="text-xl font-bold text-navy-900 mt-2">
                  Admin & Faculty Sign Up
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  For institute administrators, directors, and teaching faculty members.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Official email OTP authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Institute Access Key protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Full ERP management authorization</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                href="/signup/admin"
                className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
              >
                Sign Up as Staff / Admin
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                Already registered?{" "}
                <Link href="/login/admin" className="text-navy-900 font-bold hover:underline">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Master Login Link */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-royal-600 font-bold hover:underline">
            Go to Portal Sign In Hub →
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
