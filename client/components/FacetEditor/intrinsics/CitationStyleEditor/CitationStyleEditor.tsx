import {
	CitationStyle,
	citationStyleKind,
	inlineCitationStyleKind,
} from 'facets/intrinsics/citationStyle';
import { citationStyles, citationInlineStyles } from 'utils/citations';

import { createFacetEditor } from '../../createFacetEditor';
import { choice } from '../../propTypeEditors';

const CitationStyleChoice = choice<typeof citationStyleKind>({
	items: (() => {
		const items = {};
		citationStyles.forEach((style) => {
			items[style.key] = { label: style.name };
		});
		return items;
	})(),
});

const InlineCitationStyleChoice = choice<typeof inlineCitationStyleKind>({
	items: (() => {
		const items = {};
		citationInlineStyles.forEach((style) => {
			items[style.key] = { label: style.title, rightElement: style.example };
		});
		return items;
	})(),
});

export default createFacetEditor(CitationStyle, {
	propEditors: {
		citationStyle: CitationStyleChoice,
		inlineCitationStyle: InlineCitationStyleChoice,
	},
});
