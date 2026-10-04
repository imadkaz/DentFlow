# DentFlow — Database Architecture & UML Guidelines

> **Version:** 1.1 · **Date:** 2026-09-04
> Target: PostgreSQL 16+ (primary) · Prisma ORM (recommended)
>
> **v1.1 note:** This revision closes five gaps found in v1.0, where a domain was
> named in Section 1 (or sketched in the UML) but never given an actual DDL/Prisma
> definition. See **Section 12 — v1.1 Changelog & Design Rationale** for the full
> list and the reasoning behind each decision. Everything added in this revision
> is marked inline with `-- v1.1` (SQL) or `// v1.1` (Prisma).

---

## 1. Overview

DentFlow persists six first-class domain models:

| Domain          | Core Tables                                                   |
|-----------------|---------------------------------------------------------------|
| Identity & Auth | `users`, `clinic_memberships`                                 |
| Clinic          | `clinics`, `locations`, `subscriptions`, `plans`               |
| Personnel       | `doctors`, `staff`                                            |
| Patients        | `patients`, `medical_records`, `tooth_records`                |
| Scheduling      | `appointments`, `appointment_notes`                           |
| Financials      | `treatment_plans`, `treatment_stages`, `invoices`, `payments` |

> **v1.1:** `roles` / `user_roles` (v1.0 names) were replaced by `clinic_memberships`,
> and `subscriptions` / `plans` were added. See Section 12.

---

## 2. UML Class Diagram

> **v1.1 note:** The diagram below is unchanged from v1.0 and does **not** include
> `Location`, `User`, `ClinicMembership`, `Staff`, `Subscription`, `Plan`, or
> `AppointmentNote` — redrawing the ASCII diagram risked corrupting it. Their
> DDL, Prisma models, and relationships are fully defined in Sections 4, 6, and 12.

```
┌──────────────────────────────────────────────────────────────────────┐
│                         DentFlow Domain Model                        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌───────────────────┐
│    Clinic    │1       *│     Location      │
│──────────────│─────────│───────────────────│
│ id: UUID     │         │ id: UUID          │
│ name: String │         │ clinicId: UUID    │
│ logo: String │         │ address: String   │
│ phone: String│         │ city: String      │
│ email: String│         │ state: String     │
│ createdAt    │         │ zip: String       │
└──────────────┘         └───────────────────┘
        │1
        │
        │*
┌──────────────┐
│    Doctor    │
│──────────────│
│ id: UUID     │
│ clinicId: UUID│
│ userId: UUID │◄───── User (auth identity)
│ name: String │
│ specialty:   │
│   String     │
│ licenseNo:   │
│   String     │
│ phone: String│
│ createdAt    │
└──────┬───────┘
       │1
       │
       │*
       │               ┌──────────────────────────────┐
┌──────▼───────┐  *  1 │          Patient             │
│ Appointment  │───────│──────────────────────────────│
│──────────────│       │ id: UUID                     │
│ id: UUID     │       │ clinicId: UUID               │
│ patientId:   │       │ name: String                 │
│   UUID       │       │ initials: String             │
│ doctorId:    │       │ email: String                │
│   UUID       │       │ phone: String                │
│ procedure:   │       │ address: String              │
│   String     │       │ dateOfBirth: Date            │
│ date: Date   │       │ status: PatientStatus        │
│ time: Time   │       │ balance: Decimal             │
│ duration:    │       │ createdAt: Timestamp         │
│   Integer    │       │ updatedAt: Timestamp         │
│ status:      │       └──────────────┬───────────────┘
│ AppStatus    │                      │1
│ notes: String│       ┌──────────────▼───────────────┐
└──────────────┘       │       MedicalRecord           │
                       │──────────────────────────────│
                       │ id: UUID                     │
                       │ patientId: UUID              │
                       │ allergies: String[]          │
                       │ conditions: String[]         │
                       │ medications: String[]        │
                       │ bloodType: String            │
                       │ notes: Text                  │
                       │ updatedAt: Timestamp         │
                       └──────────────┬───────────────┘
                                      │
                       ┌──────────────▼───────────────┐
                       │        ToothRecord            │
                       │──────────────────────────────│
                       │ id: UUID                     │
                       │ patientId: UUID              │
                       │ toothNumber: Integer (1-32)  │
                       │ surface: Surface[]           │
                       │ status: ToothStatus          │
                       │ notes: Text                  │
                       │ recordedAt: Timestamp        │
                       └──────────────────────────────┘

┌──────────────────────────────┐
│        TreatmentPlan         │     ┌──────────────────────┐
│──────────────────────────────│1  * │   TreatmentStage     │
│ id: UUID                     │─────│──────────────────────│
│ patientId: UUID              │     │ id: UUID             │
│ doctorId: UUID               │     │ planId: UUID         │
│ treatmentType: String        │     │ name: String         │
│ startDate: Date              │     │ sequence: Integer    │
│ endDate: Date                │     │ completed: Boolean   │
│ totalCost: Decimal           │     │ completedAt: Date    │
│ paidAmount: Decimal          │     │ notes: Text          │
│ status: PlanStatus           │     └──────────────────────┘
│ createdAt: Timestamp         │
│ updatedAt: Timestamp         │     ┌──────────────────────┐
└──────────────┬───────────────┘1  * │      Invoice         │
               │─────────────────────│──────────────────────│
                                     │ id: UUID             │
                                     │ planId: UUID         │
                                     │ patientId: UUID      │
                                     │ amount: Decimal      │
                                     │ dueDate: Date        │
                                     │ status: InvoiceStatus│
                                     │ issuedAt: Timestamp  │
                                     └──────────┬───────────┘
                                                │1
                                                │*
                                     ┌──────────▼───────────┐
                                     │       Payment        │
                                     │──────────────────────│
                                     │ id: UUID             │
                                     │ invoiceId: UUID      │
                                     │ amount: Decimal      │
                                     │ method: PayMethod    │
                                     │ reference: String    │
                                     │ paidAt: Timestamp    │
                                     └──────────────────────┘
```

