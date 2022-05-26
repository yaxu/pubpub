import { z } from 'zod';

import { primitives } from './primitives';

type ScopeType = 'community' | 'collection' | 'pub';

type FacetUriDefinition = { intrinsic: true } | { uri: string };

export type FacetDefinition = {
	scopeTypes?: ScopeType[];
	name: string;
	props: (prims: typeof primitives) => Record<string, z.ZodSchema>;
} & FacetUriDefinition;
