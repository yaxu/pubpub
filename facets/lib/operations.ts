import { FacetDefinition, FacetTypeOf, FacetInsertion } from './types';
import { overwrite } from './cascade';

export function createEmptyFacet<
	Definition extends FacetDefinition,
	Type = FacetTypeOf<Definition>,
>(definition: Definition): Type {
	const { props } = definition;
	const emptyFacet: Partial<Type> = {};
	Object.entries(props).forEach(([key, prop]) => {
		const value = prop.defaultValue ?? null;
		emptyFacet[key as keyof Type] = value;
	});
	return emptyFacet as Type;
}

export function createFacet<Definition extends FacetDefinition, Type = FacetTypeOf<Definition>>(
	definition: Definition,
	args: FacetInsertion<Definition>,
): Type {
	return {
		...createEmptyFacet(definition),
		...args,
	};
}

export function cascadeFacets<Definition extends FacetDefinition, Type = FacetTypeOf<Definition>>(
	definition: Definition,
	upper: Type,
	lower: Type,
): Type {
	const { props } = definition;
	const cascaded: Partial<Type> = {};
	Object.entries(props).forEach(([key, prop]) => {
		const { cascade = overwrite } = prop;
		const upperProp = upper[key];
		const lowerProp = lower[key];
		cascaded[key as keyof Type] = cascade(upperProp, lowerProp);
	});
	return cascaded as Type;
}
