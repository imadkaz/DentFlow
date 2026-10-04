-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('active', 'inactive', 'new');

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "initials" VARCHAR(3) NOT NULL,
    "email" VARCHAR(120),
    "phone" VARCHAR(30),
    "address" TEXT,
    "dateOfBirth" DATE,
    "status" "PatientStatus" NOT NULL DEFAULT 'new',
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "lastVisit" DATE,
    "totalVisit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
