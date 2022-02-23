import React from 'react';
import { PubAttributionEditor } from 'components';

import { usePageContext } from 'utils/hooks';
import { PubPageData, DefinitelyHas } from 'types';

type Props = {
	pubData: DefinitelyHas<PubPageData, 'submission'>;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
};

const Contributors = (props: Props) => {
	const { onUpdatePub, pubData } = props;
	const { communityData } = usePageContext();

	return (
		<PubAttributionEditor
			pubData={pubData}
			communityData={communityData}
			updatePubData={onUpdatePub}
			canEdit
		/>
	);
};

export default Contributors;
