import { useCallback, useMemo, useState } from 'react';

import { managerStatuses, SubmissionWorkflow } from 'types';
import { apiFetch } from 'client/utils/apiFetch';

import { movePub, MovePubOptions, getInitialState } from './state';
import {
	PubWithSubmission,
	SendEmailAboutSubmissionOptions,
	SubmissionStatusDescriptor,
} from './types';
import { getStatusKey } from './statuses';

type Options = {
	initialPubs: PubWithSubmission[];
	submissionWorkflow: SubmissionWorkflow;
};

export const useSubmissionsManager = (options: Options) => {
	const { initialPubs, submissionWorkflow } = options;

	const statuses: SubmissionStatusDescriptor[] = useMemo(() => {
		const { customStatuses = [] } = submissionWorkflow;
		return [
			...managerStatuses.map((status) => ({ status })),
			...customStatuses.map((customStatus) => ({ status: 'pending' as const, customStatus })),
		];
	}, [submissionWorkflow]);

	const [pubsState, setPubsState] = useState(() =>
		getInitialState({ initialPubs, submissionWorkflow, statuses }),
	);

	const { pubsByStatus, statusesByKey } = useMemo(() => {
		return {
			pubsByStatus: statuses.map((status) => {
				const key = getStatusKey(status);
				return { status, pubs: pubsState[key] };
			}),
			statusesByKey: statuses.reduce((byKey, status) => {
				return {
					...byKey,
					[getStatusKey(status)]: status,
				};
			}, {} as Record<string, SubmissionStatusDescriptor>),
		};
	}, [statuses, pubsState]);

	const statefulMovePub = useCallback(
		(moveOptions: MovePubOptions & SendEmailAboutSubmissionOptions) => {
			const { state, updateSubmission } = movePub(pubsState, moveOptions);
			setPubsState(state);
			if (updateSubmission) {
				const { skipEmail, customEmailText } = moveOptions;
				const { id, rank, status } = updateSubmission;
				apiFetch.put('/api/submissions', { id, rank, status, skipEmail, customEmailText });
			}
		},
		[pubsState],
	);

	const handleMovePub = useCallback(
		(moveOptions: MovePubOptions) => {
			const { sourceStatus, destinationStatus, index, pubId } = moveOptions;

			const moveAction = (emailOptions?: SendEmailAboutSubmissionOptions) =>
				statefulMovePub({
					sourceStatus,
					destinationStatus,
					index,
					pubId,
					skipEmail: true,
					...emailOptions,
				});

			const mustConfirmMove = [sourceStatus, destinationStatus].some(
				({ status }) => status === 'accepted' || status === 'declined',
			);

			// if (mustConfirmMove) {
			//     return {

			//     }
			// }

			moveAction();
		},
		[statefulMovePub],
	);

	return { handleMovePub, pubsByStatus, statusesByKey };
};
