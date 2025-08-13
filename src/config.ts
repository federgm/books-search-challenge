import { Config } from "./libs/config-interfaces";

const config: Config = {
  app: {
    host: String(process.env.API_SERVER_HOST || "localhost"),
    port: Number(process.env.API_SERVER_PORT || 3000),
    routePrefix: String(process.env.API_ROUTE_PREFIX || "/"),
  },
  db: {
    host: String(process.env.DATABASE_HOST || "localhost"),
    port: Number(process.env.DATABASE_PORT || 5432),
    database: String(process.env.DATABASE_NAME),
    user: String(process.env.DATABASE_USERNAME),
    password: String(process.env.DATABASE_PASSWORD),
    poolMin: process.env.DATABASE_POOL_MIN ? Number(process.env.DATABASE_POOL_MIN) : undefined,
    poolMax: process.env.DATABASE_POOL_MAX ? Number(process.env.DATABASE_POOL_MAX) : undefined,
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD,
    db: 0,
    connectTimeout: 10000,
  },
};

export default config;
