import { SingleScopeId } from 'types';

type ScopeIdProperty = 'communityId' | 'collectionId' | 'pubId';

const getTruthyScopeIdPropertyOrNull = (scopeId: any, property: ScopeIdProperty): null | string => {
	const resolved = scopeId[property];
	return resolved || null;
};

const matchScopeIdProperty = (
	expected: SingleScopeId,
	claimed: SingleScopeId,
	property: ScopeIdProperty,
) => {
	return (
		getTruthyScopeIdPropertyOrNull(expected, property) ===
		getTruthyScopeIdPropertyOrNull(claimed, property)
	);
};

export const parseSingleScopeId = (scopeId: any): null | SingleScopeId => {
	if (scopeId) {
		const communityId = getTruthyScopeIdPropertyOrNull(scopeId, 'communityId');
		const collectionId = getTruthyScopeIdPropertyOrNull(scopeId, 'collectionId');
		const pubId = getTruthyScopeIdPropertyOrNull(scopeId, 'pubId');
		const onlyOne = [communityId, collectionId, pubId].filter((x) => !!x).length === 1;
		return onlyOne ? (scopeId as SingleScopeId) : null;
	}
	return null;
};

export const matchScopeIds = (expected: SingleScopeId, claimed: SingleScopeId) => {
	// This is known at compile-time, but we also want a runtime check
	const expectedScopeId = parseSingleScopeId(expected);
	const claimedScopeId = parseSingleScopeId(claimed);
	if (expectedScopeId && claimedScopeId) {
		return (
			matchScopeIdProperty(expectedScopeId, claimedScopeId, 'communityId') &&
			matchScopeIdProperty(expectedScopeId, claimedScopeId, 'collectionId') &&
			matchScopeIdProperty(expectedScopeId, claimedScopeId, 'pubId')
		);
	}
	return false;
};
