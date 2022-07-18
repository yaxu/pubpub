import { useContext } from 'react';

import { FacetsContext, FacetsState } from 'components';

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

const doNotPrefer = Symbol('do not');
type DoNotPrefer = typeof doNotPrefer;

type UseFacetsQueryOptions<T> = {
	prefer?: (doNotPreferSymbol: DoNotPrefer) => DoNotPrefer | T;
	fallback?: () => T;
};

export const useFacetsQuery = <T>(
	query: (f: FacetsState['facets']) => T,
	options: UseFacetsQueryOptions<T> = {},
): T => {
	const { prefer, fallback } = options;
	const actuallyUseFacets = useContext(FacetsContext);
	// It's possible that after this line we know we want the return value of prefer()
	// but we have to follow the Rules of Hooks and call every hook unconditionally.
	const preferredValue: T | typeof doNotPrefer = prefer?.(doNotPrefer) ?? doNotPrefer;
	if (actuallyUseFacets) {
		const facetsState = actuallyUseFacets();
		// Now we've followed the Rules of Hooks and we can return whatever we want.
		return preferredValue === doNotPrefer ? query(facetsState.facets) : preferredValue;
	}
	if (preferredValue !== doNotPrefer) {
		return preferredValue;
	}
	if (!fallback) {
		throwFacetsStateError();
	}
	return fallback!();
};
