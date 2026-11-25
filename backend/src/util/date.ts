import { ValidationError } from "./exceptions/http/ValidationError";

const BUSINESS_TZ = 'Asia/Beirut';

const beirutFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

/** 'YYYY-MM-DD' of an instant, as seen on a Beirut calendar. */
export function toBeirutDateString(date: Date): string {
    return beirutFormatter.format(date);
}

export function todayInBeirut(): string {
    return toBeirutDateString(new Date());
}

/** 'YYYY-MM-DD' of a date-only value (Prisma @db.Date comes back as UTC midnight). */
export function formatDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/** Parses a strict 'YYYY-MM-DD' string into a UTC-midnight Date. */
export function parseDateOnly(value: unknown, field = 'date'): Date {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new ValidationError(`${field} must be a date in YYYY-MM-DD format`);
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (isNaN(date.getTime()) || formatDateOnly(date) !== value) {
        throw new ValidationError(`${field} is not a valid date`);
    }
    return date;
}
