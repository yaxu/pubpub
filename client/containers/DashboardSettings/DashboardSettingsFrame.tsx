import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';
import classNames from 'classnames';

import { DashboardFrame, Icon, IconName } from 'components';
import { PubPubIconName } from 'client/utils/icons';

require('./dashboardSettingsFrame.scss');

type Section = React.ReactNode | (() => React.ReactNode);

export type Subtab = {
	id: string;
	title: string;
	sections: Section[];
} & ({ icon: IconName } | { pubPubIcon: PubPubIconName });

type Props = {
	id: string;
	tabs: Subtab[];
	className?: string;
};

const DashboardSettingsFrame = (props: Props) => {
	const { tabs, id, className } = props;

	const renderTab = (tab: Subtab) => {
		const { id: tabId, title, sections, ...iconProps } = tab;
		return (
			<Tab
				id={tabId}
				key={title}
				className="dashboard-settings-frame-tab"
				panelClassName="dashboard-settings-frame-tab-panel"
				title={
					<>
						<div className="icon-container">
							<div className="background-circle" />
							<Icon iconSize={16} {...iconProps} />
						</div>
						{title}
					</>
				}
				panel={
					<>
						{sections.map((section) => {
							const element = typeof section === 'function' ? section() : section;
							return element;
						})}
					</>
				}
			/>
		);
	};

	return (
		<DashboardFrame
			title="Settings"
			className={classNames('dashboard-settings-frame-component', className)}
		>
			<Tabs id={id} large>
				{tabs.map(renderTab)}
			</Tabs>
		</DashboardFrame>
	);
};

export default DashboardSettingsFrame;
