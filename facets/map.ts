import type { Writeable } from 'types';

import { intrinsics, Intrinsics } from './intrinsics';
import type { FacetDefinition, FacetCascadeResult } from './lib';

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
) => FacetCascadeResult<any> | SkipIterationSymbol;

export function mapFacetDefinitionsToCascadedInstances(
	mapper: FacetDefinitionToCascadedInstanceMapper,
) {
	return mapFacetDefinitions(mapper) as Partial<{
		[K in keyof Intrinsics]: FacetCascadeResult<Intrinsics[K]>;
	}>;
}
