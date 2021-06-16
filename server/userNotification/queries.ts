import { Op } from 'sequelize';

import * as types from 'types';
import { ActivityItem, UserNotification } from 'server/models';

type GetOptions = {
	userId: string;
	offset?: number;
	limit?: number;
};

type CreateOptions = Pick<
	types.UserNotification,
	'activityItemId' | 'userSubscriptionId' | 'userId'
>;

type MarkReadOptions = {
	userNotificationIds: string[];
	userId: string;
	isRead: boolean;
};

type DeleteOptions = {
	userId: string;
	userNotificationIds: string[];
};

export const getUserNotifications = (
	options: GetOptions,
): Promise<types.SequelizeModel<types.UserNotification>[]> => {
	const { userId, offset = 0, limit = 50 } = options;
	return UserNotification.findAll({
		where: { userId },
		limit,
		offset,
		include: [{ model: ActivityItem, as: 'activityItem' }],
		order: [
			['isRead', 'DESC'],
			['createdAt', 'DESC'],
		],
	});
};

export const createUserNotification = async (
	options: CreateOptions,
): Promise<types.SequelizeModel<types.UserNotification>> => {
	const { activityItemId, userId, userSubscriptionId } = options;
	return UserNotification.create({ activityItemId, userId, userSubscriptionId });
};

export const markUserNotificationsRead = async (options: MarkReadOptions) => {
	const { isRead, userId, userNotificationIds } = options;
	const [updatedCount] = await UserNotification.update(
		{ isRead },
		{
			where: {
				userId,
				id: { [Op.in]: userNotificationIds },
			},
		},
	);
	return updatedCount;
};

export const deleteUserNotifications = async (options: DeleteOptions) => {
	const { userId, userNotificationIds } = options;
	const destroyedCount = await UserNotification.destroy({
		where: { userId, id: { [Op.in]: userNotificationIds } },
	});
	return destroyedCount;
};
