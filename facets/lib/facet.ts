import { Schema, TypeOf } from 'zod';

import { FacetConstructorOptions, FacetPropDefinition, FacetTypeOf } from './types';

export const facet = <Options extends FacetConstructorOptions>(options: Options) => {
	const empty = (): FacetTypeOf<Options> => {};

	return { ...options, empty };
};

export const prop = <
	PropSchema extends Schema,
	Options extends Omit<FacetPropDefinition<PropSchema>, 'schema' | 'nullable'>,
>(
	schema: PropSchema,
	options?: Options,
) => {
	return {
		...options,
		schema,
		nullable: false,
	} as const;
};

export const nullable = <
	PropSchema extends Schema,
	Options extends Omit<FacetPropDefinition<PropSchema>, 'schema' | 'nullable' | 'backstop'>,
>(
	schema: PropSchema,
	options?: Options,
) => {
	return {
		...options,
		schema,
		backstop: null,
		nullable: true,
	} as const;
};
