import * as types from 'types';
import { ActivityItem } from 'server/models';
import { defer } from 'server/utils/deferred';

import { getNotificationTask } from './notifications';

ActivityItem.afterCreate((item: types.ActivityItem) => {
	const notify = getNotificationTask(item);
	if (notify) {
		defer(notify);
	}
});
