import React from 'react';

import { FacetProp, FacetPropCascadeResult, FacetSourceScope } from 'facets';

import FacetPropTypeEditor from './FacetPropTypeEditor';

type ComponentProps<Prop extends FacetProp> = {
	facetProp: Prop;
	currentScope: FacetSourceScope;
	cascadeResult: FacetPropCascadeResult<Prop>;
};

function FacetPropEditor<Prop extends FacetProp>(props: ComponentProps<Prop>) {
	const { facetProp, cascadeResult } = props;
	const { label, propType, cascade } = facetProp;
	return (
		<div className="facet-prop-editor-component">
			<div className="label">{label}</div>
			<FacetPropTypeEditor
				isValueLocal
				prop={facetProp}
				propType={propType}
				value={cascadeResult.result}
				onUpdateValue={() => {}}
			/>
		</div>
	);
}

export default FacetPropEditor;
