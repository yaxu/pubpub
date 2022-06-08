import { prop, facet, string, oneOf } from '../lib';

const headerTheme = oneOf(['dark', 'light', 'black-blocks', 'white-blocks']);

export const pubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	props: {
		backgroundImage: prop(string, { rootValue: null }),
		backgroundColor: prop(string, { rootValue: 'community' }),
		theme: prop(headerTheme, { rootValue: null }),
	},
});
