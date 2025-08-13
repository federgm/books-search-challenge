import { TSchema, Type } from "@sinclair/typebox";

export const ErrorResponseDto = Type.Object({
  message: Type.String(),
});

export const Nullable = <T extends TSchema>(schema: T) => Type.Union([Type.Null(), schema]);

export interface parametersDto {
  keywords: string;
  fields?: string;
  page?: string;
  force?: boolean;
}
