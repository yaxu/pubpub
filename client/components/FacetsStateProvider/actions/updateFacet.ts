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
	FacetCascadeResult,
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
	previous: Record<string, any>,
	nextInvalid: Record<string, any>,
	nextValid: Record<string, any>,
) {
	const next = { ...previous, ...nextInvalid };
	Object.keys(nextValid).forEach((key) => {
		delete next[key];
	});
	return next;
}

function getNextPendingChanges<Def extends FacetDefinition>(
	persistedCascadeResult: FacetCascadeResult<Def>,
	nextCascadeResult: FacetCascadeResult<Def>,
) {
	const { stack: nextStack } = nextCascadeResult;
	const { stack: persistedStack } = persistedCascadeResult;
	const { value: nextInstance } = nextStack[nextStack.length - 1];
	const persistedInstance =
		persistedStack.length === nextStack.length
			? persistedStack[persistedStack.length - 1].value
			: null;
	const pendingChanges = { ...nextInstance };
	Object.keys(pendingChanges).forEach((key) => {
		const pendingValue = pendingChanges[key];
		const persistedValue = persistedInstance?.[key] ?? null;
		if (pendingValue === persistedValue) {
			delete pendingChanges[key];
		}
	});
	return pendingChanges;
}

export function updateFacet<FacetName extends IntrinsicFacetName>(
	get: GetState<FacetsState>,
	set: SetState<FacetsState>,
	name: FacetName,
	patch: Partial<FacetInstanceType<Intrinsics[FacetName]>>,
) {
	const { facets, currentScope } = get();
	const facetState: undefined | FacetState = facets[name];
	if (!facetState) {
		return;
	}
	const {
		facetDefinition,
		cascadeResult: { stack },
		persistedCascadeResult,
		invalidProps: prevInvalidProps,
	} = facetState;
	const { valid, invalid } = parsePartialFacetInstance(facetDefinition, patch);
	const nextStack = applyPatchToStack(facetDefinition, stack, patch, currentScope);
	const cascadeResult = cascade(facetDefinition, nextStack);
	const invalidProps = getNextInvalidProps(prevInvalidProps, invalid, valid);
	const persistableChanges = getNextPendingChanges(persistedCascadeResult, cascadeResult);
	const hasPersistableChanges = Object.keys(persistableChanges).length > 0;
	const hasInvalidChanges = Object.keys(invalidProps).length === 0;
	const nextFacetState: FacetState = {
		...facetState,
		cascadeResult,
		invalidProps,
		persistableChanges,
		hasPersistableChanges,
		hasInvalidChanges,
	};
	const nextFacetsState = { ...facets, [name]: nextFacetState };
	const nextAnyFacetHasPendingChanges = Object.values(nextFacetsState).some(
		(state) => state?.hasPersistableChanges,
	);
	set({ facets: nextFacetsState, hasPersistableChanges: nextAnyFacetHasPendingChanges });
}
