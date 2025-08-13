import { Type } from "@sinclair/typebox";
import { ErrorResponseDto } from "../../../../src/libs/dtos";

const OpenLibraryApiDto = Type.Object({
  cover_i: Type.Optional(Type.Number()),
  has_fulltext: Type.Optional(Type.Boolean()),
  edition_count: Type.Optional(Type.Number()),
  title: Type.Optional(Type.String()),
  author_name: Type.Optional(Type.Array(Type.String())),
  first_publish_year: Type.Optional(Type.Number()),
  key: Type.Optional(Type.String()),
  ia: Type.Optional(Type.Array(Type.String())),
  author_key: Type.Optional(Type.Array(Type.String())),
  public_scan_b: Type.Optional(Type.Boolean()),
});

const parametersDto = Type.Object({
<<<<<<< Updated upstream
  keyword: Type.String(),
=======
  keywords: Type.String(),
  fields: Type.Optional(Type.String()),
  page: Type.Optional(Type.String()),
  force: Type.Optional(Type.String()),
>>>>>>> Stashed changes
});

export default {
  getBook: {
    params: parametersDto,
    response: {
      200: OpenLibraryApiDto,
      404: ErrorResponseDto,
      400: ErrorResponseDto,
    },
  },
};
