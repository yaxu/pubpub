import Bluebird from 'bluebird';

import * as types from 'types';
import { DefinitelyHas } from 'types';
import { Discussion, ReviewNew, UserThreadSubscription, Visibility } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';

type QueryOptions = {
	userId: string;
	threadId: string;
};

type CreateOptions = QueryOptions & {
	createdAutomatically: boolean;
};

type MuteOptions = QueryOptions & {
	muted: boolean;
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
): Promise<null | types.UserThreadSubscription> => {
	const { userId, threadId, createdAutomatically } = options;
	if (await canUserSubscribeToThread(options)) {
		const existing = await UserThreadSubscription.findOne({ where: { userId, threadId } });
		if (existing) {
			return existing;
		}
		return UserThreadSubscription.create({ userId, threadId, createdAutomatically });
	}
	return null;
};

export const muteUserThreadSubscription = async (options: MuteOptions) => {
	const { userId, threadId, muted } = options;
	await UserThreadSubscription.update({ muted }, { where: { userId, threadId } });
};

export const destroyUserThreadSubscription = async (options: QueryOptions) => {
	const { userId, threadId } = options;
	await UserThreadSubscription.destroy({ where: { userId, threadId } });
};

export const updateUserThreadSubscriptions = async (threadId: string) => {
	await Bluebird.map(
		await UserThreadSubscription.findAll({
			where: { threadId },
		}),
		async (subscription: types.UserThreadSubscription) => {
			const canSubscribe = await canUserSubscribeToThread(subscription);
			if (!canSubscribe) {
				await destroyUserThreadSubscription(subscription);
			}
		},
		{ concurrency: 5 },
	);
};
