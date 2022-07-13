import React from 'react';

import {
	CascadedFacetType,
	FacetDefinition,
	FacetProp,
	FacetPropType,
	PossiblyNullableTypeOfPropType,
} from 'facets';

type RenderFn<Props> = (props: Props) => React.ReactElement;

export type PropTypeEditorRenderFn<
	PropType extends FacetPropType,
	Nullable extends boolean = true,
> = RenderFn<PropTypeEditorRenderProps<PropType, Nullable>>;

export type PropTypeEditorRenderProps<
	PropType extends FacetPropType,
	Nullable extends boolean = true,
> = {
	prop: FacetProp<PropType>;
	propType: PropType;
	value: PossiblyNullableTypeOfPropType<PropType, Nullable>;
	onUpdateValue: (update: PossiblyNullableTypeOfPropType<PropType, Nullable>) => unknown;
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
	Nullable extends boolean = true,
> = PropTypeEditorRenderProps<Def['props'][PropName]['propType'], Nullable> & {
	facetValue: CascadedFacetType<Def>;
};
