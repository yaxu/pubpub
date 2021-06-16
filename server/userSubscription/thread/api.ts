import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { muteUserSubscription } from '../shared/queries';
import { createUserThreadSubscription } from './queries';

const unwrapRequest = (req: any) => {
	return {
		threadId: req.body.threadId as string,
		userId: req.user?.id as string,
		muted: (req.body.muted || false) as boolean,
	};
};

app.post(
	'/api/threads/subscriptions',
	wrap(async (req, res) => {
		const { threadId, userId, muted } = unwrapRequest(req);
		const result = await createUserThreadSubscription({
			threadId,
			userId,
			muted,
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
		const { threadId, userId, muted } = unwrapRequest(req);
		await muteUserSubscription({ threadId, userId, muted });
		return res.status(200).json({});
	}),
);
