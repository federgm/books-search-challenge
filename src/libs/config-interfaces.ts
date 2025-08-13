import Redis from "ioredis";
import { Knex } from "knex";

export interface Book {
  id: number;
  keyword: string;
  title: string;
  fetchedAt: string;
}

export interface AppConfig {
  host: string;
  port: number;
  routePrefix: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  poolMin?: number;
  poolMax?: number;
}

export interface Config {
  app: AppConfig;
  db: DatabaseConfig;
  redis: Redis;
}

export declare const buildKnexInstance: ({
  host,
  port,
  user,
  password,
  database,
  poolMin,
  poolMax,
}: DatabaseConfig) => Knex;
