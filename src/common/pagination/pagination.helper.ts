import { BadRequestException } from "../exception/common.exception.js";
import { Pageable } from "./pageable.js";
import { PageableSchema } from "./pagination.schema.js";

export function extractPageable(query: unknown): Pageable {
  const { success, data, error } = PageableSchema.safeParse(query);

  if (!success || !data) {
    const fields = [...new Set(error.issues.map((i) => i.path[0]))];
    const message = `Invalid pagination fields: ${fields.join(", ")}`;
    throw new BadRequestException(message);
  }

  return Pageable.from(data.page, data.size, data.sort);
}
