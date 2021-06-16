import Bluebird from 'bluebird';

import * as types from 'types';
import { UserSubscription } from 'server/models';
import { canUserSeeThread } from 'server/thread/queries';

import {
	createUserSubscription,
	destroyUserSubscription,
	findUserSubscription,
} from '../shared/queries';

type QueryOptions = {
	userId: string;
	threadId: string;
};

type CreateOptions = QueryOptions & {
	createdAutomatically: boolean;
	muted?: boolean;
};

export const createUserThreadSubscription = async (
	options: CreateOptions,
): Promise<null | types.UserSubscription> => {
	const { userId, threadId, createdAutomatically, muted = false } = options;
	if (await canUserSeeThread(options)) {
		const existing = await findUserSubscription({ userId, threadId });
		if (existing) {
			return existing;
		}
		return createUserSubscription({ userId, threadId, createdAutomatically, muted });
	}
	return null;
};

export const updateUserThreadSubscriptions = async (threadId: string) => {
	await Bluebird.map(
		await UserSubscription.findAll({
			where: { threadId },
		}),
		async (subscription: types.UserSubscription) => {
			if (typeof subscription.threadId === 'string') {
				const canSubscribe = await canUserSeeThread({
					threadId: subscription.threadId,
					userId: subscription.userId,
				});
				if (!canSubscribe) {
					await destroyUserSubscription({ id: subscription.id });
				}
			}
		},
		{ concurrency: 5 },
	);
};
