import React from 'react';

import { FacetPropType, NullableTypeOfPropType } from 'facets';

export type RenderFn<PropType extends FacetPropType> = (
	props: RenderProps<PropType>,
) => React.ReactElement;

export type RenderProps<PropType extends FacetPropType> = {
	value: NullableTypeOfPropType<PropType>;
	onUpdateValue: (update: NullableTypeOfPropType<PropType>) => unknown;
	isValueLocal: boolean;
};

export type PropTypeEditor<PropType extends FacetPropType> = {
	propType: PropType;
	renderFn: RenderFn<PropType>;
};
