import React, { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { SubmissionWorkflow } from 'types';

import { useSubmissionsManager } from './useSubmissionsManager';
import { getStatusKey } from './statuses';
import { PubWithSubmission } from './types';
import SubmissionStatusColumn from './SubmissionStatusColumn';

require('./submissionsManager.scss');

type Props = {
	initialPubs: PubWithSubmission[];
	submissionWorkflow: SubmissionWorkflow;
};

const SubmissionsManager = (props: Props) => {
	const { initialPubs, submissionWorkflow } = props;
	const { handleMovePub, pubsByStatus, statusesByKey } = useSubmissionsManager({
		initialPubs,
		submissionWorkflow,
	});

	const handleDragEnd = useCallback(
		(dropResult: DropResult) => {
			const { source, destination, draggableId: pubId } = dropResult;
			if (destination) {
				const { index } = destination;
				const sourceStatus = statusesByKey[source.droppableId];
				const destinationStatus = statusesByKey[destination.droppableId];
				if (sourceStatus && destinationStatus) {
					handleMovePub({ sourceStatus, destinationStatus, index, pubId });
				}
			}
		},
		[handleMovePub, statusesByKey],
	);

	return (
		<div className="submissions-manager-component">
			<div className="columns">
				<DragDropContext onDragEnd={handleDragEnd}>
					{pubsByStatus.map(({ pubs, status }) => {
						return (
							<SubmissionStatusColumn
								pubs={pubs}
								status={status}
								key={getStatusKey(status)}
							/>
						);
					})}
				</DragDropContext>
			</div>
		</div>
	);
};

export default SubmissionsManager;
