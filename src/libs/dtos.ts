import { TSchema, Type } from "@sinclair/typebox";

export const ErrorResponseDto = Type.Object({
  message: Type.String(),
});

export const Nullable = <T extends TSchema>(schema: T) => Type.Union([Type.Null(), schema]);

export interface parametersDto {
  keywords: string;
  fields?: string;
  page?: string;
  force?: string;
}

export interface OpenLibraryApiDto {
  cover_i?: number;
  has_fulltext?: boolean;
  edition_count?: number;
  title?: string;
  author_name?: string;
  first_publish_year?: number;
  key?: string;
  ia?: string;
  author_key: string;
  public_scan_b: boolean;
}
