import React, { useState } from 'react';

import { DocJson, DefinitelyHas, PubHistoryState, PubPageData } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { getEmptyDoc } from 'components/Editor';
import { GridWrapper } from 'components';

import TopTabs, { SpubHeaderTab } from './TopTabs';
import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';

require('./spubHeader.scss');

type Props = {
	historyData: PubHistoryState;
	updateLocalData: (
		type: string,
		patch: Partial<PubPageData> | Partial<PubHistoryState>,
	) => unknown;
	pubData: DefinitelyHas<PubPageData, 'submission'>;
};

const SpubHeader = (props: Props) => {
	const { pubData } = props;
	const [selectedTab, setSelectedTab] = useState<SpubHeaderTab>('instructions');
	const [abstract, setAbstract] = useState(
		() => props.pubData.submission.abstract || getEmptyDoc(),
	);

	const updateAbstract = async (newAbstract: DocJson) => {
		return apiFetch('/api/submissions', {
			method: 'PUT',
			body: JSON.stringify({
				abstract: newAbstract,
				id: props.pubData.submission.id,
			}),
		}).then(() => setAbstract(newAbstract));
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		props.updateLocalData('pub', newPubData);
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: props.pubData.id,
				communityId: props.pubData.communityId,
			}),
		}).catch(() => props.updateLocalData('pub', props.pubData));
	};

	const updateHistoryData = (newHistoryData: Partial<PubHistoryState>) => {
		return props.updateLocalData('history', newHistoryData);
	};

	return (
		<div className="spub-header-component">
			<TopTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
			{selectedTab === 'instructions' && (
				<InstructionsTab submissionWorkflow={pubData.submission.submissionWorkflow} />
			)}
			{selectedTab === 'submission' && (
				<SubmissionTab
					pub={pubData}
					abstract={abstract}
					onUpdatePub={updateAndSavePubData}
					onUpdateAbstract={updateAbstract}
				/>
			)}
		</div>
	);
};

export default SpubHeader;
