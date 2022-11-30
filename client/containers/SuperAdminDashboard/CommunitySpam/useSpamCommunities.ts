import { useCallback, useState } from 'react';
import useStateRef from 'react-usestateref';
import { useUpdateEffect } from 'react-use';

import { apiFetch } from 'client/utils/apiFetch';

import { CommunityWithSpam } from './types';
import { SpamCommunitiesFilter } from './filters';

type UseSpamCommunitiesOptions = {
	filter: SpamCommunitiesFilter;
	searchTerm: string;
	initialCommunities: CommunityWithSpam[];
	limit: number;
};

export const useSpamCommunities = (options: UseSpamCommunitiesOptions) => {
	const { searchTerm, filter, limit, initialCommunities } = options;
	const [_, setOffset, offsetRef] = useStateRef(0);
	const [isLoading, setIsLoading] = useState(false);
	const [mayLoadMoreCommunities, setMayLoadMoreCommunities] = useState(true);
	const [communities, setCommunities] = useState(initialCommunities);

	const loadMoreCommunities = useCallback(async () => {
		setIsLoading(true);
		setMayLoadMoreCommunities(false);
		setOffset((offset) => offset + limit);
		const { status, ordering } = filter.query!;
		const nextCommunities = await apiFetch.post(`/api/spamTags/queryCommunitiesForSpam?`, {
			limit,
			searchTerm,
			offset: offsetRef.current,
			status,
			ordering,
		});
		setIsLoading(false);
		setMayLoadMoreCommunities(nextCommunities.length === limit);
		setCommunities((currentCommunities) => [...currentCommunities, ...nextCommunities]);
	}, [offsetRef, setOffset, limit, filter, searchTerm]);

	useUpdateEffect(() => {
		setOffset(0);
		setCommunities([]);
		loadMoreCommunities();
	}, [setOffset, loadMoreCommunities, filter]);

	return { communities, isLoading, loadMoreCommunities, mayLoadMoreCommunities };
};
