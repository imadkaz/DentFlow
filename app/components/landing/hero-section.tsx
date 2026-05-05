import { ArrowRight, Calendar, CreditCard, FileText } from "lucide-react";
import { DashboardMockup } from "../dashboardMockup";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-25 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-linear-to-r from-blue-50 to-emerald-50 rounded-full">
                <span className="text-sm text-blue-700">
                  ✨ The Future of Dental Practice Management
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Smart Dental Clinic Management Made Simple
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline your dental practice with intelligent appointment booking, 
                comprehensive treatment planning, and seamless payment tracking. 
                Everything you need to run a modern dental clinic in one platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/get-started" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/schedule-demo" className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                Schedule Demo
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Automated Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-gray-600">Digital Records</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Easy Payments</span>
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}