import { Op } from 'sequelize';

import * as types from 'types';
import { FacetBinding } from 'server/models';
import { flattenOnce, pruneFalsyValues } from 'utils/arrays';
import {
	cascade,
	FacetCascadeResult,
	FacetDefinition,
	FacetInstanceType,
	IntrinsicFacetDefinition,
	IntrinsicFacetName,
	Intrinsics,
	mapFacetDefinitions,
	mapFacetDefinitionsToCascadedInstances,
} from 'facets';
import { mapObject } from 'utils/objects';
import { ResolvedScopeIds, resolveScopeIds, ScopeIdsByKind, ScopeStack } from './resolveScopeIds';
import {
	mapByScopeKind,
	getBindingKeyForScopeKind,
	ByScopeKind,
	Scope,
	createByScopeKind,
	getScopeKindAndId,
} from './scopes';
import { loadFacetInstancesForBindingIds } from './load';

type ValidFacetName = IntrinsicFacetName;

type ByFacetKind<T> = types.Writeable<{ [K in keyof Intrinsics]?: T }>;

type FacetBindings = ByScopeKind<Record<string, types.FacetBinding[]>>;

type CascadedFacetsByKind = types.Writeable<{
	[K in keyof Intrinsics]?: FacetInstanceType<Intrinsics[K]>;
}>;

type FacetInstancesByBindingId<Def extends FacetDefinition> = Record<
	string,
	FacetInstanceType<Def>
>;

type FacetInstances = ByFacetKind<FacetInstancesByBindingId<IntrinsicFacetDefinition>>;

type CascadedFacetsByScopeId<FacetNames extends ValidFacetName> = Record<
	string,
	types.DefinitelyHas<CascadedFacetsByKind, FacetNames>
>;

type CascadedFacetsForScopes<FacetNames extends ValidFacetName> = ByScopeKind<
	CascadedFacetsByScopeId<FacetNames>
>;

const cascadeSingleFacetForScopeStack = <Def extends FacetDefinition>(
	stack: ScopeStack,
	def: Def,
	bindings: FacetBindings,
	instances: FacetInstancesByBindingId<Def>,
): FacetCascadeResult<Def> => {
	const matchingInstancesWithScopes = flattenOnce(
		stack.map((scope) => {
			const bindingsForScope = bindings[scope.kind][scope.id];
			const matchingInstances = pruneFalsyValues(
				bindingsForScope.map((binding) => instances[binding.id]),
			);
			return matchingInstances.map((value) => ({ scope, value }));
		}),
	);
	return cascade(def, matchingInstancesWithScopes);
};

const cascadeFacetsForScopeStack = (
	stack: ScopeStack,
	bindings: FacetBindings,
	instances: FacetInstances,
): CascadedFacetsByKind => {
	return mapFacetDefinitionsToCascadedInstances((def, skip) => {
		const instancesForFacetDefinition = instances[def.name as keyof Intrinsics];
		if (instancesForFacetDefinition) {
			return cascadeSingleFacetForScopeStack(
				stack,
				def,
				bindings,
				instancesForFacetDefinition,
			);
		}
		return skip;
	});
};

const getFacetBindingsForResolvedScopeIds = async (
	resolvedScopeIds: ResolvedScopeIds,
): Promise<{ facetBindings: FacetBindings; facetBindingIds: string[] }> => {
	const { scopeIdsIncludingDependencies } = resolvedScopeIds;
	const {
		pub: pubIds = [],
		collection: collectionIds = [],
		community: communityIds = [],
	} = scopeIdsIncludingDependencies;
	const facetBindingInstances: types.FacetBinding[] = await FacetBinding.findAll({
		where: {
			[Op.or]: [
				{ pubId: pubIds },
				{ collectionId: collectionIds },
				{ communityId: communityIds },
			],
		},
	});
	const facetBindingIds = facetBindingInstances.map((binding) => binding.id);
	const facetBindings = mapByScopeKind(scopeIdsIncludingDependencies, (scopeIds, scopeKind) => {
		const bindingKey = getBindingKeyForScopeKind(scopeKind);
		const bindingsByScopeId: Record<string, types.FacetBinding[]> = {};
		scopeIds.forEach((scopeId) => {
			bindingsByScopeId[scopeId] = facetBindingInstances.filter(
				(instance) => instance[bindingKey] === scopeId,
			);
		});
		return bindingsByScopeId;
	});
	return { facetBindings, facetBindingIds };
};

const getFacetInstancesForBindingIds = async <FacetNames extends ValidFacetName>(
	facetBindingIds: string[],
	facetNames: FacetNames[],
): Promise<types.DefinitelyHas<FacetInstances, FacetNames>> => {
	const facetInstances: FacetInstances = {};
	await Promise.all(
		Object.values(
			mapFacetDefinitions(async (definition) => {
				const { name } = definition;
				if (facetNames.includes(name as any)) {
					facetInstances[name] = await loadFacetInstancesForBindingIds(
						definition,
						facetBindingIds,
					);
				}
			}),
		),
	);
	return facetInstances as types.DefinitelyHas<FacetInstances, FacetNames>;
};

const fetchFacetsForResolvedScopeIds = async <FacetNames extends ValidFacetName>(
	resolvedScopeIds: ResolvedScopeIds,
	facetNames: FacetNames[],
): Promise<CascadedFacetsForScopes<FacetNames>> => {
	const { scopeStacks } = resolvedScopeIds;
	const { facetBindings, facetBindingIds } = await getFacetBindingsForResolvedScopeIds(
		resolvedScopeIds,
	);
	const facetInstances = await getFacetInstancesForBindingIds(facetBindingIds, facetNames);
	const cascadedFacets = mapByScopeKind(scopeStacks, (scopeStacksByScopeId) => {
		return mapObject(scopeStacksByScopeId, (stack: ScopeStack) => {
			return cascadeFacetsForScopeStack(stack, facetBindings, facetInstances);
		});
	});
	return cascadedFacets as CascadedFacetsForScopes<FacetNames>;
};

export const fetchFacetsForScopeIds = async <FacetNames extends ValidFacetName>(
	requestedScopes: ScopeIdsByKind,
	facetNames?: FacetNames[],
) => {
	const resolvedScopeIds = await resolveScopeIds(requestedScopes);
	return fetchFacetsForResolvedScopeIds(resolvedScopeIds, facetNames ?? ALL_INTRINSIC_FACETS);
};

export const fetchFacetsForScope = async <FacetNames extends ValidFacetName>(
	scope: Scope,
	facetNames?: FacetNames[],
) => {
	const scopeIds = createByScopeKind<string[]>(() => []);
	const { kind, id } = getScopeKindAndId(scope);
	scopeIds[kind].push(id);
	const fetchResult = await fetchFacetsForScopeIds(scopeIds, facetNames);
	return fetchResult[kind][id];
};
