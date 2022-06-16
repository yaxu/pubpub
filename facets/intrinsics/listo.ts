import { prop, facet, string, many } from '../lib';

export const Listo = facet({
	name: 'Listo',
	props: {
		items: prop(many(string), {
			rootValue: null,
			cascade: { strategy: 'extend', direction: 'desc' },
		}),
	},
});
