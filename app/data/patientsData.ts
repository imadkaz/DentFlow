// Centralized data for patients, appointments, and treatment plans

export interface TreatmentStage {
  name: string;
  completed: boolean;
  date?: string;
}

export interface TreatmentPlan {
  id: number;
  treatmentType: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  paidAmount: number;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  stages: TreatmentStage[];
  nextAppointment?: string;
}

export interface Patient {
  id: number;
  name: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  lastVisit: string;
  totalVisits: number;
  status: 'active' | 'inactive' | 'new';
  balance: number;
  medicalNotes?: string;
  treatmentPlan?: TreatmentPlan;
}

export interface Appointment {
  id: number;
  patientId: number;
  procedure: string;
  date: string;
  time: string;
  duration: string;
  doctor: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
}

export const patients: Patient[] = [
  {
    id: 1,
    name: 'John Anderson',
    initials: 'JA',
    email: 'john.anderson@email.com',
    phone: '(555) 123-4567',
    address: '123 Oak Street, New York, NY 10001',
    dateOfBirth: 'Jan 15, 1985',
    lastVisit: 'Feb 10, 2026',
    totalVisits: 24,
    status: 'active',
    balance: 3300,
    medicalNotes: 'Allergic to penicillin. Root canal in progress.',
    treatmentPlan: {
      id: 1,
      treatmentType: 'Full Orthodontic Treatment',
      startDate: 'Jan 10, 2026',
      endDate: 'Jan 10, 2027',
      totalCost: 5500,
      paidAmount: 2200,
      status: 'active',
      nextAppointment: 'Feb 23, 2026 - 09:00 AM',
      stages: [
        { name: 'Initial Consultation', completed: true, date: 'Jan 10, 2026' },
        { name: 'X-Rays & Impressions', completed: true, date: 'Jan 12, 2026' },
        { name: 'Braces Installation', completed: true, date: 'Jan 20, 2026' },
        { name: 'First Adjustment', completed: false },
        { name: 'Monthly Check-ups', completed: false },
        { name: 'Braces Removal', completed: false },
        { name: 'Retainer Fitting', completed: false },
      ],
    },
  },
  {
    id: 2,
    name: 'Emma Wilson',
    initials: 'EW',
    email: 'emma.wilson@email.com',
    phone: '(555) 234-5678',
    address: '456 Pine Avenue, Brooklyn, NY 11201',
    dateOfBirth: 'Mar 22, 1990',
    lastVisit: 'Feb 18, 2026',
    totalVisits: 18,
    status: 'active',
    balance: 1000,
    medicalNotes: 'Regular checkups every 6 months.',
    treatmentPlan: {
      id: 2,
      treatmentType: 'Root Canal & Crown',
      startDate: 'Feb 5, 2026',
      endDate: 'Mar 15, 2026',
      totalCost: 2000,
      paidAmount: 1000,
      status: 'active',
      nextAppointment: 'Feb 23, 2026 - 10:30 AM',
      stages: [
        { name: 'Initial Examination', completed: true, date: 'Feb 5, 2026' },
        { name: 'Root Canal - Session 1', completed: true, date: 'Feb 10, 2026' },
        { name: 'Root Canal - Session 2', completed: false },
        { name: 'Crown Preparation', completed: false },
        { name: 'Crown Placement', completed: false },
      ],
    },
  },
  {
    id: 3,
    name: 'Michael Brown',
    initials: 'MB',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    address: '789 Maple Drive, Queens, NY 11354',
    dateOfBirth: 'Jul 8, 1978',
    lastVisit: 'Feb 20, 2026',
    totalVisits: 32,
    status: 'active',
    balance: 1900,
    medicalNotes: 'Dental implant procedure scheduled.',
    treatmentPlan: {
      id: 3,
      treatmentType: 'Dental Implant',
      startDate: 'Jan 15, 2026',
      endDate: 'Jun 15, 2026',
      totalCost: 3800,
      paidAmount: 1900,
      status: 'active',
      nextAppointment: 'Feb 23, 2026 - 02:00 PM',
      stages: [
        { name: 'Consultation & Planning', completed: true, date: 'Jan 15, 2026' },
        { name: '3D Imaging & CT Scan', completed: true, date: 'Jan 18, 2026' },
        { name: 'Implant Surgery', completed: true, date: 'Feb 1, 2026' },
        { name: 'Healing Period', completed: false },
        { name: 'Abutment Placement', completed: false },
        { name: 'Crown Fitting', completed: false },
      ],
    },
  },
  {
    id: 4,
    name: 'Sarah Davis',
    initials: 'SD',
    email: 'sarah.davis@email.com',
    phone: '(555) 456-7890',
    address: '321 Elm Street, Manhattan, NY 10002',
    dateOfBirth: 'Nov 30, 1995',
    lastVisit: 'Jan 20, 2026',
    totalVisits: 8,
    status: 'active',
    balance: 0,
    medicalNotes: 'Teeth whitening completed.',
    treatmentPlan: {
      id: 4,
      treatmentType: 'Teeth Whitening Package',
      startDate: 'Dec 10, 2025',
      endDate: 'Jan 20, 2026',
      totalCost: 800,
      paidAmount: 800,
      status: 'completed',
      stages: [
        { name: 'Initial Assessment', completed: true, date: 'Dec 10, 2025' },
        { name: 'Professional Cleaning', completed: true, date: 'Dec 12, 2025' },
        { name: 'Whitening Session 1', completed: true, date: 'Dec 20, 2025' },
        { name: 'Whitening Session 2', completed: true, date: 'Jan 5, 2026' },
        { name: 'Final Review', completed: true, date: 'Jan 20, 2026' },
      ],
    },
  },
  {
    id: 5,
    name: 'James Wilson',
    initials: 'JW',
    email: 'james.wilson@email.com',
    phone: '(555) 567-8901',
    address: '654 Cedar Lane, Bronx, NY 10451',
    dateOfBirth: 'May 12, 2000',
    lastVisit: 'Dec 15, 2025',
    totalVisits: 3,
    status: 'new',
    balance: 1200,
    medicalNotes: 'Wisdom teeth extraction scheduled.',
    treatmentPlan: {
      id: 5,
      treatmentType: 'Wisdom Teeth Extraction',
      startDate: 'Feb 20, 2026',
      endDate: 'Feb 20, 2026',
      totalCost: 1200,
      paidAmount: 0,
      status: 'pending',
      nextAppointment: 'Feb 24, 2026 - 09:00 AM',
      stages: [
        { name: 'Pre-op Consultation', completed: false },
        { name: 'Extraction Procedure', completed: false },
        { name: 'Follow-up Check', completed: false },
      ],
    },
  },
];

