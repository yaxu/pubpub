import React from 'react';

import { FacetDefinition } from 'facets';

import FacetEditor, { PropEditors, Props as FacetEditorProps } from './FacetEditor';

type OptionsProps<Def extends FacetDefinition> = Pick<
	FacetEditorProps<Def>,
	'propEditors' | 'description'
>;

type RestProps<Def extends FacetDefinition> = Omit<
	FacetEditorProps<Def>,
	'propEditors' | 'description' | 'facetDefinition'
>;

export function createFacetEditor<Def extends FacetDefinition>(
	facetDefinition: Def,
	optionsProps: OptionsProps<Def>,
) {
	return (props: RestProps<Def>) => {
		return <FacetEditor {...props} {...optionsProps} facetDefinition={facetDefinition} />;
	};
}
