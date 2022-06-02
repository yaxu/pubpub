import { FacetDefinition, CascadedFacetType, FacetInstanceType } from './facet';
import { overwrite } from './cascade';

export function createEmptyFacetInstance<
	Definition extends FacetDefinition,
	Type = FacetInstanceType<Definition>,
>(definition: Definition): Type {
	const { props } = definition;
	const emptyFacet: Partial<Type> = {};
	Object.entries(props).forEach(([key, prop]) => {
		const value = prop.defaultValue ?? null;
		emptyFacet[key as keyof Type] = value;
	});
	return emptyFacet as Type;
}

export function createFacetInstance<Definition extends FacetDefinition>(
	definition: Definition,
	args: FacetInstanceType<Definition>,
): FacetInstanceType<Definition> {
	return {
		...createEmptyFacetInstance(definition),
		...args,
	};
}

export function cascadeFacetInstances<
	Def extends FacetDefinition,
	CascadedType = CascadedFacetType<Def>,
>(definition: Def, upper: FacetInstanceType<Def>, lower: FacetInstanceType<Def>): CascadedType {
	const { props } = definition;
	const cascaded: Partial<CascadedType> = {};
	Object.entries(props).forEach(([key, prop]) => {
		const { cascade = overwrite } = prop;
		const upperProp = upper[key];
		const lowerProp = lower[key];
		cascaded[key as keyof CascadedType] = cascade(upperProp, lowerProp);
	});
	return cascaded as CascadedType;
}
