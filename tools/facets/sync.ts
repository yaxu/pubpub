import { Sequelize, ModelType } from 'sequelize';

import { CanonicalizedFacet, canonicalizeFacet, FacetDefinition, intrinsics } from 'facets';

type SequelizeModel = any;

type SyncContext = {
	FacetDefinition: SequelizeModel;
	FacetInstance: SequelizeModel;
};

const createFacetSyncContext = (sequelize: Sequelize): SyncContext => {
	return {
		FacetDefinition: sequelize.import('./models/facetDefinition'),
		FacetInstance: sequelize.import('./models/facetInstance'),
	};
};

const getCurrentlyRegisteredFacets = async (ctx: SyncContext): Promise<CanonicalizedFacet[]> => {
	const { FacetDefinition } = ctx;
	const facetDefinitionModels = await FacetDefinition.findAll();
	return facetDefinitionModels.map((model) => {
		const { name, props } = model;
		return { name, props } as CanonicalizedFacet;
	});
};

const getCurrentlyDefinedFacets = (): CanonicalizedFacet[] => {
	return Object.values(intrinsics).map(canonicalizeFacet);
};

const getFacetsThatNeedRegistration = async (ctx: SyncContext): Promise<FacetDefinition[]> => {
	const registeredFacetNames = (await getCurrentlyDefinedFacets()).map((c) => c.name);
	return Object.values(intrinsics).filter((f) => !registeredFacetNames.includes(f.name));
};
