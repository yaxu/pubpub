import { useContext, useMemo } from 'react';

import { FacetsContext, FacetState } from 'components';
import { CascadedFacetType, IntrinsicFacetName, Intrinsics } from 'facets';

const throwFacetsStateError = (): never => {
	throw new Error(`Must call useFacets beneath FacetsStateProvider`);
};

export const useFacetsState = () => {
	const actuallyUseFacets = useContext(FacetsContext);
	if (!actuallyUseFacets) {
		throwFacetsStateError();
	}
	return actuallyUseFacets!();
};

type FacetsQueryLevel = 'current' | 'persisted' | 'latest';
type FacetsQueryable = { [K in keyof Intrinsics]: CascadedFacetType<Intrinsics[K]> };

type UseFacetsQueryOptions<T> = {
	fallback?: () => T;
	level?: FacetsQueryLevel;
};

const getQueryableObjectForLevel = (state: FacetState, level: FacetsQueryLevel) => {
	const { persistedCascadeResult, cascadeResult, latestAndPossiblyInvalidCascadeResult } = state;
	if (level === 'current') {
		return cascadeResult;
	}
	if (level === 'persisted') {
		return persistedCascadeResult;
	}
	return latestAndPossiblyInvalidCascadeResult;
};

export const useFacetsQuery = <T>(
	query: (f: FacetsQueryable) => T,
	options: UseFacetsQueryOptions<T> = {},
): T => {
	const { fallback, level = 'current' } = options;
	const actuallyUseFacets = useContext(FacetsContext);
	if (!actuallyUseFacets) {
		if (fallback) {
			return fallback();
		}
		throwFacetsStateError();
	}

	const { facets } = actuallyUseFacets!();

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const queryable = useMemo(
		() =>
			new Proxy({} as FacetsQueryable, {
				get: (_, facetName: IntrinsicFacetName) => {
					const facetState = facets[facetName];
					return getQueryableObjectForLevel(facetState, level).value;
				},
			}),
		[facets, level],
	);

	return query(queryable);
};
