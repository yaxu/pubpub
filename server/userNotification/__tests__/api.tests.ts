/* global describe, it, expect, beforeAll, afterAll */
import { modelize, login, setup, teardown } from 'stubstub';

const models = `
    User user {}

    Community community {
        Pub {
            Discussion {
                number: 1
                author: user
                visibility: public
                thread: thread
            }
        }
    }

    ActivityItem activityItem1 {
        community: community
        kind: 'pub-thread-comment-added'
    }

    ActivityItem activityItem2 {
        community: community
        kind: 'pub-thread-comment-added'
    }

    ActivityItem activityItem3 {
        community: community
        kind: 'pub-thread-comment-added'
    }


    Thread thread {
        UserSubscription {
            user: user
            createdAutomatically: true
            UserNotification userNotification1 {
                user: user
                activityItem: activityItem1
            }
            UserNotification userNotification2 {
                user: user
                activityItem: activityItem2
            }
            UserNotification userNotification3 {
                user: user
                activityItem: activityItem3
            }
        }
    }
`;
