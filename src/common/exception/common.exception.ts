import { HttpStatus } from "../http/http-status.js";
import { HttpException } from "./http.exception.js";

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", code = "BAD_REQUEST") {
    super(HttpStatus.BAD_REQUEST, code, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(HttpStatus.UNAUTHORIZED, code, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(HttpStatus.FORBIDDEN, code, message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(
    message = "Internal Server Error",
    code = "INTERNAL_SERVER_ERROR",
  ) {
    super(HttpStatus.INTERNAL, code, message, false);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Resource Not Found", code = "NOT_FOUND") {
    super(HttpStatus.NOT_FOUND, code, message, true);
  }
}
export class ValidationException extends HttpException {
  constructor(
    message = "Validation Error",
    public readonly details?: unknown,
  ) {
    super(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
  }
}
