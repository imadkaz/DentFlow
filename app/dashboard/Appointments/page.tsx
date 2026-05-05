"use client";
import { Search, Plus, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, User, Stethoscope, FileText, AlarmClock } from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  id: number;
  patientName: string;
  patientInitials: string;
  procedure: string;
  date: string;
  time: string;
  duration: string;
  doctor: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: 'John Anderson',
    patientInitials: 'JA',
    procedure: 'Root Canal - Session 2',
    date: '2026-02-23',
    time: '09:00 AM',
    duration: '90 min',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed',
    notes: 'Patient requested morning appointment',
  },
  {
    id: 2,
    patientName: 'Emma Wilson',
    patientInitials: 'EW',
    procedure: 'Regular Checkup',
    date: '2026-02-23',
    time: '10:30 AM',
    duration: '30 min',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed',
  },
  {
    id: 3,
    patientName: 'Michael Brown',
    patientInitials: 'MB',
    procedure: 'Teeth Cleaning',
    date: '2026-02-23',
    time: '02:00 PM',
    duration: '45 min',
    doctor: 'Dr. James Miller',
    status: 'in-progress',
  },
  {
    id: 4,
    patientName: 'Sarah Davis',
    patientInitials: 'SD',
    procedure: 'Consultation',
    date: '2026-02-23',
    time: '04:00 PM',
    duration: '30 min',
    doctor: 'Dr. Sarah Chen',
    status: 'pending',
  },
  {
    id: 5,
    patientName: 'James Wilson',
    patientInitials: 'JW',
    procedure: 'Wisdom Teeth Extraction',
    date: '2026-02-24',
    time: '09:00 AM',
    duration: '60 min',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed',
    notes: 'Pre-surgery consultation completed',
  },
  {
    id: 6,
    patientName: 'Lisa Martinez',
    patientInitials: 'LM',
    procedure: 'Dental Crown Fitting',
    date: '2026-02-24',
    time: '11:00 AM',
    duration: '60 min',
    doctor: 'Dr. James Miller',
    status: 'confirmed',
  },
  {
    id: 7,
    patientName: 'David Chen',
    patientInitials: 'DC',
    procedure: 'Orthodontic Adjustment',
    date: '2026-02-24',
    time: '02:30 PM',
    duration: '45 min',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed',
  },
  {
    id: 8,
    patientName: 'Jennifer Taylor',
    patientInitials: 'JT',
    procedure: 'Teeth Whitening',
    date: '2026-02-25',
    time: '10:00 AM',
    duration: '60 min',
    doctor: 'Dr. James Miller',
    status: 'confirmed',
  },
  {
    id: 9,
    patientName: 'Robert Lee',
    patientInitials: 'RL',
    procedure: 'Dental Implant Consultation',
    date: '2026-02-25',
    time: '03:00 PM',
    duration: '45 min',
    doctor: 'Dr. Sarah Chen',
    status: 'pending',
  },
  {
    id: 10,
    patientName: 'Maria Garcia',
    patientInitials: 'MG',
    procedure: 'Emergency - Toothache',
    date: '2026-02-26',
    time: '09:30 AM',
    duration: '30 min',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed',
    notes: 'Emergency appointment',
  },
];

const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DOCTORS = ['Dr. Sarah Chen', 'Dr. James Miller', 'Dr. Priya Nair'];
const PROCEDURES = [
  'Regular Checkup',
  'Root Canal',
  'Teeth Cleaning',
  'Consultation',
  'Teeth Whitening',
  'Dental Crown Fitting',
  'Orthodontic Adjustment',
  'Dental Implant Consultation',
  'Wisdom Teeth Extraction',
  'Emergency - Toothache',
  'Braces Installation',
  'Dental X-Ray',
  'Filling',
  'Other',
];

const DURATIONS = ['15 min', '30 min', '45 min', '60 min', '90 min', '120 min'];

interface NewAppointmentForm {
  patientName: string;
  procedure: string;
  customProcedure: string;
  date: string;
  time: string;
  duration: string;
  doctor: string;
  notes: string;
}