---

## 3. Entity-Relationship Diagram (Crow's Foot Notation)

```
CLINIC ──┬───< LOCATION
         ├───< SUBSCRIPTION >─── PLAN                    (v1.1)
         ├───< CLINIC_MEMBERSHIP >─── USER                (v1.1)
         │
         └───< DOCTOR ─────┬───< APPOINTMENT >─── PATIENT
         │                 │            │
         └───< STAFF (v1.1)│            └───< APPOINTMENT_NOTE >─── USER  (v1.1)
                           │
                           └───< TREATMENT_PLAN >──────┤
                                        │              │
                                        ├───< TREATMENT_STAGE
                                        │
                                        └───< INVOICE ────< PAYMENT

PATIENT ──┬───1 MEDICAL_RECORD
          └───< TOOTH_RECORD
```

---

## 4. Table Definitions (SQL DDL)

### 4.1 Enumerations

```sql
CREATE TYPE patient_status   AS ENUM ('active', 'inactive', 'new');
CREATE TYPE appointment_status AS ENUM ('confirmed', 'pending', 'completed', 'cancelled', 'in_progress');
CREATE TYPE plan_status      AS ENUM ('active', 'completed', 'pending', 'cancelled');
CREATE TYPE invoice_status   AS ENUM ('unpaid', 'partial', 'paid', 'overdue', 'void');
CREATE TYPE pay_method       AS ENUM ('cash', 'card', 'insurance', 'bank_transfer', 'other');
CREATE TYPE tooth_status     AS ENUM ('healthy', 'treatment_needed', 'in_treatment', 'completed', 'missing', 'extracted');
CREATE TYPE surface          AS ENUM ('mesial', 'distal', 'buccal', 'lingual', 'occlusal', 'incisal');

-- v1.1
CREATE TYPE user_role        AS ENUM ('owner', 'admin', 'doctor', 'receptionist');
CREATE TYPE billing_cycle    AS ENUM ('monthly', 'yearly');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled');
```

### 4.2 Core Tables

