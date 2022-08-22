import { Writeable, FacetBinding, DefinitelyHas } from 'types';

import { ByScopeKind, FacetCascadeResult, FacetDefinition, FacetInstanceType } from '../lib';
import { IntrinsicFacetName, Intrinsics, IntrinsicFacetDefinition } from '../intrinsics';

export type CascadedFacetsByKind = Writeable<{
	[K in keyof Intrinsics]?: FacetCascadeResult<Intrinsics[K]>;
}>;

export type FacetBindings = ByScopeKind<Record<string, FacetBinding[]>>;

export type CascadedFacetsByScopeId<FacetNames extends IntrinsicFacetName> = Record<
	string,
	DefinitelyHas<CascadedFacetsByKind, FacetNames>
>;

export type CascadedFacetsForScopes<FacetNames extends IntrinsicFacetName> = ByScopeKind<
	CascadedFacetsByScopeId<FacetNames>
>;

export type ByFacetKind<T> = Writeable<{ [K in keyof Intrinsics]?: T }>;

export type FacetInstancesByBindingId<Def extends FacetDefinition> = Record<
	string,
	FacetInstanceType<Def>
>;

export type FacetInstancesByKind = ByFacetKind<FacetInstancesByBindingId<IntrinsicFacetDefinition>>;
