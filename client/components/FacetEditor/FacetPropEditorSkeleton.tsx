import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit/Button';

import { Icon } from 'components';
import { Callback } from 'types';
import { capitalize } from 'utils/strings';
import { FacetPropSourceInfo } from './types';

require('./facetPropEditorSkeleton.scss');

type Props = {
	children: React.ReactNode;
	label: React.ReactNode;
	onReset: Callback;
	propSourceInfo: FacetPropSourceInfo;
};

function getLabelForContributingScope(sourceInfo: FacetPropSourceInfo): string {
	const { contributingScopes, isValueLocal } = sourceInfo;
	const lowestContributingScope = contributingScopes[contributingScopes.length - 1];
	if (isValueLocal) {
		return 'Defined here';
	}
	if (lowestContributingScope) {
		const { kind } = lowestContributingScope;
		if (kind === 'root') {
			return 'PubPub default';
		}
		const scopeKind = capitalize(kind);
		return `Defined by ${scopeKind}`;
	}
	return 'unknown';
}

function FacetPropEditorSkeleton(props: Props) {
	const { children, label, propSourceInfo, onReset } = props;

	const { isValueLocal } = propSourceInfo;
	const inheritanceIcon = isValueLocal ? (
		<Icon className="inheritance-icon reset-icon" iconSize={12} icon="reset" />
	) : (
		<Icon className="inheritance-icon" iconSize={16} icon="double-chevron-down" />
	);

	const inheritanceLabel = getLabelForContributingScope(propSourceInfo);

	return (
		<div
			className={classNames(
				'facet-prop-editor-skeleton-component',
				isValueLocal && 'local-value',
			)}
		>
			<div className="top-row">
				<Button
					className="inheritance-triangle"
					as="div"
					onClick={onReset}
					disabled={!isValueLocal}
				>
					{inheritanceIcon}
				</Button>
				<div className="label-group">
					<div className="inheritance-info">{inheritanceLabel}</div>
					<div className="prop-name">{label}</div>
				</div>
			</div>
			<div className="controls-container">{children}</div>
		</div>
	);
}

export default FacetPropEditorSkeleton;
