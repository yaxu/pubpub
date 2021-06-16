import * as types from 'types';
import { UserNotification } from 'server/models';

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
	userNotificationId: string;
	isRead: boolean;
};

export const getUserNotifications = (
	options: GetOptions,
): Promise<types.SequelizeModel<types.UserNotification>[]> => {
	const { userId, offset = 0, limit = 50 } = options;
	return UserNotification.findAll({
		where: { userId },
		limit,
		offset,
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

export const markUserNotificationRead = async (options: MarkReadOptions) => {
	const { isRead, userNotificationId } = options;
	await UserNotification.update({ isRead }, { where: { id: userNotificationId } });
};

export const deleteUserNotification = async (userNotificationId: string) => {
	await UserNotification.destroy({ where: { id: userNotificationId } });
};

export const markAllNotificationsReadForUser = async (userId: string) => {
	await UserNotification.update({isRead: true},{ where: { userId } });
};

export const deleteAllNotificationsForUser = async (userId: string) => {
	await UserNotification.destroy({ where: { userId } });
};
