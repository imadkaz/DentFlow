# DentFlow — Frontend Plan (Clinic Dashboard)

> Audience: the frontend developer. Owner: backend lead.
> Status: draft v1. Anything marked **[DECIDE]** needs an answer before that phase starts.
> Source of truth for the data model: `DentFlowGuideLine/DATABASE_GUIDELINES (1).md` (v1.1). Where the working schema (`backend/prisma/schema.prisma`) differs, the schema wins.

---

## 1. Scope

**In scope now: the clinic-facing SaaS** — marketing site, signup, and the clinic dashboard (staff: owner / admin / doctor / receptionist).

**Out of scope (deferred, do not build or design for):**
- The patient-facing site/marketplace (separate domain and brand, "nearby clinics" search, patient booking). It comes after the SaaS is done.
- Per-clinic white-label sites or subdomains.
- Clinic ratings/reviews, geo search, maps.

The backend is **one API for everything**. The future patient site will be a *second frontend* on the same backend under `/api/portal/*`. So keep the dashboard free of patient-portal assumptions.

## 2. Suggested stack (recommendations — confirm or counter-propose)

| Concern | Suggestion | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript strict | Already decided |
| Styling/UI | Tailwind + a component kit you already know (e.g. shadcn/ui) | Speed; dashboard is form/table heavy |
| Server state | TanStack Query | Caching, invalidation after mutations |
| Forms | react-hook-form + Zod | Mirror backend validation client-side |
| API mocking | MSW | Lets you work before backend endpoints exist |
| E2E (later) | Playwright | Phase 5 |

Repo layout: put the app in `frontend/` at the monorepo root (next to `backend/`). Separate CI job; do not touch `backend/` files.

## 3. What the backend has TODAY (verified from `backend/src/routes`)

No auth exists yet. All routes are open. Base path is root (no `/api` prefix yet).

| Resource | Endpoints |
|---|---|
| `/clinics` | `POST /`, `GET /:id`, `GET /email/:email`, `PATCH /:id`, `DELETE /:id` |
| `/users` | `POST /`, `GET /:id`, `GET /email/:email`, `PATCH /:id`, `DELETE /:id` |
| `/doctors` | `POST /`, `PATCH /:id`, `GET /:id`, `GET /email/:email`, `GET /lecenseNo/:licenseNo` *(typo in path, will be fixed — do not hardcode)*, `GET /clinic/:clinicId`, `DELETE /:id` |
| `/patients` | `POST /`, `PATCH /:id`, `DELETE /:id`, `GET /:id`, `GET /name/:name`, `GET /clinic/:clinicId` |
| `/patients/:patientId/teeth` | `GET /:patientId/teeth`, `PUT /:patientId/teeth/:num` (upsert) |
| `/appointments` | `POST /`, `PATCH /:id`, `GET /:id`, `DELETE /:id`, `GET /patient/:patientId`, `GET /doctor/:doctorId` |
| `/medical-records` | `POST /`, `PATCH /:id`, `GET /:id`, `GET /patient/:patientId`, `DELETE /:id` |
| `/treatment-plans` | `POST /`, `GET /patient/:patientId`, **`PUT /:id`** *(PUT, not PATCH)*, `GET /:id`, `DELETE /:id` |
| `/treatment-stages` | `POST /`, `GET /:id`, `PATCH /:id`, `PATCH /:id/complete`, `GET /plan/:planId`, `DELETE /:id` |

Errors: JSON `{ "message": string }` with status `400` (validation), `404` (not found), `409` (conflict), generic `500`. Build one API client that maps these to typed errors.

**Request/response field shapes are not documented yet.** Read the controllers and mappers (`backend/src/Controllers`, `backend/src/mapper`) for each module before you build its screens, and write what you find into `docs/api-contract.md` (one section per module). That file becomes the contract and the source for your MSW mocks. Do not guess field names or date formats — check them.

### Known gaps the frontend will hit (backend to-do, tracked by backend lead)
1. **CORS blocks `PATCH`.** `backend/src/index.ts` allows `GET, POST, PUT, DELETE, OPTIONS` only; every PATCH from a browser fails the preflight. Backend fix, one line. Until it lands, use a Next.js route-handler proxy in dev or ask for the fix first.
2. **No auth.** Login, JWT, signup, clinic memberships are the next backend milestone after Invoice/Payment. Until then use the dev clinic selector (see Phase 1).
3. **No list-by-clinic/date for appointments.** Only by patient or doctor. A calendar view needs `GET /appointments?clinicId&from&to`. Requested; mock it for now.
4. **No pagination or search** on patient/doctor lists. Design tables to be paginated, but expect everything in one response for now.
5. **Invoices/Payments do not exist yet** (being built now).
6. **No OpenAPI spec.** Hence `docs/api-contract.md`.

## 4. Conventions that must be right from day one

