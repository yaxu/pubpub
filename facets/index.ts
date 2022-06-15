import * as intrinsics from './intrinsics';

export type Intrinsics = typeof intrinsics;
export type IntrinsicFacetDefinition = Intrinsics[keyof Intrinsics];
export type IntrinsicFacetName = keyof Intrinsics;
export const ALL_INTRINSIC_FACETS = Object.keys(intrinsics) as IntrinsicFacetName[];
export { intrinsics };

export * as primitives from './lib/primitives';
export * from './lib';
