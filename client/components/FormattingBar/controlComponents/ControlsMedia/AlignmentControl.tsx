import React from 'react';
import { Button } from '@blueprintjs/core';
import { Radio, RadioGroup, useRadioState } from 'reakit';

import { Icon } from 'components';

type Props = {
	onChange: (...args: any[]) => any;
	value: string;
};

const alignOptions = [
	{ key: 'left', icon: 'align-left' },
	{ key: 'center', icon: 'align-center' },
	{ key: 'right', icon: 'align-right' },
	{ key: 'full', icon: 'vertical-distribution' },
	{ key: 'breakout', icon: 'fullscreen' },
] as const;

const AlignmentControl = (props: Props) => {
	const { onChange, value } = props;
	const radio = useRadioState();
	return (
		<div className="controls-row">
			<div className="left-label">Alignment</div>
			<RadioGroup className="controls" aria-label="Figure alignment" as="div">
				{alignOptions.map((item) => {
					return (
						<Radio
							{...radio}
							aria-label={item.key}
							title={item.key}
							key={item.key}
							checked={value === item.key}
							onClick={() => onChange(item.key)}
						>
							{({ ref, ...restRadioProps }) => (
								<Button
									elementRef={ref}
									icon={<Icon icon={item.icon} iconSize={16} />}
									minimal={true}
									aria-label={item.key}
									active={value === item.key}
									{...restRadioProps}
								/>
							)}
						</Radio>
					);
				})}
			</RadioGroup>
		</div>
	);
};
export default AlignmentControl;
