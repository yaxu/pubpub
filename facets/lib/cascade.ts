import {
	NullableTypeOfPropType,
	FacetPropType,
	TypeOfPropType,
	NullablePropTypeIfRootValueIsNull,
} from './propType';
import { FacetCascadeNotImplError } from './errors';
import { FacetDefinition, FacetInstanceType } from './facet';

export type FacetPropCascadeStrategy =
	| 'overwrite' // Non-null values from lower scopes overwrite those from higher scopes
	| 'defer' // Non-null values from *higher* scopes overwrite those from lower scopes
	| 'merge' //  // Values are object-spread: {...a, ...b}
	| 'extend'; // Non-null values are array-spread: [...a, ...b]

export type AvailableCascadeStrategyForPropType<
	PropType extends FacetPropType,
	Type = TypeOfPropType<PropType>,
> =
	| 'defer'
	| 'overwrite'
	| (Type extends Record<string, any> ? 'merge' : never)
	| (Type extends any[] ? 'extend' : never);

type ScopeContributionTypeForStrategy<
	Strategy extends FacetPropCascadeStrategy,
	PropType extends FacetPropType,
> = Strategy extends 'overwrite'
	? NullableTypeOfPropType<PropType> // In `overwrite`, only the lowest scope contributes a value
	: Strategy extends 'defer'
	? NullableTypeOfPropType<PropType> // In `defer`, only the highest scope contributes a value
	: Strategy extends 'extend'
	? TypeOfPropType<PropType> // In `extend`, any scope can contribute a value (implicitly, Type extends any[])
	: Strategy extends 'merge'
	? Partial<TypeOfPropType<PropType>> // In `merge`, any scope can contribute keys from the value
	: never;

type CascadeResultTypeForStrategy<
	Strategy extends FacetPropCascadeStrategy,
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<FacetPropType>,
> = Strategy extends 'overwrite'
	? NullablePropTypeIfRootValueIsNull<PropType, RootValue> // In `overwrite`, we end up with `null` if all scopes contribute an null value
	: Strategy extends 'defer'
	? NullablePropTypeIfRootValueIsNull<PropType, RootValue> // Same with `defer`
	: Strategy extends 'extend'
	? TypeOfPropType<PropType> // In `extend`, we are guaranteed to end up with an empty array (a Type with length = 0)
	: Strategy extends 'merge'
	? Partial<TypeOfPropType<PropType>> // In `merge`, we are guaranteed to end up with a Partial<Type>
	: never;

type FacetPropCascadableValues<PropType extends FacetPropType, Source> = {
	value: NullableTypeOfPropType<PropType>;
	source: Source;
}[];

type FacetPropCascadeContribution<
	Strategy extends FacetPropCascadeStrategy,
	PropType extends FacetPropType,
	Source,
> = {
	source: Source;
	contribution: ScopeContributionTypeForStrategy<Strategy, PropType>;
};

type FacetPropCascadeResult<
	Strategy extends FacetPropCascadeStrategy,
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<FacetPropType>,
	Source,
> = {
	strategy: Strategy;
	result: CascadeResultTypeForStrategy<Strategy, PropType, RootValue>;
	contributions: FacetPropCascadeContribution<Strategy, PropType, Source>[];
};

export type FacetPropCascadeFn<
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<PropType>,
	Strategy extends FacetPropCascadeStrategy,
	Source extends any = any,
> = (
	values: FacetPropCascadableValues<PropType, Source>,
) => FacetPropCascadeResult<
	Strategy,
	TypeOfPropType<PropType>,
	NullablePropTypeIfRootValueIsNull<PropType, RootValue>,
	Source
>;

const overwrite: FacetPropCascadeFn<any, any, 'overwrite', any> = (
	values: FacetPropCascadableValues<any, any>,
) => {
	const contributions = values
		.map((entry) => {
			const { value, source } = entry;
			if (entry.value !== null) {
				return { contribution: value, source };
			}
			return null;
		})
		.filter((x): x is FacetPropCascadeContribution<'overwrite', any, any> => !!x);
	const result = contributions.length
		? contributions[contributions.length - 1].contribution
		: null;
	return {
		strategy: 'overwrite' as const,
		contributions,
		result,
	};
};

export const createCascadeFn = <
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<PropType>,
	Strategy extends FacetPropCascadeStrategy,
	Source,
>(
	strategy: Strategy,
): FacetPropCascadeFn<PropType, RootValue, Strategy, Source> => {
	type ReturnType = FacetPropCascadeFn<PropType, RootValue, Strategy, Source>;
	if (strategy === 'overwrite') {
		return overwrite as ReturnType;
	}
	throw new FacetCascadeNotImplError(strategy);
};

type FacetCascadableInstances<Def extends FacetDefinition, Source extends any> = ({
    source: Source;
    instance: FacetInstanceType<Def>
})[];

export const cascadeFacetInstances = <Def extends FacetDefinition, Source extends any>(
	definition: Def, instances: FacetCascadableInstances<Def, Source>
): CascadedFacetType<Def> {
	const { props } = definition;
	const empty = createEmptyFacetInstance(definition);
	const result: Partial<CascadedFacetType<Def>> = {};
	Object.entries(props).forEach(([key, prop]) => {
		const values
	});
}
