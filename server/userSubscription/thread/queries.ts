import Bluebird from 'bluebird';

import * as types from 'types';
import { DefinitelyHas } from 'types';
import { Discussion, ReviewNew, UserSubscription, Visibility } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';

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
};

const canUserSubscribeToThread = async (options: QueryOptions): Promise<boolean> => {
	const { userId, threadId } = options;
	const [parentDiscussion, parentReview]: [
		null | DefinitelyHas<types.Discussion, 'visibility'>,
		null | DefinitelyHas<types.Review, 'visibility'>,
	] = await Promise.all([
		Discussion.findOne({
			where: { threadId },
			include: [{ model: Visibility, as: 'visibility' }],
		}),
		ReviewNew.findOne({
			where: { threadId },
			include: [{ model: Visibility, as: 'visibility' }],
		}),
	]);
	const parentItem = parentDiscussion || parentReview;
	if (parentItem) {
		const {
			visibility: { access },
		} = parentItem;
		if (access === 'public') {
			return true;
		}
		if (access === 'private') {
			return false;
		}
		if (access === 'members') {
			const scopeData = await getScope({ loginId: userId, pubId: parentItem.pubId });
			return scopeData.activePermissions.canView;
		}
	}
	return false;
};

export const createUserThreadSubscription = async (
	options: CreateOptions,
): Promise<null | types.UserSubscription> => {
	const { userId, threadId, createdAutomatically } = options;
	if (await canUserSubscribeToThread(options)) {
		const existing = await findUserSubscription({ userId, threadId });
		if (existing) {
			return existing;
		}
		return createUserSubscription({ userId, threadId, createdAutomatically });
	}
	return null;
};

export const updateUserThreadSubscriptions = async (threadId: string) => {
	await Bluebird.map(
		await UserSubscription.findAll({
			where: { threadId },
		}),
		async (subscription: types.UserSubscription) => {
			if ('threadId' in subscription && subscription.threadId) {
				const canSubscribe = await canUserSubscribeToThread(subscription);
				if (!canSubscribe) {
					await destroyUserSubscription({ id: subscription.id });
				}
			}
		},
		{ concurrency: 5 },
	);
};
