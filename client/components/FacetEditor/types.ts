import React from 'react';

import { FacetProp, FacetPropType, NullableTypeOfPropType } from 'facets';

type RenderFn<Props> = (props: Props) => React.ReactElement;

export type PropTypeEditorRenderFn<PropType extends FacetPropType> = RenderFn<
	PropTypeEditorRenderProps<PropType>
>;

export type PropTypeEditorRenderProps<PropType extends FacetPropType> = {
	prop: FacetProp<PropType>;
	propType: PropType;
	value: NullableTypeOfPropType<PropType>;
	onUpdateValue: (update: NullableTypeOfPropType<PropType>) => unknown;
	isValueLocal: boolean;
};

export type PropTypeEditorDefinition<PropType extends FacetPropType> = {
	propType: PropType;
	renderFn: PropTypeEditorRenderFn<PropType>;
};
