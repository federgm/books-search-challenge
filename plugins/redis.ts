import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";
import Redis from "ioredis";

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

function buildRedisClientPlugin(
  fastify: FastifyInstance,
  config: RedisConfig,
  pluginIsReady: () => void,
) {
  fastify.log.info("Building Redis client");

  const redis = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db ?? 0,
    lazyConnect: true,
  });

  redis
    .connect()
    .then(() => {
      fastify.decorate("redis", redis);
      fastify.log.info("Redis connection established");
      pluginIsReady();
    })
    .catch((err) => {
      fastify.log.error({ err }, "Redis connection failed");
      throw err;
    });

  fastify.addHook("onClose", async () => {
    fastify.log.info("Closing Redis connection");
    await redis.quit();
  });
}

export default FastifyPlugin(buildRedisClientPlugin);
