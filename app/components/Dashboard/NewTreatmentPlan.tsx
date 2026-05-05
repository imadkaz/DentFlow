import { X, Plus, Trash2, Calendar, DollarSign, User, FileText } from 'lucide-react';
import { useState } from 'react';
import { patients } from '../../data/patientsData';

interface NewTreatmentPlanProps {
  onClose: () => void;
  onSave: (plan: any) => void;
}

const treatmentTypes = [
  'Full Orthodontic Treatment',
  'Root Canal & Crown',
  'Dental Implant',
  'Teeth Whitening Package',
  'Wisdom Teeth Extraction',
  'Dental Crown',
  'Teeth Cleaning & Checkup',
  'Periodontal Treatment',
  'Dentures',
  'Veneers',
  'Bridge Installation',
  'TMJ Treatment',
  'Other',
];

const defaultStages = {
  'Full Orthodontic Treatment': [
    'Initial Consultation',
    'X-Rays & Impressions',
    'Braces Installation',
    'Monthly Adjustments',
    'Braces Removal',
    'Retainer Fitting',
  ],
  'Root Canal & Crown': [
    'Initial Examination',
    'Root Canal - Session 1',
    'Root Canal - Session 2',
    'Crown Preparation',
    'Crown Placement',
  ],
  'Dental Implant': [
    'Consultation & Planning',
    '3D Imaging & CT Scan',
    'Implant Surgery',
    'Healing Period',
    'Abutment Placement',
    'Crown Fitting',
  ],
  'Teeth Whitening Package': [
    'Initial Assessment',
    'Professional Cleaning',
    'Whitening Session 1',
    'Whitening Session 2',
    'Final Review',
  ],
  'Wisdom Teeth Extraction': [
    'Pre-op Consultation',
    'Extraction Procedure',
    'Follow-up Check',
  ],
};

export function NewTreatmentPlan({ onClose, onSave }: NewTreatmentPlanProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: '',
    treatmentType: '',
    customTreatmentType: '',
    startDate: '',
    endDate: '',
    totalCost: '',
    initialPayment: '',
    status: 'pending' as 'active' | 'pending' | 'completed' | 'cancelled',
    stages: [] as string[],
    notes: '',
  });

  const [customStage, setCustomStage] = useState('');

  const handlePatientSelect = (patientId: string) => {
    setFormData({ ...formData, patientId });
  };

  const handleTreatmentTypeChange = (type: string) => {
    setFormData({
      ...formData,
      treatmentType: type,
      stages: defaultStages[type as keyof typeof defaultStages] || [],
    });
  };

  const addCustomStage = () => {
    if (customStage.trim()) {
      setFormData({
        ...formData,
        stages: [...formData.stages, customStage.trim()],
      });
      setCustomStage('');
    }
  };

  const removeStage = (index: number) => {
    setFormData({
      ...formData,
      stages: formData.stages.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    // Validate form
    if (!formData.patientId || !formData.treatmentType || !formData.totalCost) {
      alert('Please fill in all required fields');
      return;
    }

    const newPlan = {
      patientId: parseInt(formData.patientId),
      treatmentType: formData.treatmentType === 'Other' ? formData.customTreatmentType : formData.treatmentType,
      startDate: formData.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: formData.endDate,
      totalCost: parseInt(formData.totalCost),
      paidAmount: parseInt(formData.initialPayment) || 0,
      status: formData.status,
      stages: formData.stages.map(name => ({ name, completed: false })),
      notes: formData.notes,
    };

    onSave(newPlan);
    alert('Treatment plan created successfully!');
    onClose();
  };

  const canProceedStep1 = formData.patientId !== '';
  const canProceedStep2 = formData.treatmentType !== '' && (formData.treatmentType !== 'Other' || formData.customTreatmentType !== '');
  const canProceedStep3 = formData.totalCost !== '' && formData.stages.length > 0;

  const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Create New Treatment Plan</h2>
            <p className="text-gray-600 mt-1">Step {currentStep} of 4</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step < currentStep
                    ? 'bg-emerald-500 text-white'
                    : step === currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 4 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Patient */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient.id.toString())}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.patientId === patient.id.toString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {patient.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-600">{patient.phone}</p>
                    </div>
                    {patient.treatmentPlan && (
                      <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">
                        Has active plan
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Treatment Type */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Treatment Type</h3>
            {selectedPatient && (
              <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600">Creating plan for:</p>
                <p className="font-semibold text-gray-900">{selectedPatient.name}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {treatmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTreatmentTypeChange(type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.treatmentType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-900">{type}</p>
                </button>
              ))}
            </div>

            {formData.treatmentType === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Treatment Type
                </label>
                <input
                  type="text"
                  value={formData.customTreatmentType}
                  onChange={(e) => setFormData({ ...formData, customTreatmentType: e.target.value })}
                  placeholder="Enter treatment type"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Treatment Details & Stages */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Treatment Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Estimated)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Cost *
                </label>
                <input
                  type="number"
                  value={formData.totalCost}
                  onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                  placeholder="5000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Payment
                </label>
                <input
                  type="number"
                  value={formData.initialPayment}
                  onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Stages *
              </label>
              <div className="space-y-2 mb-3">
                {formData.stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <span className="flex-1 text-gray-900">{stage}</span>
                    <button
                      onClick={() => removeStage(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customStage}
                  onChange={(e) => setCustomStage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomStage()}
                  placeholder="Add custom stage..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  onClick={addCustomStage}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Notes */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review & Confirm</h3>

            {selectedPatient && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                    {selectedPatient.initials}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-semibold text-gray-900">{selectedPatient.name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Treatment Type</p>
              <p className="font-semibold text-gray-900">
                {formData.treatmentType === 'Other' ? formData.customTreatmentType : formData.treatmentType}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-2xl font-semibold text-gray-900">${parseInt(formData.totalCost || '0').toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Initial Payment</p>
                <p className="text-2xl font-semibold text-emerald-600">${parseInt(formData.initialPayment || '0').toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Treatment Stages ({formData.stages.length})</p>
              <div className="space-y-2">
                {formData.stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-900">{stage}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or notes..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2) ||
                (currentStep === 3 && !canProceedStep3)
              }
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                ((currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2) ||
                (currentStep === 3 && !canProceedStep3))
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Create Treatment Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
