// Extracted from https://github.com/airjp73/remix-validated-form/blob/main/packages/zod-form-data/src/helpers.ts
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  z,
  ZodEffects,
  ZodNumber,
  ZodTypeAny,
} from 'zod';

type InputType<DefaultType extends ZodTypeAny> = {
  (): ZodEffects<DefaultType>;
  <ProvidedType extends ZodTypeAny>(
    schema: ProvidedType
  ): ZodEffects<ProvidedType>;
};

const stripEmpty = z.literal('').transform(() => undefined);

const preprocessIfValid = (schema: ZodTypeAny) => (val: unknown) => {
  const result = schema.safeParse(val);
  if (result.success) {
		return result.data;
	}
  return val;
};

export const numeric: InputType<ZodNumber> = (schema = z.number()) =>
	// @ts-ignore
  z.preprocess(
    preprocessIfValid(
      z.union([
        stripEmpty,
        z
          .string()
          .transform((val) => Number(val))
          .refine((val) => !Number.isNaN(val)),
      ])
    ),
    schema
  );
