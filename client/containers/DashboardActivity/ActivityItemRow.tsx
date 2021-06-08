import React from 'react';
import TimeAgo from 'react-timeago';

import { timeAgoBaseProps } from 'utils/dates';
import { Icon } from 'client/components';
import { RenderedActivityItem } from 'client/utils/activity/types';

require('./activityItemRow.scss');

type Props = {
	item: RenderedActivityItem;
};

const ActivityItemRow = (props: Props) => {
	const {
		item: { message, timestamp, icon },
	} = props;
	return (
		<div className="activity-item-row-component">
			<div className="timestamp">
				<TimeAgo {...timeAgoBaseProps} date={timestamp} />
			</div>
			<div className="icon">
				<Icon icon={icon} />
			</div>
			<div className="message">{message}</div>
		</div>
	);
};

export default ActivityItemRow;
