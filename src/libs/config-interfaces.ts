import knex, { Knex } from "knex";

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

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  connectTimeout?: number;
}

export interface Config {
  app: AppConfig;
  db: DatabaseConfig;
  redis: RedisConfig;
}

export const buildKnexInstance = ({
  host,
  port,
  user,
  password,
  database,
  poolMin = 2,
  poolMax = 10,
}: DatabaseConfig): Knex =>
  knex({
    client: "pg",
    connection: {
      host,
      port,
      user,
      password,
      database,
    },
    pool: {
      min: poolMin,
      max: poolMax,
    },
  });
