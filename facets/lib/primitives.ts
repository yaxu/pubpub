import { z } from 'zod';

import { propType } from './propType';

export const string = propType({ name: 'string', schema: z.string() });
export const boolean = propType({ name: 'boolean', schema: z.boolean() });
export const number = propType({ name: 'number', schema: z.boolean() });

export const oneOf = <T extends string, U extends readonly [T, ...T[]]>(strings: U) => {
	return propType({ schema: z.enum(strings) });
};
