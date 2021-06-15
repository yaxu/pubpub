import { UserNotification } from 'server/models';

type CanManipulateOptions = {
	userId: string;
	userNotificationId: string;
};

export const canUserManipulateNotification = async (options: CanManipulateOptions) => {
	const { userId, userNotificationId } = options;
	const notificationsForUser = await UserNotification.count({
		where: { userId, userNotificationId },
	});
	return notificationsForUser === 1;
};
