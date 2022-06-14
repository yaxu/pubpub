import {
	FacetPropCascadeFn,
	AvailableCascadeStrategyForPropType,
	createCascadeFn,
} from './cascade';
import { FacetPropType, NullableTypeOfPropType } from './propType';

export type FacetPropOptions<
	// The PropType of the prop.
	PropType extends FacetPropType,
	// The `rootValue` provided, which may be `null`.
	// We provide this as a type parameter so that TypeScript will infer its narrowest -- most
	// specific -- type and preserve that information in the inferred return type. This lets us
	// determine statically whether a facet prop will ever be null and adjust its TypeScript
	// definitions accordingly.
	RootValue extends NullableTypeOfPropType<PropType>,
	// How to cascade this prop down scopes
	CascadeStrategy extends AvailableCascadeStrategyForPropType<PropType>,
	// When we provide a defaultValue to a facet, it may be `null`.
	DefaultValue = NullableTypeOfPropType<PropType>,
> = {
	// The value of this prop at the "root" of PubPub -- in the absence of any other facet instances
	// that override it, what value does this prop have?
	rootValue: RootValue;
	// The default value of this prop, if not explicitly provided to createFacet(). By contrast with
	// `rootValue`, this value will actually be stored on a facet instance.
	defaultValue?: DefaultValue;
	// Explains how this prop should cascade from higher to lower scopes.
	cascade?: CascadeStrategy;
};

export type FacetProp<
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<PropType>,
	CascadeStrategy extends AvailableCascadeStrategyForPropType<PropType>,
> =
	// Everything in the FacetPropOptions above, minus the name of the cascade strategy...
	Omit<FacetPropOptions<PropType, RootValue, CascadeStrategy>, 'cascade'> & {
		__facetProp: true;
		// Plus the provided propType.
		propType: PropType;
		// Plus the returned cascading function.
		cascade: FacetPropCascadeFn<PropType, RootValue, CascadeStrategy, any>;
	};

// Creates a prop definition.
export const prop = <
	PropType extends FacetPropType,
	RootValue extends NullableTypeOfPropType<PropType>,
	CascadeStrategy extends AvailableCascadeStrategyForPropType<PropType> = 'overwrite',
>(
	propType: PropType,
	options: FacetPropOptions<PropType, RootValue, CascadeStrategy>,
): FacetProp<PropType, RootValue, CascadeStrategy> => {
	const cascade = options.cascade ?? ('overwrite' as CascadeStrategy);
	return {
		...options,
		propType,
		cascade: createCascadeFn<PropType, RootValue, CascadeStrategy, any>(cascade),
		__facetProp: true,
	};
};
