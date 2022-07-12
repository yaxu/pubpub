import React from 'react';
import { storiesOf } from '@storybook/react';

import { createFacetInstance, cascade } from 'facets';
import { PubHeaderTheme } from 'facets/intrinsics';
import { communityData, pubData } from 'utils/storybook/data';

import PubHeaderThemeEditor from './PubHeaderThemeEditor';

const cascadedPubTheme = cascade(PubHeaderTheme, [
	{
		scope: { kind: 'community', id: communityData.id },
		value: createFacetInstance(PubHeaderTheme, {
			textStyle: 'light',
			backgroundColor: 'robinseggblue',
			backgroundImage: null,
		}),
	},
	{
		scope: { kind: 'pub', id: pubData.id },
		value: createFacetInstance(PubHeaderTheme, {
			textStyle: 'dark',
			backgroundColor: null,
			backgroundImage: 'https://assets.pubpub.org/eys4nqr0/11528828519590.jpg',
		}),
	},
]);

storiesOf('components/facets/FacetEditor', module).add('default', () => (
	<PubHeaderThemeEditor
		facetDefinition={PubHeaderTheme}
		cascadeResult={cascadedPubTheme}
		currentScope={{ kind: 'pub', id: pubData.id }}
	/>
));
