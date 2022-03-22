import React from 'react';

import { ContributorAvatars, PubByline } from 'components';
import { pubUrl } from 'utils/canonicalUrls';
import { usePageContext } from 'utils/hooks';
import { getAllPubContributors } from 'utils/contributors';

import { PubWithSubmission } from './types';

require('./submissionPubCard.scss');

type Props = {
	pub: PubWithSubmission;
};

const SubmissionPubCard = (props: Props) => {
	const { pub } = props;
	const { communityData } = usePageContext();
	return (
		<div className="submission-pub-card-component">
			<div className="title-row">
				<a href={pubUrl(communityData, pub)} target="_blank" rel="noopener noreferrer">
					{pub.title}
				</a>
			</div>
			<div className="byline-row">
				<PubByline pubData={pub} truncateAt={8} />
			</div>
			<div className="details-row">
				<ContributorAvatars attributions={getAllPubContributors(pub)} truncateAt={5} />
			</div>
		</div>
	);
};

export default SubmissionPubCard;
