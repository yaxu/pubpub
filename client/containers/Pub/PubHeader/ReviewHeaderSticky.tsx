import React, { useState, useReducer } from 'react';
import { Button } from '@blueprintjs/core';
import immer from 'immer';

import { usePageContext } from 'utils/hooks';
import { pubUrl } from 'utils/canonicalUrls';
import { assert } from 'utils/assert';
import { Icon } from 'components';
import { apiFetch } from 'client/utils/apiFetch';
import { useLocalStorage } from 'client/utils/useLocalStorage';
import { getEmptyDoc } from 'client/components/Editor';
import { DocJson } from 'types';

import { usePubContext } from '../pubHooks';
import Review from './Review/Review';
import ReviewerDialog from './Review/ReviewerDialog';

require('./reviewHeaderSticky.scss');

enum Status {
	Reviewing,
	EditingMetadata,
	ServerPersisting,
	ServerPersistingError,
	ServerPersistingSuccess,
	Reset,
}

type StateReset = {
	status: Status.Reset;
	initialReview: DocJson;
};

type StateReviewing = {
	status: Status.Reviewing;
	review: DocJson;
	open: boolean;
	saving: boolean;
};

type StateEditingMetadata = {
	status: Status.EditingMetadata;
	review: DocJson;
	reviewTitle: string;
	reviewerName: string;
};

type PersistingProps = {
	reviewTitle: string;
	reviewerName: string;
};

type StateServerPersisting = PersistingProps & {
	status: Status.ServerPersisting;
	review: DocJson;
};

type StateServerPersistingError = PersistingProps & {
	status: Status.ServerPersistingError;
	review: DocJson;
	error: Error;
};

type StateServerPersistingSuccess = {
	status: Status.ServerPersistingSuccess;
};

type State =
	| StateReviewing
	| StateEditingMetadata
	| StateServerPersisting
	| StateServerPersistingError
	| StateServerPersistingSuccess
	| StateReset;

enum ActionKind {
	ToggleReview,
	UpdateReview,
	FinishUpdate,
	SubmitReview,
	UpdateReviewTitle,
	UpdateReviewerName,
}

type ToggleReview = { kind: ActionKind.ToggleReview };
type UpdateReview = { kind: ActionKind.UpdateReview; review: DocJson };
type FinishUpdate = { kind: ActionKind.FinishUpdate };
type SubmitReview = { kind: ActionKind.SubmitReview };
type UpdateReviewTitle = { kind: ActionKind.UpdateReviewTitle; reviewTitle: string };
type UpdateReviewerName = { kind: ActionKind.UpdateReviewerName; reviewerName: string };

const toggleReview = (): ToggleReview => ({ kind: ActionKind.ToggleReview });
const updateReview = (review: DocJson): UpdateReview => ({ kind: ActionKind.UpdateReview, review });
const finishUpdate = (): FinishUpdate => ({ kind: ActionKind.FinishUpdate });
const submitReview = (): SubmitReview => ({ kind: ActionKind.SubmitReview });

const updateReviewTitle = (reviewTitle: string): UpdateReviewTitle => ({
	kind: ActionKind.UpdateReviewTitle,
	reviewTitle,
});
const updateReviewerName = (reviewerName: string): UpdateReviewerName => ({
	kind: ActionKind.UpdateReviewerName,
	reviewerName,
});

type Action =
	| ToggleReview
	| UpdateReview
	| FinishUpdate
	| SubmitReview
	| UpdateReviewTitle
	| UpdateReviewerName;

const reducer = (state: State, action: Action) =>
	// eslint-disable-next-line consistent-return
	immer(state, (draft) => {
		switch (action.kind) {
			case ActionKind.ToggleReview:
				assert(draft.status === Status.Reviewing);
				draft.open = !draft.status;
				break;
			case ActionKind.UpdateReview:
				assert(draft.status === Status.Reviewing);
				draft.review = action.review;
				draft.saving = true;
				break;
			case ActionKind.FinishUpdate:
				assert(draft.status === Status.Reviewing);
				draft.saving = false;
				break;
			case ActionKind.SubmitReview:
				assert(draft.status === Status.Reviewing);
				return {
					status: Status.EditingMetadata as const,
					review: draft.review,
					reviewTitle: 'Untitled Review',
					reviewerName: '',
				};
			default:
				break;
		}
	});

