import { facet } from './lib';

export const title = facet({
	scopeTypes: ['pub'],
	name: 'title',
	intrinsic: true,
	props: ({ string, prosemirrorDoc }) => ({
		plain: string,
		html: string,
		doc: prosemirrorDoc,
	}),
});
