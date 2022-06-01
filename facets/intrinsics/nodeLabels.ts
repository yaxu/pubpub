import { z } from 'zod';

import { prop, facet, merge, FacetTypeOf } from '../lib';

const nodeLabel = z.object({ enabled: z.boolean(), label: z.string() });

export const nodeLabels = facet({
	name: 'NodeLabels',
	props: {
		image: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Image' },
		}),
		video: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Video' },
			cascade: merge,
		}),
		audio: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Audio' },
			cascade: merge,
		}),
		table: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Table' },
			cascade: merge,
		}),
		blockEquation: prop(nodeLabel, {
			rootValue: { enabled: false, label: 'Equation' },
			cascade: merge,
		}),
	},
});

export type NodeLabels = FacetTypeOf<typeof nodeLabels>;
