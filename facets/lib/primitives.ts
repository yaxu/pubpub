import { z } from 'zod';

export const string = z.string();
export const boolean = z.boolean();
export const number = z.number();
export const url = string;
export const color = string;

export const oneOf = <T extends string, U extends readonly [T, ...T[]]>(values: U) =>
	z.enum<T, U>(values);

const prosemirrorDoc = z.object({
	type: z.literal('doc'),
	attrs: z.object({}).catchall(z.union([z.string(), z.number(), z.boolean()])),
	content: z.array(z.any()),
});

export const primitives = {
	url,
	string,
	boolean,
	number,
	oneOf,
	prosemirrorDoc,
};

export type Primitive = typeof primitives[keyof typeof primitives];
