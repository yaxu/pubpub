import { GetState, SetState } from 'zustand';

import { mapFacetDefinitions } from 'facets';
import { apiFetch } from 'client/utils/apiFetch';

import { FacetsState } from '../types';

export async function persistFacets(get: GetState<FacetsState>, set: SetState<FacetsState>) {
	const { facets, currentScope } = get();
	const query = mapFacetDefinitions((facetDefinition, skip) => {
		const facetState = facets[facetDefinition.name];
		return facetState?.pendingChanges ?? skip;
	});
	if (Object.keys(query).length) {
		set({ isPersisting: true });
		await apiFetch.post('/api/facets', { scope: currentScope, facets: query });
		set({ isPersisting: false });
	}
}
