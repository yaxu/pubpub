import React from 'react';

import { FacetProp, FacetPropType, NullableTypeOfPropType } from 'facets';

export type RenderFn<PropType extends FacetPropType> = (
	props: RenderProps<PropType>,
) => React.ReactElement;

export type RenderProps<PropType extends FacetPropType> = {
	prop: FacetProp<PropType>;
	propType: PropType;
	value: NullableTypeOfPropType<PropType>;
	onUpdateValue: (update: NullableTypeOfPropType<PropType>) => unknown;
	isValueLocal: boolean;
};

export type PropTypeEditor<PropType extends FacetPropType> = {
	propType: PropType;
	renderFn: RenderFn<PropType>;
};
