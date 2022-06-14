import { prop, facet, string, oneOf, many } from '../lib';

const headerTheme = oneOf(['dark', 'light', 'black-blocks', 'white-blocks']);

export const PubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	props: {
		backgroundImage: prop(string, { rootValue: null }),
		backgroundColor: prop(string, { rootValue: 'community' }),
		theme: prop(headerTheme, { rootValue: null }),
	},
});
