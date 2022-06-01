import { TypeOf } from 'zod';
import {
	prop,
	facet,
	string,
	oneOf,
	FacetDefinition,
	FacetTypeOf,
	FacetInsertion,
	merge,
	createFacet,
	cascadeFacets,
} from '../lib';

const headerTheme = oneOf(['dark', 'light', 'black-blocks', 'white-blocks']);

export const pubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	props: {
		backgroundImage: prop(string, { rootValue: null }),
		backgroundColor: prop(string, { rootValue: 'community' }),
		theme: prop(headerTheme, { rootValue: 'light' as const }),
	},
});

export type PubHeaderTheme = FacetTypeOf<typeof pubHeaderTheme>;

const oneTheme = createFacet(pubHeaderTheme, { backgroundColor: 'blue', theme: 'black-blocks' });
const anotherTheme = createFacet(pubHeaderTheme, { backgroundColor: 'red' });
const cascadedTheme = cascadeFacets(pubHeaderTheme, oneTheme, anotherTheme);
