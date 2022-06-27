import React, { useMemo } from 'react';

import { FacetPropType } from 'facets';

import { RenderProps } from './types';
import { propTypeEditors } from './propTypes';

type ComponentProps<PropType extends FacetPropType> = {
	propType: PropType;
} & RenderProps<PropType>;

function getEditorComponentForPropType(propType: FacetPropType) {
	const valueFromEditors = propTypeEditors.get(propType);
	if (valueFromEditors) {
		return valueFromEditors;
	}
	throw new Error(`No editor component for prop type ${propType.name}`);
}

function FacetPropTypeEditor<PropType extends FacetPropType>(props: ComponentProps<PropType>) {
	const { propType, ...renderProps } = props;
	const Editor = useMemo(() => getEditorComponentForPropType(propType), [propType]);
	return <Editor {...renderProps} />;
}

export default FacetPropTypeEditor;
