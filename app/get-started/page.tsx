"use client";
import { useState, Suspense } from "react";
import HeroSection from "../components/landing/get-started/header-section";
import ProgressStepSection from "../components/landing/get-started/Progress-step-section";
import FormSection from "../components/landing/get-started/form-section";

export default function GetStartedPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen pt-20 px-6 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <HeroSection />

        {/* Progress Steps */}
        <ProgressStepSection step={step} />

        {/* Form Container */}
        <Suspense fallback={<div>Loading...</div>}>
          <FormSection step={step} setStep={setStep} />
        </Suspense>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
