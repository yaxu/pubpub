import { TypeOf, ZodSchema } from 'zod';

type FacetPropTypeOptions<Schema extends ZodSchema = ZodSchema> = {
	name?: string;
	schema: Schema;
};

export type FacetPropType<Schema extends ZodSchema = ZodSchema> = FacetPropTypeOptions<Schema> & {
	__facetPropType: true;
};

export type TypeOfFacetPropType<PropType extends FacetPropType> = TypeOf<PropType['schema']>;

export type NullableTypeOfPropType<PropType extends FacetPropType> =
	null | TypeOfFacetPropType<PropType>;

export const propType = <Schema extends ZodSchema>(
	options: FacetPropTypeOptions<Schema>,
): FacetPropType<Schema> => {
	return { ...options, __facetPropType: true };
};
