import { Calendar, Clock, User, Phone, Mail, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface BookingStep {
  id: number;
  title: string;
  completed: boolean;
}

const treatments = [
  { id: 1, name: 'General Checkup', duration: '30 min', price: '$80' },
  { id: 2, name: 'Teeth Cleaning', duration: '45 min', price: '$120' },
  { id: 3, name: 'Root Canal', duration: '90 min', price: '$800' },
  { id: 4, name: 'Teeth Whitening', duration: '60 min', price: '$350' },
  { id: 5, name: 'Dental Crown', duration: '120 min', price: '$1,200' },
  { id: 6, name: 'Tooth Extraction', duration: '45 min', price: '$250' },
  { id: 7, name: 'Dental Implant', duration: '150 min', price: '$2,500' },
  { id: 8, name: 'Orthodontic Consultation', duration: '30 min', price: '$100' },
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const availableDates = [
  { date: 23, day: 'Mon', available: true },
  { date: 24, day: 'Tue', available: true },
  { date: 25, day: 'Wed', available: false },
  { date: 26, day: 'Thu', available: true },
  { date: 27, day: 'Fri', available: true },
  { date: 28, day: 'Sat', available: true },
  { date: 1, day: 'Sun', available: false },
];

export function BookingInterface({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTreatment, setSelectedTreatment] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const steps: BookingStep[] = [
    { id: 1, title: 'Select Treatment', completed: selectedTreatment !== null },
    { id: 2, title: 'Choose Date & Time', completed: selectedDate !== null && selectedTime !== null },
    { id: 3, title: 'Your Information', completed: formData.name !== '' && formData.email !== '' && formData.phone !== '' },
    { id: 4, title: 'Confirmation', completed: false },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = () => {
    // Handle booking submission
    alert('Appointment booked successfully!');
    if (onClose) onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTreatment !== null;
      case 2:
        return selectedDate !== null && selectedTime !== null;
      case 3:
        return formData.name !== '' && formData.email !== '' && formData.phone !== '';
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 8s-2-3-5-3-5 3-5 3M17 16s-2 3-5 3-5-3-5-3" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-gray-800">DentFlow</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600">
            Schedule your visit in just a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.id < currentStep
                        ? 'bg-emerald-500 text-white'
                        : step.id === currentStep
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 -mt-8 ${
                      step.id < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Step 1: Select Treatment */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                What type of treatment do you need?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treatments.map((treatment) => (
                  <button
                    key={treatment.id}
                    onClick={() => setSelectedTreatment(treatment.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedTreatment === treatment.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{treatment.name}</h3>
                      {selectedTreatment === treatment.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {treatment.duration}
                      </span>
                      <span className="font-semibold text-blue-600">{treatment.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Date & Time */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Select your preferred date and time
              </h2>

              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Choose Date</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableDates.map((dateItem) => (
                    <button
                      key={dateItem.date}
                      onClick={() => dateItem.available && setSelectedDate(dateItem.date)}
                      disabled={!dateItem.available}
                      className={`flex-shrink-0 flex flex-col items-center p-4 rounded-xl border-2 min-w-[100px] transition-all ${
                        !dateItem.available
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : selectedDate === dateItem.date
                          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs text-gray-600 mb-1">{dateItem.day}</span>
                      <span className="text-2xl font-semibold text-gray-900">{dateItem.date}</span>
                      <span className="text-xs text-gray-500 mt-1">Feb</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Choose Time</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        selectedTime === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/20'
                          : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Your Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tell us about yourself
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any specific concerns or questions?"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Review Your Appointment
                </h2>
                <p className="text-gray-600">
                  Please confirm your appointment details
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Treatment</p>
                  <p className="font-semibold text-gray-900">
                    {treatments.find((t) => t.id === selectedTreatment)?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Duration: {treatments.find((t) => t.id === selectedTreatment)?.duration} | 
                    Price: {treatments.find((t) => t.id === selectedTreatment)?.price}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {availableDates.find((d) => d.date === selectedDate)?.day}, Feb {selectedDate}, 2026
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Time: {selectedTime}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Your Information</p>
                  <p className="font-semibold text-gray-900">{formData.name}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.email} | {formData.phone}
                  </p>
                  {formData.notes && (
                    <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-purple-200">
                      Notes: {formData.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
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
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                !canProceed()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleBooking}
              className="px-8 py-3 rounded-xl font-medium flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
