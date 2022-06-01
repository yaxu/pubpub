import { IntrinsicFacetByName, IntrinsicFacetName } from './intrinsics';
import { FacetTypeOf, FacetInsertion } from './lib';

type UpdateQuery = Partial<{
	[K in IntrinsicFacetName]: FacetInsertion<IntrinsicFacetByName<K>>;
}>;

const update = (q: UpdateQuery) => {};

update({
	license: { copyrightYear: 2001, kind: null },
	pubHeaderTheme: { backgroundColor: 'green', theme: 'black-blocks' },
	nodeLabels: {
		image: null,
		video: null,
	},
});
