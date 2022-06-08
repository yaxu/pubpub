import { TypeOf, ZodSchema } from 'zod';
import { DataTypes } from 'sequelize';

type FacetPropTypeOptions<Schema extends ZodSchema = ZodSchema> = {
	name?: string;
	kind?: 'enum';
	schema: Schema;
	postgresType: typeof DataTypes[keyof typeof DataTypes];
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
