import { Calendar, Heart, CreditCard, Clock, CheckCircle, TrendingUp } from "lucide-react";

export function FeaturesSection() {

    const features = [
        {
            icon: Calendar,
            title: "Smart Appointments",
            description: "Intelligent scheduling system with automated reminders, conflict detection, and patient self-booking portal. Reduce no-shows by up to 60%.",
            color: "blue",
            stats: "60% fewer no-shows",
            details: [
                "Automated SMS & email reminders",
                "Real-time calendar sync",
                "Patient self-service portal",
                "Waitlist management"
            ]
        },
        {
            icon: Heart,
            title: "Interactive Tooth Chart",
            description: "Visual treatment planning with interactive dental charts. Document procedures, track treatment history, and share plans with patients instantly.",
            color: "emerald",
            stats: "100% digital records",
            details: [
                "Visual treatment tracking",
                "Complete dental history",
                "Before/after comparisons",
                "Patient education tools"
            ]
        },
        {
            icon: CreditCard,
            title: "Installment Payments",
            description: "Flexible payment solutions with customizable installment plans. Accept multiple payment methods and automate payment reminders seamlessly.",
            color: "purple",
            stats: "3x faster payments",
            details: [
                "Custom payment plans",
                "Multiple payment methods",
                "Automated invoicing",
                "Payment tracking dashboard"
            ]
        }
    ];

    const colorClasses = {
        blue: {
            gradient: "from-blue-600 to-blue-700",
            bg: "bg-blue-50",
            text: "text-blue-700",
            iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
            border: "border-blue-200",
            statBg: "bg-blue-100",
            statText: "text-blue-700"
        },
        emerald: {
            gradient: "from-emerald-600 to-emerald-700",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
            border: "border-emerald-200",
            statBg: "bg-emerald-100",
            statText: "text-emerald-700"
        },
        purple: {
            gradient: "from-purple-600 to-purple-700",
            bg: "bg-purple-50",
            text: "text-purple-700",
            iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
            border: "border-purple-200",
            statBg: "bg-purple-100",
            statText: "text-purple-700"
        }
    };

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-full">
                        <span className="text-sm text-blue-700">
                            ✨ Powerful Features
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-center mt-8 text-gray-900">Everything You Need to Grow Your Dental Practice</h2>
                    <p className="text-lg text-gray-600 text-center mt-4 max-w-2xl mx-auto">From smart scheduling to interactive treatment planning, DentFlow has all the tools you need to run a modern dental clinic.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const colorClass = colorClasses[feature.color as keyof typeof colorClasses];
                        return (
                            <div key={index} className={`group p-6 rounded-xl border ${colorClass.border} ${colorClass.bg} hover:border-gray-200 hover:shadow-xl transition-all duration-300`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${colorClass.text}`}>{feature.title}</h3>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorClass.statBg} ${colorClass.statText}`}>
                                    {feature.stats}
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {feature.details.map((detail, detailIndex) => (
                                        <li key={detailIndex} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}