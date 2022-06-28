import { FacetPropType } from 'facets';

import { RenderFn, PropTypeEditor } from './types';

type ReturnsFacetPropType = (...args: any[]) => FacetPropType;
type EditorArgument = FacetPropType | ReturnsFacetPropType;

type ExtractFacetPropType<Arg extends EditorArgument> = Arg extends ReturnsFacetPropType
	? ReturnType<Arg>
	: Arg;

export function propTypeEditor<Arg extends EditorArgument>(
	arg: Arg,
	renderFn: RenderFn<ExtractFacetPropType<Arg>>,
): PropTypeEditor<ExtractFacetPropType<Arg>> {
	return { propType: arg as any, renderFn };
}
