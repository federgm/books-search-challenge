import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";
import Redis from "ioredis";
import { RedisConfig } from "src/libs/config-interfaces";

function buildRedisClientPlugin(
  fastify: FastifyInstance,
  config: RedisConfig,
  pluginIsReady: () => void,
) {
  fastify.log.info("Building Redis client");

  const redis = new Redis({
    host: config.host,
    port: 6379, // Setting this here as is the port where redis will run on the container
    db: config.db ?? 0,
  });

  redis.on("connect", () => {
    fastify.decorate("redis", redis);
    fastify.log.info("Redis connection established");
    pluginIsReady();
  });

  redis.on("error", (err) => {
    fastify.log.error({ err }, "Redis connection failed");
    throw err;
  });

  fastify.addHook("onClose", async () => {
    fastify.log.info("Closing Redis connection");
    await redis.quit();
  });
}

export default FastifyPlugin(buildRedisClientPlugin);
