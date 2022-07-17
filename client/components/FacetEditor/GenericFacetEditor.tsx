import React, { useCallback } from 'react';

import { FacetDefinition, FacetProp, mapFacet } from 'facets';

import { GenericFacetEditorProps, PropTypeEditorComponent, PropTypeEditorProps } from './types';
import FacetPropEditorSkeleton from './FacetPropEditorSkeleton';

require('./facetEditor.scss');

function GenericFacetEditor<Def extends FacetDefinition>(props: GenericFacetEditorProps<Def>) {
	const {
		cascadeResult,
		currentScope,
		description,
		facetDefinition,
		onUpdateValue,
		propEditors,
	} = props;
	const { props: cascadedProps, value: facetValue } = cascadeResult;
	const { name, label } = facetDefinition;

	const renderPropEditor = useCallback(
		(key, prop: FacetProp) => {
			const { propType } = prop;
			const PropEditor: PropTypeEditorComponent<any> = propEditors[key]!;
			const propCascadeResult = cascadedProps[key];
			const { value, contributions } = propCascadeResult;

			const isValueLocal =
				contributions[contributions.length - 1]?.scope.id === currentScope.id;

			const updateProp = (newValue) => onUpdateValue({ [key]: newValue } as any);

			const renderProps: PropTypeEditorProps<any> = {
				value,
				prop,
				propType,
				onUpdateValue: updateProp,
				isValueLocal,
				facetValue,
			};

			return (
				<FacetPropEditorSkeleton
					label={prop.label}
					onReset={() => updateProp(null)}
					isValueLocal={isValueLocal}
				>
					<PropEditor key={key} {...renderProps} />
				</FacetPropEditorSkeleton>
			);
		},
		[propEditors, cascadedProps, currentScope, facetValue, onUpdateValue],
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

export default GenericFacetEditor;
