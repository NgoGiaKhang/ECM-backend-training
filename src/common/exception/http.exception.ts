export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL: 500,
} as const;

export class HttpException extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly expose: boolean;

  constructor(status: number, code: string, message: string, expose = true) {
    super(message);

    this.status = status;
    this.code = code;
    this.expose = expose;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}
