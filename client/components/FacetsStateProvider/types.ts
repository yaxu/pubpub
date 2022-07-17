import { FacetCascadeResult, FacetDefinition, FacetInstanceType, FacetSourceScope } from 'facets';

import { bindActionsToStore } from './actions';

export type FacetState<Def extends FacetDefinition = FacetDefinition> = {
	facetDefinition: Def;
	persistedCascadeResult: FacetCascadeResult<Def>;
	cascadeResult: FacetCascadeResult<Def>;
	persistableChanges: Partial<FacetInstanceType<Def>>;
	invalidProps: Partial<Record<keyof FacetInstanceType<Def>, true>>;
	hasInvalidChanges: boolean;
	hasPersistableChanges: boolean;
};

export type FacetsState = {
	currentScope: FacetSourceScope;
	facets: Partial<Record<string, FacetState>>;
	isPersisting: boolean;
	hasPersistableChanges: boolean;
};

export type FacetsStore = FacetsState & ReturnType<typeof bindActionsToStore>;
