import { PubHeaderTheme, NodeLabels, CitationStyle } from './intrinsics';
import {
	CascadedFacetType,
	createEmptyFacetInstance,
	createFacetInstance,
	cascade,
	FacetInstanceType,
} from './lib';

const a = createEmptyFacetInstance(NodeLabels);
const b = createEmptyFacetInstance(NodeLabels);

const sa = { kind: 'community', id: '0' } as const;
const sb = { kind: 'collection', id: '1' } as const;

const c = cascade(NodeLabels, [
	{ value: a, scope: sa },
	{ value: b, scope: sb },
]);
