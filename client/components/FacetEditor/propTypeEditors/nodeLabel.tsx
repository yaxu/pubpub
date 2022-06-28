import React from 'react';

import { intrinsics } from 'facets';

import { propTypeEditor } from './_propType';

export const nodeLabel = propTypeEditor(intrinsics.NodeLabels.props.audio.propType, (props) => {
	const { value, onUpdateValue } = props;
	const { enabled = false, label = '' } = value ?? {};
	return <div className="node-label-proptype-editor-component" />;
});
