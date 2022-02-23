import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { PubPageData, DefinitelyHas, DocJson } from 'types';

import TabColumn from '../TabColumn';
import TitleDescriptionAbstract from './TitleDescriptionAbstract';
import Contributors from './Contributors';
import SpubSettings from './SpubSettings';

require('./submissionTab.scss');

type Props = {
	pub: DefinitelyHas<PubPageData, 'submission'>;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
};

const SubmissionTab = (props: Props) => {
	return (
		<TabColumn className="submission-tab-component">
			<Tabs id="spub-subtabs" className="subtabs">
				<Tab
					id="title-description-abstract"
					title="Title, Description & Abstract"
					panel={
						<TitleDescriptionAbstract
							pub={props.pub}
							abstract={props.abstract}
							onUpdatePub={props.onUpdatePub}
							onUpdateAbstract={props.onUpdateAbstract}
						/>
					}
				/>
				<Tab
					id="contributors"
					title="Contributors"
					panel={<Contributors pubData={props.pub} onUpdatePub={props.onUpdatePub} />}
				/>
				<Tab
					id="spubSettings"
					title="Pub Settings"
					panel={<SpubSettings pubData={props.pub} onUpdatePub={props.onUpdatePub} />}
				/>
			</Tabs>
		</TabColumn>
	);
};

export default SubmissionTab;