- **Money is integer cents** in the app and in the invoice/payment API. Format with `Intl.NumberFormat` using the clinic's `currency` (3-letter code, default `USD`). Never use floats for arithmetic. *Note:* older modules (TreatmentPlan `totalCost`/`paidAmount`) currently return decimal numbers; check the contract per module. Unifying them is a deferred backend decision.
- **Derived values are computed server-side on read**: invoice `status`, `overdue`, plan `paidAmount`, patient `balance`. The UI displays them; it never recalculates or sends them.
- **Dates:** the schema mixes date-only (`@db.Date`), time-only (`@db.Time`) and timestamps. The business timezone is Beirut. Never compare "today" using `new Date()` on a date-only value. Check the serialized format in the contract before building pickers.
- **Enums** to mirror exactly: patient status (`active|inactive|new`), appointment status (`confirmed|pending|completed|cancelled|in_progress`), plan status (`active|completed|pending|cancelled`), invoice status (`unpaid|partial|paid|overdue|void`), pay method (`cash|card|insurance|bank_transfer|other`), tooth status, tooth surface. Put them in one shared constants file.
- **No hard deletes of financial/patient records.** UI wording: "void" / "cancel" / "archive", not "delete", for invoices, payments, patients, plans.
- **Authorization is never done in the UI.** Hiding a button is UX, not security. Don't build logic that assumes the client enforces roles.
- **Multi-tenancy:** every screen runs in the context of exactly one clinic. Keep `clinicId` in one place (an app-level context), never scattered in components.
- **i18n / RTL [DECIDE]:** Lebanon likely means Arabic + English. Retrofitting RTL is expensive. Recommendation: build with logical CSS (`ms-*`/`me-*`, `ps-*`/`pe-*`, `start/end`) from day one, add the i18n library when a real translation is requested. Confirm before Phase 1.

## 5. Phases

### Phase 0 — Setup (≈ 2–3 days)
- `frontend/` scaffold, TS strict, ESLint, Prettier, env handling (`NEXT_PUBLIC_API_URL`).
- Typed API client + error mapping (`{message}` + status).
- App shell: sidebar, top bar, clinic context provider, empty/loading/error primitives, toast.
- MSW set up with one working example.
- CI job: install, lint, typecheck, build.
- **Done when:** a hello-world page fetches `GET /clinics/:id` from a local backend and shows a typed error on 404.

### Phase 1 — Clinic core, no auth (can start now)
Use a **dev-only clinic selector** (env var or a hidden dropdown) as the temporary source of `clinicId`. It will be replaced by the session in Phase 3 — keep it behind one hook (`useClinicId()`).

Screens, in this order:
1. **Patients**: list (by clinic), search by name, create, edit, detail page with tabs.
2. **Doctors**: list by clinic, create, edit.
3. **Patient detail tabs**: Medical record (create/edit), Tooth chart (32 teeth, surfaces, status; upsert per tooth), Appointments, Treatment plans.
4. **Appointments**: create (patient + doctor + date/time + duration), edit, cancel, status changes; list by doctor and by patient. Calendar view once the clinic-wide endpoint exists (mock until then).
5. **Treatment plans & stages**: plan create/edit, stage list, complete stages **in ascending order** (backend enforces; surface its 400 message), progress indicator.

Edge cases to handle explicitly:
- Booking a slot that is already taken → `409`. Show it clearly.
- Only one `active` plan per patient → expect a conflict error when activating a second.
- Optional fields that arrive as `null`.

### Phase 2 — Billing UI (starts when backend Invoice/Payment is merged)
- Patient → **Invoices** tab: list, create invoice from a treatment plan, status badges.
- **Record payment** dialog: amount (cents under the hood), method, reference, paid-at. Reference required for card/bank transfer *(rule pending backend confirmation)*.
- Prevent double submit (disable + idempotent UX); expect a `409`/`400` if the payment would exceed the invoice amount or the invoice is void/paid.
- Void invoice (not allowed if payments exist — show backend message).
- Money formatting from cents + clinic currency.
- Not in v1: refunds, invoice numbering, PDF/receipts (deferred).

### Phase 3 — Auth & marketing (starts when backend Auth is ready)
- Public site: landing, pricing/plans, signup (clinic + owner account), login.
- Session handling. **[DECIDE with backend lead]** httpOnly cookie vs bearer token — decided in the Auth design, not before.
- Route protection (Next.js middleware), logout, expired-session handling.
- Clinic switcher (a user can belong to several clinics with one role each).
- Role-based navigation: `owner | admin | doctor | receptionist`. Replace the dev clinic selector.
- Settings: clinic profile (name, logo, phone, email; currency read-only for now).

### Phase 4 — Payments integration (after Whish Money backend)
- Clinic settings for payment methods and the fee-bearer option.
- Whish payment flow screens. Spec to come from the backend lead; do not start earlier.

### Phase 5 — Hardening & deploy
- E2E tests for the critical flows (create patient → book → plan → invoice → payment).
- Accessibility pass, responsive pass, error boundary, 404/500 pages.
- Docker + DigitalOcean deploy config together with the backend.

## 6. Definition of done (every screen)
- Loading, empty, error, and success states exist.
- Forms validate client-side with Zod, matching backend rules, and display backend `message` on failure.
- Works at tablet width; keyboard-navigable; labels on inputs.
- Mutations invalidate the right queries; no stale lists after create/edit.
- Typecheck, lint, and tests pass in CI.
- The module's section in `docs/api-contract.md` is up to date.

## 7. Working agreement
- One PR per screen or small feature; branch from `main`, name `feature/<area>-<thing>`.
- If an endpoint you need is missing or its shape is awkward, **open an issue/message with the exact request** instead of working around it silently. The backend is easy to change now and expensive later.
- Backend lead reviews contract changes; frontend dev reviews UX of errors. Weekly check-in to re-order phases.

## 8. Open decisions
| # | Question | Needed by |
|---|---|---|
| F1 | Arabic/RTL from day one? | Phase 1 start |
| F2 | UI kit choice | Phase 0 |
| F3 | Cookie vs bearer session | Phase 3 (Auth design) |
| F4 | Design source: do we have Figma / the existing prototype (`patientsData.ts` mentioned in the DB guidelines)? Where is it? | Phase 0 |
