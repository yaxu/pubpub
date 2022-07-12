import React from 'react';
import classNames from 'classnames';
import { Button } from 'reakit';

import { CascadedFacetType } from 'facets';
import { PubHeaderTheme } from 'facets/intrinsics';

import { PubHeaderBackground } from 'components';
import { Pub } from 'types';

type Props = {
	className?: string;
	communityData: any;
	label: React.ReactNode;
	onClick: (...args: any[]) => any;
	pubHeaderTheme: CascadedFacetType<typeof PubHeaderTheme>;
	selected?: boolean;
	style?: any;
};

const TextStyleChoice = React.forwardRef((props: Props, ref) => {
	const {
		label,
		className,
		onClick,
		selected = false,
		style = {},
		pubHeaderTheme,
		communityData,
	} = props;

	const psuedoPubData: Pick<
		Pub,
		'headerBackgroundColor' | 'headerBackgroundImage' | 'headerStyle'
	> = {
		headerStyle: pubHeaderTheme.textStyle!,
		headerBackgroundColor: pubHeaderTheme.backgroundColor,
		headerBackgroundImage: pubHeaderTheme.backgroundImage!,
	};

	return (
		// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
		<Button
			className={classNames('text-style-choice')}
			onClick={onClick}
			ref={ref}
			title={label}
		>
			<PubHeaderBackground
				pubData={psuedoPubData}
				communityData={communityData}
				blur={true}
				className={classNames('example', className, 'selectable', selected && 'selected')}
				style={style || {}}
			>
				<div className="example-text">Aa</div>
			</PubHeaderBackground>
			<div className="label">{label}</div>
		</Button>
	);
});

export default TextStyleChoice;
