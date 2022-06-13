import { Op } from 'sequelize';

import * as types from 'types';
import { Collection, CollectionPub, Pub, FacetInstance, facetModels } from 'server/models';
import { bucketBy, indexById } from 'utils/arrays';
import { getPrimaryCollection } from 'utils/collections/primary';
import { assert } from 'utils/assert';
import { intrinsics, Intrinsics, parseFacetInstance } from 'facets';

type ScopeIdsByKind = {
	pubIds?: string[];
	collectionIds?: string[];
	communityIds?: string[];
};

type ScopeStack = {
	communityId: string;
	collectionId: null | string;
	pubId: null | string;
};

type ResolvedScopeIds = {
	scopesWithDependencies: ScopeIdsByKind;
	scopeStacks: ScopeStack[];
};

type FacetModelsByKindById = types.Writeable<{
	[K in keyof Intrinsics]: Record<string, Intrinsics[K]>;
}>;

const getPrimaryCollectionIdsByPubId = async (
	collectionPubs: types.CollectionPub[],
	collections: types.Collection[],
): Promise<Record<string, string>> => {
	const collectionsById = indexById(collections);
	const collectionPubsByPubId = bucketBy(collectionPubs, (cp) => cp.pubId);
	const primaryCollectionIds: Record<string, string> = {};
	Object.entries(collectionPubsByPubId).forEach(([pubId, collectionPubsForPubId]) => {
		const augmentedCollectionPubs: types.DefinitelyHas<types.CollectionPub, 'collection'>[] =
			collectionPubsForPubId.map((collectionPub) => {
				return {
					...collectionPub,
					collection: collectionsById[collectionPub.collectionId],
				};
			});
		const primaryCollection = getPrimaryCollection(augmentedCollectionPubs);
		if (primaryCollection) {
			primaryCollectionIds[pubId] = primaryCollection.id;
		}
	});
	return primaryCollectionIds;
};

const getIdIndexOfCommunityIds = <Item extends { id: string; communityId: string }>(
	items: Item[],
): Record<string, string> => {
	const idIndex: Record<string, string> = {};
	Object.entries(indexById(items)).forEach(([itemId, item]) => {
		idIndex[itemId] = item.communityId;
	});
	return idIndex;
};

const getScopeStacks = (
	requestedScopes: ScopeIdsByKind,
	primaryCollectionIdsByPubId: Record<string, string>,
	communityIdsByPubId: Record<string, string>,
	communityIdsByCollectionId: Record<string, string>,
) => {
	const { pubIds = [], collectionIds = [], communityIds = [] } = requestedScopes;
	const pubStacks: ScopeStack[] = pubIds.map((pubId) => {
		const communityId = communityIdsByPubId[pubId];
		const primaryCollectionId = primaryCollectionIdsByPubId[pubId];
		if (primaryCollectionId) {
			assert(communityIdsByCollectionId[primaryCollectionId] === communityId);
		}
		return {
			communityId,
			collectionId: primaryCollectionId ?? null,
			pubId,
		};
	});
	const collectionStacks: ScopeStack[] = collectionIds.map((collectionId) => {
		const communityId = communityIdsByCollectionId[collectionId];
		return {
			communityId,
			collectionId,
			pubId: null,
		};
	});
	const communityStacks: ScopeStack[] = communityIds.map((communityId) => {
		return {
			communityId,
			collectionId: null,
			pubId: null,
		};
	});
	return [...pubStacks, ...collectionStacks, ...communityStacks];
};

const resolveScopeIds = async (requestedScopes: ScopeIdsByKind): Promise<ResolvedScopeIds> => {
	const { pubIds = [], collectionIds = [], communityIds = [] } = requestedScopes;
	const collectionPubs = await CollectionPub.findAll({
		where: { pubId: [...new Set(pubIds)] },
		attributes: ['id', 'pubId', 'collectionId'],
	});
	const allCollectionIds = [
		...new Set([...collectionIds, ...collectionPubs.map((cp) => cp.collectionId)]),
	];
	const [pubs, collections]: [types.Pub[], types.Collection[]] = await Promise.all([
		Pub.findAll({ attributes: ['id', 'communityId'], where: { id: pubIds } }),
		Collection.findAll({
			attributes: ['id', 'communityId'],
			where: {
				id: allCollectionIds,
			},
		}),
	]);
	const allCommunityIds = [
		...new Set([
			...communityIds,
			...pubs.map((pub) => pub.communityId),
			...collections.map((collection) => collection.communityId),
		]),
	];
	const communityIdsByPubId = getIdIndexOfCommunityIds(pubs);
	const communityIdsByCollectionId = getIdIndexOfCommunityIds(collections);
	const primaryCollectionIdsByPubId = await getPrimaryCollectionIdsByPubId(
		collectionPubs,
		collections,
	);
	return {
		scopeStacks: getScopeStacks(
			requestedScopes,
			primaryCollectionIdsByPubId,
			communityIdsByPubId,
			communityIdsByCollectionId,
		),
		scopesWithDependencies: {
			pubIds,
			collectionIds: allCollectionIds,
			communityIds: allCommunityIds,
		},
	};
};

const getFacetInstancesForResolvedScopeIds = async (
	resolvedScopeIds: ResolvedScopeIds,
): Promise<types.FacetInstance[]> => {
	const {
		scopesWithDependencies: { pubIds = [], collectionIds = [], communityIds = [] },
	} = resolvedScopeIds;
	const facetInstances: types.FacetInstance[] = await FacetInstance.findAll({
		where: {
			[Op.or]: [
				{ pubId: pubIds },
				{ collectionid: collectionIds },
				{ communityId: communityIds },
			],
		},
	});
	return facetInstances;
};

const getFacetModelsByKindForFacetInstanceIds = async (
	facetInstanceIds: string[],
): Promise<FacetModelsByKindById> => {
	const entries = await Promise.all(
		Object.entries(intrinsics).map(async ([facetName, facetDefinition]) => {
			const FacetModel = facetModels[facetName];
			const facetModelsInstances = await FacetModel.findAll({
				where: { facetInstanceId: facetInstanceIds },
			});
			const instances = facetModelsInstances.map((instance) =>
				parseFacetInstance(facetDefinition, instance),
			);
			return [facetName, instances] as const;
		}),
	);
	const facetModelsByKindById: Partial<FacetModelsByKindById> = {};
	entries.forEach(([facetName, facetModelInstances]) => {
		facetModelsByKindById[facetName as keyof Intrinsics] = indexById(facetModelInstances);
	});
	return facetModelsByKindById as FacetModelsByKindById;
};
