import React from 'react';

import { SubmissionWorkflow } from 'types';
import { Editor } from 'components';

import TabColumn from './TabColumn';

require('./instructionsTab.scss');

type Props = {
	submissionWorkflow: SubmissionWorkflow;
};

const InstructionsTab = (props: Props) => {
	const { submissionWorkflow } = props;
	return (
		<TabColumn className="instructions-tab-component">
			<h1>{submissionWorkflow.title}</h1>
			<div className="instructions">
				<Editor initialContent={submissionWorkflow.instructionsText} isReadOnly />
			</div>
		</TabColumn>
	);
};
export default InstructionsTab;
