-- CreateEnum
CREATE TYPE "Surface" AS ENUM ('mesial', 'distal', 'buccal', 'lingual', 'occlusal', 'incisal');

-- CreateEnum
CREATE TYPE "ToothStatus" AS ENUM ('healthy', 'treatment_needed', 'in_treatment', 'completed', 'missing', 'extracted');

-- CreateTable
CREATE TABLE "tooth_records" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "toothNumber" SMALLINT NOT NULL,
    "surfaces" "Surface"[],
    "status" "ToothStatus" NOT NULL DEFAULT 'healthy',
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tooth_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tooth_records_patientId_toothNumber_key" ON "tooth_records"("patientId", "toothNumber");

-- AddForeignKey
ALTER TABLE "tooth_records" ADD CONSTRAINT "tooth_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
