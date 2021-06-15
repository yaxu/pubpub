import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

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

app.put(
	'/api/userNotifications',
	wrap(async (req, res) => {
		const { userId, userNotificationId } = unwrapRequest(req);
		if (await canUserManipulateNotification({ userId, userNotificationId })) {
		}
	}),
);
