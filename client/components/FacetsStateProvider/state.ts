import {
	FacetCascadeResult,
	FacetDefinition,
	FacetSourceScope,
	CascadedFacetsByKind,
	mapFacetDefinitions,
} from 'facets';
import { FacetsState, FacetState } from './types';

export type CreateStateOptions = {
	currentScope: FacetSourceScope;
	initialCascadeResults: CascadedFacetsByKind;
};

function createInitialFacetState<Def extends FacetDefinition>(
	facetDefinition: Def,
	initialCascadeResult: FacetCascadeResult<Def>,
): FacetState<Def> {
	return {
		facetDefinition,
		persistedCascadeResult: initialCascadeResult,
		cascadeResult: initialCascadeResult,
		persistableChanges: {},
		invalidProps: {},
		hasInvalidChanges: true,
		hasPersistableChanges: false,
	};
}

export function createInitialState(options: CreateStateOptions): FacetsState {
	const { currentScope, initialCascadeResults } = options;
	const facets = mapFacetDefinitions((facetDefinition): FacetState<typeof facetDefinition> => {
		const initialCascadeResult = initialCascadeResults[facetDefinition.name];
		return createInitialFacetState(facetDefinition, initialCascadeResult);
	});
	return {
		currentScope,
		facets,
		isPersisting: false,
		hasPersistableChanges: false,
	};
}
