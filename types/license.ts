import { TypeOfFacetProp, License as LicenseFacet } from 'facets';

export type LicenseKind = TypeOfFacetProp<typeof LicenseFacet['props']['kind']>;

export type License = {
	slug: LicenseKind;
	full: string;
	short: string;
	version: string | null;
	link: string | null;
	requiresPremium?: true;
};

export type RenderedLicense = License & {
	summary?: string;
};
