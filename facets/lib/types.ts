import { TypeOf, ZodSchema } from 'zod';

export type FacetPropDefinition<Schema extends ZodSchema, Type = TypeOf<Schema>> = {
	schema: Schema;
	default?: Type;
	cascade?: (upper: Type, lower: Type) => Type;
} & ({ nullable: true; backstop: null } | { nullable: false; backstop: Type });

export type FacetPropsDefinition = Record<string, FacetPropDefinition<any>>;

export type FacetConstructorOptions = {
	name: string;
	props: FacetPropsDefinition;
};

export type FacetDefinition = FacetConstructorOptions;

export type FacetPropsDefinitionTypeOf<Props extends FacetPropsDefinition> = {
	[K in keyof Props]: Props[K]['nullable'] extends true
		? null | TypeOf<Props[K]['schema']>
		: TypeOf<Props[K]['schema']>;
};

export type FacetTypeOf<Def extends FacetDefinition> = FacetPropsDefinitionTypeOf<Def['props']>;
