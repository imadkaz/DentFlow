"use client";
import { Check, Sparkles, Crown, Zap, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [popularIndex, setPopularIndex] = useState(1);

  const plans = [
    {
      name: "Basic",
      monthlyPrice: "49",
      annualPrice: "39",
      description: "Perfect for small practices getting started",
      icon: Zap,
      features: [
        "Up to 100 patients",
        "Basic appointment scheduling",
        "Digital patient records",
        "Email support",
        "Mobile app access",
        "Basic reporting",
        "1 user account",
        "5GB storage",
      ],
      gradient: "from-gray-600 to-gray-700",
      bgGradient: "from-gray-50 to-white",
    },
    {
      name: "Pro",
      monthlyPrice: "99",
      annualPrice: "79",
      description: "Most popular for growing clinics",
      icon: Sparkles,
      features: [
        "Up to 500 patients",
        "Smart appointment scheduling",
        "Interactive tooth chart",
        "Payment installments",
        "Priority support",
        "Advanced analytics",
        "SMS reminders",
        "Custom branding",
        "5 user accounts",
        "50GB storage",
        "Patient portal",
        "Automated workflows",
      ],
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-white",
    },
    {
      name: "Premium",
      monthlyPrice: "199",
      annualPrice: "159",
      description: "For large practices with multiple locations",
      icon: Crown,
      features: [
        "Unlimited patients",
        "All Pro features",
        "Multi-location support",
        "Dedicated account manager",
        "24/7 phone support",
        "API access",
        "Custom integrations",
        "White-label options",
        "Unlimited users",
        "Unlimited storage",
        "Advanced security features",
        "Custom training sessions",
      ],
      gradient: "from-emerald-600 to-emerald-700",
      bgGradient: "from-emerald-50 to-white",
    },
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), ACH transfers, and wire transfers for annual plans.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No setup fees! We'll help you get started with free onboarding and data migration assistance on all plans.",
    },
    {
      question: "What happens after the free trial?",
      answer:
        "Your 14-day free trial includes full access to all features. After the trial, you'll be billed based on your selected plan. Cancel anytime during the trial with no charge.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, we'll provide a full refund.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption, are fully HIPAA compliant, and perform regular security audits. Your data is backed up daily.",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-linear-to-r from-blue-50 to-emerald-50 rounded-full mb-6 border border-blue-200">
            <span className="text-sm text-blue-700">
              💰 Simple, Transparent Pricing
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Choose the Perfect Plan for Your Practice
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            No hidden fees. No surprises. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-white p-2 rounded-xl shadow-md border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price =
                billingCycle === "monthly"
                  ? plan.monthlyPrice
                  : plan.annualPrice;
              const isPopular = popularIndex === index;
              return (
                <div
                  key={index}
                  onClick={() => setPopularIndex(index)}
                  className={`relative bg-linear-to-b ${plan.bgGradient} rounded-2xl p-8 border-2 ${
                    isPopular
                      ? "border-blue-500 shadow-2xl scale-105"
                      : "border-gray-200"
                  } transition-all duration-300 hover:shadow-xl`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-full shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${plan.gradient} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">
                        ${price}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-sm text-emerald-600 mt-2">
                        Billed ${parseInt(price) * 12} annually
                      </p>
                    )}
                  </div>
                  {isPopular ? (
                    <Link
                      href={`/get-started?plan=${plan.name.toLowerCase()}`}
                      className={`block w-full py-4 rounded-xl font-medium mb-8 transition-all duration-200 text-center ${
                        isPopular
                          ? `bg-linear-to-r ${plan.gradient} text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40`
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Start Free Trial
                    </Link>
                  ) : (
                    <button
                      className={`w-full py-4 rounded-xl font-medium mb-8 transition-all duration-200  ${
                        isPopular
                          ? `bg-linear-to-r ${plan.gradient} text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40`
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Get Started
                    </button>
                  )}
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full bg-linear-to-br ${plan.gradient} flex items-center justify-center shrink-0`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need a custom enterprise plan?{" "}
              <a
                href="/contact"
                className="text-blue-600 font-medium hover:underline"
              >
                Contact our sales team
              </a>
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>✓ 14-day free trial</span>
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <HelpCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
