import z from "zod";

/**
 * Convert ZodError into a flat map like:
 *
 *   "address.city"   -> "message"
 *   "items[0].name"  -> "message"
 *   "items[1].price" -> "message"
 *
 * Uses issue.message as both i18n key and default message.
 */
/**
 * Build a string path from Zod issue path.
 *
 * Examples:
 *   ['address', 'city']            -> "address.city"
 *   ['items', 0, 'name']           -> "items[0].name"
 *   ['items', 1, 'price']          -> "items[1].price"
 *   []                             -> "root"
 */
function buildPath(path: PropertyKey[]): string {
  if (!path.length) {
    return "root";
  }

  let result = "";

  for (const segment of path) {
    if (typeof segment === "number") {
      // array index: append [index]
      result += `[${segment}]`;
    } else {
      // object key: first key or nested
      const s = String(segment);
      if (result === "") {
        result = s;
      } else {
        result += `.${s}`;
      }
    }
  }

  return result;
}

export function formatValidationError(
  params: z.ZodError,
): Record<string, string> {
  const details: Record<string, string> = {};
  const issues = params.issues ?? [];

  for (const issue of issues) {
    const path = buildPath(issue.path);
    const defaultValue = issue.message;

    details[path] = defaultValue;
  }

  return details;
}
