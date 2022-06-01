import { TypeOf, ZodSchema } from 'zod';

export type FacetPropOptions<Schema extends ZodSchema, RootValue extends TypeOf<Schema>> = {
	rootValue: null | RootValue;
	defaultValue?: TypeOf<Schema>;
	cascade?: (upper: TypeOf<Schema>, lower: TypeOf<Schema>) => TypeOf<Schema>;
};

export type FacetPropDefinition<
	Schema extends ZodSchema,
	RootValue extends TypeOf<Schema>,
> = FacetPropOptions<Schema, RootValue> & { schema: Schema };

export type FacetDefinition<Name extends string> = {
	name: Name;
	props: Record<string, FacetPropDefinition<any, any>>;
};

type _IsNeverNull<T> = Extract<T, null> extends never ? true : false;
type _FacetPropsDefinitionTypeOf<Props extends FacetDefinition<any>['props'], NullishValue> = {
	[K in keyof Props]:
		| NullishValue
		| TypeOf<Props[K]['schema']>
		| (_IsNeverNull<Props[K]['rootValue']> extends true ? never : null);
};

export type FacetTypeOf<Def extends FacetDefinition<any>> = _FacetPropsDefinitionTypeOf<
	Def['props'],
	never
>;

export type FacetUpdateTypeOf<Def extends FacetDefinition<any>> = Partial<
	_FacetPropsDefinitionTypeOf<Def['props'], null>
>;
