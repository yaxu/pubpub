import { SubmissionStatus, SubmissionWorkflow } from 'types';
import { findRankInRankedList, sortByRank } from 'utils/rank';

import { PubWithSubmission, SubmissionStatusDescriptor } from './types';
import { getStatusKey, getSubmissionStatusDescriptor } from './statuses';

export type PubsState = Record<string, PubWithSubmission[]>;

export type MovePubOptions = {
	sourceStatus: SubmissionStatusDescriptor;
	destinationStatus: SubmissionStatusDescriptor;
	pubId: string;
	index: number;
};

export type RemovePubOptions = {
	status: SubmissionStatusDescriptor;
	pubId: string;
};

export type UpdatePubOptions = {
	status: SubmissionStatusDescriptor;
	pubId: string;
	update: (pub: PubWithSubmission) => PubWithSubmission;
};

export type GetInitialStateOptions = {
	initialPubs: PubWithSubmission[];
	statuses: SubmissionStatusDescriptor[];
	submissionWorkflow: SubmissionWorkflow;
};

const pubRankKey = (pub: PubWithSubmission) => pub.submission.rank;

export const movePub = (
	state: PubsState,
	options: MovePubOptions,
): {
	state: PubsState;
	updateSubmission?: { id: string; rank: string; status?: SubmissionStatus };
} => {
	const { sourceStatus, destinationStatus, index, pubId } = options;
	const sourceKey = getStatusKey(sourceStatus);
	const destinationKey = getStatusKey(destinationStatus);
	const pub = state[sourceKey].find((p) => p.id === pubId);
	if (pub) {
		const rank = findRankInRankedList(state[destinationKey], index, pubRankKey);
		const updatedPub = {
			...pub,
			submission: {
				...pub.submission,
				rank,
			},
		};
		const nextSource = state[sourceKey].filter((p) => p.id !== pubId);
		if (sourceKey === destinationKey) {
			nextSource.splice(index, 0, updatedPub);
			return {
				state: {
					...state,
					[sourceKey]: nextSource,
				},
				updateSubmission: {
					id: updatedPub.submission.id,
					rank,
				},
			};
		}
		const nextDestination = [...state[destinationKey]];
		nextDestination.splice(index, 0, pub);
		return {
			state: {
				...state,
				[sourceKey]: nextSource,
				[destinationKey]: nextDestination,
			},
			updateSubmission: {
				id: updatedPub.submission.id,
				status: destinationStatus.status,
				rank,
			},
		};
	}
	return { state };
};

export const removePub = (state: PubsState, options: RemovePubOptions): PubsState => {
	const { status, pubId } = options;
	const statusKey = getStatusKey(status);
	const nextStatusPubs = state[statusKey].filter((p) => p.id !== pubId);
	return {
		...state,
		[statusKey]: nextStatusPubs,
	};
};

export const updatePub = (state: PubsState, options: UpdatePubOptions) => {
	const { status, pubId, update } = options;
	const statusKey = getStatusKey(status);
	const nextStatusPubs = state[statusKey].map((p) => {
		if (p.id === pubId) {
			return update(p);
		}
		return p;
	});
	return {
		...state,
		[statusKey]: nextStatusPubs,
	};
};

export const getInitialState = (options: GetInitialStateOptions): PubsState => {
	const { initialPubs, statuses, submissionWorkflow } = options;
	const state = {} as PubsState;
	const pubsByRank = sortByRank(initialPubs, pubRankKey);
	statuses.forEach((status) => {
		const key = getStatusKey(status);
		state[key] = [];
	});
	pubsByRank.forEach((pub) => {
		const status = getSubmissionStatusDescriptor(pub.submission, submissionWorkflow);
		const key = getStatusKey(status);
		state[key].push(pub);
	});
	return state;
};
