import { z } from 'zod';

import { propType, prop, facet } from '../lib';

const nodeLabel = propType({
	name: 'nodeLabel',
	schema: z.object({ enabled: z.boolean(), label: z.string() }),
	postgresType: 'jsonb',
});

export const NodeLabels = facet({
	name: 'NodeLabels',
	label: 'Item labels',
	props: {
		image: prop(nodeLabel, {
			label: 'Images',
			rootValue: { enabled: false, label: 'Image' },
		}),
		video: prop(nodeLabel, {
			label: 'Videos',
			rootValue: { enabled: false, label: 'Video' },
		}),
		audio: prop(nodeLabel, {
			label: 'Audio',
			rootValue: { enabled: false, label: 'Audio' },
		}),
		table: prop(nodeLabel, {
			label: 'Tables',
			rootValue: { enabled: false, label: 'Table' },
		}),
		blockEquation: prop(nodeLabel, {
			label: 'Math',
			rootValue: { enabled: false, label: 'Equation' },
		}),
	},
});
