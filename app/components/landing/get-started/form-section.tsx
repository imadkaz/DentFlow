"use client";
import { User, Mail, Lock, Building, Users, CreditCard, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type MyComponentProps = {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function FormSection({ step, setStep }: MyComponentProps) {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");

    useEffect(() => {
        if (plan) {
            setFormData(prev => ({
                ...prev,
                selectedPlan: plan
            }))
        }
    }, [plan]);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        // Step 2: Practice Info
        practiceName: "",
        practiceSize: "",
        phoneNumber: "",
        // Step 3: Plan Selection
        selectedPlan: "pro"
    });
    const [customValidation, setCustomValidation] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        practiceName: "",
        practiceSize: "",
        phoneNumber: "",
    });

    const handleNext = () => {
        const errors = {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            practiceName: "",
            practiceSize: "",
            phoneNumber: "",
        };

        if (step === 1) {
            if (!formData.fullName) {
                errors.fullName = "Please enter your full name";
            }

            if (!formData.email) {
                errors.email = "Please enter your email";
            }

            if (!formData.password) {
                errors.password = "Please create a password";
            }
            if (!formData.confirmPassword) {
                errors.confirmPassword = "Please confirm your password";
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }
        }

        if (step === 2) {
            if (!formData.practiceName) {
                errors.practiceName = "Please enter your practice name";
            }

            if (!formData.practiceSize) {
                errors.practiceSize = "Please select practice size";
            }

            if (!formData.phoneNumber) {
                errors.phoneNumber = "Please enter your phone number";
            }
        }

        setCustomValidation(errors);

        const hasError = Object.values(errors).some((error) => error !== "");

        if (!hasError) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send formData to your backend API
        console.log("Form submitted:", formData);
        alert("Your account has been created! Check the console for submitted data.");
    };

    const plans = [
        {
            id: "basic",
            name: "Basic",
            price: "49",
            features: ["Up to 100 patients", "Basic scheduling", "Email support"]
        },
        {
            id: "pro",
            name: "Pro",
            price: "99",
            features: ["Up to 500 patients", "All features", "Priority support"],
            popular: true
        },
        {
            id: "premium",
            name: "Premium",
            price: "199",
            features: ["Unlimited patients", "All features", "24/7 support"]
        }
    ];

    let validationCheck: boolean = false;
    if (step === 1) {
        validationCheck =
            !!formData.fullName &&
            !!formData.email &&
            !!formData.password &&
            !!formData.confirmPassword &&
            formData.password === formData.confirmPassword;
    } else if (step === 2) {
        validationCheck =
            !!formData.practiceName &&
            !!formData.practiceSize &&
            !!formData.phoneNumber;
    } else {
        validationCheck = !!formData.selectedPlan;
    }
    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Create Your Account
                            </h2>
                            <p className="text-gray-600">
                                Let's start with your basic information
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, fullName: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, fullName: "" }));
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Dr. John Smith"
                                />
                            </div>
                            {customValidation.fullName && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, email: "" }));
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@dentalclinic.com"
                                />
                            </div>
                            {customValidation.email && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, password: "" }));
                                    }}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {customValidation.password && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                        setFormData({ ...formData, confirmPassword: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, confirmPassword: "" }));
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Re-enter your password"
                                />
                            </div>
                            {customValidation.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Practice Information */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Practice Information
                            </h2>
                            <p className="text-gray-600">
                                Tell us about your dental practice
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Practice Name *
                            </label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.practiceName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, practiceName: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, practiceName: "" }));
                                    }} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Bright Smile Dental Clinic"
                                />
                            </div>
                            {customValidation.practiceName && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.practiceName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Practice Size *
                            </label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    required
                                    value={formData.practiceSize}
                                    onChange={(e) => {
                                        setFormData({ ...formData, practiceSize: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, practiceSize: "" }));
                                    }} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    <option value="">Select practice size</option>
                                    <option value="solo">Solo Practitioner (1 dentist)</option>
                                    <option value="small">Small Practice (2-5 dentists)</option>
                                    <option value="medium">Medium Practice (6-10 dentists)</option>
                                    <option value="large">Large Practice (11+ dentists)</option>
                                    <option value="multi">Multi-location Practice</option>
                                </select>
                            </div>
                            {customValidation.practiceSize && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.practiceSize}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <div className="relative">
                                <svg
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        setFormData({ ...formData, phoneNumber: e.target.value });
                                        setCustomValidation(prev => ({ ...prev, phoneNumber: "" }));
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+1 (234) 567-890"
                                />
                            </div>
                            {customValidation.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{customValidation.phoneNumber}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Plan Selection */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Choose Your Plan
                            </h2>
                            <p className="text-gray-600">
                                Select the plan that best fits your practice
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                                    className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${formData.selectedPlan === plan.id
                                        ? "border-blue-500 bg-blue-50 shadow-lg"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    {formData.selectedPlan === plan.id && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="px-3 py-1 bg-linear-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-full">
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-gray-900">
                                                ${plan.price}
                                            </span>
                                            <span className="text-gray-600">/mo</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    {formData.selectedPlan === plan.id && (
                                        <div className="mt-4 flex justify-center">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-linear-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        14-Day Free Trial
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        No credit card required. Your trial starts immediately and you can cancel
                                        anytime. After the trial, you'll be charged based on your selected plan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all"
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                handleNext()
                            }}
                            className="flex-1 px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!validationCheck}
                            className="flex-1 px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            Start Free Trial
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}