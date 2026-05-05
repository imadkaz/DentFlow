export function DashboardMockup() {
  return (
    <div className="relative">
      {/* Decorative Background Elements */}
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-linear-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-linear-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
      
      {/* Dashboard Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
          </div>
          <div className="text-white text-sm font-medium">DentFlow Dashboard</div>
          <div className="w-8 h-8 rounded-full bg-white/20" />
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
              <div className="text-xs text-blue-600 mb-1">Today</div>
              <div className="text-2xl font-bold text-blue-900">24</div>
              <div className="text-xs text-blue-700">Appointments</div>
            </div>
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 p-3 rounded-xl">
              <div className="text-xs text-emerald-600 mb-1">Revenue</div>
              <div className="text-2xl font-bold text-emerald-900">$8.2k</div>
              <div className="text-xs text-emerald-700">This week</div>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 p-3 rounded-xl">
              <div className="text-xs text-purple-600 mb-1">Patients</div>
              <div className="text-2xl font-bold text-purple-900">342</div>
              <div className="text-xs text-purple-700">Active</div>
            </div>
          </div>

          {/* Appointment List */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Upcoming Appointments</div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                  <div className="text-xs text-gray-500">Root Canal - 2:00 PM</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                Confirmed
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Mike Williams</div>
                  <div className="text-xs text-gray-500">Cleaning - 3:30 PM</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Pending
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-purple-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Emma Davis</div>
                  <div className="text-xs text-gray-500">Checkup - 4:00 PM</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                Confirmed
              </div>
            </div>
          </div>

          {/* Mini Chart Placeholder */}
          <div className="bg-linear-to-r from-blue-50 to-emerald-50 p-4 rounded-xl">
            <div className="text-xs text-gray-600 mb-2">Weekly Revenue</div>
            <div className="flex items-end justify-between h-16 gap-1">
              <div className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: '40%' }} />
              <div className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: '65%' }} />
              <div className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: '50%' }} />
              <div className="w-full bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t" style={{ height: '80%' }} />
              <div className="w-full bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t" style={{ height: '95%' }} />
              <div className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: '70%' }} />
              <div className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: '55%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
