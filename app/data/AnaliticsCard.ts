import { DollarSign, Users, Calendar, AlertCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { AnalyticsCardProps } from "../components/Dashboard/AnalyticsCard";



export const AnalyticsCards: AnalyticsCardProps[] = [
  {
    title: "Total Revenue",
    value: "$48,574",
    change: "+12.5% from last month",
    changeType: "positive",
    icon: DollarSign,          // ← بلا {}
    iconColor: "text-emerald-600",
    iconBgColor: "bg-emerald-100",
  },
  {
    title: "Active Patients",
    value: "1,248",
    change: "+8.2% from last month",
    changeType: "positive",
    icon: Users,               // ← بلا {}
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
  },
  {
    title: "Upcoming Appointments",
    value: "24",
    change: "Today",
    changeType: "negative",
    icon: Calendar,            // ← بلا {}
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
  },
  {
    title: "Outstanding Payments",
    value: "$12,450",
    change: "-5.3% from last month",
    changeType: "negative",    // ← سالب = negative
    icon: AlertCircle,         // ← بلا {}
    iconColor: "text-amber-600",
    iconBgColor: "bg-amber-100",
  },
];