const ReviewHeaderSticky = () => {
	const { pubData, updatePubData } = usePubContext();
	const {
		communityData,
		scopeData: { activePermissions, memberData },
		loginData: { fullName },
	} = usePageContext();

	const [createError, setCreateError] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [createdReview, setCreatedReview] = useState(false);
	const [reviewNumber, setReviewNumber] = useState(0);

	// creates a docjoson object in local store, provides state handlers as well
	const { value: review, setValue: setReview } = useLocalStorage<DocJson>({
		initial: getEmptyDoc,
		communityId: communityData.id,
		featureName: 'new-review-editor',
		path: [`pub-${pubData.id}`],
		debounce: 100,
	});

	const [state, dispatch] = useReducer(reducer, {
		status: Status.Reviewing,
		review,
		open: true,
		saving: false,
	});

	const updatingReviewDoc = (doc: DocJson) => {
		dispatch(updateReview(doc));
		setTimeout(() => {
			dispatch(finishUpdate());
		}, 1000);
	};

	const url = new URL(window.location.href);
	const query = new URLSearchParams(url.search);
	const handleSubmit = () => {
		assert(state.status === Status.EditingMetadata);
		setIsLoading(true);
		apiFetch
			.post('/api/reviews', {
				communityId: communityData.id,
				pubId: pubData.id,
				reviewContent: review,
				title: state.reviewTitle,
				accessHash: query.get('access'),
				reviewerName: state.reviewerName,
			})
			.then((reviewRes) => {
				updatePubData((currentPubData) => {
					return currentPubData.reviews
						? {
								reviews: [...currentPubData.reviews, reviewRes],
						  }
						: {
								reviews: [reviewRes],
						  };
				});
				setIsLoading(false);
				setReviewNumber(reviewRes.number);
				setReview(getEmptyDoc());
				setCreatedReview(true);
			})
			.catch((err) => {
				setIsLoading(false);
				setCreateError(err);
			});
	};

	const renderReview = () => (
		<Review
			communityData={communityData}
			onSubmit={() => dispatch(submitReview())}
			isLoading={isLoading}
			review={review}
			updateReview={updatingReviewDoc}
		/>
	);
	const reviewPath = `/dash/pub/${pubData.slug}/reviews/${reviewNumber}`;
	const pubPath = pubUrl(communityData, pubData);
	const reviewVisible =
		state.status === Status.Reviewing ||
		state.status === Status.EditingMetadata ||
		state.status === Status.ServerPersisting ||
		state.status === Status.ServerPersistingError;
	const reviewDialogVisible =
		state.status === Status.EditingMetadata ||
		state.status === Status.ServerPersisting ||
		state.status === Status.ServerPersistingError;

	return (
		<div className="review-header-sticky-component container pub">
			<div className="sticky-section">
				<div className="sticky-title">{pubData.title}</div>
				<div className="side-content">
					{reviewVisible && renderReview()}
					<div className="sticky-buttons">
						<div className="sticky-review-text">review</div>
						{state.status === Status.Reviewing && state.saving ? (
							<div className="saving-text">
								<em>Saving...</em>
							</div>
						) : (
							<em className="saving-text">Saved</em>
						)}
						{state.status === Status.EditingMetadata && (
							<ReviewerDialog
								isOpen={reviewDialogVisible}
								onClose={() => {
									setCreatedReview(false);
								}}
								pubData={pubData}
								onCreateReviewDoc={handleSubmit}
								setReviewTitle={(reviewTitle) =>
									dispatch(updateReviewTitle(reviewTitle))
								}
								reviewTitle={state.reviewTitle}
								reviewerName={state.reviewerName}
								setReviewerName={(reviewerName) =>
									dispatch(updateReviewerName(reviewerName))
								}
								createdReview={createdReview}
								createError={createError}
								activePermissions={activePermissions}
								fullName={fullName}
								memberData={memberData}
								pubPath={pubPath}
								reviewPath={reviewPath}
							/>
						)}

						<Button
							minimal
							icon={<Icon icon="expand-all" />}
							onClick={() => dispatch(toggleReview())}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReviewHeaderSticky;
