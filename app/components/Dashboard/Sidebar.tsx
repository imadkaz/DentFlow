// components/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Calendar, ClipboardList, CreditCard, FileBarChart, Settings } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'patients', label: 'Patients', icon: Users, href: '/dashboard/Patients' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/dashboard/Appointments' },
  { id: 'treatment-plans', label: 'Treatment Plans', icon: ClipboardList, href: '/dashboard/TreatmentPlans' },
  { id: 'payments', label: 'Payments', icon: CreditCard, href: '/dashboard/Payments' },
  { id: 'reports', label: 'Reports', icon: FileBarChart, href: '/dashboard/Reports' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/Setting' },
];

export function Sidebar() {
  const pathname = usePathname();  // ← بيعرف وين أنت تلقائياً
  const router = useRouter();

  return (
    <aside className="[grid-area:sidebar] fixed h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 8s-2-3-5-3-5 3-5 3M17 16s-2 3-5 3-5-3-5-3" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-800">DentFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href; // ← تلقائي من الـ URL
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Dr. Sarah Chen</p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}