import { LucideIcon } from "lucide-react";

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function Analytics({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  iconBgColor,
}: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Row: title + icon */}
      <div className="flex flex-row items-start justify-between mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <div
          className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>

      {/* Value */}
      <h3 className="text-3xl font-semibold text-gray-900 mb-2">{value}</h3>

      {/* Change */}
      {change && (
        <p
          className={`text-sm ${
            changeType === "positive" ? "text-green-600" : "text-red-600"
          }`}
        >
          {changeType === "positive" ? "↑" : "↓"} {change}
        </p>
      )}
    </div>
  );
}
