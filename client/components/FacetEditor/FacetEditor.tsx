import React from 'react';

import {
	FacetCascadeResult,
	FacetDefinition,
	FacetProp,
	FacetPropCascadeResult,
	FacetSourceScope,
	mapFacet,
} from 'facets';

import FacetPropEditor from './FacetPropEditor';

type Props<Def extends FacetDefinition> = {
	facetDefinition: Def;
	cascadeResult: FacetCascadeResult<Def>;
	currentScope: FacetSourceScope;
};

function FacetEditor<Def extends FacetDefinition>(props: Props<Def>) {
	const { facetDefinition, cascadeResult, currentScope } = props;
	const { name } = facetDefinition;

	const propEditorsByName = mapFacet(facetDefinition, (key, facetProp: FacetProp) => {
		const propCascadeResult = cascadeResult.props[key] as FacetPropCascadeResult<
			typeof facetProp
		>;
		return (
			<FacetPropEditor
				key={key as string}
				facetProp={facetProp}
				cascadeResult={propCascadeResult}
				currentScope={currentScope}
			/>
		);
	});

	return (
		<div className="facet-editor-component">
			<div className="name">{name}</div>
			{Object.values(propEditorsByName)}
		</div>
	);
}

export default FacetEditor;
