import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { calculateBackgroundColor } from 'utils/colors';

require('./pubHeaderBackground.scss');

const propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	communityData: PropTypes.shape({
		accentColorDark: PropTypes.string,
	}).isRequired,
	pubData: PropTypes.shape({
		headerBackgroundColor: PropTypes.string,
		headerBackgroundImage: PropTypes.string,
		headerStyle: PropTypes.string,
	}).isRequired,
	blur: PropTypes.bool,
	style: PropTypes.object,
	showSafetyLayer: PropTypes.bool,
};

const defaultProps = {
	className: '',
	children: null,
	blur: false,
	style: {},
	showSafetyLayer: false,
};

const PubHeaderBackground = React.forwardRef((props, ref) => {
	const { children, className, pubData, communityData, blur, style, showSafetyLayer } = props;
	const { headerBackgroundColor, headerBackgroundImage } = pubData;

	const effectiveBackgroundColor = calculateBackgroundColor(
		headerBackgroundColor,
		communityData.accentColorDark,
	);

	return (
		<div
			className={classNames(
				'pub-header-background-component',
				`pub-header-theme-${pubData.headerStyle}`,
				className,
			)}
			style={style}
			ref={ref}
		>
			<div className="background-element background-white-layer" />
			{headerBackgroundImage && (
				<div
					className={classNames('background-element', 'background-image', blur && 'blur')}
					style={{ backgroundImage: `url('${headerBackgroundImage}')` }}
				/>
			)}
			{effectiveBackgroundColor && (
				<div
					className="background-element background-color"
					style={{ backgroundColor: effectiveBackgroundColor }}
				/>
			)}
			{showSafetyLayer && <div className="background-element background-safety-layer" />}
			{children}
		</div>
	);
});

PubHeaderBackground.propTypes = propTypes;
PubHeaderBackground.defaultProps = defaultProps;
export default PubHeaderBackground;
