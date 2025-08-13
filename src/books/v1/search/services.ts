import { FastifyBaseLogger } from "fastify";
import Redis from "ioredis";
import { Knex } from "knex";
import crypto from "crypto";
import { parametersDto } from "src/libs/dtos";

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

  async getBookByKeyword(keywords: string, fields?: string, page?: string, force?: boolean) {
    try {
      const searchKey: string = this.getCacheKeyFromKeywords({ keywords, fields, page });
      const url = this.buildOpenLibraryUrl({ keywords, fields, page });
      let searchResults;
      if (!force) {
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

  async checkIfBookIsAvailable(searchKey: string) {
    const result = await this.db("books").where({ searchKey }).first();
    return result || null;
  }

  async upsertBook(keyword: string, data: any): Promise<void> {
    await this.db("books").upsert({ ...data, keyword });
    await this.redis.del(keyword);
  }

  async storeBook(keyword: string, data: any): Promise<void> {
    await this.db("books").insert({ ...data, keyword });
    await this.redis.set(keyword, JSON.stringify(data), "EX", 3600);
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

    return `https://openlibrary.org/search.json?${params.toString()}`;
  }

  async fetchFromExternal(url: string) {
    const openLibraryResponse: Response = await fetch(url);

    if (!openLibraryResponse.ok) {
      throw new Error(
        `OpenLibrary request failed: ${openLibraryResponse.status} ${openLibraryResponse.statusText}`,
      );
    }

    return await openLibraryResponse.json();
  }
}
