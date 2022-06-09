import { facet, prop, boolean } from '../lib';

export const PubEdgeDisplay = facet({
	name: 'PubEdgeDisplay',
	props: {
		defaultsToCarousel: prop(boolean, { rootValue: true }),
		descriptionIsVisible: prop(boolean, { rootValue: true }),
	},
});
