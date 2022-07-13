import React from 'react';

import {
	CascadedFacetType,
	FacetDefinition,
	FacetProp,
	FacetPropType,
	PossiblyNullableTypeOfPropType,
} from 'facets';

type RenderFn<Props> = (props: Props) => React.ReactElement;

export type PropTypeEditorComponent<
	PropType extends FacetPropType,
	Nullable extends boolean = true,
> = RenderFn<PropTypeEditorProps<PropType, Nullable>>;

export type PropTypeEditorProps<PropType extends FacetPropType, Nullable extends boolean = true> = {
	prop: FacetProp<PropType>;
	propType: PropType;
	value: PossiblyNullableTypeOfPropType<PropType, Nullable>;
	onUpdateValue: (update: PossiblyNullableTypeOfPropType<PropType, Nullable>) => unknown;
	isValueLocal: boolean;
	facetValue: any;
};

export type PropTypeEditorDefinition<PropType extends FacetPropType> = {
	propType: PropType;
	renderFn: PropTypeEditorComponent<PropType>;
};

export type FacetPropEditorProps<
	Def extends FacetDefinition,
	PropName extends keyof Def['props'],
	Nullable extends boolean = true,
> = PropTypeEditorProps<Def['props'][PropName]['propType'], Nullable> & {
	facetValue: CascadedFacetType<Def>;
};
