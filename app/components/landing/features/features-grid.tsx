import { Calendar, Heart, CreditCard, Users, BarChart3, Bell, Shield, Smartphone, Cloud, Zap, Mail, FileText } from "lucide-react";

export default function GridSection() {

    const allFeatures = [
        {
            icon: Calendar,
            title: "Smart Appointment Scheduling",
            description: "AI-powered scheduling that automatically optimizes your calendar, prevents double bookings, and suggests optimal appointment times based on treatment types and duration.",
            color: "blue"
        },
        {
            icon: Bell,
            title: "Automated Reminders",
            description: "Send automatic SMS and email reminders to patients. Reduce no-shows by up to 60% with customizable reminder templates and timing.",
            color: "emerald"
        },
        {
            icon: Heart,
            title: "Interactive Tooth Chart",
            description: "Visual treatment planning with full dental charting capabilities. Document procedures, track treatment history, and create comprehensive treatment plans.",
            color: "purple"
        },
        {
            icon: CreditCard,
            title: "Flexible Payment Plans",
            description: "Create custom installment plans for patients. Accept credit cards, ACH transfers, and manage payment schedules with automated billing.",
            color: "blue"
        },
        {
            icon: Users,
            title: "Patient Portal",
            description: "Give patients 24/7 access to book appointments, view treatment history, access documents, and communicate with your practice.",
            color: "emerald"
        },
        {
            icon: BarChart3,
            title: "Advanced Analytics",
            description: "Comprehensive reporting and analytics dashboard. Track revenue, patient retention, treatment acceptance rates, and practice performance.",
            color: "purple"
        },
        {
            icon: Shield,
            title: "HIPAA Compliant",
            description: "Enterprise-grade security with end-to-end encryption. Full HIPAA compliance with audit logs, role-based access control, and secure data storage.",
            color: "blue"
        },
        {
            icon: Smartphone,
            title: "Mobile Apps",
            description: "Native iOS and Android apps for on-the-go access. Manage your practice from anywhere with full mobile functionality.",
            color: "emerald"
        },
        {
            icon: Cloud,
            title: "Cloud-Based Storage",
            description: "Unlimited cloud storage for X-rays, photos, and documents. Automatic backups and 99.9% uptime guarantee.",
            color: "purple"
        },
        {
            icon: Zap,
            title: "Treatment Templates",
            description: "Pre-built treatment templates for common procedures. Customize and save your own templates to speed up treatment planning.",
            color: "blue"
        },
        {
            icon: Mail,
            title: "Patient Communication",
            description: "Two-way messaging system, bulk email campaigns, birthday greetings, and recall reminders to keep patients engaged.",
            color: "emerald"
        },
        {
            icon: FileText,
            title: "Digital Forms",
            description: "Paperless intake forms, consent forms, and medical history questionnaires. Patients can complete forms before arriving.",
            color: "purple"
        }
    ];

    const colorClasses = {
        blue: {
            iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
            border: "border-blue-200",
            hoverBorder: "hover:border-blue-300"
        },
        emerald: {
            iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
            border: "border-emerald-200",
            hoverBorder: "hover:border-emerald-300"
        },
        purple: {
            iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
            border: "border-purple-200",
            hoverBorder: "hover:border-purple-300"
        }
    };

    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allFeatures.map((feature, index) => {
                        const colors = colorClasses[feature.color as keyof typeof colorClasses];
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl p-8 border-2 border-gray-100 ${colors.hoverBorder} hover:shadow-xl transition-all duration-300`}
                            >
                                <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}