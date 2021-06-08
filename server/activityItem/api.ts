import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';
import { getScope } from 'server/utils/queryHelpers';
import { Scope } from 'types';

import { fetchActivityItems } from './fetch';

const unwrapRequest = (req) => {
	const { body, user } = req;
	const { scope, offset } = body;
	return {
		scope: scope as Scope,
		userId: user?.id ?? null,
		offset: parseInt(offset, 10),
	};
};

app.post(
	'/api/activityItems',
	wrap(async (req, res) => {
		const { scope, offset, userId } = unwrapRequest(req);
		const {
			activePermissions: { canView },
		} = await getScope({ loginId: userId, ...scope });

		if (!canView) {
			throw new ForbiddenError();
		}

		const result = await fetchActivityItems({ offset, scope });
		res.status(200).json(result);
	}),
);
