import React, { useMemo } from 'react';

import { MenuSelect } from 'components/Menu';
import { primitives } from 'facets';

import { propTypeEditor } from './_propType';

const getMenuItems = (values: string[], labels?: Record<string, string>) => {
	return values.map((value) => {
		const label = labels?.[value];
		if (label) {
			return { value, label };
		}
		return { value, label: value };
	});
};

export const OneOf = propTypeEditor(primitives.oneOf, (props) => {
	const { value, onUpdateValue, propType, prop } = props;
	const { values, labels } = propType.extension;
	const menuItems = useMemo(() => getMenuItems(values, labels), [values, labels]);

	return (
		<MenuSelect
			aria-label={`Select value for prop (${prop.label})`}
			items={menuItems}
			value={value}
			onSelectValue={onUpdateValue}
		/>
	);
});
