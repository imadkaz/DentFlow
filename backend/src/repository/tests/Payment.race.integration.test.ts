import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { describe, it, expect, afterAll } from 'vitest';
import { prisma } from '../../db';
import { InvoiceRepository } from '../InvoiceRepository';
import { PaymentRepository } from '../PaymentRepository';
import { Invoice } from '../../models/Invoice.model';
import { Payment, PayMethod } from '../../models/Payment.model';
import { parseDateOnly } from '../../util/date';
import { ConflictError } from '../../util/exceptions/http/ConflictError';
import { NotFoundError } from '../../util/exceptions/http/NotFoundError';
import { vi } from 'vitest';
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });
/**
 * Concurrency tests for the invoice row lock (SELECT ... FOR UPDATE).
 * These cannot be reproduced with fakes: they need a real database.
 * They create their own clinics and delete everything they create.
 */

const invoiceRepository = new InvoiceRepository(prisma);
const paymentRepository = new PaymentRepository(prisma);

const createdClinicIds: string[] = [];

afterAll(async () => {
    for (const clinicId of createdClinicIds) {
        await prisma.payment.deleteMany({ where: { invoice: { clinicId } } });
        await prisma.invoice.deleteMany({ where: { clinicId } });
        await prisma.treatmentPlan.deleteMany({ where: { patient: { clinicId } } });
        const doctors = await prisma.doctor.findMany({ where: { clinicId }, select: { id: true, userId: true } });
        await prisma.doctor.deleteMany({ where: { clinicId } });
        for (const d of doctors) await prisma.user.deleteMany({ where: { id: d.userId } });
        await prisma.patient.deleteMany({ where: { clinicId } });
        await prisma.clinic.deleteMany({ where: { id: clinicId } });
    }
    createdClinicIds.length = 0;
    await prisma.$disconnect();
});

async function createFixture() {
    const clinic = await prisma.clinic.create({ data: { name: 'Race Test Clinic' } });
    createdClinicIds.push(clinic.id);
    const user = await prisma.user.create({
        data: { email: `race-${randomUUID()}@example.com`, passwordHash: 'x', firstName: 'Race', lastName: 'Test' },
    });
    const doctor = await prisma.doctor.create({
        data: { clinicId: clinic.id, userId: user.id, name: 'Dr Race', licenseNo: `LIC-${randomUUID().slice(0, 8)}` },
    });
    const patient = await prisma.patient.create({
        data: { clinicId: clinic.id, name: 'Race Patient', initials: 'RPT' },
    });
    const plan = await prisma.treatmentPlan.create({
        data: { patientId: patient.id, doctorId: doctor.id, treatmentType: 'Race test', startDate: new Date('2030-01-01') },
    });
    return { clinicId: clinic.id, patientId: patient.id, planId: plan.id };
}

async function createInvoice(
    f: { clinicId: string; patientId: string; planId: string },
    amountCents: number,
): Promise<Invoice> {
    return invoiceRepository.save(Invoice.issue({
        id: randomUUID(),
        clinicId: f.clinicId,
        patientId: f.patientId,
        planId: f.planId,
        amountCents,
        dueDate: parseDateOnly('2099-12-31'),
    }));
}

const pay = (invoiceId: string, clinicId: string, amountCents: number) =>
    paymentRepository.recordPayment(
        Payment.record({ id: randomUUID(), invoiceId, amountCents, method: PayMethod.CASH }),
        clinicId,
    );

const paidCentsInDb = async (invoiceId: string) => {
    const agg = await prisma.payment.aggregate({ where: { invoiceId }, _sum: { amount: true } });
    return agg._sum.amount ? Math.round(agg._sum.amount.mul(100).toNumber()) : 0;
};