```sql
-- v1.1: users — platform-wide login identity. NOT clinic-specific;
-- a user's relationship to a clinic (and role within it) lives in
-- clinic_memberships, not here. See Section 12.2.
CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          VARCHAR(120)  NOT NULL UNIQUE,
  password_hash  TEXT          NOT NULL,
  first_name     VARCHAR(80)   NOT NULL,
  last_name      VARCHAR(80)   NOT NULL,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- clinics
CREATE TABLE clinics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(120)  NOT NULL,
  logo_url    TEXT,
  phone       VARCHAR(30),
  email       VARCHAR(120)  UNIQUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- v1.1: clinic_memberships — replaces the v1.0 "roles"/"user_roles" pair.
-- A user's role is scoped PER CLINIC (the same person can be 'doctor' at
-- one clinic and 'receptionist' at another), so role cannot live directly
-- on users. See Section 12.2 for the full reasoning.
CREATE TABLE clinic_memberships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinic_id   UUID        NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  role        user_role   NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, clinic_id)
);

-- v1.1: locations — physical branches of a clinic. Fields per the v1.0 UML
-- sketch (Section 2); created_at/updated_at added for consistency with
-- every other table in this schema (the UML sketch omitted timestamps).
CREATE TABLE locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   UUID          NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  address     VARCHAR(255)  NOT NULL,
  city        VARCHAR(80)   NOT NULL,
  state       VARCHAR(80),
  zip         VARCHAR(20),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- v1.1: plans — catalog of subscription tiers. Seeded data (3 rows:
-- free/pro/enterprise), not created per clinic.
CREATE TABLE plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(50)    NOT NULL UNIQUE,
  price_cents   INTEGER        NOT NULL DEFAULT 0,
  billing_cycle billing_cycle  NOT NULL DEFAULT 'monthly',
  max_users     INTEGER,                          -- NULL = unlimited
  max_clinics   INTEGER        NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- v1.1: subscriptions — one active subscription per clinic, referencing
-- a plan from the catalog above.
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id             UUID  NOT NULL UNIQUE REFERENCES clinics(id) ON DELETE CASCADE,
  plan_id               UUID  NOT NULL REFERENCES plans(id),
  status                subscription_status NOT NULL DEFAULT 'trialing',
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- doctors
-- v1.1: added user_id — every doctor now REQUIRES a login account
-- (unique + NOT NULL). Decided in Section 12.1.
CREATE TABLE doctors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   UUID          NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id     UUID          NOT NULL UNIQUE REFERENCES users(id),  -- v1.1
  name        VARCHAR(120)  NOT NULL,
  specialty   VARCHAR(80),
  license_no  VARCHAR(40)   UNIQUE NOT NULL,
  phone       VARCHAR(30),
  email       VARCHAR(120)  UNIQUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- v1.1: staff — non-doctor clinic employees (receptionists, office
-- managers...). Mirrors doctors' shape but without medical-license fields.
-- Role/permissions still come from clinic_memberships, not from this table.
CREATE TABLE staff (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   UUID          NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id     UUID          NOT NULL UNIQUE REFERENCES users(id),
  title       VARCHAR(80)   NOT NULL,   -- e.g. 'Receptionist', 'Office Manager'
  phone       VARCHAR(30),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- patients
CREATE TABLE patients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID            NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name            VARCHAR(120)    NOT NULL,
  initials        CHAR(3)         NOT NULL,
  email           VARCHAR(120),
  phone           VARCHAR(30),
  address         TEXT,
  date_of_birth   DATE,
  status          patient_status  NOT NULL DEFAULT 'new',
  balance         DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  last_visit      DATE,
  total_visits    INTEGER         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- medical_records (one-to-one with patients)
CREATE TABLE medical_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID          NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
  allergies     TEXT[],
  conditions    TEXT[],
  medications   TEXT[],
  blood_type    VARCHAR(5),
  notes         TEXT,
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- tooth_records
CREATE TABLE tooth_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID          NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number  SMALLINT      NOT NULL CHECK (tooth_number BETWEEN 1 AND 32),
  surfaces      surface[],
  status        tooth_status  NOT NULL DEFAULT 'healthy',
  notes         TEXT,
  recorded_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (patient_id, tooth_number)
);

-- appointments
CREATE TABLE appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID                  NOT NULL REFERENCES patients(id),
  doctor_id     UUID                  NOT NULL REFERENCES doctors(id),
  procedure     VARCHAR(120)          NOT NULL,
  appt_date     DATE                  NOT NULL,
  appt_time     TIME                  NOT NULL,
  duration_min  SMALLINT              NOT NULL DEFAULT 30,
  status        appointment_status    NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ           NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ           NOT NULL DEFAULT now()
);

-- v1.1: appointment_notes — a timestamped, multi-author note LOG per
-- appointment (e.g. "10:02am, Dr. Aoun: patient arrived late"), distinct
-- from appointments.notes above which is a single free-text field.
CREATE TABLE appointment_notes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID          NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  author_id      UUID          NOT NULL REFERENCES users(id),
  note           TEXT          NOT NULL,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- treatment_plans
CREATE TABLE treatment_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID            NOT NULL REFERENCES patients(id),
  doctor_id       UUID            NOT NULL REFERENCES doctors(id),
  treatment_type  VARCHAR(120)    NOT NULL,
  start_date      DATE            NOT NULL,
  end_date        DATE,
  total_cost      DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  paid_amount     DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  status          plan_status     NOT NULL DEFAULT 'pending',
  next_appt_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- treatment_stages
CREATE TABLE treatment_stages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       UUID          NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
  name          VARCHAR(120)  NOT NULL,
  sequence      SMALLINT      NOT NULL,
  completed     BOOLEAN       NOT NULL DEFAULT false,
  completed_at  DATE,
  notes         TEXT,
  UNIQUE (plan_id, sequence)
);

-- invoices
CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       UUID            NOT NULL REFERENCES treatment_plans(id),
  patient_id    UUID            NOT NULL REFERENCES patients(id),
  amount        DECIMAL(10, 2)  NOT NULL,
  due_date      DATE            NOT NULL,
  status        invoice_status  NOT NULL DEFAULT 'unpaid',
  issued_at     TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- payments
CREATE TABLE payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    UUID            NOT NULL REFERENCES invoices(id),
  amount        DECIMAL(10, 2)  NOT NULL,
  method        pay_method      NOT NULL DEFAULT 'cash',
  reference     VARCHAR(80),
  paid_at       TIMESTAMPTZ     NOT NULL DEFAULT now()
);
```

