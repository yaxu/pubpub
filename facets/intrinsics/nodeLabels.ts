import { z } from 'zod';
import { DataTypes } from 'sequelize';

import { propType, prop, facet } from '../lib';

const nodeLabel = propType({
	name: 'nodeLabel',
	schema: z.object({ enabled: z.boolean(), label: z.string() }),
	postgresType: DataTypes.JSONB,
});

export const NodeLabels = facet({
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
