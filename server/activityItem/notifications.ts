import { Op } from 'sequelize';

import * as types from 'types';
import { UserNotification, UserSubscription } from 'server/models';
import { indexByProperty, splitArrayOn } from 'utils/arrays';
import { filterUsersWhoCanSeeThread } from 'server/thread/queries';

type ActivityItemResponder<Kind extends types.ActivityItemKind> = (
	item: types.ActivityItem & { kind: Kind },
) => Promise<void>;

const notifyForDiscussionComment: ActivityItemResponder<'pub-discussion-comment-added'> = async (
	item,
) => {
	const {
		actorId,
		pubId,
		payload: { threadId },
	} = item;

	const subscriptions: types.UserSubscription[] = await UserSubscription.findAll({
		where: { [Op.or]: [{ threadId }, { pubId }], userId: { [Op.not]: actorId } },
	});

	const [mutedThreadSubscriptions, unmutedThreadSubscriptions] = splitArrayOn(
		subscriptions.filter((sub) => !!sub.threadId),
		(s) => s.muted,
	);

	const unmutedPubSubscriptionsNotSupersededByThreadMute = subscriptions.filter(
		(sub) =>
			sub.pubId &&
			!sub.muted &&
			!mutedThreadSubscriptions.some((mutedSub) => mutedSub.userId === sub.userId),
	);

	const subscriptionsThatMayProduceNotifications = [
		...unmutedThreadSubscriptions,
		...unmutedPubSubscriptionsNotSupersededByThreadMute,
	];
	const indexedSubscriptionsByUserId = indexByProperty(
		subscriptionsThatMayProduceNotifications,
		'userId',
	);

	const userIdsToNotifty = await filterUsersWhoCanSeeThread({
		threadId,
		userIds: subscriptionsThatMayProduceNotifications.map((sub) => sub.userId),
	});

	await UserNotification.bulkCreate(
		userIdsToNotifty.map((userId) => {
			return {
				userId,
				userSubscriptionId: indexedSubscriptionsByUserId[userId].id,
				activityItemId: item.id,
			};
		}),
	);
};

const notificationCreatorsByKind: Partial<
	{ [Kind in types.ActivityItemKind]: ActivityItemResponder<Kind> }
> = {
	'pub-discussion-comment-added': notifyForDiscussionComment,
};

export const getNotificationTask = (item: types.ActivityItem) => {
	const creator = notificationCreatorsByKind[item.kind] as ActivityItemResponder<any>;
	if (creator) {
		return () => creator(item);
	}
	return null;
};
