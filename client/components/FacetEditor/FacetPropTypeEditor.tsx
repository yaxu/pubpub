import React, { useMemo } from 'react';

import { FacetPropType } from 'facets';

import { RenderProps, RenderFn, PropTypeEditor } from './types';
import { st, OneOf } from './propTypeEditors';

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

const propTypeEditors = registerPropTypeEditors([st, OneOf]);

const getEditorComponentForPropType = (propType: FacetPropType) => {
	const valueFromEditors = propTypeEditors.get(propType.identity ?? propType);
	if (valueFromEditors) {
		return valueFromEditors;
	}
	throw new Error(`No editor component for prop type ${propType.name}: ${propType.postgresType}`);
};

const FacetPropTypeEditor = <PropType extends FacetPropType>(props: ComponentProps<PropType>) => {
	const { propType } = props;
	console.log('hello,');
	const Editor = useMemo(() => getEditorComponentForPropType(propType), [propType]);
	console.log({ Editor });
	return <Editor {...props} />;
};

export default FacetPropTypeEditor;
