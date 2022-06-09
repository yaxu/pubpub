import { oneOf, prop, facet, integer } from '../lib';

const licenseKind = oneOf(['cc-zero', 'cc-by-nd', 'copyright']);

export const License = facet({
	name: 'License',
	props: {
		kind: prop(licenseKind, { rootValue: 'cc-by-nd' as const }),
		copyrightYear: prop(integer, { rootValue: null }),
	},
});
