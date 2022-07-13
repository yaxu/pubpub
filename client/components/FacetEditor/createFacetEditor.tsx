import React from 'react';

import { FacetDefinition } from 'facets';

import FacetEditor, { Props as FacetEditorProps } from './FacetEditor';

type PropEditors<Def extends FacetDefinition> = FacetEditorProps<Def>['propEditors'];
type RestProps<Def extends FacetDefinition> = Omit<
	FacetEditorProps<Def>,
	'propEditors' | 'facetDefinition'
>;

export function createFacetEditor<Def extends FacetDefinition>(
	facetDefinition: Def,
	propEditors: PropEditors<Def>,
) {
	return (props: RestProps<Def>) => {
		return (
			<FacetEditor {...props} facetDefinition={facetDefinition} propEditors={propEditors} />
		);
	};
}