const emptyForm: NewAppointmentForm = {
  patientName: '',
  procedure: '',
  customProcedure: '',
  date: '',
  time: '',
  duration: '30 min',
  doctor: DOCTORS[0],
  notes: '',
};

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 23));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState<NewAppointmentForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewAppointmentForm, string>>>({});
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(appointments);

  const updateForm = (field: keyof NewAppointmentForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof NewAppointmentForm, string>> = {};
    if (!form.patientName.trim()) errors.patientName = 'Patient name is required';
    if (!form.procedure) errors.procedure = 'Procedure is required';
    if (form.procedure === 'Other' && !form.customProcedure.trim()) errors.customProcedure = 'Please specify the procedure';
    if (!form.date) errors.date = 'Date is required';
    if (!form.time) errors.time = 'Time is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const initials = form.patientName.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const finalProcedure = form.procedure === 'Other' ? form.customProcedure : form.procedure;
    const [hourMin, meridiem] = form.time.split(' ');
    const formattedTime = form.time.length === 5
      ? (() => { const [h, m] = form.time.split(':'); const hour = parseInt(h); return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`; })()
      : form.time;

    const newAppt: Appointment = {
      id: localAppointments.length + 1,
      patientName: form.patientName.trim(),
      patientInitials: initials,
      procedure: finalProcedure,
      date: form.date,
      time: formattedTime,
      duration: form.duration,
      doctor: form.doctor,
      status: 'pending',
      notes: form.notes.trim() || undefined,
    };
    setLocalAppointments(prev => [...prev, newAppt]);
    setForm(emptyForm);
    setFormErrors({});
    setShowNewModal(false);
  };

  const closeNewModal = () => {
    setShowNewModal(false);
    setForm(emptyForm);
    setFormErrors({});
  };

  const filteredAppointments = localAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.procedure.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    'in-progress': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  };

  const stats = {
    total: localAppointments.length,
    today: localAppointments.filter(a => a.date === '2026-02-23').length,
    confirmed: localAppointments.filter(a => a.status === 'confirmed').length,
    pending: localAppointments.filter(a => a.status === 'pending').length,
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayAppointments = localAppointments.filter(a => a.date === selectedDateStr);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return localAppointments.filter(a => a.date === dateStr).length;
  };

  return (
    <div className="space-y-6 mx-4 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
          <p className="text-gray-600 mt-1">Manage and schedule appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
          <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Today</p>
          <p className="text-3xl font-semibold text-blue-600">{stats.today}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-3xl font-semibold text-emerald-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-semibold text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name or procedure..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'confirmed'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Patient</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Procedure</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Duration</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Doctor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment) => {
                  const colors = statusColors[appointment.status];
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {appointment.patientInitials}
                          </div>
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{appointment.procedure}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {appointment.time}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{appointment.duration}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{appointment.doctor}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {appointment.status === 'in-progress' ? 'In Progress' : appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {daysInWeek.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const appointmentCount = getAppointmentsForDate(day);
                const isToday = day === 23; // Feb 23, 2026
                const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDateStr === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                    className={`aspect-square p-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg'
                        : isToday
                        ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium">{day}</div>
                    {appointmentCount > 0 && (
                      <div className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                        {appointmentCount} apt{appointmentCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day's Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} Appointments
            </h3>
            {dayAppointments.length > 0 ? (
              <div className="space-y-3">
                {dayAppointments.map((appointment) => {
                  const colors = statusColors[appointment.status];
                  return (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {appointment.patientInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600 truncate">{appointment.procedure}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`inline-block mt-3 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {appointment.status === 'in-progress' ? 'In Progress' : appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No appointments scheduled</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeNewModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">New Appointment</h2>
                  <p className="text-sm text-gray-500">Fill in the details to schedule</p>
                </div>
              </div>
              <button
                onClick={closeNewModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-500" /> Patient Name</span>
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={e => updateForm('patientName', e.target.value)}
                  placeholder="e.g. John Anderson"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    formErrors.patientName ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {formErrors.patientName && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.patientName}</p>
                )}
              </div>

              {/* Procedure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-blue-500" /> Procedure</span>
                </label>
                <select
                  value={form.procedure}
                  onChange={e => updateForm('procedure', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none ${
                    formErrors.procedure ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a procedure…</option>
                  {PROCEDURES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {formErrors.procedure && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.procedure}</p>
                )}
                {form.procedure === 'Other' && (
                  <input
                    type="text"
                    value={form.customProcedure}
                    onChange={e => updateForm('customProcedure', e.target.value)}
                    placeholder="Specify procedure…"
                    className={`mt-2 w-full px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      formErrors.customProcedure ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                )}
                {formErrors.customProcedure && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.customProcedure}</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-blue-500" /> Date</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => updateForm('date', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      formErrors.date ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> Time</span>
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => updateForm('time', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      formErrors.time ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.time && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>
                  )}
                </div>
              </div>

              {/* Duration & Doctor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><AlarmClock className="w-4 h-4 text-blue-500" /> Duration</span>
                  </label>
                  <select
                    value={form.duration}
                    onChange={e => updateForm('duration', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    {DURATIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-500" /> Doctor</span>
                  </label>
                  <select
                    value={form.doctor}
                    onChange={e => updateForm('doctor', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    {DOCTORS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-blue-500" /> Notes <span className="text-gray-400 font-normal">(optional)</span></span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => updateForm('notes', e.target.value)}
                  placeholder="Any special instructions or notes…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={closeNewModal}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Appointment Details</h2>
                <p className="text-gray-600">ID: #{selectedAppointment.id}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Appointment Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-lg font-semibold">
                  {selectedAppointment.patientInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{selectedAppointment.patientName}</p>
                  <p className="text-gray-600">{selectedAppointment.procedure}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.duration}</p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.doctor}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[selectedAppointment.status].bg} ${statusColors[selectedAppointment.status].text}`}>
                  {selectedAppointment.status === 'in-progress' ? 'In Progress' : selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                </span>
              </div>

              {selectedAppointment.notes && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-gray-600 mb-2">Notes</p>
                  <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                Reschedule
              </button>
              <button className="flex-1 px-4 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all">
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
