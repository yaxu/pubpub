import { MemberPermission } from '../member';

import { ActivityItemBase, Diff } from './util';

type MemberActivityItemBase = ActivityItemBase & {
	payload: {
		userId: string;
	};
};

export type MemberCreated = MemberActivityItemBase & {
	kind: 'member-created';
	payload: {
		memberPermission: MemberPermission;
	};
};

export type MemberUpdatedActivityItem = MemberActivityItemBase & {
	kind: 'member-updated';
	payload: {
		memberPermission: Diff<MemberPermission>;
	};
};

export type MemberRemovedActivityItem = MemberActivityItemBase & {
	kind: 'member-removed';
};

export type MemberActivityItem =
	| MemberCreated
	| MemberUpdatedActivityItem
	| MemberRemovedActivityItem;
