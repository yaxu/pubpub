import { ActivityItem } from './activity';
import { User } from './attribution';
import { UserSubscription } from './userSubscription';

export type UserNotification = {
	id: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	userSubscriptionId: string;
	activityItemId: string;
	isRead: boolean;
	user?: User;
	activityItem?: ActivityItem;
	userSubscription?: UserSubscription;
};
