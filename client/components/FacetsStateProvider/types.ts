import {
	FacetCascadeResult,
	FacetDefinition,
	FacetInstanceType,
	FacetSourceScope,
	Intrinsics,
} from 'facets';

import { bindActionsToStore } from './actions';

export type FacetState<Def extends FacetDefinition = FacetDefinition> = {
	facetDefinition: Def;
	persistedCascadeResult: FacetCascadeResult<Def>;
	cascadeResult: FacetCascadeResult<Def>;
	latestAndPossiblyInvalidCascadeResult: FacetCascadeResult<Def>;
	persistableChanges: Partial<FacetInstanceType<Def>>;
	invalidProps: Partial<Record<keyof FacetInstanceType<Def>, true>>;
	hasInvalidChanges: boolean;
	hasPersistableChanges: boolean;
};

export type FacetsState = {
	currentScope: FacetSourceScope;
	facets: { [K in keyof Intrinsics]: FacetState<Intrinsics[K]> };
	isPersisting: boolean;
	hasPersistableChanges: boolean;
};

export type FacetsStore = FacetsState & ReturnType<typeof bindActionsToStore>;
