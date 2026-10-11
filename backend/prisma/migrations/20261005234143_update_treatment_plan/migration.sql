/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `TreatmentPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TreatmentPlan_patientId_key" ON "TreatmentPlan"("patientId") WHERE (status = 'active');
