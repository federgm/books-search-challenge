import { FastifyTyped } from "../../../libs/fastify-interfaces.js";
import createControllers from "./controllers.js";
import schemas from "./dtos.js";

export default async (fastify: FastifyTyped) => {
  const controllerLogic = createControllers(fastify);
  fastify.log.info(`Path: ${fastify.prefix}/search/:keywords`);
  fastify.get("/search/:keywords", { schema: schemas.getBook }, controllerLogic.getBook);
};
