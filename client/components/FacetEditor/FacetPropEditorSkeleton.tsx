import React from 'react';
import { Button } from '@blueprintjs/core';

import { Callback } from 'types';

require('./facetPropEditorSkeleton.scss');

type Props = {
	children: React.ReactNode;
	label: React.ReactNode;
	onReset: Callback;
};

const arrow = (
	<div className="arrow-container">
		<div className="arrow">
			<div className="arrow-bend" />
			<div className="arrow-tip" />
			<div className="arrow-bauble" />
		</div>
	</div>
);

function FacetPropEditorSkeleton(props: Props) {
	const { children, label, onReset } = props;
	return (
		<div className="facet-prop-editor-skeleton-component">
			<div className="inheritance-container">
				{arrow}
				<div className="inheritance-controls">from community</div>
			</div>
			<div className="label">{label}</div>
			<div className="controls-container">{children}</div>
		</div>
	);
}

export default FacetPropEditorSkeleton;
