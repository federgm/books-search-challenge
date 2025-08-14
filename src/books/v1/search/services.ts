import { FastifyBaseLogger } from "fastify";
import Redis from "ioredis";
import { Knex } from "knex";
import crypto from "crypto";
import { parametersDto, OpenLibraryApiDto } from "../../../libs/dtos";

export class BookEntityService {
  private db: Knex;
  private redis: Redis;
  private log: FastifyBaseLogger;

  constructor(db: Knex, redis: Redis, log: FastifyBaseLogger) {
    this.db = db;
    this.redis = redis;
    this.log = log;
  }

  getCacheKeyFromKeywords(params: parametersDto): string {
    const sortedEntries = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
    const serialized = JSON.stringify(sortedEntries);

    const hash = crypto.createHash("sha256").update(serialized).digest("hex").slice(0, 16);

    return `books:${hash}`;
  }

  async checkIfBookIsAvailable(searchKey: string) {
    const result = await this.db("books-search-engine.books").where({ searchKey }).first();
    return result || null;
  }

  async upsertBook(searchKey: string, content: OpenLibraryApiDto): Promise<void> {
    // Remove key from Postgres to force update
    await this.db("books-search-engine.books").where("searchKey", searchKey).del();

    // Store key again in Postgres.
    await this.db("books-search-engine.books").insert({ searchKey, content });

    // Remove key from Redis to force update
    await this.redis.del(searchKey);

    // Store key again in Redis.
    await this.redis.set(searchKey, JSON.stringify(content), "EX", 3600);
  }

  async storeBook(searchKey: string, content: OpenLibraryApiDto): Promise<void> {
    await this.db("books-search-engine.books").insert({ searchKey, content });
    await this.redis.set(searchKey, JSON.stringify(content), "EX", 3600);
  }

  buildOpenLibraryUrl(params: parametersDto): string {
    const urlParameters = new URLSearchParams();
    if (params.fields) {
      urlParameters.append("fields", params.fields);
    }
    if (params.page) {
      urlParameters.append("page", params.page);
    }
    urlParameters.append("q", params.keywords);
    return `https://openlibrary.org/search.json?${urlParameters}`;
  }

  async fetchFromExternal(url: string): Promise<OpenLibraryApiDto> {
    const openLibraryResponse: Response = await fetch(url);
    if (!openLibraryResponse.ok) {
      throw new Error(
        `OpenLibrary request failed: ${openLibraryResponse.status} ${openLibraryResponse.statusText}`,
      );
    }

    return (await openLibraryResponse.json()) as OpenLibraryApiDto;
  }

  async getBookByKeyword(keywords: string, fields?: string, page?: string, force?: string) {
    try {
      const searchKey: string = this.getCacheKeyFromKeywords({ keywords, fields, page });
      const url = this.buildOpenLibraryUrl({ keywords, fields, page });
      let searchResults: OpenLibraryApiDto;

      if (force === "false") {
        const cached = await this.redis.get(searchKey);
        if (cached) {
          this.log.info(`Cache hit for ${searchKey}`);
          return JSON.parse(cached);
        }

        const dbResult = await this.checkIfBookIsAvailable(searchKey);
        if (dbResult) {
          this.log.info(`DB hit for ${searchKey}`);
          await this.redis.set(searchKey, JSON.stringify(dbResult), "EX", 3600);
          return dbResult;
        }

        searchResults = await this.fetchFromExternal(url);
        await this.storeBook(searchKey, searchResults);
        return searchResults;
      } else {
        searchResults = await this.fetchFromExternal(url);
        this.upsertBook(searchKey, searchResults);
        return searchResults;
      }
    } catch (err) {
      return err;
    }
  }
}
