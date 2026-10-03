/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,apptDate,apptTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_apptDate_apptTime_key" ON "Appointment"("doctorId", "apptDate", "apptTime");
