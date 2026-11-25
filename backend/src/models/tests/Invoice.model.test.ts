import { describe, it, expect } from 'vitest';
import { Invoice, InvoiceStatus } from '../Invoice.model';
import { Payment, PayMethod } from '../Payment.model';
import { parseDateOnly } from '../../util/date';

const base = {
    id: 'i1', clinicId: 'c1', patientId: 'p1', planId: 'pl1',
    amountCents: 10_000, dueDate: parseDateOnly('2030-01-31'),
};

describe('Invoice status (derived)', () => {
    it('unpaid when nothing paid and not due', () => {
        expect(Invoice.create(base).getStatus('2030-01-01')).toBe(InvoiceStatus.UNPAID);
    });
    it('partial when some paid', () => {
        expect(Invoice.create({ ...base, paidCents: 4_000 }).getStatus('2030-01-01')).toBe(InvoiceStatus.PARTIAL);
    });
    it('paid when fully paid, even if past due', () => {
        expect(Invoice.create({ ...base, paidCents: 10_000 }).getStatus('2031-01-01')).toBe(InvoiceStatus.PAID);
    });
    it('overdue when past due and unpaid or partial', () => {
        expect(Invoice.create(base).getStatus('2030-02-01')).toBe(InvoiceStatus.OVERDUE);
        expect(Invoice.create({ ...base, paidCents: 1 }).getStatus('2030-02-01')).toBe(InvoiceStatus.OVERDUE);
    });
    it('not overdue on the due date itself', () => {
        expect(Invoice.create(base).getStatus('2030-01-31')).toBe(InvoiceStatus.UNPAID);
    });
    it('void wins over everything', () => {
        expect(Invoice.create({ ...base, voided: true, paidCents: 10_000 }).getStatus('2031-01-01')).toBe(InvoiceStatus.VOID);
    });
});

describe('Invoice rules', () => {
    it('rejects non-integer, zero and negative amounts', () => {
        for (const amountCents of [0, -5, 10.5, NaN]) {
            expect(() => Invoice.create({ ...base, amountCents })).toThrow();
        }
    });
    it('issue() rejects a due date before today', () => {
        expect(() => Invoice.issue({ ...base, dueDate: parseDateOnly('2000-01-01') })).toThrow(/before the issue date/);
    });
    it('parseDateOnly rejects garbage and impossible dates', () => {
        for (const v of ['garbage', '2030-13-01', '2030-02-31', 20300101, undefined]) {
            expect(() => parseDateOnly(v)).toThrow();
        }
    });
});

describe('Payment rules', () => {
    const p = { id: 'x', invoiceId: 'i1', amountCents: 500 };
    it('requires a positive integer amount', () => {
        for (const amountCents of [0, -1, 1.5]) {
            expect(() => Payment.record({ ...p, amountCents })).toThrow();
        }
    });
    it('requires a reference for card and bank_transfer, not for cash', () => {
        expect(() => Payment.record({ ...p, method: PayMethod.CARD })).toThrow(/reference is required/);
        expect(() => Payment.record({ ...p, method: PayMethod.BANK_TRANSFER })).toThrow(/reference is required/);
        expect(Payment.record({ ...p, method: PayMethod.CASH }).getMethod()).toBe(PayMethod.CASH);
        expect(Payment.record({ ...p, method: PayMethod.CARD, reference: 'R1' }).getReference()).toBe('R1');
    });
    it('rejects a paidAt in the future', () => {
        expect(() => Payment.record({ ...p, paidAt: new Date(Date.now() + 3_600_000) })).toThrow(/future/);
    });
    it('create() (DB rehydrate) does not apply record-time business rules', () => {
        expect(Payment.create({ ...p, method: PayMethod.CARD }).getReference()).toBeNull();
    });
});
