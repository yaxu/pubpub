import { ThreadComment, includeUserModel, Commenter } from 'server/models';
import * as types from 'types';
import { createCommenter } from '../commenter/queries';

const findThreadCommentWithUserOrCommenter = (threadCommentId: string) => {
	return ThreadComment.findOne({
		where: { id: threadCommentId },
		include: [includeUserModel({ as: 'author' }), { model: Commenter, as: 'commenter' }],
	});
};

export type CreateThreadWithCommentOptions = {
	text: string;
	content: types.DocJson;
	userId: null | string;
	commenterName: null | string;
};

export const createThreadCommentWithUserOrCommenter = async (
	options: CreateThreadWithCommentOptions,
	threadId: string,
) => {
	const { text, content, userId, commenterName } = options;
	const newCommenter = commenterName && (await createCommenter({ name: commenterName }));
	const userIdOrCommenterId = newCommenter ? { commenterId: newCommenter.id } : { userId };
	const commenter = newCommenter && 'id' in newCommenter ? newCommenter : null;
	const threadComment = await ThreadComment.create({
		text,
		content,
		threadId,
		...userIdOrCommenterId,
	});

	return { threadCommentId: threadComment.id, commenterId: commenter?.id };
};

export type CreateThreadOptions = {
	text: string;
	content: types.DocJson;
	threadId: string;
	userId?: string;
	commenterId?: string;
};

export const createThreadComment = async (options: CreateThreadOptions) => {
	const { text, content, commenterId, threadId, userId } = options;

	const user = userId || null;
	const commenter = commenterId || null;

	const { threadCommentId } = await createThreadCommentWithUserOrCommenter(
		{ text, content, userId: user, commenterName: commenter },
		threadId,
	);

	const threadCommentWithUser = await findThreadCommentWithUserOrCommenter(threadCommentId);
	return threadCommentWithUser;
};

export const updateThreadComment = (inputValues, updatePermissions) => {
	// Filter to only allow certain fields to be updated
	const filteredValues = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});
	return ThreadComment.update(filteredValues, {
		where: { id: inputValues.threadCommentId },
	}).then(() => {
		return {
			...filteredValues,
			id: inputValues.threadCommentId,
		};
	});
};
