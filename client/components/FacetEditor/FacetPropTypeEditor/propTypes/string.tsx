import React from 'react';
import { InputGroup } from '@blueprintjs/core';

import { primitives } from 'facets';

import { propTypeEditor } from '../propType';

export const string = propTypeEditor(primitives.string, (props) => {
	const { value, onUpdateValue } = props;
	return (
		<InputGroup value={value ?? undefined} onChange={(e) => onUpdateValue(e.target.value)} />
	);
});
