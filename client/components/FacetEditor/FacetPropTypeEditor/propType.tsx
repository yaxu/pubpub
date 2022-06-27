import { FacetPropType } from 'facets';

import { RenderFn, PropTypeEditor } from './types';

export function propTypeEditor<PropType extends FacetPropType>(
	propType: PropType,
	renderFn: RenderFn<PropType>,
): PropTypeEditor<PropType> {
	return { propType, renderFn };
}
