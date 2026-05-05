import { X, Calendar, Phone, Mail, MapPin, DollarSign, Edit, Save } from 'lucide-react';
import { useState } from 'react';

interface TreatmentStage {
  name: string;
  completed: boolean;
  date?: string;
}

interface PatientData {
  id: number;
  name: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  treatmentPlan?: {
    id: number;
    treatmentType: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    paidAmount: number;
    status: 'active' | 'completed' | 'pending' | 'cancelled';
    stages: TreatmentStage[];
    nextAppointment?: string;
  };
}

interface PatientDetailModalProps {
  patient: PatientData;
  onClose: () => void;
  onEditPlan?: (patientId: number) => void;
}

export function PatientDetailModal({ patient, onClose, onEditPlan }: PatientDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStages, setEditedStages] = useState(patient.treatmentPlan?.stages || []);

  const handleSavePlan = () => {
    // Save logic here
    setIsEditing(false);
    alert('Treatment plan updated successfully!');
  };

  const toggleStageCompletion = (index: number) => {
    if (!isEditing) return;
    const newStages = [...editedStages];
    newStages[index].completed = !newStages[index].completed;
    if (newStages[index].completed && !newStages[index].date) {
      newStages[index].date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    setEditedStages(newStages);
  };

  const progress = patient.treatmentPlan 
    ? (patient.treatmentPlan.paidAmount / patient.treatmentPlan.totalCost) * 100 
    : 0;
  
  const completedStages = editedStages.filter(s => s.completed).length;
  const stageProgress = editedStages.length > 0 
    ? (completedStages / editedStages.length) * 100 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-semibold">
              {patient.initials}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600">Patient ID: #{patient.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-sm text-gray-900">{patient.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Date of Birth</p>
                    <p className="text-sm text-gray-900">{patient.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>

            {patient.treatmentPlan && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Next Appointment</h3>
                <p className="text-lg font-semibold text-blue-600">
                  {patient.treatmentPlan.nextAppointment || 'Not scheduled'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Treatment Plan */}
          <div className="lg:col-span-2 space-y-4">
            {patient.treatmentPlan ? (
              <>
                {/* Treatment Plan Header */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.treatmentPlan.treatmentType}</h3>
                      <p className="text-sm text-gray-600">
                        {patient.treatmentPlan.startDate} - {patient.treatmentPlan.endDate}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.treatmentPlan.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      patient.treatmentPlan.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      patient.treatmentPlan.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {patient.treatmentPlan.status.charAt(0).toUpperCase() + patient.treatmentPlan.status.slice(1)}
                    </span>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Treatment Progress</span>
                        <span className="font-medium text-gray-900">{completedStages}/{editedStages.length} stages</span>
                      </div>
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${stageProgress}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Payment Progress</span>
                        <span className="font-medium text-gray-900">
                          ${patient.treatmentPlan.paidAmount.toLocaleString()} / ${patient.treatmentPlan.totalCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Controls */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Treatment Stages</h3>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSavePlan();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                      isEditing
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg'
                    }`}
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {isEditing ? 'Save Changes' : 'Edit Plan'}
                  </button>
                </div>

                {/* Treatment Stages */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="space-y-3">
                    {editedStages.map((stage, index) => {
                      const isLast = index === editedStages.length - 1;
                      return (
                        <div key={index} className="relative">
                          <div className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                              <button
                                onClick={() => toggleStageCompletion(index)}
                                disabled={!isEditing}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  stage.completed
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                                } ${isEditing ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                              >
                                {stage.completed && (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              {!isLast && (
                                <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                                  stage.completed ? 'bg-emerald-300' : 'bg-gray-200'
                                }`}></div>
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <h4 className={`font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                                {stage.name}
                              </h4>
                              {stage.date && (
                                <p className="text-xs text-gray-500 mt-1">{stage.date}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Cost</p>
                      <p className="text-xl font-semibold text-gray-900">
                        ${patient.treatmentPlan.totalCost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Paid</p>
                      <p className="text-xl font-semibold text-emerald-600">
                        ${patient.treatmentPlan.paidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                      <p className="text-xl font-semibold text-amber-600">
                        ${(patient.treatmentPlan.totalCost - patient.treatmentPlan.paidAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onEditPlan && onEditPlan(patient.id)}
                  className="w-full px-4 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all"
                >
                  Go to Full Treatment Plan Editor
                </button>
              </>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-600 mb-4">No treatment plan assigned</p>
                <button
                  onClick={() => onEditPlan && onEditPlan(patient.id)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Create Treatment Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
