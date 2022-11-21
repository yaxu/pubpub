import { Pub } from 'server/models';
import { issueToken } from 'server/utils/tokens';

type IssueGuestCommenterTokenOptions = {
	pubId: string;
	userId: null | string;
	accessHash: null | string;
};

export const issueGuestCommenterToken = async (
	options: IssueGuestCommenterTokenOptions,
): Promise<null | string> => {
	const { pubId, userId, accessHash } = options;
	if (pubId && accessHash && !userId) {
		const { commentHash } = await Pub.findOne({
			where: { id: pubId },
			attributes: ['id', 'commentHash'],
		});
		if (accessHash === commentHash) {
			return issueToken({
				userId: null,
				expiresIn: '24hr',
				scope: { pubId },
				payload: { canComment: true },
				type: 'guest-commenter',
			});
		}
	}
	return null;
};
