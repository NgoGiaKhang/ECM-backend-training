import { HttpException } from "@/shared/exception/index.js";
import { HttpStatus } from "@/shared/http/http-status.js";

export class IdempotencyInProgressException extends HttpException {
  constructor(
    message = "Request is already processing",
    code = "IDEMPOTENCY_IN_PROGRESS",
  ) {
    super(409, message, code);
  }
}

export class MissingIdempotencyKeyException extends HttpException {
  constructor(
    message = "Missing idempotency key",
    code = "MISSING_IDEMPOTENCY_KEY",
  ) {
    super(HttpStatus.BAD_REQUEST, message, code);
  }
}
