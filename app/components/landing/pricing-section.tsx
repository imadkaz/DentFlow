"use client";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
export function PricingSection() {
    const [popularIndex, setPopularIndex] = useState(1);

    const plans = [
        {
            name: "Basic",
            price: "49",
            description: "Perfect for small practices getting started",
            icon: Zap,
            features: [
                "Up to 100 patients",
                "Basic appointment scheduling",
                "Digital patient records",
                "Email support",
                "Mobile app access",
                "Basic reporting"
            ],
            gradient: "from-gray-600 to-gray-700",
            bgGradient: "from-gray-50 to-white",
        },
        {
            name: "Pro",
            price: "99",
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
                "Custom branding"
            ],
            gradient: "from-blue-600 to-blue-700",
            bgGradient: "from-blue-50 to-white",
        },
        {
            name: "Premium",
            price: "199",
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
                "White-label options"
            ],
            gradient: "from-emerald-600 to-emerald-700",
            bgGradient: "from-emerald-50 to-white",
        }
    ];

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-2 bg-linear-to-r from-blue-50 to-emerald-50 rounded-full">
                        <span className="text-sm text-blue-700">💰 Transparent Pricing</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        Simple, Predictable Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect plan for your practice. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const isPopular = popularIndex === index;

                        return (
                            <div
                                key={index}
                                onClick={() => setPopularIndex(index)}
                                className={`relative bg-linear-to-b ${plan.bgGradient} rounded-2xl p-8 border-2 ${isPopular ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200'
                                    } transition-all duration-300 hover:shadow-xl cursor-pointer`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-full shadow-lg">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <div className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${plan.gradient} rounded-xl flex items-center justify-center`}>
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
                                            ${plan.price}
                                        </span>
                                        <span className="text-gray-600">/month</span>
                                    </div>
                                </div>

                                {isPopular ? (
                                    <Link href={`/get-started?plan=${plan.name.toLowerCase()}`}>
                                        <button className={`w-full py-4 rounded-xl font-medium mb-8 transition-all duration-200  ${isPopular
                                                ? `bg-linear-to-r ${plan.gradient} text-white shadow-lg shadow-blue-500/30 cursor-pointer hover:shadow-xl hover:shadow-blue-500/40`
                                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                                            }`}>
                                            Start Free Trial
                                        </button>
                                    </Link>
                                ) : (
                                    <button className={`w-full py-4 rounded-xl font-medium mb-8 transition-all duration-200  ${isPopular
                                            ? `bg-linear-to-r ${plan.gradient} text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40`
                                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                                        }`}>
                                        Get Started
                                    </button>
                                )}


                                <div className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full bg-linear-to-br ${plan.gradient} flex items-center justify-center shrink-0`}>
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
                        Need a custom plan for your enterprise? <a href="#" className="text-blue-600 font-medium hover:underline">Contact sales</a>
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <span>✓ 14-day free trial</span>
                        <span>✓ No credit card required</span>
                        <span>✓ Cancel anytime</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
