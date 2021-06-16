import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import {
	deleteAllNotificationsForUser,
	deleteUserNotification,
	getUserNotifications,
	markAllNotificationsReadForUser,
	markUserNotificationRead,
} from './queries';
import { canUserManipulateNotification } from './permissions';

const unwrapGetRequest = (req: any) => {
	const { offset, limit } = req.query;
	return {
		userId: req.user?.id as string,
		offset: offset ? parseInt(offset, 10) : 0,
		limit: limit ? parseInt(limit, 10) : 50,
	};
};

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

app.get(
	'/api/userNotifications',
	wrap(async (req, res) => {
		const { userId, offset, limit } = unwrapGetRequest(req);
		const notifications = await getUserNotifications({ userId, offset, limit });
		return res.status(200).json(notifications.map((n) => n.toJSON()));
	}),
);

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
