import { IntrinsicFacetByName, IntrinsicFacetName } from './intrinsics';
import { FacetTypeOf, FacetUpdateTypeOf } from './lib';

type UpdateQuery = Partial<{
	[K in IntrinsicFacetName]: FacetUpdateTypeOf<IntrinsicFacetByName<K>>;
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
