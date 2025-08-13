import { FastifyError } from "fastify";

export const NOT_FOUND = "Not found";
export const INTERNAL_SERVER_ERROR = "Something went wrong";
export const BAD_REQUEST = "Bad request";

export const handleError = (
  error: FastifyError,
): { status: number; body: Record<string, string> } => {
  if (error.validation) {
    return { status: 400, body: { message: BAD_REQUEST } };
  }
  if (error.statusCode === 404) {
    return { status: 404, body: { message: NOT_FOUND } };
  }
  return { status: 500, body: { message: INTERNAL_SERVER_ERROR } };
};
