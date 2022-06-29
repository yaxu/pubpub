import React from 'react';
import { storiesOf } from '@storybook/react';

import { intrinsics, createFacetInstance, cascade } from 'facets';
import { communityData, pubData } from 'utils/storybook/data';

import FacetEditor from './FacetEditor';

const { PubHeaderTheme } = intrinsics;

const cascadedPubTheme = cascade(PubHeaderTheme, [
	{
		scope: { kind: 'community', id: communityData.id },
		value: createFacetInstance(PubHeaderTheme, {
			theme: 'light',
			backgroundColor: '#333',
			backgroundImage: null,
		}),
	},
	{
		scope: { kind: 'pub', id: pubData.id },
		value: createFacetInstance(PubHeaderTheme, {
			theme: 'dark',
			backgroundColor: 'robinseggblue',
			backgroundImage: 'https://assets.pubpub.org/eys4nqr0/11528828519590.jpg',
		}),
	},
]);

storiesOf('components/facets/FacetEditor', module).add('default', () => (
	<FacetEditor
		facetDefinition={PubHeaderTheme}
		cascadeResult={cascadedPubTheme}
		currentScope={{ kind: 'pub', id: pubData.id }}
	/>
));
