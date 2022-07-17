import { useContext } from 'react';

import { FacetsContext } from 'components';

export const useFacets = () => {
	const actuallyUseFacets = useContext(FacetsContext);

	if (!actuallyUseFacets) {
		throw new Error(`Must call useFacets beneath FacetsStateProvider`);
	}

	return actuallyUseFacets();
};
