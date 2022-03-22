import { Submission, SubmissionWorkflow } from 'types';
import { capitalize } from 'utils/strings';

import { SubmissionStatusDescriptor } from './types';

export const getSubmissionStatusDescriptor = (
	submission: Submission,
	submissionWorkflow: SubmissionWorkflow,
): SubmissionStatusDescriptor => {
	const { status, customStatusId } = submission;
	if (status === 'pending' && customStatusId) {
		const customStatus = submissionWorkflow.customStatuses.find((s) => s.id === customStatusId);
		if (customStatus) {
			return { status, customStatus };
		}
	}
	return { status };
};

export const getStatusKey = (desc: SubmissionStatusDescriptor) => {
	if (desc.status === 'pending') {
		if (desc.customStatus) {
			return `pending__${desc.customStatus.id}`;
		}
	}
	return desc.status;
};

export const getStatusLabel = (desc: SubmissionStatusDescriptor) => {
	if (desc.status === 'pending') {
		if (desc.customStatus) {
			return desc.customStatus.label;
		}
		return 'Received';
	}
	return capitalize(desc.status);
};
