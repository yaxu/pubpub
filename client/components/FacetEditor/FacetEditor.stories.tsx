import React from 'react';
import { storiesOf } from '@storybook/react';

import { createFacetInstance, cascade } from 'facets';
import { NodeLabels, PubHeaderTheme, CitationStyle } from 'facets/intrinsics';
import { communityData, pubData } from 'utils/storybook/data';

import PubHeaderThemeEditor from './PubHeaderThemeEditor';
import NodeLabelsEditor from './NodeLabelsEditor';
import FacetEditor from './FacetEditor';

const cascadedPubTheme = cascade(PubHeaderTheme, [
	{
		scope: { kind: 'community', id: communityData.id },
		value: createFacetInstance(PubHeaderTheme, {
			textStyle: 'light',
			backgroundColor: '#acd413aa',
			backgroundImage: null,
		}),
	},
	{
		scope: { kind: 'pub', id: pubData.id },
		value: createFacetInstance(PubHeaderTheme, {
			textStyle: 'light',
			backgroundColor: null,
			backgroundImage: 'https://assets.pubpub.org/eys4nqr0/11528828519590.jpg',
		}),
	},
]);

const cascadedNodeLabels = cascade(NodeLabels, [
	{
		scope: { kind: 'community', id: communityData.id },
		value: createFacetInstance(NodeLabels),
	},
	{
		scope: { kind: 'pub', id: pubData.id },
		value: createFacetInstance(NodeLabels, {
			image: {
				enabled: true,
				label: 'Ooooo',
			},
		}),
	},
]);

const cascadedCitationStyle = cascade(CitationStyle, [
	{
		scope: { kind: 'community', id: communityData.id },
		value: createFacetInstance(CitationStyle),
	},
	{
		scope: { kind: 'pub', id: pubData.id },
		value: createFacetInstance(CitationStyle, {
			inlineCitationStyle: 'authorYear',
		}),
	},
]);

storiesOf('components/FacetEditor', module).add('PubHeaderTheme', () => (
	<PubHeaderThemeEditor
		cascadeResult={cascadedPubTheme}
		currentScope={{ kind: 'pub', id: pubData.id }}
	/>
));

storiesOf('components/FacetEditor', module).add('NodeLabels', () => (
	<NodeLabelsEditor
		cascadeResult={cascadedNodeLabels}
		currentScope={{ kind: 'pub', id: pubData.id }}
	/>
));

storiesOf('components/FacetEditor', module).add('CitationStyle', () => (
	<FacetEditor
		facetDefinition={CitationStyle}
		cascadeResult={cascadedCitationStyle}
		currentScope={{ kind: 'pub', id: pubData.id }}
	/>
));
