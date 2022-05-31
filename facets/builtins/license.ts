import { prop, nullable, facet, string, url, number, oneOf, FacetTypeOf } from '../lib';

const licenseKind = oneOf(['cc-zero', 'cc-by-nd', 'copyright']);

export const license = facet({
	name: 'license',
	props: {
		kind: prop(licenseKind),
		copyrightYear: nullable(number),
	},
});

type License = FacetTypeOf<typeof license>;
