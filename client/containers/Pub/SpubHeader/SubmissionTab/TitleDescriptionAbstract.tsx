import React from 'react';
import { Label, InputGroup } from '@blueprintjs/core';
import { useDebouncedCallback } from 'use-debounce';

import { PubPageData, Pub, DocJson } from 'types';
import { MinimalEditor } from 'components';

require('./titleDescriptionAbstract.scss');

type Props = {
	pub: Pub;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
};

const TitleDescriptionAbstract = (props: Props) => {
	const [onUpdatePubDebounced] = useDebouncedCallback(props.onUpdatePub, 250);
	return (
		<div className="title-description-abstract-component">
			<div className="field">
				<h2>Title</h2>
				<InputGroup
					className="submission-input"
					defaultValue={props.pub.title}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
						onUpdatePubDebounced({ title: evt.target.value })
					}
				/>
			</div>
			<div className="field">
				<h2>Abstract</h2>
				<MinimalEditor
					initialContent={props.abstract}
					onEdit={(doc) => props.onUpdateAbstract(doc.toJSON() as DocJson)}
					debounceEditsMs={300}
					getButtons={(buttons) => buttons.minimalButtonSet}
					useFormattingBar
					constrainHeight
				/>
			</div>
			<div className="field">
				<h2>Description</h2>
				<InputGroup
					className="submission-input"
					defaultValue={props.pub.description}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
						onUpdatePubDebounced({ description: evt.target.value })
					}
				/>
			</div>
		</div>
	);
};

export default TitleDescriptionAbstract;
