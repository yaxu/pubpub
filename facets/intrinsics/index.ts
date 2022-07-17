import { CitationStyle } from './citationStyle';
import { License } from './license';
import { NodeLabels } from './nodeLabels';
import { PubEdgeDisplay } from './pubEdgeDisplay';
import { PubHeaderTheme } from './pubHeaderTheme';

const intrinsics = { CitationStyle, License, NodeLabels, PubEdgeDisplay, PubHeaderTheme };

export { intrinsics };
export { CitationStyle, License, NodeLabels, PubEdgeDisplay, PubHeaderTheme };

export type Intrinsics = typeof intrinsics;
export type IntrinsicFacetDefinition = Intrinsics[keyof Intrinsics];
export type IntrinsicFacetName = keyof Intrinsics;
export const ALL_INTRINSIC_FACETS = Object.keys(intrinsics) as IntrinsicFacetName[];
