import { BadRequestException } from "../exception/common.exception.js";
import { Pageable } from "./pageable.js";
import { PageableSchema } from "./pagination.schema.js";
import type { Request } from "express";

/**
 * Extracts and validates pagination and sorting parameters
 * from an Express request query.
 *
 * @param request The incoming Express request.
 * @param allowedSortFields Optional whitelist of allowed sort fields.
 *
 * @returns A validated Pageable instance.
 *
 * @throws {BadRequestException}
 * Throws when:
 * - pagination parameters are invalid
 * - sort fields are not allowed
 */
export function extractPageable(
  request: Request,
  allowedSortFields?: readonly string[],
): Pageable {
  const result = PageableSchema.safeParse(request.query);

  if (!result.success) {
    const fields = [
      ...new Set(result.error.issues.map((issue) => String(issue.path[0]))),
    ];

    throw new BadRequestException(
      `Invalid pagination fields: ${fields.join(", ")}`,
    );
  }

  const pageable = Pageable.from(
    result.data.page,
    result.data.limit,
    result.data.sort,
  );

  validateSortFields(pageable, allowedSortFields);

  return pageable;
}

/**
 * Validates requested sort fields against a whitelist.
 *
 * @param pageable The pageable instance.
 * @param allowedSortFields Allowed sortable fields.
 *
 * @throws {BadRequestException}
 * Throws when an unauthorized sort field is requested.
 */
function validateSortFields(
  pageable: Pageable,
  allowedSortFields?: readonly string[],
): void {
  if (!allowedSortFields || allowedSortFields.length === 0) {
    return;
  }

  const invalidOrder = pageable.sort.orders.find(
    ({ property }) => !allowedSortFields.includes(String(property)),
  );

  if (!invalidOrder) {
    return;
  }

  throw new BadRequestException(
    [
      `Sorting by field '${String(invalidOrder.property)}' is not allowed.`,
      `Allowed fields: ${allowedSortFields.join(", ")}`,
    ].join(" "),
  );
}
