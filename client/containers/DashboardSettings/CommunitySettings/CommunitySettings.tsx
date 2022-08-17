import React from 'react';

import { FacetEditor } from 'components';
import { usePageContext, usePendingChanges } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';
import { communityUrl } from 'utils/canonicalUrls';
import { isDevelopment } from 'utils/environment';
import { apiFetch } from 'client/utils/apiFetch';
import { usePersistableState } from 'client/utils/usePersistableState';
import { mapFacetDefinitions } from 'facets';

import DashboardSettingsFrame, { Subtab } from '../DashboardSettingsFrame';
import ExportAndDelete from './ExportAndDelete';
import PublicNewPubs from './PublicNewPubs';
import Details from './Details';
import CommunitySettingsPreview from './CommunitySettingsPreview';

const CommunitySettings = () => {
	const { communityData: initialCommunityData } = usePageContext();
	const { pendingPromise } = usePendingChanges();
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
				<Details communityData={communityData} updateCommunityData={updateCommunityData} />,
				<ExportAndDelete />,
			],
		},
		{
			id: 'layout',
			title: 'Layout',
			pubPubIcon: 'layout',
			sections: [<CommunitySettingsPreview communityData={communityData} />],
		},
		{
			id: 'pub-settings',
			title: 'Pub Settings',
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

	return (
		<DashboardSettingsFrame
			id="collection-settings"
			tabs={tabs}
			hasChanges={hasChanges}
			persist={persist}
		/>
	);
};

export default CommunitySettings;
