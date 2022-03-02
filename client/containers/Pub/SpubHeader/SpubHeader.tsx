import React, { useEffect } from 'react';
import { Tab, Tabs, Icon, IconName } from '@blueprintjs/core';

import { DocJson, PubHistoryState, PubPageData } from 'types';
import { apiFetch } from 'client/utils/apiFetch';

import { usePubContext } from '../pubHooks';
import InstructionsTab from './InstructionsTab';
import SubmissionTab from './SubmissionTab';
import PreviewTab from './PreviewTab';

require('./spubHeader.scss');

export type SpubHeaderTab = 'instructions' | 'submission' | 'preview';

export const renderTabTitle = (icon: IconName, title: string) => (
	<>
		<Icon icon={icon} /> {title}
	</>
);

const SpubHeader = () => {
	const {
		updatePubData,
		updateLocalData,
		pubData,
		updateSubmissionState,
		submissionState,
		historyData,
	} = usePubContext();
	const { selectedTab, submission } = submissionState!;

	const updateAbstract = async (newAbstract: DocJson) => {
		updateSubmissionState(({ submission: currentSubmission }) => ({
			submission: {
				...currentSubmission,
				abstract: newAbstract,
			},
		}));
		return apiFetch.put('/api/submissions', {
			abstract: newAbstract,
			id: submission.id,
		});
	};

	const updateAndSavePubData = async (newPubData: Partial<PubPageData>) => {
		updatePubData(newPubData);
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newPubData,
				pubId: pubData.id,
				communityId: pubData.communityId,
			}),
		}).catch(() => updatePubData(pubData));
	};

	const setSelectedTab = (nextTab: SpubHeaderTab) => {
		updateSubmissionState({ selectedTab: nextTab });
	};

	const updateHistoryData = (newHistoryData: Partial<PubHistoryState>) => {
		return updateLocalData('history', newHistoryData);
	};

	const instructionTabTitle = renderTabTitle('align-left', 'Instructions');
	const submissionTabTitle = renderTabTitle('manually-entered-data', 'Submission');
	const previewTabTitle = renderTabTitle('eye-open', 'Preview & Submit');
	const maybeActiveClass = (tabId: string) => (tabId === selectedTab ? 'active' : 'inactive');

	useEffect(() => {
		updatePubData({ isReadOnly: selectedTab === 'preview' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTab]);

	return (
		<Tabs
			id="spubHeader"
			onChange={(t) => setSelectedTab(t as any)}
			selectedTabId={selectedTab}
			className="spub-header-component tabs bp3-large"
		>
			<Tab
				id="instructions"
				title={instructionTabTitle}
				className={`tab-panel ${maybeActiveClass('instructions')}`}
				panel={<InstructionsTab submissionWorkflow={submission.submissionWorkflow!} />}
			/>

			<Tab
				id="submission"
				title={submissionTabTitle}
				className={`tab-panel ${maybeActiveClass('submission')}`}
				panel={
					<SubmissionTab
						abstract={submission.abstract}
						onUpdatePub={updateAndSavePubData}
						onUpdateAbstract={updateAbstract}
						pub={pubData}
					/>
				}
			/>
			<Tab
				id="preview"
				title={previewTabTitle}
				className={`${maybeActiveClass('preview')}`}
				panel={
					<PreviewTab
						updateHistoryData={updateHistoryData}
						historyData={historyData}
						pubData={pubData}
						submission={submission}
					/>
				}
			/>
		</Tabs>
	);
};

export default SpubHeader;
