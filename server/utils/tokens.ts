import jwt from 'jsonwebtoken';

import { JSON, ScopeId, SingleScopeId } from 'types';
import { matchScopeIds, parseSingleScopeId } from 'utils/scopeIds';

type IssueTokenOptions = {
	userId: null | string;
	scope: SingleScopeId;
	type: string;
	payload: JSON;
	expiresIn: string | number;
};

export const issueToken = (options: IssueTokenOptions): string => {
	const { userId, scope, type, payload, expiresIn } = options;
	const parsedScope = parseSingleScopeId(scope);
	if (!parsedScope) {
		throw new Error(`Refusing to create JWT with invalid scope ${JSON.stringify(scope)}`);
	}
	if (!(type && expiresIn)) {
		throw new Error('Refusing to create JWT without type and expiresIn');
	}
	if (!userId && userId !== null) {
		throw new Error(`userId must be string or null`);
	}
	return jwt.sign({ userId, scope: parsedScope, type, payload }, process.env.JWT_SIGNING_SECRET, {
		expiresIn,
	});
};

type VerifyAndDecodeTokenOptions = {
	userId: null | string;
	scope: SingleScopeId;
	type: string;
};

export const verifyAndDecodeToken = (token: string, options: VerifyAndDecodeTokenOptions) => {
	const { userId, scope, type } = options;
	try {
		jwt.verify(token, process.env.JWT_SIGNING_SECRET);
	} catch (_) {
		return null;
	}
	const decodedValue = jwt.decode(token);
	const { userId: claimedUserId, scope: claimedScope, type: claimedType } = decodedValue;
	if (claimedUserId === userId && matchScopeIds(scope, claimedScope) && claimedType === type) {
		return decodedValue;
	}
	return null;
};
