import * as types from 'types';
import { ThreadComment, includeUserModel, Commenter } from 'server/models';
import { PubPubError } from 'server/utils/errors';
import { assert } from 'utils/assert';
import { createCommenter, getCommenterById } from '../commenter/queries';

type CreateThreadCommentOptions = {
	text: string;
	content: types.DocJson;
	threadId: string;
	userId?: string;
	commenter?: types.Commenter;
};

const findThreadCommentWithUserOrCommenter = (
	threadCommentId: string,
): Promise<types.DefinitelyHas<types.ThreadComment, 'user' | 'commenter'>> => {
	return ThreadComment.findOne({
		where: { id: threadCommentId },
		include: [includeUserModel({ as: 'author' }), { model: Commenter, as: 'commenter' }],
	});
};

const resolveAuthorId = async (
	options: Pick<CreateThreadCommentOptions, 'userId' | 'commenter'>,
): Promise<{ userId: string } | { commenterId: string }> => {
	const { userId, commenter } = options;
	if (userId) {
		return { userId };
	}
	if (commenter) {
		// Although we have a types.Commenter here, it may exist only on the client up to this
		// point. Let's check to see whether it exists in the DB.
		const existingCommenter = await getCommenterById(commenter.id);
		if (existingCommenter) {
			assert(existingCommenter.id === commenter.id);
			return { commenterId: existingCommenter.id };
		}
		// SIDE EFFECT: Make sure we have an actual Commenter model in the DB before we try
		// associating any ThreadComments with this ID.
		const newCommenter = await createCommenter(commenter);
		assert(newCommenter.id === commenter.id);
		return { commenterId: newCommenter.id };
	}
	throw new PubPubError.MissingIdentifierError('ThreadComment author not specified');
};

export const createThreadComment = async (options: CreateThreadCommentOptions) => {
	const { text, content, threadId, commenter, userId } = options;

	const authorId = await resolveAuthorId({ userId, commenter });
	const threadComment = await ThreadComment.create({
		text,
		content,
		threadId,
		...authorId,
	});

	// Send it back with the associated User or Commenter
	return findThreadCommentWithUserOrCommenter(threadComment.id);
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
