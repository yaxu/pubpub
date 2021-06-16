import * as types from 'types';
import { ThreadComment } from 'server/models';
import { createUserThreadSubscription } from 'server/userSubscription/queries';
import { defer } from 'server/utils/deferred';
import { getParentModelForThread } from 'server/thread/queries';
import {
	createPubDiscussionCommentAddedActivityItem,
	createPubReviewCommentAddedActivityItem,
} from 'server/activityItem/queries';

const createActivityItems = async (threadComment: types.ThreadComment) => {
	const parent = await getParentModelForThread(threadComment.threadId);
	if (parent) {
		if (parent.type === 'discussion') {
			const { value: discussion } = parent;
			const numberOfCommentsInThread = await ThreadComment.count({
				where: { threadId: threadComment.threadId },
			});
			const isReply = numberOfCommentsInThread > 1;
			await createPubDiscussionCommentAddedActivityItem(
				discussion.id,
				threadComment.id,
				isReply,
			);
		}
		if (parent.type === 'review') {
			const { value: review } = parent;
			await createPubReviewCommentAddedActivityItem(review.id, threadComment.id);
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
