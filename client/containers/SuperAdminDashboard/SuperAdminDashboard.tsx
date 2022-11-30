import React from 'react';

import { GridWrapper } from 'components';
import { SuperAdminTabKind } from 'utils/superAdmin';

import { superAdminTabs } from './tabs';

require('./superAdminDashboard.scss');

type Props = {
	tabKind: SuperAdminTabKind;
	tabProps: Record<string, any>;
};

const SuperAdminDashboard = (props: Props) => {
	const { tabKind, tabProps } = props;
	const { component: TabComponent } = superAdminTabs[tabKind];
	return (
		<GridWrapper columnClassName="superadmin-dashboard-component">
			<h1>Superadmin Dashboard</h1>
			<p>Warning! Danger! etc.</p>
			<TabComponent {...tabProps} />
		</GridWrapper>
	);
};

export default SuperAdminDashboard;
