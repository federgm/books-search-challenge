import { NOT_FOUND } from "../../../libs/errors.js";
import {
  FastifyReplyTyped,
  FastifyRequestTyped,
  FastifyTyped,
} from "../../../libs/fastify-interfaces.js";
import schemas from "./dtos.js";
import { BookEntityService } from "./services.js";

export default (fastify: FastifyTyped) => {
  const entityService = new BookEntityService(fastify.db, fastify.redis, fastify.log);
  return {
    getBook: async (
      request: FastifyRequestTyped<typeof schemas.getBook>,
      reply: FastifyReplyTyped<typeof schemas.getBook>,
    ) => {
      const {
        q: searchKey,
        fields,
        page,
        force,
      } = request.query as {
        q: string;
        fields?: string;
        page?: string;
        force?: boolean;
      };

      if (searchKey === "") {
        return reply.status(400).send({ message: "No search keywords provided" });
      }

      const books = await entityService.getBookByKeyword(searchKey, fields, page, force);

      if (!books || !books.length) {
        return reply.code(404).send({ message: NOT_FOUND });
      }

      return reply.code(200).send(books);
    },
  };
};
