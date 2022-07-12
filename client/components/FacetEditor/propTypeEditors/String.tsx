import React from 'react';
import { InputGroup } from '@blueprintjs/core';

import { primitives } from 'facets';

import { propTypeEditor } from './_propType';

export const String = propTypeEditor(primitives.string, (props) => {
	const { value, onUpdateValue, isValueLocal } = props;

	return (
		<InputGroup
			value={(isValueLocal && value) || undefined}
			placeholder={(!isValueLocal && value) || undefined}
			onChange={(e) => onUpdateValue(e.target.value)}
		/>
	);
});
