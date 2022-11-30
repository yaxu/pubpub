import { OverviewSearchFilter } from 'client/containers/DashboardOverview/helpers/filters';
import { SpamCommunityQuery } from 'types';

export type SpamCommunitiesFilter = OverviewSearchFilter<
	Pick<SpamCommunityQuery, 'status' | 'ordering'>
>;

export const filters: SpamCommunitiesFilter[] = [
	{
		title: '👀 Unreviewed',
		id: 'queue',
		query: {
			ordering: { field: 'spam-score', direction: 'DESC' },
			status: ['unreviewed'],
		},
	},
	{
		title: '🗑 Confirmed spam',
		id: 'spam',
		query: {
			ordering: { field: 'community-created-at', direction: 'DESC' },
			status: ['confirmed-spam'],
		},
	},
	{
		title: '✅ Confirmed not spam',
		id: 'not-spam',
		query: {
			ordering: { field: 'community-created-at', direction: 'DESC' },
			status: ['confirmed-not-spam'],
		},
	},
];
