import { Collection, DocJson } from 'types';

export type SubmissionWorkflow = {
	id: string;
	createdAt: string;
	updatedAt: string;
	enabled: boolean;
	title: string;
	introText: DocJson;
	instructionsText: DocJson;
	acceptedText: DocJson;
	declinedText: DocJson;
	emailText: DocJson;
	targetEmailAddress: string;
	collectionId: string;
	collection?: Collection;
	customStatuses: SubmissionWorkflowCustomStatus[];
};

export type SubmissionWorkflowCustomStatus = {
	id: string;
	label: string;
	rank: string;
};
