import { Writeable } from 'types';

import { FacetCascadeResult } from '../lib';
import { Intrinsics } from '../intrinsics';

export type CascadedFacetsByKind = Writeable<{
	[K in keyof Intrinsics]?: FacetCascadeResult<Intrinsics[K]>;
}>;
