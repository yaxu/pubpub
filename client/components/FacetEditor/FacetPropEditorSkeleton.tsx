import React from 'react';
import classNames from 'classnames';

import { Callback } from 'types';

require('./facetPropEditorSkeleton.scss');

type Props = {
	children: React.ReactNode;
	label: React.ReactNode;
	onReset: Callback;
	isValueLocal: boolean;
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
	const { children, label, isValueLocal } = props;
	return (
		<div
			className={classNames(
				'facet-prop-editor-skeleton-component',
				isValueLocal && 'local-value',
			)}
		>
			{/* <div className="inheritance-container">
				{arrow}
				<div className="inheritance-controls">from community</div>
			</div> */}
			<div className="label">{label}</div>
			<div className="controls-container">{children}</div>
		</div>
	);
}

export default FacetPropEditorSkeleton;
