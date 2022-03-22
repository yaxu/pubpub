import React from 'react';

import { DragDropListing } from 'components';

import { PubWithSubmission, SubmissionStatusDescriptor } from './types';
import { getStatusLabel, getStatusKey } from './statuses';
import SubmissionPubCard from './SubmissionPubCard';

require('./submissionStatusColumn.scss');

type Props = {
	pubs: PubWithSubmission[];
	status: SubmissionStatusDescriptor;
};

const SubmissionStatusColumn = (props: Props) => {
	const { pubs, status } = props;
	const renderPub = (pub: PubWithSubmission) => {
		return <SubmissionPubCard pub={pub} key={pub.id} />;
	};

	return (
		<div className="submission-status-column-component">
			<div className="label">{getStatusLabel(status)}</div>
			<DragDropListing
				className="pubs"
				items={pubs}
				renderItem={renderPub}
				droppableId={getStatusKey(status)}
				droppableType="SUBMISSION_PUB"
			/>
		</div>
	);
};

export default SubmissionStatusColumn;
