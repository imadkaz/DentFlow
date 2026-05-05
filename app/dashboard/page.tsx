"use client";
import { useState } from "react";
import { Analytics } from "../components/Dashboard/AnalyticsCard";
import { AlertCircle, Calendar, DollarSign, Users } from "lucide-react";
import { AnalyticsCards } from "../data/AnaliticsCard";
import { todayAppointments, getPatientById } from "../data/patientsData";
import { PatientDetailModal } from "../components/Dashboard/PatientDetailModal";
import { BookingInterface } from "../components/Dashboard/BookingInterface";
import { ToothChart } from "../components/Dashboard/ToothChart";
import { TreatmentPlanPanel } from "../components/Dashboard/TreatmentPlanPanel";

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );

  const selectedPatient = selectedPatientId
    ? getPatientById(selectedPatientId)
    : null;

  const handleEditPlan = (patientId: number) => {
    setSelectedPatientId(null);
    // setActiveMenuItem('treatment-plans');
    // You can add logic to scroll to or highlight the specific patient's plan
  };

  // Show booking interface
  if (showBooking) {
    return <BookingInterface onClose={() => setShowBooking(false)} />;
  }
  return (
    <>
      <main className="pt-10 p-8">
        <div className="max-w-400 mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book New Appointment
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {AnalyticsCards.map((card, index) => (
              <Analytics key={index} {...card} />
            ))}
          </div>
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tooth Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ToothChart />
            </div>

            {/* Treatment Plan Panel - Takes 1 column */}
            <div className="lg:col-span-1">
              <TreatmentPlanPanel />
            </div>
          </div>
          {/* Recent Activity Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Appointments
              </h3>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  if (!patient) return null;

                  return (
                    <button
                      key={appointment.id}
                      onClick={() =>
                        setSelectedPatientId(appointment.patientId)
                      }
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all text-left"
                    >
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                          {patient.initials}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {patient.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.procedure}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.time}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : appointment.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {appointment.status === "in-progress"
                            ? "In Progress"
                            : appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Statistics
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Patient Satisfaction
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      98%
                    </span>
                  </div>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-linear-to-r from-emerald-50 to-green-50 border border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Treatment Success Rate
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      96%
                    </span>
                  </div>
                  <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-green-400 rounded-full"
                      style={{ width: "96%" }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Appointment Attendance
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      94%
                    </span>
                  </div>
                  <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-purple-500 to-pink-400 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Revenue Target
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      87%
                    </span>
                  </div>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-500 to-orange-400 rounded-full"
                      style={{ width: "87%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatientId(null)}
          onEditPlan={handleEditPlan}
        />
      )}
    </>
  );
}
