-- CreateTable
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "logoUrl" TEXT,
    "phone" VARCHAR(30),
    "email" VARCHAR(120),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinics_email_key" ON "clinics"("email");
