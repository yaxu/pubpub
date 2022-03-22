import {
	DefinitelyHas,
	DocJson,
	Pub,
	SubmissionStatus,
	SubmissionWorkflowCustomStatus,
} from 'types';

export type PubWithSubmission = DefinitelyHas<Pub, 'submission'>;

export type SubmissionStatusDescriptor =
	| { status: Exclude<SubmissionStatus, 'pending'> }
	| { status: 'pending'; customStatus?: SubmissionWorkflowCustomStatus };

export type SendEmailAboutSubmissionOptions = {
	skipEmail?: boolean;
	customEmailText?: DocJson;
};
