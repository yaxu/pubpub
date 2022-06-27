import { FacetPropType } from 'facets';

import { PropTypeEditor, RenderFn } from '../types';

import { nodeLabel } from './nodeLabel';
import { string } from './string';

function registerPropTypeEditors(editors: PropTypeEditor<any>[]) {
	const registry: Map<FacetPropType, RenderFn<any>> = new Map();

	editors.forEach((editor) => {
		const { propType, renderFn } = editor;
		registry.set(propType, renderFn);
	});

	return registry;
}

export const propTypeEditors = registerPropTypeEditors([string, nodeLabel]);
