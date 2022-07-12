import React from 'react';

import {
	CascadedFacetType,
	FacetDefinition,
	FacetProp,
	FacetPropType,
	NullableTypeOfPropType,
} from 'facets';

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
	facetValue: any;
};

export type PropTypeEditorDefinition<PropType extends FacetPropType> = {
	propType: PropType;
	renderFn: PropTypeEditorRenderFn<PropType>;
};

export type FacetPropEditorProps<
	Def extends FacetDefinition,
	PropName extends keyof Def['props'],
> = PropTypeEditorRenderProps<Def['props'][PropName]['propType']> & {
	facetValue: CascadedFacetType<Def>;
};
