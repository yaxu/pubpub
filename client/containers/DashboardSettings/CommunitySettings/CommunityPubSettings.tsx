import React from 'react';

import { IntrinsicFacetName } from 'facets';
import { FacetEditor } from 'components';

const facetsInOrder: IntrinsicFacetName[] = [
	'License',
	'CitationStyle',
	'PubHeaderTheme',
	'NodeLabels',
	'PubEdgeDisplay',
];

const CommunityPubSettings = () => {
	return (
		<>
			{facetsInOrder.map((facetName) => (
				<FacetEditor facetName={facetName} />
			))}
		</>
	);
};

export default CommunityPubSettings;
