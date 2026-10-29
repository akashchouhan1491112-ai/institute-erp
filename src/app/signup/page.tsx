"use client";

import React from "react";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  GraduationCap,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

export default function SignupHubPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-royal-700 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
            Online Registration & ERP Accounts
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Choose Your Account Type to Get Started
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto">
            Select whether you are registering as an enrolled Student or creating a Parent/Guardian monitoring profile.
          </p>
        </div>
      </section>

      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Student Account */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-royal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-royal-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Student Portal
                </span>
                <h2 className="text-2xl font-bold text-navy-900 mt-2">
                  Student Registration
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  For students enrolling in competitive exam batches (IIT-JEE, NEET, Foundation, Civil Services) or regular tuition programs.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access daily batch timetable & lecture notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Attend CBT mock tests & download result percentiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pay fee installments online with instant receipts</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                href="/signup/student"
                className="w-full py-3.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
              >
                Create Student Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                Already registered?{" "}
                <Link href="/login/student" className="text-royal-600 font-bold hover:underline">
                  Student Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Parent Account */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                  Guardian Portal
                </span>
                <h2 className="text-2xl font-bold text-navy-900 mt-2">
                  Parent / Guardian Sign-Up
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  For parents wishing to track their child&apos;s daily classroom attendance, examination scorecards, and fee status.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Live presence & absence SMS/portal notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Review faculty feedback & subject-wise test analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Receive upcoming installment alerts & pay dues online</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                href="/signup/parent"
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
              >
                Create Parent Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                Already registered?{" "}
                <Link href="/login/parent" className="text-teal-600 font-bold hover:underline">
                  Parent Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Admin note */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Looking for Staff or Institute Administration login?{" "}
          <Link href="/login/admin" className="text-navy-900 font-bold hover:underline">
            Admin & Faculty Portal →
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