---

## 5. Indexes

```sql
-- patient lookups
CREATE INDEX idx_patients_clinic    ON patients(clinic_id);
CREATE INDEX idx_patients_status    ON patients(status);
CREATE INDEX idx_patients_email     ON patients(email);

-- scheduling
CREATE INDEX idx_appts_date         ON appointments(appt_date);
CREATE INDEX idx_appts_patient      ON appointments(patient_id);
CREATE INDEX idx_appts_doctor       ON appointments(doctor_id);
CREATE INDEX idx_appts_status       ON appointments(status);

-- treatment plans
CREATE INDEX idx_plans_patient      ON treatment_plans(patient_id);
CREATE INDEX idx_plans_status       ON treatment_plans(status);

-- financials
CREATE INDEX idx_invoices_patient   ON invoices(patient_id);
CREATE INDEX idx_invoices_status    ON invoices(status);
CREATE INDEX idx_invoices_due       ON invoices(due_date);
CREATE INDEX idx_payments_invoice   ON payments(invoice_id);

-- tooth chart
CREATE INDEX idx_tooth_patient      ON tooth_records(patient_id);

-- v1.1: identity, location & billing
CREATE INDEX idx_memberships_user     ON clinic_memberships(user_id);
CREATE INDEX idx_memberships_clinic   ON clinic_memberships(clinic_id);
CREATE INDEX idx_locations_clinic     ON locations(clinic_id);
CREATE INDEX idx_staff_clinic         ON staff(clinic_id);
CREATE INDEX idx_doctors_user         ON doctors(user_id);
CREATE INDEX idx_subscriptions_clinic ON subscriptions(clinic_id);
CREATE INDEX idx_appt_notes_appt      ON appointment_notes(appointment_id);
```

---

## 6. Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// v1.1
model User {
  id             String              @id @default(uuid())
  email          String              @unique @db.VarChar(120)
  passwordHash   String
  firstName      String              @db.VarChar(80)
  lastName       String              @db.VarChar(80)
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  memberships    ClinicMembership[]
  doctorProfile  Doctor?
  staffProfile   Staff?
  authoredNotes  AppointmentNote[]
}

