/* global describe, it, expect, beforeAll, afterAll */
import { ActivityItem, UserNotification } from 'server/models';
import { createThreadComment } from 'server/threadComment/queries';
import { finishDeferredTasks } from 'server/utils/deferred';
import { modelize, setup, teardown } from 'stubstub';

const models = modelize`
    User rando {}
    User chattyUser {}
    Community {
        Member {
            permissions: "admin"
            User communityAdmin {}
        }
        Pub pub {
            Member {
                permissions: "manage"
                user: chattyUser
            }
            Member {
                permissions: "view"
                User pubSubscriber {}
            }
            Member {
                permissions: "view"
                User sickOfThisThreadUser {} 
            }
            UserSubscription {
                user: pubSubscriber
            }
            UserSubscription {
                user: sickOfThisThreadUser
            }
            Discussion membersDiscussion {
                number: 0
                author: chattyUser
                Visibility {
                    access: "members"
                }
                Thread membersThread {
                    UserSubscription {
                        user: chattyUser
                    }
                    UserSubscription {
                        user: communityAdmin
                    }
                    UserSubscription {
                        user: sickOfThisThreadUser
                        muted: true
                    }
                }
            }
            Discussion publicDiscussion {
                number: 1
                author: chattyUser
                Visibility {
                    access: "public"
                }
                Thread publicThread {
                    UserSubscription {
                        user: rando
                    }
                }
            }
        }
    }
`;

setup(beforeAll, models.resolve);
teardown(afterAll);

describe('UserNotifications created when ActivityItems are created', () => {
	it('creates the right notifications for a members-only discussion ThreadComment', async () => {
		const {
			membersThread,
			chattyUser,
			rando,
			communityAdmin,
			pubSubscriber,
			sickOfThisThreadUser,
			pub,
		} = models;
		const threadComment = await createThreadComment(
			{
				text: 'Hello members',
				threadId: membersThread.id,
			},
			chattyUser,
		);
		await finishDeferredTasks();
		const activityItem = await ActivityItem.findOne({
			where: { pubId: pub.id, kind: 'pub-discussion-comment-added' },
			order: [['createdAt', 'DESC']],
		});
		expect(activityItem.toJSON()).toMatchObject({
			payload: { threadId: membersThread.id, threadComment: { id: threadComment.id } },
		});
		expect(
			await Promise.all(
				[
					// Does not create a UserNotification for an un-permissioned user somehow subscribed to a thread
					rando,
					// Creates a UserNotification for a permissioned user subscribed to a thread
					communityAdmin,
					// Creates a UserNotification for a user subscribed to a Pub
					pubSubscriber,
					// Does not create a UserNotification when a muted thread subscription overrides a Pub subscription
					sickOfThisThreadUser,
					// Does not create a UserNotification for one's own ThreadComment
					chattyUser,
				].map((user) =>
					UserNotification.count({
						where: { userId: user.id, activityItemId: activityItem.id },
					}),
				),
			),
		).toEqual([0, 1, 1, 0, 0]);
	});

	it('creates the right notifications for a public discussion ThreadComment', async () => {
		const { chattyUser, rando, pubSubscriber, publicThread, pub } = models;
		const threadComment = await createThreadComment(
			{
				text: 'Hello world',
				threadId: publicThread.id,
			},
			chattyUser,
		);
		await finishDeferredTasks();
		const activityItem = await ActivityItem.findOne({
			where: { pubId: pub.id, kind: 'pub-discussion-comment-added' },
			order: [['createdAt', 'DESC']],
		});
		expect(activityItem.toJSON()).toMatchObject({
			payload: { threadId: publicThread.id, threadComment: { id: threadComment.id } },
		});
		expect(
			await Promise.all(
				[
					// Creates a UserNotification for an un-permissioned user subscribed to a thread
					rando,
					// Creates a UserNotification for a user subscribed to a Pub
					pubSubscriber,
					// Does not create a UserNotification for one's own ThreadComment
					chattyUser,
				].map((user) =>
					UserNotification.count({
						where: { userId: user.id, activityItemId: activityItem.id },
					}),
				),
			),
		).toEqual([1, 1, 0]);
	});
});
