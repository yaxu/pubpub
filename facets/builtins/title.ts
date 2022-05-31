import { DocJson } from 'types';

import { facet } from '../lib';

type UpdateMutationOptions = {
	doc: DocJson;
};

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
