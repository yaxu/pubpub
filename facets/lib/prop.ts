import { FacetPropType, TypeOfFacetPropType } from './propType';

type IsNeverNull<T> = Extract<T, null> extends never ? true : false;
type CascadeFn<T> = (upper: T, lower: T) => T;
type NullablePropType<PropType extends FacetPropType> = null | TypeOfFacetPropType<PropType>;

export type NullableFacetPropTypeIfRootValueIsNull<
	PropType extends FacetPropType,
	RootValue extends NullablePropType<PropType>,
> = IsNeverNull<RootValue> extends true
	? TypeOfFacetPropType<PropType>
	: NullablePropType<PropType>;

export type FacetPropOptions<
	// The PropType of the prop.
	PropType extends FacetPropType,
	// The `rootValue` provided, which may be `null`.
	// We provide this as a type parameter so that TypeScript will infer its narrowest -- most
	// specific -- type and preserve that information in the inferred return type. This lets us
	// determine statically whether a facet prop will ever be null and adjust its TypeScript
	// definitions accordingly.
	RootValue extends NullablePropType<PropType>,
	// When we provide a defaultValue to a facet, it may be `null`.
	DefaultValue = NullablePropType<PropType>,
	// The value accessed from the `cascade` function may or may not be nullable depending on what
	// was provided as the `rootValue`. In other words, if a non-null `rootValue` is provided, we
	// can be sure that the value is never null.
	CascadingValue = NullableFacetPropTypeIfRootValueIsNull<PropType, RootValue>,
> = {
	// The value of this prop at the "root" of PubPub -- in the absence of any other facet instances
	// that override it, what value does this prop have?
	rootValue: RootValue;
	// The default value of this prop, if not explicitly provided to createFacet(). By contrast with
	// `rootValue`, this value will actually be stored on a facet instance.
	defaultValue?: DefaultValue;
	// Explains how this prop should cascade from higher to lower scopes.
	cascade?: CascadeFn<CascadingValue>;
};

export type FacetProp<
	PropType extends FacetPropType,
	RootValue extends NullablePropType<PropType>,
> =
	// Everything in the FacetPropOptions above...
	FacetPropOptions<PropType, RootValue> & {
		__facetProp: true;
		// Plus the provided propType.
		propType: PropType;
	};

// Creates a prop definition.
export const prop = <PropType extends FacetPropType, RootValue extends NullablePropType<PropType>>(
	propType: PropType,
	options: FacetPropOptions<PropType, RootValue>,
): FacetProp<PropType, RootValue> => {
	return { ...options, propType, __facetProp: true };
};
