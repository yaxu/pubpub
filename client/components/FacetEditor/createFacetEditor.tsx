import React from 'react';

import { FacetDefinition } from 'facets';

import FacetEditor from './GenericFacetEditor';
import { FacetEditorComponent, FacetEditorCreationOptions, SpecificFacetEditorProps } from './types';

export function createFacetEditor<Def extends FacetDefinition>(
	facetDefinition: Def,
	options: FacetEditorCreationOptions<Def>,
): FacetEditorComponent<Def> {
	return (props: SpecificFacetEditorProps<Def>) => {
		return <FacetEditor {...props} {...options} facetDefinition={facetDefinition} />;
	};
}
