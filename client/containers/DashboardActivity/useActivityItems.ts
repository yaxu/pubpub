import { useMemo, useState } from 'react';

import {
	ActivityAssociations,
	ActivityFilter,
	ActivityItem,
	ActivityItemsFetchResult,
	IdIndex,
	Maybe,
} from 'types';
import { ActivityRenderContext, RenderedActivityItem } from 'client/utils/activity/types';
import { renderActivityItem } from 'client/utils/activity';
import { createActivityAssociations } from '../../../utils/activity';

type PartialActivityRenderContext = Omit<ActivityRenderContext, 'associations'>;

type SerializedQuery = string;

type Query = {
	filters: ActivityFilter[];
};

type QueryState = {
	itemIds: string[];
	offset: number;
	loading: false;
};

type State = {
	queries: Record<SerializedQuery, QueryState>;
	associations: ActivityAssociations;
	itemsById: IdIndex<RenderedActivityItem>;
};

type Options = PartialActivityRenderContext & {
	filters: ActivityFilter[];
	initialActivityData: ActivityItemsFetchResult;
};

type ReturnValues = {
	items: RenderedActivityItem[];
};

const initialState: State = {
	queries: {},
	associations: createActivityAssociations(),
	itemsById: {},
};

const initialQueryState: QueryState = {
	loading: false,
	offset: 0,
	itemIds: [],
};

const serializeQuery = (query: Query) => {
	const sortedFilters = query.filters.concat().sort();
	return JSON.stringify({ filters: sortedFilters });
};

const updateQueryState = (
	previousQueryState: Maybe<QueryState>,
	result: ActivityItemsFetchResult,
): QueryState => {
	const { itemIds, offset, loading } = previousQueryState || initialQueryState;
	return {
		loading,
		itemIds: [...itemIds, ...result.activityItems.map((item) => item.id)],
		offset: offset + itemIds.length,
	};
};

const mergeAssociations = (
	current: ActivityAssociations,
	additional: ActivityAssociations,
): ActivityAssociations => {
	const associations = createActivityAssociations();
	Object.keys(associations).forEach((key) => {
		associations[key] = { ...current[key], ...additional[key] };
	});
	return associations;
};

const renderNewActivityItems = (
	rendered: IdIndex<RenderedActivityItem>,
	unrendered: ActivityItem[],
	context: ActivityRenderContext,
): IdIndex<RenderedActivityItem> => {
	const next = { ...rendered };
	unrendered.forEach((item) => {
		if (!next[item.id]) {
			next[item.id] = renderActivityItem(item, context);
		}
	});
	return next;
};

const updateStateWithFetchResult = (
	state: State,
	query: Query,
	result: ActivityItemsFetchResult,
	context: PartialActivityRenderContext,
): State => {
	const serializedQuery = serializeQuery(query);
	const associations = mergeAssociations(state.associations, result.associations);
	return {
		...state,
		associations,
		queries: {
			...state.queries,
			[serializedQuery]: updateQueryState(state.queries[serializedQuery], result),
		},
		itemsById: renderNewActivityItems(state.itemsById, result.activityItems, {
			...context,
			associations,
		}),
	};
};

export const useActivityItems = (options: Options): ReturnValues => {
	const { filters = [], initialActivityData, ...context } = options;
	const [state, setState] = useState<State>(() => {
		return updateStateWithFetchResult(initialState, { filters }, initialActivityData, context);
	});

	const serializedQuery = useMemo(() => serializeQuery({ filters }), [filters]);
	const queryState = state.queries[serializedQuery] || initialQueryState;

	const items = useMemo(() => {
		const { itemIds } = queryState;
		const { itemsById } = state;
		return itemIds
			.map((id) => itemsById[id])
			.filter((item): item is RenderedActivityItem => !!item);
	}, [queryState, state]);

	return { items };
};
