import React from 'react';

import { Community, PageContext as PageContextType, ViewportSize } from 'types';
import { ForceMobileAware, Header, NavBar, Footer } from 'components';
import { PageContext, usePageContext } from 'utils/hooks';

type Props = {
	communityData: Community;
	forceViewportSize?: ViewportSize;
};

const CommunitySettingsPreview = (props: Props) => {
	const { communityData, forceViewportSize = 'mobile' } = props;
	const pageContext = usePageContext();

	const previewContext: PageContextType = {
		...pageContext,
		communityData: {
			...pageContext.communityData,
			...communityData,
		},
		locationData: {
			...pageContext.locationData,
			path: '/',
			queryString: '',
			params: {},
		},
		loginData: {
			id: null,
		},
	};

	return (
		<div className="community-settings-preview-component" style={{ width: 375 }}>
			<ForceMobileAware force={forceViewportSize}>
				<Header
					previewContext={previewContext}
					forceMobile={forceViewportSize === 'mobile'}
				/>
				<NavBar previewContext={previewContext} />
				<Footer previewContext={previewContext} />
			</ForceMobileAware>
		</div>
	);
};

export default CommunitySettingsPreview;
