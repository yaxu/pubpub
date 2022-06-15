import { intrinsics, Intrinsics } from 'facets';
import { Writeable } from 'types';
import { CascadedFacetType, FacetDefinition } from './facet';
import { FacetProp } from './prop';

type MappedFacet<Def extends FacetDefinition, ToType> = {
	[K in keyof Def['props']]: ToType;
};

type FacetMapperMapper<Def extends FacetDefinition, ToType> = (
	key: keyof Def['props'],
	prop: FacetProp,
) => ToType;

export function mapFacet<Def extends FacetDefinition, ToType>(
	def: Def,
	map: FacetMapperMapper<Def, ToType>,
): MappedFacet<Def, ToType> {
	const result: Partial<MappedFacet<Def, ToType>> = {};
	Object.entries(def.props).forEach(([key, prop]) => {
		result[key as keyof Def['props']] = map(key, prop);
	});
	return result as MappedFacet<Def, ToType>;
}

const skipIterationSymbol = Symbol('skip');
type SkipIterationSymbol = typeof skipIterationSymbol;

type FacetDefinitionMapper<ToType> = (
	def: FacetDefinition,
	skip: SkipIterationSymbol,
) => ToType | SkipIterationSymbol;

export function mapFacetDefinitions<ToType>(mapper: FacetDefinitionMapper<ToType>) {
	type ReturnType = Partial<Writeable<{ [K in keyof Intrinsics]: ToType }>>;
	const result: ReturnType = {};
	Object.values(intrinsics).forEach((facet) => {
		const mapResult = mapper(facet, skipIterationSymbol);
		if (mapResult !== skipIterationSymbol) {
			result[facet.name as keyof Intrinsics] = mapResult;
		}
	});
	return result as ReturnType;
}

type FacetDefinitionToCascadedInstanceMapper = (
	def: FacetDefinition,
	skip: SkipIterationSymbol,
) => CascadedFacetType<any> | SkipIterationSymbol;

export function mapFacetDefinitionsToCascadedInstances(
	mapper: FacetDefinitionToCascadedInstanceMapper,
) {
	return mapFacetDefinitions(mapper) as Partial<{
		[K in keyof Intrinsics]: CascadedFacetType<Intrinsics[K]>;
	}>;
}
