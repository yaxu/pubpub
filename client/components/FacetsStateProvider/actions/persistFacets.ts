import { GetState, SetState } from 'zustand';

import { mapFacetDefinitions } from 'facets';
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
	});
}

export async function persistFacets(get: GetState<FacetsState>, set: SetState<FacetsState>) {
	const { facets, currentScope } = get();
	const query = mapFacetDefinitions((facetDefinition, skip) => {
		const facetState = facets[facetDefinition.name];
		return facetState?.persistableChanges ?? skip;
	});
	if (Object.keys(query).length) {
		set({ isPersisting: true });
		await apiFetch.post('/api/facets', { scope: currentScope, facets: query });
		set({
			isPersisting: false,
			hasPersistableChanges: false,
			facets: markFacetsAsPersisted(facets),
		});
	}
}
