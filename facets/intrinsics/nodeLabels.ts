import { z } from 'zod';

import { propType, prop, facet } from '../lib';

const nodeLabel = propType({
	name: 'nodeLabel',
	schema: z.object({ enabled: z.boolean(), label: z.string() }),
});

export const nodeLabels = facet({
	name: 'NodeLabels',
	props: {
		image: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Image' },
		}),
		video: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Video' },
		}),
		audio: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Audio' },
		}),
		table: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Table' },
		}),
		blockEquation: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Equation' },
		}),
	},
});
