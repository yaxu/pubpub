import React from 'react';
import { Button } from '@blueprintjs/core';

import { Callback } from 'types';

require('./facetPropEditorSkeleton.scss');

type Props = {
	children: React.ReactNode;
	label: React.ReactNode;
	onReset: Callback;
};

function FacetPropEditorSkeleton(props: Props) {
	const { children, label, onReset } = props;
	return (
		<div className="facet-prop-editor-skeleton-component">
			<div className="label">{label}</div>
			<div className="controls">
				<Button icon="reset" className="reset-button" onClick={onReset} />
				<div className="editor-container">{children}</div>
			</div>
		</div>
	);
}

export default FacetPropEditorSkeleton;
