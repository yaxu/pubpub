import React from 'react';

import { FacetDefinition } from 'facets';

import FacetEditor, { Props as FacetEditorProps } from './FacetEditor';

type PropEditors<Def extends FacetDefinition> = FacetEditorProps<Def>['propEditors'];
type RestProps<Def extends FacetDefinition> = Omit<FacetEditorProps<Def>, 'propEditors'>;

export function createFacetEditor<Def extends FacetDefinition>(propEditors: PropEditors<Def>) {
	return (props: RestProps<Def>) => {
		return <FacetEditor {...props} propEditors={propEditors} />;
	};
}
