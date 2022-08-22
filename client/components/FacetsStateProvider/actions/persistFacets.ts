import { GetState, SetState } from 'zustand';

import { IntrinsicFacetName, mapFacetDefinitions } from 'facets';
import { apiFetch } from 'client/utils/apiFetch';

import { FacetsState, FacetState } from '../types';

function markFacetAsPersisted(state: FacetState): FacetState {
	const { cascadeResult } = state;
	return {
		...state,
		persistedCascadeResult: cascadeResult,
		hasPersistableChanges: false,
		persistableChanges: {},
	};
}

function markFacetsAsPersisted(state: FacetsState['facets']): FacetsState['facets'] {
	return mapFacetDefinitions((definition, skip) => {
		const facetState = state[definition.name];
		return facetState ? markFacetAsPersisted(facetState) : skip;
	}) as FacetsState['facets'];
}

function markFacetsAsPersisting(
	state: FacetsState['facets'],
	persistingFacetNames: IntrinsicFacetName[],
): FacetsState['facets'] {
	return mapFacetDefinitions((definition, skip) => {
		const facetState = state[definition.name];
		if (persistingFacetNames.includes(definition.name as IntrinsicFacetName)) {
			return { ...facetState, isPersisting: true };
		}
		return skip;
	}) as FacetsState['facets'];
}

export async function persistFacets(get: GetState<FacetsState>, set: SetState<FacetsState>) {
	const { facets, currentScope } = get();
	const query = mapFacetDefinitions((facetDefinition, skip) => {
		const facetState = facets[facetDefinition.name];
		return facetState?.persistableChanges ?? skip;
	});
	const persistingFacetNames = Object.keys(query) as IntrinsicFacetName[];
	if (persistingFacetNames.length) {
		set({ isPersisting: true, facets: markFacetsAsPersisting(facets, persistingFacetNames) });
		await apiFetch.post('/api/facets', { scope: currentScope, facets: query });
		set({
			isPersisting: false,
			hasPersistableChanges: false,
			facets: markFacetsAsPersisted(facets),
		});
	}
}
