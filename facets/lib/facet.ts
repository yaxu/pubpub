import { Schema, z } from 'zod';

import { FacetDefinition, FacetPropOptions, FacetTypeOf, NullableTypeOf } from './types';

export const facet = <
	Name extends string,
	Def extends FacetDefinition<Name>,
	Type = FacetTypeOf<Def>,
>(
	options: Def,
) => {
	const { props } = options;

	const empty = (): Type => {
		const emptyFacet: Partial<Type> = {};
		Object.entries(props).forEach(([key, prop]) => {
			const value = prop.defaultValue ?? null;
			emptyFacet[key as keyof Type] = value;
		});
		return emptyFacet as Type;
	};

	const create = (args: Partial<Type>): Type => {
		const emptyPartial: Type = empty();
		return { ...emptyPartial, ...args };
	};

	return { ...options, empty, create };
};

export const prop = <PropSchema extends Schema, RootValue extends NullableTypeOf<PropSchema>>(
	schema: PropSchema,
	options: FacetPropOptions<PropSchema, RootValue>,
) => {
	return { ...options, schema };
};
