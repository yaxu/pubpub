import React, { useMemo, useState } from 'react';

import { FacetEditor } from 'components';
import { usePageContext, usePendingChanges } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';
import { communityUrl } from 'utils/canonicalUrls';
import { isDevelopment } from 'utils/environment';
import { apiFetch } from 'client/utils/apiFetch';
import { usePersistableState } from 'client/utils/usePersistableState';
import { mapFacetDefinitions } from 'facets';
import { PageContext } from 'types';

import DashboardSettingsFrame, { Subtab } from '../DashboardSettingsFrame';
import ExportAndDeleteSettings from './ExportAndDeleteSettings';
import PublicNewPubs from './PublicNewPubs';
import BasicSettings from './BasicSettings';
import CommunitySettingsPreview from './CommunitySettingsPreview';
import Layout from './Layout';
import NavSettings from './NavSettings';
import HeaderSettings from './HeaderSettings';
import FooterSettings from './FooterSettings';
import HomeBannerSettings from './HomeBannerSettings';

const CommunitySettings = () => {
	const pageContext = usePageContext();
	const { pendingPromise } = usePendingChanges();
	const { communityData: initialCommunityData, locationData } = pageContext;
	const {
		state: communityData,
		hasChanges,
		update: updateCommunityData,
		persistedState: persistedCommunityData,
		persist,
	} = usePersistableState(initialCommunityData, async (update) => {
		await pendingPromise(
			apiFetch.put('/api/communities', { communityId: communityData.id, ...update }),
		);
		if (update.subdomain && update.subdomain !== persistedCommunityData.subdomain) {
			if (isDevelopment()) {
				window.location.reload();
			} else {
				const communityPart = communityUrl({ ...communityData, ...update });
				const dashPart = getDashUrl({ mode: 'settings' });
				window.location.href = communityPart + dashPart;
			}
		}
	});

	const renderPubFacets = () => {
		const facetMap = mapFacetDefinitions((facet) => (
			<FacetEditor facetName={facet.name as any} />
		));
		return Object.values(facetMap);
	};

	const tabs: Subtab[] = [
		{
			id: 'details',
			title: 'Details',
			icon: 'settings',
			sections: [
				<BasicSettings
					communityData={communityData}
					updateCommunityData={updateCommunityData}
				/>,
				<ExportAndDeleteSettings />,
			],
		},
		{
			id: 'header',
			title: 'Header',
			icon: 'widget-header',
			sections: [
				<HeaderSettings
					communityData={communityData}
					updateCommunityData={updateCommunityData}
				/>,
				<HomeBannerSettings
					communityData={communityData}
					updateCommunityData={updateCommunityData}
				/>,
			],
		},
		{
			id: 'navigation',
			title: 'Navigation',
			icon: 'link',
			sections: [
				<NavSettings
					communityData={communityData}
					updateCommunityData={updateCommunityData}
				/>,
			],
		},
		{
			id: 'footer',
			title: 'Footer',
			icon: 'widget-footer',
			sections: [
				<FooterSettings
					communityData={communityData}
					updateCommunityData={updateCommunityData}
				/>,
			],
		},
		{
			id: 'pub-settings',
			title: 'Pubs',
			pubPubIcon: 'pub',
			sections: [
				<PublicNewPubs
					communityData={communityData}
					updateCommunityData={updateCommunityData}
				/>,
				renderPubFacets,
			],
		},
	];

	const [currentTabId, setCurrentTabId] = useState(() => {
		const { subMode } = locationData.params;
		if (tabs.some((tab) => tab.id === subMode)) {
			return subMode;
		}
		return tabs[0].id;
	});

	const previewContext: PageContext = {
		...pageContext,
		communityData: {
			...pageContext.communityData,
			...communityData,
		},
		locationData: {
			...pageContext.locationData,
			path: currentTabId === 'header' ? '/' : '/some-page',
			queryString: '',
			params: {},
		},
		loginData: {
			id: null,
		},
	};

	return (
		<DashboardSettingsFrame
			id="collection-settings"
			tabs={tabs}
			hasChanges={hasChanges}
			persist={persist}
			currentTabId={currentTabId}
			onSelectTabId={setCurrentTabId}
			preview={<CommunitySettingsPreview previewContext={previewContext} />}
		/>
	);
};

export default CommunitySettings;
