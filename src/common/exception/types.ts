export type ErrorResponse = {
  status: number;
  message: string;
  code: string;
  details?: Record<string, unknown>
}