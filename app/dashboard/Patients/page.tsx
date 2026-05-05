"use client";
import { Search, Filter, Plus, Mail, Phone, MapPin, Calendar, FileText, Edit, Trash2, X, Save } from 'lucide-react';
import { useState } from 'react';
import { patients as initialPatients } from '../../data/patientsData';
import type { Patient, TreatmentPlan } from '../../data/patientsData';

type ViewMode = 'view' | 'edit' | 'schedule';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    medicalNotes: '',
  });

  // New Appointment Form State
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    procedure: '',
    doctor: '',
    notes: '',
  });

  // Add New Patient Handler
  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const initials = newPatient.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    const patient: Patient = {
      id: Math.max(...patients.map(p => p.id)) + 1,
      name: newPatient.name,
      initials: initials,
      email: newPatient.email,
      phone: newPatient.phone,
      address: newPatient.address,
      dateOfBirth: newPatient.dateOfBirth,
      lastVisit: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalVisits: 0,
      status: 'new',
      balance: 0,
      medicalNotes: newPatient.medicalNotes,
    };

    setPatients([...patients, patient]);
    setShowAddModal(false);
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      medicalNotes: '',
    });
  };

  // Save Edited Patient
  const handleSavePatient = () => {
    if (!editedPatient) return;

    setPatients(patients.map(p => p.id === editedPatient.id ? editedPatient : p));
    setSelectedPatient(editedPatient);
    setViewMode('view');
  };

  // Schedule Appointment Handler

  const handleScheduleAppointment = () => {
  if (!newAppointment.date || !newAppointment.time || !newAppointment.procedure) {
    alert('Please fill in all required appointment fields');
    return;
  }

  // ✅ مباشرة هون بدون function داخلية
  const patientId = selectedPatient?.id;
  if (patientId) {
    setPatients(patients.map(p =>
      p.id === patientId
        ? {
            ...p,
            treatmentPlan: {
              ...(p.treatmentPlan as TreatmentPlan),
              nextAppointment: `${newAppointment.date} - ${newAppointment.time}`,
            },
          }
        : p
    ));

    // ✅ حدث الـ selectedPatient كمان حتى الـ modal يتحدث
    // setSelectedPatient(prev =>
    //   prev ? {
    //     ...prev,
    //     treatmentPlan: {
    //       ...(prev.treatmentPlan as TreatmentPlan),
    //       nextAppointment: `${newAppointment.date} - ${newAppointment.time}`,
    //     },
    //   } : null
    // );
  }

  setNewAppointment({ date: '', time: '', procedure: '', doctor: '', notes: '' });
  setViewMode('view');
};

  // Open Patient Detail Modal
  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedPatient(patient);
    setViewMode('view');
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
    new: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  };

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    new: patients.filter(p => p.status === 'new').length,
    outstanding: patients.reduce((sum, p) => sum + p.balance, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mt-8 mx-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Patients</h2>
          <p className="text-gray-600 mt-1">Manage your patient records and information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Patients</p>
          <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active Patients</p>
          <p className="text-3xl font-semibold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">New This Month</p>
          <p className="text-3xl font-semibold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
          <p className="text-3xl font-semibold text-amber-600">${stats.outstanding.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mx-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
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
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'active'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('new')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'new'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'inactive'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mx-4 mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Last Visit</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Next Appointment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Visits</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Balance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => {
                const colors = statusColors[patient.status];
                return (
                  <tr
                    key={patient.id}
                    onClick={() => handlePatientClick(patient)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {patient.initials}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.dateOfBirth}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {patient.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {patient.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{patient.lastVisit}</p>
                    </td>
                    <td className="px-6 py-4">
                      {patient.treatmentPlan?.nextAppointment ? (
                        <p className="text-sm text-blue-600 font-medium">{patient.treatmentPlan.nextAppointment}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Not scheduled</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{patient.totalVisits}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-medium ${patient.balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ${patient.balance}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePatientClick(patient);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePatientClick(patient);
                            setViewMode('edit');
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="john@email.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  placeholder="123 Main Street, New York, NY 10001"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                <textarea
                  value={newPatient.medicalNotes}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalNotes: e.target.value })}
                  placeholder="Allergies, medical conditions, etc."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPatient}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && editedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-semibold">
                  {selectedPatient.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-600">Patient ID: #{selectedPatient.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setViewMode('view');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setViewMode('view')}
                className={`px-4 py-2 font-medium transition-all ${
                  viewMode === 'view'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                View Details
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`px-4 py-2 font-medium transition-all ${
                  viewMode === 'edit'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Edit Patient
              </button>
              <button
                onClick={() => setViewMode('schedule')}
                className={`px-4 py-2 font-medium transition-all ${
                  viewMode === 'schedule'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Schedule Appointment
              </button>
            </div>

            {/* View Mode */}
            {viewMode === 'view' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                    <p className="font-medium text-gray-900">{selectedPatient.dateOfBirth}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Visits</p>
                    <p className="font-medium text-gray-900">{selectedPatient.totalVisits}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedPatient.email}
                    </p>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedPatient.phone}
                    </p>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedPatient.address}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Appointment Info</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Last Visit</p>
                      <p className="font-medium text-gray-900">{selectedPatient.lastVisit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Next Appointment</p>
                      <p className="font-medium text-blue-600">
                        {selectedPatient.treatmentPlan?.nextAppointment || 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-gray-600 mb-2">Financial Summary</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">Outstanding Balance</span>
                    <span className="text-2xl font-semibold text-amber-600">
                      ${selectedPatient.balance}
                    </span>
                  </div>
                </div>

                {selectedPatient.medicalNotes && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Medical Notes</p>
                    <p className="text-sm text-gray-900">{selectedPatient.medicalNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Edit Mode */}
            {viewMode === 'edit' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editedPatient.name}
                    onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editedPatient.email}
                      onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editedPatient.phone}
                      onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editedPatient.address}
                    onChange={(e) => setEditedPatient({ ...editedPatient, address: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="text"
                    value={editedPatient.dateOfBirth}
                    onChange={(e) => setEditedPatient({ ...editedPatient, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                  <textarea
                    value={editedPatient.medicalNotes || ''}
                    onChange={(e) => setEditedPatient({ ...editedPatient, medicalNotes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editedPatient.status}
                      onChange={(e) => setEditedPatient({ ...editedPatient, status: e.target.value as 'active' | 'inactive' | 'new' })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="new">New</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
                    <input
                      type="number"
                      value={editedPatient.balance}
                      onChange={(e) => setEditedPatient({ ...editedPatient, balance: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setEditedPatient(selectedPatient);
                      setViewMode('view');
                    }}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePatient}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Schedule Mode */}
            {viewMode === 'schedule' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                  <p className="text-sm text-blue-900">
                    Schedule a new appointment for <strong>{selectedPatient.name}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Procedure *</label>
                  <select
                    value={newAppointment.procedure}
                    onChange={(e) => setNewAppointment({ ...newAppointment, procedure: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select a procedure</option>
                    <option value="Regular Checkup">Regular Checkup</option>
                    <option value="Teeth Cleaning">Teeth Cleaning</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Filling">Filling</option>
                    <option value="Crown">Crown</option>
                    <option value="Extraction">Extraction</option>
                    <option value="Orthodontic Adjustment">Orthodontic Adjustment</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <select
                    value={newAppointment.doctor}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select a doctor</option>
                    <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
                    <option value="Dr. James Miller">Dr. James Miller</option>
                    <option value="Dr. Emily Johnson">Dr. Emily Johnson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    placeholder="Any special notes or instructions..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setNewAppointment({
                        date: '',
                        time: '',
                        procedure: '',
                        doctor: '',
                        notes: '',
                      });
                      setViewMode('view');
                    }}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleAppointment}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
