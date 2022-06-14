import { TypeOf, ZodSchema } from 'zod';
import { DataTypes } from 'sequelize';

type IsNeverNull<T> = Extract<T, null> extends never ? true : false;

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

export type NullablePropTypeIfRootValueIsNull<
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<PropType>,
> = IsNeverNull<RootValue> extends true
	? TypeOfPropType<PropType>
	: NullableTypeOfPropType<PropType>;

export const propType = <Schema extends ZodSchema>(
	options: FacetPropTypeOptions<Schema>,
): FacetPropType<Schema> => {
	return { ...options, __facetPropType: true };
};
