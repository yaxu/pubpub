import React from 'react';
import { Tab, Tabs, Icon } from '@blueprintjs/core';
import Color from 'color';

import { usePageContext } from 'utils/hooks';

import TabColumn from './TabColumn';

require('./topTabs.scss');

const allTabs = [
	{ id: 'instructions', title: 'Instructions', icon: 'align-left' },
	{ id: 'submission', title: 'Submission', icon: 'manually-entered-data' },
	{ id: 'preview', title: 'Preview', icon: 'eye-open' },
] as const;

export type SpubHeaderTab = typeof allTabs[number]['id'];

type Props = {
	selectedTab: SpubHeaderTab;
	onSelectTab: (tab: SpubHeaderTab) => unknown;
};

const TopTabs = (props: Props) => {
	const { selectedTab, onSelectTab } = props;
	const {
		communityData: { accentColorDark },
	} = usePageContext();
	return (
		<div
			className="top-tabs-component"
			style={{ backgroundColor: Color(accentColorDark).fade(0.3).rgb() }}
		>
			<TabColumn>
				<Tabs id="spub-header-top-tabs" onChange={onSelectTab} selectedTabId={selectedTab}>
					{allTabs.map(({ id, title, icon }) => (
						<Tab id={id} key={id}>
							<Icon icon={icon} /> {title}
						</Tab>
					))}
				</Tabs>
			</TabColumn>
		</div>
	);
};

export default TopTabs;
