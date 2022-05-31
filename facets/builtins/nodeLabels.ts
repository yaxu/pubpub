import { z } from 'zod';

import { prop, nullable, facet, string, url, oneOf, merge, FacetTypeOf } from '../lib';

const nodeLabel = z.object({ enabled: z.boolean(), label: z.string() });

export const nodeLabels = facet({
	name: 'nodeLabels',
	props: {
		image: prop(nodeLabel, {
			backstop: { enabled: false, label: 'Image' },
			cascade: merge,
		}),
		video: prop(nodeLabel, {
			backstop: { enabled: false, label: 'Video' },
			cascade: merge,
		}),
		audio: prop(nodeLabel, {
			backstop: { enabled: false, label: 'Audio' },
			cascade: merge,
		}),
		table: prop(nodeLabel, {
			backstop: { enabled: false, label: 'Table' },
			cascade: merge,
		}),
		blockEquation: prop(nodeLabel, {
			backstop: { enabled: false, label: 'Equation' },
			cascade: merge,
		}),
	},
});

export type NodeLabels = FacetTypeOf<typeof nodeLabels>;
