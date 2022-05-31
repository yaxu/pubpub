import { TypeOf, z } from 'zod';

import { prop, nullable, facet, string, url, oneOf, FacetTypeOf } from '../lib';

const headerTheme = oneOf(['dark', 'light', 'black-blocks', 'white-blocks']);

export const pubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	props: {
		backgroundImage: nullable(url),
		backgroundColor: prop(string, { backstop: 'community' }),
		theme: prop(headerTheme, { backstop: 'light' }),
	},
});

const aTheme = pubHeaderTheme.empty();
type T = FacetTypeOf<typeof pubHeaderTheme>;
