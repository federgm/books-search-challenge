import "fastify";
import knex, { Knex } from "knex";
import redis, { Redis } from "ioredis";

declare module "fastify" {
  interface FastifyInstance {
    db: knex;
    redis: redis;
  }
}
