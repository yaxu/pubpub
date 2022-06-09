import { facet, prop, oneOf } from '../lib';

const citationStyleKind = oneOf([
	'acm-siggraph',
	'american-anthro',
	'apa',
	'apa-7',
	'arcadia-science',
	'cell',
	'chicago',
	'harvard',
	'elife',
	'frontiers',
	'mla',
	'vancouver',
	'ama',
]);

const inlineCitationStyleKind = oneOf(['count', 'authorYear', 'author', 'label']);

export const CitationStyle = facet({
	name: 'CitationStyle',
	props: {
		citationStyle: prop(citationStyleKind, { rootValue: 'apa' as const }),
		inlineCitationStyleKind: prop(inlineCitationStyleKind, { rootValue: 'count' as const }),
	},
});
