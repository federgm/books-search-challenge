import { NOT_FOUND } from "../../../libs/errors";
import {
  FastifyReplyTyped,
  FastifyRequestTyped,
  FastifyTyped,
} from "../../../libs/fastify-interfaces";
import schemas from "./dtos";
import { BookEntityService } from "./services";

export default (fastify: FastifyTyped) => {
  const entityService = new BookEntityService(fastify.db, fastify.redis, fastify.log);
  return {
    getBook: async (
      request: FastifyRequestTyped<typeof schemas.getBook>,
      reply: FastifyReplyTyped<typeof schemas.getBook>,
    ) => {
      const { fields, page, force } = request.query as {
        fields?: string;
        page?: string;
        force?: string;
      };
      const { keywords } = request.params;

      if (keywords === "") {
        return reply.status(400).send({ message: "No search keywords provided" });
      }

      const books = await entityService.getBookByKeyword(keywords, fields, page, force);

      if (!books || !books.length) {
        return reply.code(404).send({ message: NOT_FOUND });
      }

      return reply.code(200).send(books);
    },
  };
};
