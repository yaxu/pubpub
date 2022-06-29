import { FacetPropType } from 'facets';

import { PropTypeEditorRenderFn, PropTypeEditorDefinition } from '../types';

type ReturnsFacetPropType = (...args: any[]) => FacetPropType;
type EditorArgument = FacetPropType | ReturnsFacetPropType;

type ExtractFacetPropType<Arg extends EditorArgument> = Arg extends ReturnsFacetPropType
	? ReturnType<Arg>
	: Arg;

export function propTypeEditor<Arg extends EditorArgument>(
	arg: Arg,
	renderFn: PropTypeEditorRenderFn<ExtractFacetPropType<Arg>>,
): PropTypeEditorDefinition<ExtractFacetPropType<Arg>> {
	return { propType: arg as any, renderFn };
}
