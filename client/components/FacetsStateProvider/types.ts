import { FacetCascadeResult, FacetDefinition, FacetInstanceType, FacetSourceScope } from 'facets';

import { bindActionsToStore } from './actions';

export type FacetState<Def extends FacetDefinition = FacetDefinition> = {
	facetDefinition: Def;
	persistedCascadeResult: FacetCascadeResult<Def>;
	pendingChanges: Partial<FacetInstanceType<Def>>;
	cascadeResult: FacetCascadeResult<Def>;
	invalidProps: Partial<Record<keyof FacetInstanceType<Def>, true>>;
	isValid: boolean;
};

export type FacetsState = {
	currentScope: FacetSourceScope;
	facets: Partial<Record<string, FacetState>>;
	isPersisting: boolean;
};

export type FacetsStore = FacetsState & ReturnType<typeof bindActionsToStore>;
