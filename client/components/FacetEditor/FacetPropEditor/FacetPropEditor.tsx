import React, { useMemo } from 'react';

import { FacetCascadeResult, FacetProp, FacetPropCascadeResult, FacetSourceScope } from 'facets';

import FacetPropTypeEditor from '../FacetPropTypeEditor';

type ExtendFacetProp = FacetProp & { cascade: { strategy: 'extend' } };

type CR = FacetPropCascadeResult<ExtendFacetProp>;

type ComponentProps<Prop extends ExtendFacetProp> = {
	facetProp: Prop;
	currentScope: FacetSourceScope;
	cascadeResult: FacetPropCascadeResult<Prop>;
};

function FacetPropEditor<Prop extends ExtendFacetProp>(props: ComponentProps<Prop>) {
	const { facetProp, cascadeResult } = props;
	const { label, propType, cascade } = facetProp;

	return (
		<div className="facet-prop-editor-component">
			<div className="label">{label}</div>
			<FacetPropTypeEditor propType={propType} value={cascadeResult.result} />
		</div>
	);
}

export default FacetPropEditor;
