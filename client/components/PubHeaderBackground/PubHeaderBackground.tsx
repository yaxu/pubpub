import React from 'react';
import classNames from 'classnames';

import { calculateBackgroundColor } from 'utils/colors';
import { useFacetsQuery } from 'client/utils/useFacets';
import { Pub } from 'types';

require('./pubHeaderBackground.scss');

type Props = {
	children?: React.ReactNode;
	className?: string;
	communityData: {
		accentColorDark?: string;
	};
	pubData?: Pub;
	blur?: boolean;
	style?: any;
	safetyLayer?: 'enabled' | 'full-height';
};

const PubHeaderBackground = React.forwardRef((props: Props, ref: React.Ref<any>) => {
	const {
		children = null,
		className = '',
		communityData,
		pubData,
		blur = false,
		style = {},
		safetyLayer = null,
	} = props;

	const { textStyle, backgroundColor, backgroundImage } = useFacetsQuery(
		({ PubHeaderTheme }) => PubHeaderTheme.cascadeResult.value,
		{
			prefer: (doNotPrefer) => {
				if (pubData) {
					return {
						textStyle: pubData.headerStyle,
						backgroundColor: pubData.headerBackgroundColor ?? 'light',
						backgroundImage: pubData.headerBackgroundImage ?? null,
					};
				}
				return doNotPrefer;
			},
		},
	);

	const effectiveBackgroundColor = calculateBackgroundColor(
		backgroundColor,
		communityData.accentColorDark,
	);

	return (
		<div
			className={classNames(
				'pub-header-background-component',
				`pub-header-theme-${textStyle}`,
				className,
			)}
			style={style}
			ref={ref}
		>
			<div className="background-element background-white-layer" />
			{backgroundImage && (
				<div
					className={classNames('background-element', 'background-image', blur && 'blur')}
					style={{ backgroundImage: `url('${backgroundImage}')` }}
				/>
			)}
			{effectiveBackgroundColor && (
				<div
					className="background-element background-color"
					style={{ backgroundColor: effectiveBackgroundColor }}
				/>
			)}
			{!!safetyLayer && (
				<div
					className={classNames(
						'background-element',
						'background-safety-layer',
						safetyLayer === 'full-height' && 'full-height',
					)}
				/>
			)}
			{children}
		</div>
	);
});

export default PubHeaderBackground;
