import React, { useCallback, useMemo } from 'react';

import {
	cascade,
	FacetCascadeResult,
	FacetDefinition,
	FacetProp,
	FacetPropCascadeResult,
	FacetSourceScope,
	mapFacet,
} from 'facets';

import { PropTypeEditorRenderFn, PropTypeEditorRenderProps } from './types';
import DefaultFacetPropEditor from './DefaultFacetPropTypeEditor';
import FacetPropEditorSkeleton from './FacetPropEditorSkeleton';

require('./facetEditor.scss');

type PropEditors<Def extends FacetDefinition> = {
	[K in keyof Def['props']]: PropTypeEditorRenderFn<Def['props'][K]['propType']>;
};

type Props<Def extends FacetDefinition> = {
	facetDefinition: Def;
	cascadeResult: FacetCascadeResult<Def>;
	currentScope: FacetSourceScope;
	propEditors?: Partial<PropEditors<Def>>;
};

function FacetEditor<Def extends FacetDefinition>(props: Props<Def>) {
	const { facetDefinition, cascadeResult, currentScope, propEditors } = props;
	const { props: cascadedProps, value: facetValue } = cascadeResult;
	const { name, label } = facetDefinition;

	const renderPropEditor = useCallback(
		(key, prop: FacetProp) => {
			const { propType } = prop;
			const PropEditor = propEditors?.[key] ?? DefaultFacetPropEditor;
			const propCascadeResult = cascadedProps[key];
			const { value, contributions } = propCascadeResult;

			const isValueLocal =
				contributions[contributions.length - 1].scope.id === currentScope.id;

			const renderProps: PropTypeEditorRenderProps<any> = {
				value,
				prop,
				propType,
				onUpdateValue: () => {},
				isValueLocal,
				facetValue,
			};

			return (
				<FacetPropEditorSkeleton
					label={prop.label ?? key}
					onReset={() => {}}
					isValueLocal={isValueLocal}
				>
					<PropEditor key={key} {...renderProps} />
				</FacetPropEditorSkeleton>
			);
		},
		[propEditors, cascadedProps, currentScope],
	);

	const propEditorsByName = mapFacet(facetDefinition, renderPropEditor);

	return (
		<div className="facet-editor-component">
			<div className="gradient-bullshit-container" />
			<div className="title-area">
				<div className="name">{label ?? name}</div>
			</div>
			<div className="prop-editors">{Object.values(propEditorsByName)}</div>
		</div>
	);
}

export default FacetEditor;
