import { useCallback, useMemo, useState } from 'react';

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
import { apiFetch } from 'client/utils/apiFetch';
import { createActivityAssociations } from '../../../utils/activity';

type PartialActivityRenderContext = Omit<ActivityRenderContext, 'associations'>;

type SerializedQuery = string;

type Query = {
	filters: ActivityFilter[];
};

type QueryState = {
	itemIds: string[];
	offset: number;
	isLoading: boolean;
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
	loadMoreItems: () => unknown;
	isLoading: boolean;
};

const initialState: State = {
	queries: {},
	associations: createActivityAssociations(),
	itemsById: {},
};

const initialQueryState: QueryState = {
	isLoading: false,
	offset: 0,
	itemIds: [],
};

const serializeQuery = (query: Query) => {
	const sortedFilters = query.filters.concat().sort();
	return JSON.stringify({ filters: sortedFilters });
};

const updateQueryStateWithFetchResult = (
	previousQueryState: Maybe<QueryState>,
	result: ActivityItemsFetchResult,
): QueryState => {
	const { itemIds, offset, isLoading } = previousQueryState || initialQueryState;
	return {
		isLoading,
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
			[serializedQuery]: updateQueryStateWithFetchResult(
				state.queries[serializedQuery],
				result,
			),
		},
		itemsById: renderNewActivityItems(state.itemsById, result.activityItems, {
			...context,
			associations,
		}),
	};
};

const updateStateToisLoading = (state: State, query: Query): State => {
	const serializedQuery = serializeQuery(query);
	return {
		...state,
		queries: {
			...state.queries,
			[serializedQuery]: {
				...state.queries[serializedQuery],
				isLoading: true,
			},
		},
	};
};

export const useActivityItems = (options: Options): ReturnValues => {
	const { filters = [], initialActivityData, ...context } = options;
	const [state, setState] = useState<State>(() => {
		return updateStateWithFetchResult(initialState, { filters }, initialActivityData, context);
	});

	const query: Query = { filters };
	const serializedQuery = serializeQuery({ filters });
	const queryState = state.queries[serializedQuery] || initialQueryState;

	const items = useMemo(() => {
		const { itemIds } = queryState;
		const { itemsById } = state;
		return itemIds
			.map((id) => itemsById[id])
			.filter((item): item is RenderedActivityItem => !!item);
	}, [queryState, state]);

	const loadMoreItems = () => {
		setState(updateStateToisLoading(state, query));
		apiFetch
			.post('/api/activityItems', {
				offset: queryState.offset,
				scope: context.scope,
			})
			.then((results) => {
				const nextState = updateStateWithFetchResult(state, query, results, context);
				setState(nextState);
			});
	};

	return { items, loadMoreItems, isLoading: queryState.isLoading };
};
