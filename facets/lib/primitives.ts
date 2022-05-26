import { z } from 'zod';

const string = z.string();
const boolean = z.boolean();
const number = z.number();
const url = string;
const color = string;

const stringEnum = (values: [string, ...string[]]) => z.enum(values);

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
	stringEnum,
	prosemirrorDoc,
};
