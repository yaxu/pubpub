import { TypeOf, ZodSchema } from 'zod';
import { DataTypes } from 'sequelize';

type FacetPropTypeOptions<Schema extends ZodSchema = ZodSchema> = {
	name?: string;
	schema: Schema;
	postgresType: typeof DataTypes[keyof typeof DataTypes];
};

export type FacetPropType<Schema extends ZodSchema = ZodSchema> = FacetPropTypeOptions<Schema> & {
	__facetPropType: true;
};

export type TypeOfPropType<PropType extends FacetPropType> = TypeOf<PropType['schema']>;

export type NullableTypeOfPropType<PropType extends FacetPropType> =
	null | TypeOfPropType<PropType>;

export const propType = <Schema extends ZodSchema>(
	options: FacetPropTypeOptions<Schema>,
): FacetPropType<Schema> => {
	return { ...options, __facetPropType: true };
};
