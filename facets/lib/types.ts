import { TypeOf, ZodSchema } from 'zod';

type _IsNeverNull<T> = Extract<T, null> extends never ? true : false;

export type NullableTypeOf<Schema extends ZodSchema> = null | TypeOf<Schema>;
export type NullableTypeOfWhenRootValueAbsent<
	Schema extends ZodSchema,
	RootValue extends NullableTypeOf<Schema>,
> = _IsNeverNull<RootValue> extends true ? TypeOf<Schema> : NullableTypeOf<Schema>;

export type FacetPropOptions<
	Schema extends ZodSchema,
	RootValue extends NullableTypeOf<Schema>,
	ProvidedToConstructorType = NullableTypeOf<Schema>,
	ReceivedFromFacetType = NullableTypeOfWhenRootValueAbsent<Schema, RootValue>,
> = {
	rootValue: RootValue;
	defaultValue?: ProvidedToConstructorType;
	cascade?: (upper: ReceivedFromFacetType, lower: ReceivedFromFacetType) => ReceivedFromFacetType;
};

export type FacetPropDefinition<
	Schema extends ZodSchema,
	RootValue extends null | NullableTypeOf<Schema>,
> = FacetPropOptions<Schema, RootValue> & { schema: Schema };

export type FacetDefinition<Name extends string = any> = {
	name: Name;
	props: Record<string, FacetPropDefinition<any, any>>;
};

type _FacetPropsDefinitionTypeOf<Props extends FacetDefinition<any>['props'], FallbackValue> = {
	[K in keyof Props]:
		| FallbackValue
		| TypeOf<Props[K]['schema']>
		| (_IsNeverNull<Props[K]['rootValue']> extends true ? never : null);
};

export type FacetTypeOf<Def extends FacetDefinition<any>> = _FacetPropsDefinitionTypeOf<
	Def['props'],
	never
>;

export type FacetInsertion<Def extends FacetDefinition<any>> = Partial<
	_FacetPropsDefinitionTypeOf<Def['props'], null>
>;
