import { Op } from 'sequelize';

import * as types from 'types';
import { FacetBinding } from 'server/models';
import { flattenOnce, pruneFalsyValues } from 'utils/arrays';
import {
	cascade,
	FacetCascadeResult,
	FacetDefinition,
	IntrinsicFacetName,
	IntrinsicFacetDefinition,
	FacetInstanceType,
	Intrinsics,
	mapFacetDefinitions,
	mapFacetDefinitionsToCascadedInstances,
	ALL_INTRINSIC_FACETS,
	FacetInstanceStack,
	FacetSourceScope,
} from 'facets';
import { CascadedFacetsByKind } from 'facets/types/fetch';
import { mapObject } from 'utils/objects';

import { ResolvedScopeIds, resolveScopeIds, ScopeIdsByKind, ScopeStack } from './resolveScopeIds';
import {
	mapByScopeKind,
	getBindingKeyForScopeKind,
	ByScopeKind,
	createByScopeKind,
	getSourceScope,
} from './scopes';
import { loadFacetInstancesForBindingIds } from './load';

type FacetBindings = ByScopeKind<Record<string, types.FacetBinding[]>>;

type CascadedFacetsByScopeId<FacetNames extends IntrinsicFacetName> = Record<
	string,
	types.DefinitelyHas<CascadedFacetsByKind, FacetNames>
>;

type CascadedFacetsForScopes<FacetNames extends IntrinsicFacetName> = ByScopeKind<
	CascadedFacetsByScopeId<FacetNames>
>;

type ByFacetKind<T> = types.Writeable<{ [K in keyof Intrinsics]?: T }>;

type FacetInstancesByBindingId<Def extends FacetDefinition> = Record<
	string,
	FacetInstanceType<Def>
>;

type FacetInstances = ByFacetKind<FacetInstancesByBindingId<IntrinsicFacetDefinition>>;

const cascadeSingleFacetForScopeStack = <Def extends FacetDefinition>(
	scopeStack: ScopeStack,
	def: Def,
	bindings: FacetBindings,
	instances: FacetInstancesByBindingId<Def>,
): FacetCascadeResult<Def> => {
	const instanceStack: FacetInstanceStack<Def> = flattenOnce(
		scopeStack.map((scope) => {
			const bindingsForScope = bindings[scope.kind][scope.id];
			return pruneFalsyValues(
				bindingsForScope.map((binding) => {
					const boundInstance = instances[binding.id];
					if (boundInstance) {
						return {
							scope,
							value: boundInstance,
							facetBindingId: binding.id,
						};
					}
					return null;
				}),
			);
		}),
	);
	return cascade(def, instanceStack);
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

const getFacetInstancesForBindingIds = async <FacetNames extends IntrinsicFacetName>(
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

const fetchFacetsForResolvedScopeIds = async <FacetNames extends IntrinsicFacetName>(
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

export const fetchFacetsForScopeIds = async <FacetNames extends IntrinsicFacetName>(
	requestedScopes: ScopeIdsByKind,
	facetNames?: FacetNames[],
): Promise<CascadedFacetsForScopes<FacetNames>> => {
	const resolvedScopeIds = await resolveScopeIds(requestedScopes);
	return fetchFacetsForResolvedScopeIds(resolvedScopeIds, facetNames ?? ALL_INTRINSIC_FACETS);
};

const resolveFacetSourceScope = (scope: types.ScopeId | FacetSourceScope): FacetSourceScope => {
	if ('kind' in scope) {
		return scope;
	}
	return getSourceScope(scope);
};

export const fetchFacetsForScope = async <FacetNames extends IntrinsicFacetName>(
	scope: types.ScopeId | FacetSourceScope,
	facetNames?: FacetNames[],
): Promise<types.DefinitelyHas<CascadedFacetsByKind, FacetNames>> => {
	const { kind, id } = resolveFacetSourceScope(scope);
	const scopeIds = createByScopeKind<string[]>(() => []);
	scopeIds[kind].push(id);
	const fetchResult = await fetchFacetsForScopeIds(scopeIds, facetNames);
	return fetchResult[kind][id];
};
