import FastifySwagger from "@fastify/swagger";
import FastifySwaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { handleError } from "./libs/errors";
import dbPlugin from "../plugins/db";
import redisPlugin from "../plugins/redis";
import { pinoConfig } from "./libs/logger";
import BooksV1Routes from "./books/v1/search/routes";
import config from "./config";

export default async function bootstrap() {
  const server = Fastify({
    logger: pinoConfig,
  }).withTypeProvider<TypeBoxTypeProvider>();

  server.register(FastifySwagger);
  server.register(FastifySwaggerUi, {
    routePrefix: "docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });

  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    const { status, body } = handleError(error);
    reply.status(status).send(body);
  });

  await server.register(dbPlugin, config.db);
  await server.register(redisPlugin, config.redis);

  server.register(BooksV1Routes, { prefix: "v1" });

  server.get("/health", { logLevel: "warn" }, async (_request, reply) => {
    reply.status(200).send({ ok: true });
  });

  server.get("/", (request, reply) => {
    reply.status(200).send({ message: "welcome" });
  });

  try {
    server.log.info(config.app);
    await server.listen({ ...config.app });
    server.log.info("Book engine is now ready to be used!");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

process.on("unhandledeRejection", (err) => {
  console.error("Unhandled error in the engine");
  process.exit(1);
});
