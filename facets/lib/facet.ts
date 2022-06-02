import { FacetProp } from './prop';
import { TypeOfFacetPropType } from './propType';
import { IsNeverNull } from './types';

type FacetProps = Record<string, FacetProp<any, any>>;

type FacetPropsDefinitionTypeOf<Props extends FacetProps, FallbackValue = never> = {
	[K in keyof Props]:
		| FallbackValue
		| TypeOfFacetPropType<Props[K]['propType']>
		| (IsNeverNull<Props[K]['rootValue']> extends true ? never : null);
};

export type FacetOptions<Name extends string, Props extends FacetProps> = {
	name: Name;
	props: Props;
};

export type FacetDefinition<
	Name extends string = string,
	Props extends FacetProps = FacetProps,
> = FacetOptions<Name, Props> & {
	__facet: true;
};

export type CascadedFacetType<Def extends FacetDefinition> = FacetPropsDefinitionTypeOf<
	Def['props'],
	never
>;

export type FacetInstanceType<Def extends FacetDefinition> = FacetPropsDefinitionTypeOf<
	Def['props'],
	null
>;

export const facet = <Name extends string, Props extends FacetProps>(
	options: FacetOptions<Name, Props>,
): FacetDefinition<Name, Props> => {
	return { ...options, __facet: true };
};
