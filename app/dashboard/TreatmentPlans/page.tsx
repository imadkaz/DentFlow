"use client";
import { Search, Filter, Plus, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { useState } from 'react';
import { patients } from '../../data/patientsData';
import { NewTreatmentPlan } from '../../components/Dashboard/NewTreatmentPlan';

export default function TreatmentPlans() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPlanPatientId, setSelectedPlanPatientId] = useState<number | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);

  // Filter patients that have treatment plans
  const patientsWithPlans = patients.filter(p => p.treatmentPlan);

  const filteredPlans = patientsWithPlans.filter((patient) => {
    if (!patient.treatmentPlan) return false;
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.treatmentPlan.treatmentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.treatmentPlan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selectedPatient = selectedPlanPatientId ? patients.find(p => p.id === selectedPlanPatientId) : null;

  const handleSaveNewPlan = (plan: any) => {
    console.log('New plan created:', plan);
    // In a real app, this would save to a database
  };

  const statusColors = {
    active: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <div className="space-y-6 m-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Treatment Plans</h2>
          <p className="text-gray-600 mt-1">Manage and track all patient treatment plans</p>
        </div>
        <button 
          onClick={() => setShowNewPlanForm(true)}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Treatment Plan
        </button>
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
              placeholder="Search by patient name or treatment type..."
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
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed
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

      {/* Treatment Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlans.map((patient) => {
          if (!patient.treatmentPlan) return null;
          const plan = patient.treatmentPlan;
          const progress = (plan.paidAmount / plan.totalCost) * 100;
          const completedStages = plan.stages.filter((s) => s.completed).length;
          const stageProgress = (completedStages / plan.stages.length) * 100;
          const colors = statusColors[plan.status];

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanPatientId(patient.id)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                    {patient.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{plan.treatmentType}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Treatment Progress</span>
                    <span className="font-medium text-gray-900">
                      {completedStages}/{plan.stages.length} stages
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${stageProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Payment Progress</span>
                    <span className="font-medium text-gray-900">
                      ${plan.paidAmount.toLocaleString()} / ${plan.totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{plan.startDate}</span>
                </div>
                {plan.nextAppointment && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Clock className="w-4 h-4" />
                    <span>Next: {plan.nextAppointment}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      {selectedPatient && selectedPatient.treatmentPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedPlanPatientId(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-semibold">
                  {selectedPatient.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-600">{selectedPatient.treatmentPlan.treatmentType}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanPatientId(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Treatment Timeline</h3>
              <div className="space-y-4">
                {selectedPatient.treatmentPlan?.stages.map((stage, index) => {
                  const isLast = index === (selectedPatient.treatmentPlan?.stages?.length ?? 0) - 1;
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              stage.completed
                                ? 'bg-emerald-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            {stage.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 ${
                                stage.completed ? 'bg-emerald-300' : 'bg-gray-200'
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <h4 className="font-medium text-gray-900">{stage.name}</h4>
                          {stage.date && (
                            <p className="text-sm text-gray-500 mt-1">{stage.date}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${selectedPatient.treatmentPlan.totalCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-2xl font-semibold text-emerald-600">
                    ${selectedPatient.treatmentPlan.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                  <p className="text-2xl font-semibold text-amber-600">
                    ${(selectedPatient.treatmentPlan.totalCost - selectedPatient.treatmentPlan.paidAmount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {((selectedPatient.treatmentPlan.paidAmount / selectedPatient.treatmentPlan.totalCost) * 100).toFixed(0)}% Complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Treatment Plan Form */}
      {showNewPlanForm && (
        <NewTreatmentPlan 
          onClose={() => setShowNewPlanForm(false)}
          onSave={handleSaveNewPlan}
        />
      )}
    </div>
  );
}