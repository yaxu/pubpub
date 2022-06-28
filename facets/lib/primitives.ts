import { z, ZodEnum } from 'zod';

import { FacetPropType, propType } from './propType';

export const string = propType({
	name: 'string',
	schema: z.string(),
	postgresType: 'text',
});

export const boolean = propType({
	name: 'boolean',
	schema: z.boolean(),
	postgresType: 'boolean',
});

export const integer = propType({
	name: 'integer',
	schema: z.number().int(),
	postgresType: 'integer',
});

export const double = propType({
	name: 'double',
	schema: z.number(),
	postgresType: 'double',
});

export const oneOf = <T extends string, U extends [T, ...T[]]>(
	values: U,
	labels?: Record<T, string>,
): FacetPropType<z.ZodEnum<U>, { values: U; labels?: Record<T, string> }> => {
	return propType({
		identity: oneOf,
		schema: z.enum(values),
		postgresType: 'string',
		extension: { values, labels },
	});
};

export const arrayOf = <PropType extends FacetPropType>(type: PropType) => {
	return propType({
		schema: z.array(type.schema),
		postgresType: 'jsonb',
	});
};
