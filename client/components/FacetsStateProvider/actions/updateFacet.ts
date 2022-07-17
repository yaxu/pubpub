import { GetState, SetState } from 'zustand';

import {
	FacetDefinition,
	FacetInstanceStack,
	FacetInstanceType,
	FacetSourceScope,
	IntrinsicFacetName,
	Intrinsics,
	cascade,
	parsePartialFacetInstance,
	createFacetInstance,
} from 'facets';

import { FacetsState, FacetState } from '../types';

function applyPatchToStack<Def extends FacetDefinition>(
	def: Def,
	stack: FacetInstanceStack<Def>,
	patch: Partial<FacetInstanceType<Def>>,
	scope: FacetSourceScope,
): FacetInstanceStack<Def> {
	const patchableIndex = stack.findIndex(
		(e) => e.scope.kind === scope.kind && e.scope.id === scope.id,
	);
	if (patchableIndex >= 0) {
		const entry = stack[patchableIndex];
		const { value } = entry;
		const patchedEntry = {
			...entry,
			value: { ...value, ...patch },
		};
		const nextStack = stack.concat();
		nextStack.splice(patchableIndex, 1, patchedEntry);
		return nextStack;
	}
	return [...stack, { scope, facetBindingId: null, value: createFacetInstance(def, patch) }];
}

function getNextInvalidProps(
	current: Record<string, any>,
	invalid: Record<string, any>,
	valid: Record<string, any>,
) {
	const next = { ...current, ...invalid };
	Object.keys(valid).forEach((key) => {
		delete next[key];
	});
	return next;
}

export function updateFacet<FacetName extends IntrinsicFacetName>(
	get: GetState<FacetsState>,
	set: SetState<FacetsState>,
	name: FacetName,
	patch: Partial<FacetInstanceType<Intrinsics[FacetName]>>,
) {
	const { facets, currentScope } = get();
	const facetState: undefined | FacetState = facets[name];
	if (facetState) {
		const {
			facetDefinition,
			cascadeResult: { stack },
			pendingChanges,
			invalidProps,
		} = facetState;
		const { valid, invalid } = parsePartialFacetInstance(facetDefinition, patch);
		const nextStack = applyPatchToStack(facetDefinition, stack, patch, currentScope);
		const cascadeResult = cascade(facetDefinition, nextStack);
		const nextInvalidProps = getNextInvalidProps(invalidProps, invalid, valid);
		const nextFacetState = {
			...facetState,
			cascadeResult,
			pendingChanges: {
				...pendingChanges,
				...valid,
			},
			invalidProps: nextInvalidProps,
			isValid: Object.keys(nextInvalidProps).length === 0,
		};
		set({ facets: { ...facets, [name]: nextFacetState } });
	}
}
