import React from 'react';

import { useLazyRef } from 'client/utils/useLazyRef';

import { CreateStateOptions } from './state';
import { createFacetsStateStore } from './store';
import { FacetsContext } from './context';

type Props = {
	options: CreateStateOptions;
	children: React.ReactNode;
};

const FacetsStateProvider = (props: Props) => {
	const { children, options } = props;
	const useFacets = useLazyRef(() => createFacetsStateStore(options));
	return <FacetsContext.Provider value={useFacets.current}>{children}</FacetsContext.Provider>;
};

export default FacetsStateProvider;
