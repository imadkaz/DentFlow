import { Request } from "express";
import { ValidationError } from "./exceptions/http/ValidationError";

export interface RequestContext {
    clinicId: string;
}

/**
 * TEMPORARY (decision D5): until Auth exists, the clinic comes from the
 * `x-clinic-id` header. When Auth lands, only this function changes:
 * it will read clinicId from the verified session instead.
 */
export function getRequestContext(req: Request): RequestContext {
    const clinicId = req.header('x-clinic-id');
    if (!clinicId || clinicId.trim().length === 0) {
        throw new ValidationError('x-clinic-id header is required');
    }
    return { clinicId: clinicId.trim() };
}
