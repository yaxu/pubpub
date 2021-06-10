import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { createUserThreadSubscription, muteUserThreadSubscription } from './queries';

const unwrapRequest = (req: any) => {
	return {
		threadId: req.body.threadId as string,
		userId: req.user?.id as string,
	};
};

const unwrapPutRequest = (req: any) => {
	return {
		...unwrapRequest(req),
		muted: req.body.muted as boolean,
	};
};

app.post(
	'/api/threads/subscriptions',
	wrap(async (req, res) => {
		const { threadId, userId } = unwrapRequest(req);
		const result = await createUserThreadSubscription({
			threadId,
			userId,
			createdAutomatically: false,
		});
		if (result) {
			return res.status(200).json(result);
		}
		throw new ForbiddenError();
	}),
);

app.put(
	'/api/threads/subscriptions',
	wrap(async (req, res) => {
		const { threadId, userId, muted } = unwrapPutRequest(req);
		await muteUserThreadSubscription({ threadId, userId, muted });
		return res.status(200).json({});
	}),
);
