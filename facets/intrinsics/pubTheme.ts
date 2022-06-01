import { prop, facet, string, oneOf, FacetTypeOf, FacetUpdateTypeOf } from '../lib';

const headerTheme = oneOf(['dark', 'light', 'black-blocks', 'white-blocks']);

export const pubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	props: {
		backgroundImage: prop(string, { rootValue: null }),
		backgroundColor: prop(string, { rootValue: 'community' }),
		theme: prop(headerTheme, { rootValue: 'light' as const }),
	},
});

export type PubHeaderTheme = FacetUpdateTypeOf<typeof pubHeaderTheme>;
