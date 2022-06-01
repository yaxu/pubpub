import * as allIntrinsics from './_intrinsics';

export type IntrinsicFacetName = keyof typeof allIntrinsics;
export type IntrinsicFacetByName<T extends IntrinsicFacetName> = typeof allIntrinsics[T];
