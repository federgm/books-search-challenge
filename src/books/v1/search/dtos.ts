import { Static, Type } from "@sinclair/typebox";
import { ErrorResponseDto } from "../../../../src/libs/dtos";

export const BookDto = Type.Object({
  id: Type.String(),
  title: Type.String(),
});

export const OpenLibraryApiDto = Type.Object({
  cover_i: Type.Number(),
  has_fulltext: Type.Boolean(),
  edition_count: Type.Number(),
  title: Type.String(),
  author_name: Type.Array(Type.String()),
  first_publish_year: Type.Number(),
  key: Type.String(),
  ia: Type.Array(Type.String()),
  author_key: Type.Array(Type.String()),
  public_scan_b: Type.Boolean(),
});

const parametersDto = Type.Object({
  keyword: Type.String(),
});

export type BookType = Static<typeof BookDto>;

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
