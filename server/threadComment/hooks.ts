import * as types from 'types';
import { ThreadComment } from 'server/models';
import { createUserThreadSubscription } from 'server/userSubscription/queries';
import { defer } from 'server/utils/deferred';
import { getParentModelForThread } from 'server/thread/queries';
import { createPubDiscussionCommentAddedActivityItem } from 'server/activityItem/queries';

const createActivityItems = async (threadComment: types.ThreadComment) => {
	const parent = await getParentModelForThread(threadComment.threadId);
	if (parent) {
		const numberOfCommentsInThread = await ThreadComment.count({
			where: { threadId: threadComment.threadId },
		});
		const isReply = numberOfCommentsInThread > 1;
		if (parent.type === 'discussion') {
			const { value: discussion } = parent;
			await createPubDiscussionCommentAddedActivityItem(
				discussion.id,
				threadComment.id,
				isReply,
			);
		}
	}
};

ThreadComment.afterCreate(async (threadComment: types.ThreadComment) => {
	await createUserThreadSubscription({
		userId: threadComment.userId,
		threadId: threadComment.threadId,
		createdAutomatically: true,
	});
	defer(() => createActivityItems(threadComment));
});