export const todayAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
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
    patientId: 2,
    procedure: 'Regular Checkup',
    date: '2026-02-23',
    time: '10:30 AM',
    duration: '30 min',
    doctor: 'Dr. Sarah Chen',
    status: 'confirmed',
  },
  {
    id: 3,
    patientId: 3,
    procedure: 'Teeth Cleaning',
    date: '2026-02-23',
    time: '02:00 PM',
    duration: '45 min',
    doctor: 'Dr. James Miller',
    status: 'in-progress',
  },
  {
    id: 4,
    patientId: 4,
    procedure: 'Consultation',
    date: '2026-02-23',
    time: '04:00 PM',
    duration: '30 min',
    doctor: 'Dr. Sarah Chen',
    status: 'pending',
  },
];

// Helper function to get patient by ID
export function getPatientById(patientId: number): Patient | undefined {
  return patients.find(p => p.id === patientId);
}

// Helper function to get appointment details with patient info
export function getAppointmentWithPatient(appointmentId: number) {
  const appointment = todayAppointments.find(a => a.id === appointmentId);
  if (!appointment) return null;
  
  const patient = getPatientById(appointment.patientId);
  if (!patient) return null;
  
  return {
    ...appointment,
    patientName: patient.name,
    patientInitials: patient.initials,
  };
}
