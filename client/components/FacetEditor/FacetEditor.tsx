import React, { useCallback } from 'react';

import { FacetCascadeResult, FacetDefinition, FacetProp, FacetSourceScope, mapFacet } from 'facets';

import { PropTypeEditorComponent, PropTypeEditorProps } from './types';
import FacetPropEditorSkeleton from './FacetPropEditorSkeleton';

require('./facetEditor.scss');

export type PropEditors<Def extends FacetDefinition> = {
	[K in keyof Def['props']]: PropTypeEditorComponent<Def['props'][K]['propType']>;
};

export type Props<Def extends FacetDefinition> = {
	facetDefinition: Def;
	cascadeResult: FacetCascadeResult<Def>;
	currentScope: FacetSourceScope;
	propEditors: Partial<PropEditors<Def>>;
	description?: React.ReactNode;
};

function FacetEditor<Def extends FacetDefinition>(props: Props<Def>) {
	const { facetDefinition, cascadeResult, currentScope, propEditors, description } = props;
	const { props: cascadedProps, value: facetValue } = cascadeResult;
	const { name, label } = facetDefinition;

	const renderPropEditor = useCallback(
		(key, prop: FacetProp) => {
			const { propType } = prop;
			const PropEditor: PropTypeEditorComponent<any> = propEditors[key]!;
			const propCascadeResult = cascadedProps[key];
			const { value, contributions } = propCascadeResult;

			const isValueLocal =
				contributions[contributions.length - 1].scope.id === currentScope.id;

			const renderProps: PropTypeEditorProps<any> = {
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
		[propEditors, cascadedProps, currentScope, facetValue],
	);

	const propEditorsByName = mapFacet(facetDefinition, renderPropEditor);

	return (
		<div className="facet-editor-component">
			<div className="gradient" />
			<div className="title-area">
				<div className="name">{label ?? name}</div>
			</div>
			{description && (
				<details className="description">
					<summary>Description</summary>
					{description}
				</details>
			)}
			<div className="prop-editors">{Object.values(propEditorsByName)}</div>
		</div>
	);
}

export default FacetEditor;
