import { ManyPubsApiResult, PubsQuery, DefinitelyHas, PubGetOptions } from 'types';

import { apiFetch } from './apiFetch';

type Options = {
	query: DefinitelyHas<PubsQuery, 'limit'>;
	pubOptions?: PubGetOptions;
	alreadyFetchedPubIds?: string[];
};

export const fetchManyPubs = (options: Options): Promise<ManyPubsApiResult> => {
	const { query, pubOptions = {}, alreadyFetchedPubIds = [] } = options;
	return apiFetch.post('/api/pubs/many', {
		query,
		pubOptions,
		alreadyFetchedPubIds,
	});
};
