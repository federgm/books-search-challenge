import { NOT_FOUND } from "../../../../../src/libs/errors";
import bookControllerFactory from "../../../../../src/books/v1/search/controllers";
import { BookEntityService } from "../../../../../src/books/v1/search/services";

jest.mock("../../../../../src/books/v1/search/services", () => {
  return {
    BookEntityService: jest.fn().mockImplementation(() => {
      return { getBookByKeyword: jest.fn() };
    }),
  };
});

describe("getBook controller", () => {
  let mockFastify: any;
  let mockReply: any;
  let controller: ReturnType<typeof bookControllerFactory>;
  let getBookByKeywordMock: jest.Mock;

  beforeEach(() => {
    mockFastify = { db: {}, redis: {}, log: { info: jest.fn(), error: jest.fn() } };

    mockReply = {
      status: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    controller = bookControllerFactory(mockFastify);

    getBookByKeywordMock = (BookEntityService as jest.Mock).mock.results[0].value
      .getBookByKeyword as jest.Mock;

    jest.clearAllMocks();
  });

  test("Return 400 if not keywords are present", async () => {
    const mockRequest = {
      params: { keywords: "" },
      query: {},
    };

    await controller.getBook(mockRequest as any, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({ message: "No search keywords provided" });
    expect(getBookByKeywordMock).not.toHaveBeenCalled();
  });

  test("Return 200 if found books", async () => {
    const fakeBooks = [{ id: 1, title: "Book 1" }];
    getBookByKeywordMock.mockResolvedValue(fakeBooks);

    const mockRequest = {
      params: { keywords: "the,lord,of,the,rings" },
      query: { fields: "title", page: "1", force: "true" },
    };

    await controller.getBook(mockRequest as any, mockReply);

    expect(getBookByKeywordMock).toHaveBeenCalledWith(
      "the,lord,of,the,rings",
      "title",
      "1",
      "true",
    );
    expect(mockReply.code).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith(fakeBooks);
  });

  test("Return 404 if books are not found", async () => {
    getBookByKeywordMock.mockResolvedValue([]);

    const mockRequest = {
      params: { keywords: "nonexistent" },
      query: {},
    };

    await controller.getBook(mockRequest as any, mockReply);

    expect(mockReply.code).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({ message: NOT_FOUND });
  });
});
