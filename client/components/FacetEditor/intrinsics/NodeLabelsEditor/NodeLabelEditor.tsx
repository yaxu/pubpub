import React, { useCallback } from 'react';
import { Checkbox, InputGroup, Tooltip } from '@blueprintjs/core';

import { NodeLabels } from 'facets/intrinsics';

import { FacetPropEditorProps } from '../../types';

require('./nodeLabelEditor.scss');

type Props = FacetPropEditorProps<typeof NodeLabels, 'image', false>; // But could be any of 'em

const NodeLabelEditor = (props: Props) => {
	const { value, onUpdateValue } = props;
	const { enabled, label } = value;

	const onToggle = useCallback(
		(checked: boolean) => {
			onUpdateValue({ ...value, enabled: checked });
		},
		[value, onUpdateValue],
	);

	const onTextChange = useCallback(
		(text: string) => {
			onUpdateValue({ ...value, label: text });
		},
		[value, onUpdateValue],
	);

	const tooltipContent = enabled ? 'Disable labels' : 'Enable labels';

	return (
		<div className="node-label-editor-component">
			<Tooltip content={tooltipContent}>
				<Checkbox
					checked={enabled}
					onChange={(e) => onToggle((e.target as HTMLInputElement).checked)}
				/>
			</Tooltip>
			<InputGroup
				type="text"
				onChange={(e) => onTextChange(e.target.value)}
				value={label}
				disabled={!enabled}
			/>
		</div>
	);
};

export default NodeLabelEditor;
