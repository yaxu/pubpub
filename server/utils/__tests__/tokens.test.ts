import MockDate from 'mockdate';

import { issueToken, verifyAndDecodeToken } from '../tokens';

let time = Date.now();

const advanceTime = (dt) => {
	time += dt;
	MockDate.set(time);
};

beforeAll(() => {
	MockDate.set(time);
});

afterAll(() => {
	MockDate.reset();
});

it('creates a valid JWT that can be decoded later', () => {
	const token = issueToken({
		userId: 'me',
		scope: { communityId: 'us' },
		type: 'test_token',
		expiresIn: '1hr',
		payload: { number: 35 },
	});
	const decoded = verifyAndDecodeToken(token, {
		userId: 'me',
		scope: { communityId: 'us' },
		type: 'test_token',
	});
	expect(decoded.payload.number).toEqual(35);
});

it('refuses to create a JWT without required values', () => {
	expect(() =>
		issueToken({
			userId: undefined as any,
			scope: { communityId: 'us' },
			type: 'test_token',
			expiresIn: '1hr',
			payload: { number: 35 },
		}),
	).toThrow();
	expect(() =>
		issueToken({
			userId: 'me',
			type: 'test_token',
			expiresIn: '1hr',
			scope: {} as any,
			payload: { number: 36 },
		}),
	).toThrow();
	expect(() =>
		issueToken({
			userId: 'me',
			scope: { communityId: 'us' },
			expiresIn: '1hr',
			payload: { number: 37 },
			type: undefined as any,
		}),
	).toThrow();
	expect(() =>
		issueToken({
			userId: 'me',
			scope: { communityId: 'us' },
			type: 'test_token',
			payload: { number: 38 },
			expiresIn: undefined as any,
		}),
	).toThrow();
});

it('guards decoded values with an assertion of matching type, scope, and userId', () => {
	const token = issueToken({
		userId: 'me',
		scope: { communityId: 'us' },
		type: 'test_token',
		expiresIn: '1hr',
		payload: { number: 35 },
	});
	expect(
		verifyAndDecodeToken(token, {
			userId: 'someone_else',
			scope: { communityId: 'us' },
			type: 'test_token',
		}),
	).toEqual(null);
	expect(
		verifyAndDecodeToken(token, {
			userId: 'me',
			scope: { communityId: 'them' },
			type: 'test_token',
		}),
	).toEqual(null);
	expect(
		verifyAndDecodeToken(token, {
			userId: 'me',
			scope: { pubId: 'us' },
			type: 'test_token',
		}),
	).toEqual(null);
	expect(
		verifyAndDecodeToken(token, {
			userId: 'me',
			scope: { communityId: 'us' },
			type: 'another_token',
		}),
	).toEqual(null);
});

it('correctly expires tokens', () => {
	const expiresInSeconds = 60 * 30;
	const token = issueToken({
		userId: 'me',
		scope: { communityId: 'us' },
		type: 'test_token',
		expiresIn: expiresInSeconds,
		payload: { number: 35 },
	});
	const decodedNow = verifyAndDecodeToken(token, {
		userId: 'me',
		scope: { communityId: 'us' },
		type: 'test_token',
	});
	expect(decodedNow.payload.number).toEqual(35);
	advanceTime(1000 * expiresInSeconds + 1);
	const decodedLater = verifyAndDecodeToken(token, {
		userId: 'me',
		scope: { communityId: 'us' },
		type: 'test_token',
	});
	expect(decodedLater).toEqual(null);
});
