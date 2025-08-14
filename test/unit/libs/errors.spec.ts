import {
  handleError,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../../src/libs/errors";

describe("handleError", () => {
  test("Returns 400 if it comes", () => {
    const error = { statusCode: 400 } as any;
    const result = handleError(error);
    expect(result).toEqual({ status: 400, body: { message: BAD_REQUEST } });
  });

  test("Returns 404 if it comes", () => {
    const error = { statusCode: 404 } as any;
    const result = handleError(error);
    expect(result).toEqual({ status: 404, body: { message: NOT_FOUND } });
  });

  test("Returns 500 as default for any other case", () => {
    const error = { statusCode: 401 } as any;
    const result = handleError(error);
    expect(result).toEqual({ status: 500, body: { message: INTERNAL_SERVER_ERROR } });
  });
});
