import { FastifyTyped } from "../../../libs/fastify-interfaces";
import createControllers from "./controllers";
import schemas from "./dtos";

export default async (fastify: FastifyTyped) => {
  const controllerLogic = createControllers(fastify);
  fastify.log.info(`Path: ${fastify.prefix}/search/:keywords`);
  fastify.get("/search/:keywords", { schema: schemas.getBook }, controllerLogic.getBook);
};
