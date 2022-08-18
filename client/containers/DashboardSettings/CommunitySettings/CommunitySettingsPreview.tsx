import React, { useEffect, useState } from 'react';

import { PageContext, ViewportSize } from 'types';
import { ForceMobileAware, Header, NavBar, Footer, AccentStyle } from 'components';

require('./communitySettingsPreview.scss');

type Props = {
	forceViewportSize?: ViewportSize;
	previewContext: PageContext;
};

const CommunitySettingsPreview = (props: Props) => {
	const { previewContext, forceViewportSize = 'mobile' } = props;
	const {
		communityData: { hideNav },
	} = previewContext;
	const [element, setElement] = useState<null | HTMLElement>(null);
	const [simulator, setSimulator] = useState<null | HTMLElement>(null);

	useEffect(() => {
		if (element) {
			const listener = () => {
				const myBoundary = element.getBoundingClientRect();
				const controlsBoundary = document
					.querySelector('.dashboard-settings-frame-sticky-controls')!
					.getBoundingClientRect();
				const offset = Math.ceil(controlsBoundary.bottom - myBoundary.top);
				simulator!.style.transform = `translateY(${offset}px)`;
			};
			window.addEventListener('scroll', listener);
			return () => window.removeEventListener('scroll', listener);
		}
		return () => {};
	}, [element, simulator]);

	return (
		<div className="community-settings-preview-component" ref={setElement}>
			<div className="viewport-simulator" ref={setSimulator}>
				<ForceMobileAware force={forceViewportSize}>
					<AccentStyle
						isNavHidden={!!hideNav}
						communityData={previewContext.communityData}
					/>
					<Header
						previewContext={previewContext}
						forceMobile={forceViewportSize === 'mobile'}
					/>
					{!hideNav && <NavBar previewContext={previewContext} />}
					<div className="spacer" />
					<Footer previewContext={previewContext} />
					<div className="gutter" />
				</ForceMobileAware>
			</div>
			<div className="bottom-cutoff-gradient" />
		</div>
	);
};

export default CommunitySettingsPreview;
