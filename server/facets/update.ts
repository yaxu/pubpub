import {
	FacetDefinition,
	FacetInstanceType,
	intrinsics,
	Intrinsics,
	parsePartialFacetInstance,
} from 'facets';
import { FacetBinding, facetModels } from 'server/models';

type IntrinsicName = keyof Intrinsics;
type UpdateFacetByName<Name extends IntrinsicName> = Partial<FacetInstanceType<Intrinsics[Name]>>;
type UpdateFacetsQuery = Partial<{
	[Name in IntrinsicName]: UpdateFacetByName<Name>;
}>;

const updateFacetForScope = async <Name extends IntrinsicName>(
	scope: Scope,
	facet: FacetDefinition<Name>,
	update: UpdateFacetByName<Name>,
) => {
	const FacetModel = facetModels[facet.name];
	const existing = await FacetModel.findOne({
		include: [
			{
				model: FacetBinding,
				as: 'facetBinding',
				where: { ...scope },
				required: true,
			},
		],
	});
	if (existing) {
		existing.update(update);
		await existing.save();
	} else {
		const facetBinding = await FacetBinding.create({ ...scope });
		await FacetModel.create({ ...update, facetBindingId: facetBinding.id });
	}
};

export const updateFacetsForScope = async (scope: Scope, update: UpdateFacetsQuery) => {
	await Promise.all(
		Object.entries(update).map(async ([facetName, facetUpdate]) => {
			const facet = intrinsics[facetName];
			const parsedUpdate = parsePartialFacetInstance(facet, facetUpdate as any);
			await updateFacetForScope(scope, facet, parsedUpdate);
		}),
	);
};
