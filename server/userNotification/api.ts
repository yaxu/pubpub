import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import {
	deleteAllNotificationsForUser,
	deleteUserNotification,
	markAllNotificationsReadForUser,
	markUserNotificationRead,
} from './queries';
import { canUserManipulateNotification } from './permissions';

const unwrapRequest = (req: any) => {
	return {
		userId: req.user?.id as string,
		userNotificationId: req.body.userNotificationId as string,
	};
};

const unwrapMarkReadRequest = (req: any) => {
	return {
		...unwrapRequest(req),
		isRead: req.body.isRead as boolean,
	};
};

const unwrapBulkRequest = (req: any) => {
	return {
		userId: req.user?.id as string,
	};
};

app.put(
	'/api/userNotifications',
	wrap(async (req, res) => {
		const { userId, userNotificationId, isRead } = unwrapMarkReadRequest(req);
		if (await canUserManipulateNotification({ userId, userNotificationId })) {
			await markUserNotificationRead({ userNotificationId, isRead });
			res.status(200).json({});
		}
		throw new ForbiddenError();
	}),
);

app.delete(
	'/api/userNotifications',
	wrap(async (req, res) => {
		const { userId, userNotificationId } = unwrapRequest(req);
		if (await canUserManipulateNotification({ userId, userNotificationId })) {
			await deleteUserNotification(userNotificationId);
			res.status(200).json({});
		}
		throw new ForbiddenError();
	}),
);

app.put(
	'/api/userNotifications/bulk',
	wrap(async (req, res) => {
		const { userId } = unwrapBulkRequest(req);
		await markAllNotificationsReadForUser(userId);
		res.status(200).json({});
	}),
);

app.delete(
	'/api/userNotifications/bulk',
	wrap(async (req, res) => {
		const { userId } = unwrapBulkRequest(req);
		await deleteAllNotificationsForUser(userId);
		res.status(200).json({});
	}),
);
