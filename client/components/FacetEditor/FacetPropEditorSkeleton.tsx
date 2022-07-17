import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit/Button';

import { Icon } from 'components';
import { Callback } from 'types';

require('./facetPropEditorSkeleton.scss');

type Props = {
	children: React.ReactNode;
	label: React.ReactNode;
	onReset: Callback;
	isValueLocal: boolean;
};

function FacetPropEditorSkeleton(props: Props) {
	const { children, label, isValueLocal, onReset } = props;

	const inheritanceIcon = isValueLocal ? (
		<Icon className="inheritance-icon reset-icon" iconSize={12} icon="reset" />
	) : (
		<Icon className="inheritance-icon" iconSize={16} icon="double-chevron-down" />
	);

	return (
		<div
			className={classNames(
				'facet-prop-editor-skeleton-component',
				isValueLocal && 'local-value',
			)}
		>
			<div className="top-row">
				<Button className="triangle" as="div" onClick={onReset}>
					{inheritanceIcon}
				</Button>
				<div className="label-group">
					<div className="inheritance-info">
						{isValueLocal ? 'Defined here' : 'Defined by this Community'}
					</div>
					<div className="prop-name">{label}</div>
				</div>
			</div>
			<div className="controls-container">{children}</div>
		</div>
	);
}

export default FacetPropEditorSkeleton;
