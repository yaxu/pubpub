import { Schema, TypeOf } from 'zod';

import { FacetDefinition, FacetPropOptions, FacetTypeOf, FacetPropDefinition } from './types';

export const facet = <Name extends string, Def extends FacetDefinition<Name>>(options: Def) => {
	const empty = (): FacetTypeOf<Def> => {};

	return { ...options, empty };
};

export const prop = <
	PropSchema extends Schema,
	RootValue extends TypeOf<PropSchema>,
	Options extends FacetPropOptions<PropSchema, RootValue>,
>(
	schema: PropSchema,
	options: Options,
) => {
	return {
		...options,
		schema,
	};
};
