import React from 'react';

import { usePageContext } from 'utils/hooks';
import { DashboardFrame } from 'client/components';

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

	const { items } = useActivityItems({
		initialActivityData: activityData,
		scope,
		userId,
		filters: [],
	});

	return (
		<DashboardFrame className="dashboard-activity-container" title="Activity">
			{items.map((item) => (
				<ActivityItemRow item={item} key={item.id} />
			))}
		</DashboardFrame>
	);
};
export default DashboardActivity;
