"use client";
import { Search, Bell, ChevronDown, CalendarPlus } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onBookAppointment }: { onBookAppointment?: () => void }) {
  const [notifications] = useState(3);

  return (
    <header className="h-20 mb-8 bg-white/80 backdrop-blur-xl border-b border-gray-200 fixed top-0 left-64 right-0 z-10">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Book Appointment Button */}
          {/* {onBookAppointment && (
            <button
              onClick={onBookAppointment}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <CalendarPlus className="w-5 h-5" />
              Book Appointment
            </button>
          )} */}

          {/* Notifications */}
          <button className="relative p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Profile Dropdown */}
          <button className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
              DR
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Chen</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}