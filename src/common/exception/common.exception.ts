import { HttpException, HttpStatus } from "./http.exception.js";

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