// v1.1
enum UserRole {
  owner
  admin
  doctor
  receptionist
}

// v1.1 — replaces v1.0's "roles"/"user_roles". See Section 12.2.
model ClinicMembership {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  clinicId  String
  clinic    Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  role      UserRole
  createdAt DateTime @default(now())

  @@unique([userId, clinicId])
}

model Clinic {
  id            String             @id @default(uuid())
  name          String             @db.VarChar(120)
  logoUrl       String?
  phone         String?            @db.VarChar(30)
  email         String?            @unique @db.VarChar(120)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  doctors       Doctor[]
  patients      Patient[]
  locations     Location[]         // v1.1
  memberships   ClinicMembership[] // v1.1
  staff         Staff[]            // v1.1
  subscription  Subscription?      // v1.1
}

// v1.1
model Location {
  id        String   @id @default(uuid())
  clinicId  String
  clinic    Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  address   String   @db.VarChar(255)
  city      String   @db.VarChar(80)
  state     String?  @db.VarChar(80)
  zip       String?  @db.VarChar(20)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("locations")
}

// v1.1
enum BillingCycle {
  monthly
  yearly
}

// v1.1
enum SubscriptionStatus {
  trialing
  active
  past_due
  canceled
}

// v1.1 — seeded catalog, not created per clinic
model Plan {
  id            String             @id @default(uuid())
  name          String             @unique @db.VarChar(50)
  priceCents    Int                @default(0)
  billingCycle  BillingCycle       @default(monthly)
  maxUsers      Int?
  maxClinics    Int                @default(1)
  createdAt     DateTime           @default(now())
  subscriptions Subscription[]
}

// v1.1
model Subscription {
  id                  String             @id @default(uuid())
  clinicId            String             @unique
  clinic              Clinic             @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  planId              String
  plan                Plan               @relation(fields: [planId], references: [id])
  status              SubscriptionStatus @default(trialing)
  currentPeriodStart  DateTime?
  currentPeriodEnd    DateTime?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
}

model Doctor {
  id           String          @id @default(uuid())
  clinicId     String
  clinic       Clinic          @relation(fields: [clinicId], references: [id])
  userId       String          @unique // v1.1 — required login account
  user         User            @relation(fields: [userId], references: [id]) // v1.1
  name         String          @db.VarChar(120)
  specialty    String?         @db.VarChar(80)
  licenseNo    String          @unique @db.VarChar(40)
  phone        String?         @db.VarChar(30)
  email        String?         @unique @db.VarChar(120)
  createdAt    DateTime        @default(now())
  appointments Appointment[]
  plans        TreatmentPlan[]
}

// v1.1
model Staff {
  id        String   @id @default(uuid())
  clinicId  String
  clinic    Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  title     String   @db.VarChar(80)
  phone     String?  @db.VarChar(30)
  createdAt DateTime @default(now())

  @@map("staff")
}

enum PatientStatus {
  active
  inactive
  new
}

model Patient {
  id            String          @id @default(uuid())
  clinicId      String
  clinic        Clinic          @relation(fields: [clinicId], references: [id])
  name          String          @db.VarChar(120)
  initials      String          @db.Char(3)
  email         String?         @db.VarChar(120)
  phone         String?         @db.VarChar(30)
  address       String?
  dateOfBirth   DateTime?       @db.Date
  status        PatientStatus   @default(new)
  balance       Decimal         @default(0) @db.Decimal(10, 2)
  lastVisit     DateTime?       @db.Date
  totalVisits   Int             @default(0)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  medicalRecord MedicalRecord?
  toothRecords  ToothRecord[]
  appointments  Appointment[]
  plans         TreatmentPlan[]
  invoices      Invoice[]
}

model MedicalRecord {
  id          String    @id @default(uuid())
  patientId   String    @unique
  patient     Patient   @relation(fields: [patientId], references: [id])
  allergies   String[]
  conditions  String[]
  medications String[]
  bloodType   String?   @db.VarChar(5)
  notes       String?
  updatedAt   DateTime  @updatedAt
}

