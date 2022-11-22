import * as types from 'types';
import { Pub, Commenter } from 'server/models';
import { issueToken } from 'server/utils/tokens';

import { getCommenterIdFromSessionId } from './ids';

export const createCommenter = (
	props: Pick<types.Commenter, 'name'> & Partial<Pick<types.Commenter, 'id'>>,
): Promise<types.Commenter> => {
	const { id, name } = props;
	return Commenter.create({
		id,
		name,
	});
};

export const getCommenterById = (id: string): Promise<null | types.Commenter> => {
	return Commenter.findOne({ where: { id } });
};

type IssueGuestCommenterTokenOptions = {
	pubId: string;
	userId: null | string;
	accessHash: null | string;
	sessionId: string;
};

export const getPubGuestCommenterInfo = async (
	options: IssueGuestCommenterTokenOptions,
): Promise<null | types.PubGuestCommenterInfo> => {
	const { pubId, userId, accessHash, sessionId } = options;
	if (pubId && accessHash && !userId && sessionId) {
		const { commentHash } = await Pub.findOne({
			where: { id: pubId },
			attributes: ['id', 'commentHash'],
		});
		if (accessHash === commentHash) {
			const commenterId = getCommenterIdFromSessionId(sessionId);
			const commenterModel = await getCommenterById(commenterId);
			const commenter = commenterModel ?? { id: commenterId };
			const commenterToken = issueToken({
				type: 'guest-commenter',
				userId: null,
				expiresIn: '24hr',
				scope: { pubId },
				payload: {
					canComment: true,
					commenterId,
				},
			});
			return { commenter, commenterToken };
		}
	}
	return null;
};
