import { createEmptyFacet, createFacet } from 'facets/lib/operations';
import { prop, facet, number, oneOf, FacetTypeOf } from '../lib';

const licenseKind = oneOf(['cc-zero', 'cc-by-nd', 'copyright']);

export const license = facet({
	name: 'License',
	props: {
		kind: prop(licenseKind, { rootValue: 'cc-by-nd' as const }),
		copyrightYear: prop(number, { rootValue: null }),
	},
});