enum ToothStatus {
  healthy
  treatment_needed
  in_treatment
  completed
  missing
  extracted
}

model ToothRecord {
  id          String      @id @default(uuid())
  patientId   String
  patient     Patient     @relation(fields: [patientId], references: [id])
  toothNumber Int
  status      ToothStatus @default(healthy)
  notes       String?
  recordedAt  DateTime    @default(now())
  @@unique([patientId, toothNumber])
}

enum AppointmentStatus {
  confirmed
  pending
  completed
  cancelled
  in_progress
}

model Appointment {
  id          String            @id @default(uuid())
  patientId   String
  patient     Patient           @relation(fields: [patientId], references: [id])
  doctorId    String
  doctor      Doctor            @relation(fields: [doctorId], references: [id])
  procedure   String            @db.VarChar(120)
  apptDate    DateTime          @db.Date
  apptTime    DateTime          @db.Time
  durationMin Int               @default(30) @db.SmallInt
  status      AppointmentStatus @default(pending)
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  appointmentNotes AppointmentNote[] // v1.1
}

// v1.1
model AppointmentNote {
  id            String      @id @default(uuid())
  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  authorId      String
  author        User        @relation(fields: [authorId], references: [id])
  note          String
  createdAt     DateTime    @default(now())

  @@map("appointment_notes")
}

enum PlanStatus {
  active
  completed
  pending
  cancelled
}

model TreatmentPlan {
  id            String           @id @default(uuid())
  patientId     String
  patient       Patient          @relation(fields: [patientId], references: [id])
  doctorId      String
  doctor        Doctor           @relation(fields: [doctorId], references: [id])
  treatmentType String           @db.VarChar(120)
  startDate     DateTime         @db.Date
  endDate       DateTime?        @db.Date
  totalCost     Decimal          @default(0) @db.Decimal(10, 2)
  paidAmount    Decimal          @default(0) @db.Decimal(10, 2)
  status        PlanStatus       @default(pending)
  nextApptAt    DateTime?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  stages        TreatmentStage[]
  invoices      Invoice[]
}

model TreatmentStage {
  id          String        @id @default(uuid())
  planId      String
  plan        TreatmentPlan @relation(fields: [planId], references: [id])
  name        String        @db.VarChar(120)
  sequence    Int           @db.SmallInt
  completed   Boolean       @default(false)
  completedAt DateTime?     @db.Date
  notes       String?
  @@unique([planId, sequence])
}

enum InvoiceStatus {
  unpaid
  partial
  paid
  overdue
  void
}

model Invoice {
  id        String        @id @default(uuid())
  planId    String
  plan      TreatmentPlan @relation(fields: [planId], references: [id])
  patientId String
  patient   Patient       @relation(fields: [patientId], references: [id])
  amount    Decimal       @db.Decimal(10, 2)
  dueDate   DateTime      @db.Date
  status    InvoiceStatus @default(unpaid)
  issuedAt  DateTime      @default(now())
  payments  Payment[]
}

enum PayMethod {
  cash
  card
  insurance
  bank_transfer
  other
}

