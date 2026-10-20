-- CreateTable
CREATE TABLE "TreatmentStage" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "sequence" SMALLINT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATE,
    "notes" TEXT,

    CONSTRAINT "TreatmentStage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentStage_planId_sequence_key" ON "TreatmentStage"("planId", "sequence");

-- AddForeignKey
ALTER TABLE "TreatmentStage" ADD CONSTRAINT "TreatmentStage_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TreatmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
