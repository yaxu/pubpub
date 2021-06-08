import React from 'react';

import { usePageContext } from 'utils/hooks';
import { DashboardFrame } from 'client/components';
import { useInfiniteScroll } from 'client/utils/useInfiniteScroll';

import { Spinner } from '@blueprintjs/core';
import { useActivityItems } from './useActivityItems';
import ActivityItemRow from './ActivityItemRow';

require('./dashboardActivity.scss');

type Props = {
	activityData: any;
};

const DashboardActivity = (props: Props) => {
	const { activityData } = props;
	const {
		scopeData: { scope },
		loginData: { id: userId },
	} = usePageContext();

	const { items, loadMoreItems, isLoading } = useActivityItems({
		initialActivityData: activityData,
		scope,
		userId,
		filters: [],
	});

	useInfiniteScroll({
		enabled: !isLoading,
		useDocumentElement: true,
		onRequestMoreItems: loadMoreItems,
	});

	return (
		<DashboardFrame className="dashboard-activity-container" title="Activity">
			{items.map((item) => (
				<ActivityItemRow item={item} key={item.id} />
			))}
			{isLoading && (
				<div className="loading-indicator">
					<Spinner size={28} />
				</div>
			)}
		</DashboardFrame>
	);
};
export default DashboardActivity;