model Payment {
  id        String    @id @default(uuid())
  invoiceId String
  invoice   Invoice   @relation(fields: [invoiceId], references: [id])
  amount    Decimal   @db.Decimal(10, 2)
  method    PayMethod @default(cash)
  reference String?   @db.VarChar(80)
  paidAt    DateTime  @default(now())
}
```

---

## 7. Computed / Derived Values

| Field | Derivation | Where to compute |
|---|---|---|
| `patient.balance` | `SUM(invoice.amount) – SUM(payment.amount)` per patient | DB view or trigger |
| `patient.total_visits` | `COUNT(appointments WHERE status = 'completed')` | DB view or application layer |
| `patient.last_visit` | `MAX(appt_date WHERE status = 'completed')` | DB view |
| `plan.paid_amount` | `SUM(payment.amount) WHERE invoice.plan_id = plan.id` | DB view or trigger |
| `invoice.status` | Rule: paid if total payments ≥ amount; partial if 0 < payments < amount; overdue if due_date < today | Nightly job or trigger |

---

## 8. Key Business Rules

1. **One active plan per patient** — enforce with a partial unique index:
   ```sql
   CREATE UNIQUE INDEX one_active_plan_per_patient
     ON treatment_plans(patient_id)
     WHERE status = 'active';
   ```

2. **Stage sequence integrity** — stages within a plan must be marked complete in ascending `sequence` order. Validate in application layer before mutation.

3. **Payment ≤ invoice amount** — `SUM(payments.amount) ≤ invoice.amount` enforced via application layer or check trigger.

4. **Tooth number range** — 1–32 (Universal Numbering System). Validate at API boundary and DB constraint.

5. **Appointment time conflict** — no two `confirmed` appointments for the same doctor may overlap in time. Enforce in application layer with a DB query before insert.

6. **Soft deletes** — add `deleted_at TIMESTAMPTZ` to `patients`, `appointments`, and `treatment_plans`. Filter with `WHERE deleted_at IS NULL` in all queries. Never hard-delete patient-facing records.

7. **(v1.1) One clinic_membership per (user, clinic) pair** — enforced by the `UNIQUE (user_id, clinic_id)` constraint. A user CAN belong to multiple clinics, but only ever with one role per clinic.

8. **(v1.1) One subscription per clinic** — enforced by `subscriptions.clinic_id UNIQUE`.

---

## 9. Migration Strategy

```
migrations/
├── 001_create_enums.sql
├── 002_create_clinics_doctors.sql
├── 003_create_patients_medical.sql
├── 004_create_tooth_records.sql
├── 005_create_appointments.sql
├── 006_create_treatment_plans_stages.sql
├── 007_create_invoices_payments.sql
├── 008_create_indexes.sql
├── 009_create_identity_and_billing.sql   -- v1.1: users, clinic_memberships, plans, subscriptions
└── 010_create_locations_staff_notes.sql  -- v1.1: locations, staff, appointment_notes
```

Run with Prisma:
```bash
npx prisma migrate dev --name <description>
npx prisma migrate deploy          # production
npx prisma db seed                 # seed demo data
```

---

## 10. Seed Data Mapping (from current frontend)

The existing `src/app/data/patientsData.ts` maps directly to these tables:

| Frontend field | DB table · column |
|---|---|
| `Patient.id` | `patients.id` |
| `Patient.name / initials` | `patients.name / initials` |
| `Patient.email / phone / address` | `patients.*` |
| `Patient.dateOfBirth` | `patients.date_of_birth` |
| `Patient.lastVisit / totalVisits` | `patients.last_visit / total_visits` (derived) |
| `Patient.status` | `patients.status` |
| `Patient.balance` | `patients.balance` (derived) |
| `Patient.medicalNotes` | `medical_records.notes` |
| `TreatmentPlan.*` | `treatment_plans.*` |
| `TreatmentStage.name / completed / date` | `treatment_stages.name / completed / completed_at` |
| `Appointment.procedure / date / time / duration` | `appointments.procedure / appt_date / appt_time / duration_min` |
| `Appointment.doctor` | `doctors.name` (via FK) |
| `Appointment.status` | `appointments.status` |

---

## 11. API Layer Contract (REST)

```
GET    /api/patients                  → Patient[]
POST   /api/patients                  → Patient
GET    /api/patients/:id              → Patient (with medicalRecord + activePlan)
PATCH  /api/patients/:id              → Patient
DELETE /api/patients/:id              → 204 (soft delete)

GET    /api/appointments              → Appointment[] (query: date, doctorId, status)
POST   /api/appointments              → Appointment
PATCH  /api/appointments/:id          → Appointment
DELETE /api/appointments/:id          → 204

GET    /api/treatment-plans/:patientId → TreatmentPlan[]
POST   /api/treatment-plans           → TreatmentPlan
PATCH  /api/treatment-plans/:id       → TreatmentPlan
PATCH  /api/treatment-plans/:id/stages/:stageId → TreatmentStage

GET    /api/invoices/:patientId        → Invoice[]
POST   /api/invoices                   → Invoice
POST   /api/invoices/:id/payments      → Payment

