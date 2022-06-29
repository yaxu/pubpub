import React, { useMemo } from 'react';

import { FacetPropType } from 'facets';

import { RenderProps, RenderFn, PropTypeEditor } from './propTypeEditors/types';
import { String, OneOf } from './propTypeEditors';

type ComponentProps<PropType extends FacetPropType> = {
	propType: PropType;
} & RenderProps<PropType>;

const registerPropTypeEditors = (editors: PropTypeEditor<any>[]) => {
	const registry: Map<FacetPropType, RenderFn<any>> = new Map();
	editors.forEach((editor) => {
		const { propType, renderFn } = editor;
		registry.set(propType.identity ?? propType, renderFn);
	});
	return registry;
};

const propTypeEditors = registerPropTypeEditors([String, OneOf]);

const getEditorComponentForPropType = (propType: FacetPropType) => {
	const valueFromEditors = propTypeEditors.get(propType.identity ?? propType);
	if (valueFromEditors) {
		return valueFromEditors;
	}
	throw new Error(`No editor component for prop type ${propType.name}: ${propType.postgresType}`);
};

const FacetPropTypeEditor = <PropType extends FacetPropType>(props: ComponentProps<PropType>) => {
	const { propType } = props;
	const Editor = useMemo(() => getEditorComponentForPropType(propType), [propType]);
	return <Editor {...props} />;
};

export default FacetPropTypeEditor;
