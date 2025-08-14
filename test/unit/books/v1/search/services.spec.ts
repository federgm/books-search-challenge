import { BookEntityService } from "../../../../../src/books/v1/search/services";
import { NOT_FOUND } from "../../../../../src/libs/errors";
import crypto from "crypto";

global.fetch = jest.fn();

type MockKnex = jest.Mocked<any>;
type MockRedis = jest.Mocked<any>;
type MockLogger = jest.Mocked<any>;

describe("BookEntityService", () => {
  let mockDb: MockKnex;
  let mockRedis: MockRedis;
  let mockLog: MockLogger;
  let service: BookEntityService;

  beforeEach(() => {
    mockDb = jest.fn() as any;
    mockDb.mockReturnValue(mockDb);
    mockDb.where = jest.fn().mockReturnValue(mockDb);
    mockDb.first = jest.fn();
    mockDb.del = jest.fn();
    mockDb.insert = jest.fn();

    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as any;

    mockLog = { info: jest.fn(), error: jest.fn() } as any;

    service = new BookEntityService(mockDb, mockRedis, mockLog);

    jest.clearAllMocks();
  });

  describe("getCacheKeyFromKeywords", () => {
    test("hash generation for parameters to uniquely identify entries", () => {
      const key = service.getCacheKeyFromKeywords({
        keywords: "the,lord,of,the,rings",
        fields: "title",
      });
      expect(key).toMatch(/^books:[0-9a-f]{16}$/);
    });
  });

  describe("checkIfBookIsAvailable", () => {
    test("Returns result when found on DB", async () => {
      const fakeBook = { id: 1 };
      mockDb.first.mockResolvedValue(fakeBook);

      const result = await service.checkIfBookIsAvailable("searchKey");

      expect(mockDb.where).toHaveBeenCalledWith({ searchKey: "searchKey" });
      expect(result).toEqual(fakeBook);
    });

    test("Returns null when book not found on DB", async () => {
      mockDb.first.mockResolvedValue(undefined);
      const result = await service.checkIfBookIsAvailable("noKey");
      expect(result).toBeNull();
    });
  });

  describe("upsertBook", () => {
    test("Upsert book and update on redis successfully", async () => {
      await service.upsertBook("key1", [{ title: "test" } as any]);

      expect(mockDb.where).toHaveBeenCalledWith("searchKey", "key1");
      expect(mockDb.del).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalledWith({
        searchKey: "key1",
        content: [{ title: "test" }],
      });
      expect(mockRedis.del).toHaveBeenCalledWith("key1");
      expect(mockRedis.set).toHaveBeenCalledWith(
        "key1",
        JSON.stringify([{ title: "test" }]),
        "EX",
        3600,
      );
    });
  });

  describe("storeBook", () => {
    test("Insert book and update on redis successfully", async () => {
      await service.storeBook("key2", [{ title: "stored" } as any]);
      expect(mockDb.insert).toHaveBeenCalledWith({
        searchKey: "key2",
        content: [{ title: "stored" }],
      });
      expect(mockRedis.set).toHaveBeenCalledWith(
        "key2",
        JSON.stringify([{ title: "stored" }]),
        "EX",
        3600,
      );
    });
  });

  describe("buildOpenLibraryUrl", () => {
    test("Build URL to be sent to openLibrary", () => {
      const url = service.buildOpenLibraryUrl({
        keywords: "the,lord,of,the,rings",
        fields: "title",
        page: "2",
      });
      expect(url).toContain("https://openlibrary.org/search.json?");
      expect(url).toContain("fields=title");
      expect(url).toContain("page=2");
      expect(url).toContain("q=the%2Clord%2Cof%2Cthe%2Crings");
    });
  });

  describe("fetchFromExternal", () => {
    test("OpenLibrary mock successfull call", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([{ title: "ok" }]),
      });

      const result = await service.fetchFromExternal("http://test.com");
      expect(result).toEqual([{ title: "ok" }]);
    });

    test("OpenLibrary mock not successfull call", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Error",
      });

      await expect(service.fetchFromExternal("http://bad.com")).rejects.toThrow(
        "OpenLibrary request failed: 500 Error",
      );
    });
  });

  describe("getBookByKeyword", () => {
    const fakeBooks = [{ title: "book" }];

    beforeEach(() => {
      jest.spyOn(service, "getCacheKeyFromKeywords").mockReturnValue("cacheKey123");
      jest.spyOn(service, "buildOpenLibraryUrl").mockReturnValue("http://openlibrary.org");
    });

    test("force=false with redis cache response", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(fakeBooks));

      const result = await service.getBookByKeyword("the,lord,of,the,rings", "title", "1", "false");

      expect(mockLog.info).toHaveBeenCalledWith("Cache hit for cacheKey123");
      expect(result).toEqual(fakeBooks);
    });

    test("force=false with PostgresDB response", async () => {
      mockRedis.get.mockResolvedValue(null);
      jest.spyOn(service, "checkIfBookIsAvailable").mockResolvedValue(fakeBooks as any);

      const result = await service.getBookByKeyword("the,lord,of,the,rings", "title", "1", "false");

      expect(mockLog.info).toHaveBeenCalledWith("DB hit for cacheKey123");
      expect(mockRedis.set).toHaveBeenCalledWith(
        "cacheKey123",
        JSON.stringify(fakeBooks),
        "EX",
        3600,
      );
      expect(result).toEqual(fakeBooks);
    });

    test("force=false with no data and execute the openlibrary api call", async () => {
      mockRedis.get.mockResolvedValue(null);
      jest.spyOn(service, "checkIfBookIsAvailable").mockResolvedValue(null);
      jest.spyOn(service, "fetchFromExternal").mockResolvedValue(fakeBooks as any);
      jest.spyOn(service, "storeBook").mockResolvedValue();

      const result = await service.getBookByKeyword("the,lord,of,the,rings", "title", "1", "false");

      expect(service.fetchFromExternal).toHaveBeenCalledWith("http://openlibrary.org");
      expect(service.storeBook).toHaveBeenCalledWith("cacheKey123", fakeBooks);
      expect(result).toEqual(fakeBooks);
    });

    test("force=true to update a record fetching from external api", async () => {
      jest.spyOn(service, "fetchFromExternal").mockResolvedValue(fakeBooks as any);
      jest.spyOn(service, "upsertBook").mockResolvedValue();

      const result = await service.getBookByKeyword("the,lord,of,the,rings", "title", "1", "true");

      expect(service.fetchFromExternal).toHaveBeenCalled();
      expect(service.upsertBook).toHaveBeenCalledWith("cacheKey123", fakeBooks);
      expect(result).toEqual(fakeBooks);
    });

    test("Application failure returning an unexpected error", async () => {
      jest.spyOn(service, "fetchFromExternal").mockImplementation(() => {
        throw new Error("fail");
      });

      const result = await service.getBookByKeyword("the,lord,of,the,rings", "title", "1", "true");
      expect(result).toBeInstanceOf(Error);
    });
  });
});