GET    /api/patients/:id/teeth         → ToothRecord[]
PUT    /api/patients/:id/teeth/:num    → ToothRecord (upsert)
```

---

## 12. v1.1 Changelog & Design Rationale

v1.0 named five tables in Section 1's overview table (and sketched two more in
the UML) that had **no actual DDL, Prisma model, or index anywhere in the
document** — they existed as labels only. This revision closes every one of
those gaps. Nothing below was invented casually: each decision is recorded
here so a future reader (or a future you) knows *why*, not just *what*.

### 12.1 `Doctor.userId` — now required (`NOT NULL UNIQUE`)

The v1.0 UML sketched `Doctor.userId` pointing at "User (auth identity)", but
the DDL/Prisma sections never included the column at all. **Decision: every
doctor row now requires exactly one linked `users` row** — a doctor cannot
exist in the system without a login account. This matches the product flow
where the clinic owner (who signs up) is a doctor by default, and every
doctor added afterward is expected to log in and use the system directly
(view their own schedule, update treatment plans, etc.).

### 12.2 `users` / `clinic_memberships` — replaces v1.0's `roles` / `user_roles`

v1.0 named `users`, `roles`, and `user_roles` in the overview table but never
defined any of the three. The naming itself was ambiguous: a separate
`user_roles` join table implies a role can be independent of which clinic
it applies to — but in a multi-tenant SaaS, **the same person can hold a
different role at different clinics** (e.g. `doctor` at Clinic A,
`receptionist` at Clinic B). Putting a fixed `role` column directly on
`users`, or joining through a clinic-agnostic `user_roles` table, cannot
express that.

**Decision:** `clinic_memberships` replaces `user_roles`, and folds `roles`
into a plain `user_role` enum (the role set is small and fixed — `owner`,
`admin`, `doctor`, `receptionist` — so a lookup table added no value over an
enum, consistent with how every other fixed status in this schema, like
`patient_status` or `invoice_status`, is already modeled). Each row of
`clinic_memberships` says "this user has this role at this clinic," and the
`UNIQUE (user_id, clinic_id)` constraint keeps one role per user per clinic
while allowing multiple memberships across different clinics.

### 12.3 `locations` — schema now defined

v1.0 sketched `Location` in the UML (Section 2) with `address`, `city`,
`state`, `zip`, but the DDL/Prisma sections never defined it. The fields
below are taken directly from that sketch; `created_at`/`updated_at` were
added only for consistency with every other table in this schema (the UML
sketch didn't show timestamps, but no other table in this document omits
them either).

### 12.4 `staff` — schema now defined

Named in Section 1 ("Personnel: doctors, staff") but never defined. Staff
covers non-doctor clinic employees (receptionists, office managers) who
need a `users` login and a `clinic_memberships` role like anyone else, but
don't need `doctors`-specific fields (`licenseNo`, `specialty`). The table
mirrors `doctors`' shape minus the medical-license fields, plus a free-text
`title`.

### 12.5 `appointment_notes` — schema now defined

Named in Section 1 ("Scheduling: appointments, appointment_notes") but
never defined, and easy to confuse with the existing `appointments.notes`
column. **They serve different purposes:** `appointments.notes` is a single
free-text field on the appointment itself, while `appointment_notes` is a
**timestamped, multi-author log** — multiple entries per appointment, each
attributed to the `user` who wrote it (e.g. a receptionist noting "patient
arrived 10 min late" without overwriting the doctor's own note on the same
appointment).

### 12.6 `subscriptions` / `plans` — new domain, not in v1.0 at all

Not named anywhere in v1.0 — discovered as a gap while designing the SaaS
signup flow (a clinic owner picks a plan during signup). **Decision:**
split into two tables rather than one, matching how billing is modeled in
virtually every real SaaS: `plans` is a small, rarely-changing **catalog**
(seeded once — e.g. `free` / `pro` / `enterprise` — with `price_cents`,
`billing_cycle`, and `max_users`), while `subscriptions` is the **live
link** between a specific clinic and whichever plan it currently has,
tracking billing period and status (`trialing`, `active`, `past_due`,
`canceled`). This mirrors how Stripe and similar billing providers model
the same relationship, which will matter if/when DentFlow integrates one.

---

*End of DentFlow Database Guidelines*