describe('recordPayment concurrency (integration)', () => {
    it('never lets concurrent payments exceed the invoice amount', async () => {
        const f = await createFixture();
        const invoice = await createInvoice(f, 10_000);

        // 6 x 30.00 against a 100.00 invoice: exactly 3 can fit (90.00), 3 must be rejected.
        const results = await Promise.allSettled(
            Array.from({ length: 6 }, () => pay(invoice.getId(), f.clinicId, 3_000)),
        );

        const fulfilled = results.filter((r) => r.status === 'fulfilled');
        const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
        expect(fulfilled).toHaveLength(3);
        expect(rejected).toHaveLength(3);
        console.log(rejected.map((r) => [(r.reason as { code?: string }).code, (r.reason as Error).message]));
        for (const r of rejected) expect(r.reason).toBeInstanceOf(ConflictError);

        expect(await paidCentsInDb(invoice.getId())).toBe(9_000);
        const reloaded = await invoiceRepository.findById(invoice.getId(), f.clinicId);
        expect(reloaded?.getPaidCents()).toBe(9_000);
        expect(reloaded?.getBalanceCents()).toBe(1_000);
    });
    

    it('lets exactly one of two concurrent full payments through', async () => {
        const f = await createFixture();
        const invoice = await createInvoice(f, 10_000);

        const results = await Promise.allSettled([
            pay(invoice.getId(), f.clinicId, 10_000),
            pay(invoice.getId(), f.clinicId, 10_000),
        ]);

        expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
        expect(await paidCentsInDb(invoice.getId())).toBe(10_000);
        const reloaded = await invoiceRepository.findById(invoice.getId(), f.clinicId);
        expect(reloaded?.getStatus()).toBe('paid');
    });

    it('a payment and a void on the same invoice can never both succeed', async () => {
        const f = await createFixture();

        // Repeat with fresh invoices to hit different interleavings.
        for (let i = 0; i < 8; i++) {
            const invoice = await createInvoice(f, 10_000);
            const [voidResult, payResult] = await Promise.allSettled([
                invoiceRepository.voidInvoice(invoice.getId(), f.clinicId),
                pay(invoice.getId(), f.clinicId, 2_500),
            ]);

            const succeeded = [voidResult, payResult].filter((r) => r.status === 'fulfilled');
            expect(succeeded).toHaveLength(1);
            const failed = [voidResult, payResult].find((r): r is PromiseRejectedResult => r.status === 'rejected');
            expect(failed?.reason).toBeInstanceOf(ConflictError);

            // The invariant that matters: a void invoice never has payments.
            const row = await prisma.invoice.findUniqueOrThrow({ where: { id: invoice.getId() } });
            const count = await prisma.payment.count({ where: { invoiceId: invoice.getId() } });
            expect(row.status === 'void' && count > 0).toBe(false);
        }
    });
});

describe('recordPayment rules (integration)', () => {
    it('rejects a payment on a void invoice', async () => {
        const f = await createFixture();
        const invoice = await createInvoice(f, 10_000);
        await invoiceRepository.voidInvoice(invoice.getId(), f.clinicId);

        await expect(pay(invoice.getId(), f.clinicId, 1_000)).rejects.toBeInstanceOf(ConflictError);
        expect(await paidCentsInDb(invoice.getId())).toBe(0);
    });

    it('rejects a payment larger than the remaining balance, and a payment on a fully paid invoice', async () => {
        const f = await createFixture();
        const invoice = await createInvoice(f, 10_000);

        await pay(invoice.getId(), f.clinicId, 6_000);
        await expect(pay(invoice.getId(), f.clinicId, 4_001)).rejects.toBeInstanceOf(ConflictError);
        await pay(invoice.getId(), f.clinicId, 4_000);
        await expect(pay(invoice.getId(), f.clinicId, 1)).rejects.toBeInstanceOf(ConflictError);

        expect(await paidCentsInDb(invoice.getId())).toBe(10_000);
    });

    it('does not let another clinic pay or void an invoice (tenant isolation)', async () => {
        const a = await createFixture();
        const b = await createFixture();
        const invoice = await createInvoice(a, 10_000);

        await expect(pay(invoice.getId(), b.clinicId, 1_000)).rejects.toBeInstanceOf(NotFoundError);
        await expect(invoiceRepository.voidInvoice(invoice.getId(), b.clinicId)).rejects.toBeInstanceOf(NotFoundError);
        expect(await invoiceRepository.findById(invoice.getId(), b.clinicId)).toBeNull();
        expect(await paidCentsInDb(invoice.getId())).toBe(0);
    });

    it('does not void an invoice that already has a payment', async () => {
        const f = await createFixture();
        const invoice = await createInvoice(f, 10_000);
        await pay(invoice.getId(), f.clinicId, 1_000);

        await expect(invoiceRepository.voidInvoice(invoice.getId(), f.clinicId)).rejects.toBeInstanceOf(ConflictError);
    });
});
