import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";
import { buildKnexInstance } from "../src/libs/config-interfaces";
import type { DatabaseConfig } from "../src/libs/config-interfaces";

function buildDBClientPlugin(
  fastify: FastifyInstance,
  config: DatabaseConfig,
  pluginIsReady: () => void,
) {
  fastify.log.info(" Client database build ");

  const db = buildKnexInstance({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    poolMin: config.poolMin,
    poolMax: config.poolMax,
  });

  db.raw("SELECT 1").then(async () => {
    fastify.decorate("db", db);
    pluginIsReady();
    fastify.log.info(" Client database build ready ");
  });
}

export default FastifyPlugin(buildDBClientPlugin);
