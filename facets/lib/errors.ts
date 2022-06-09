import { FacetDefinition } from './facet';

export class FacetsError extends Error {
	constructor(message: string) {
		super(`[facets] ${message}`);
	}
}

export class FacetParseError extends FacetsError {
	constructor(facet: FacetDefinition, propName: string) {
		super(`Error when parsing ${facet.name} instance: invalid ${propName}`);
	}
}
