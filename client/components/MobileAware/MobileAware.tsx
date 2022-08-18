import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';

import { ViewportSize } from 'types';
import { useViewport } from 'client/utils/useViewport';

import { ForceMobileAwareContext } from './forceMobileAwareContext';

require('./mobileAware.scss');

export type RenderProps = { ref?: React.Ref<any>; className: string };
type Renderable = null | React.ReactElement | ((props: RenderProps) => React.ReactElement);

type Props = {
	desktop?: Renderable;
	mobile?: Renderable;
};

const componentPrefix = 'mobile-aware-component';

const renderMobileOrDesktop = (
	renderable: Renderable,
	ref: React.Ref<unknown>,
	isFirstMount: boolean,
	currentViewportSize: ViewportSize,
	forcedViewportSize: null | ViewportSize,
	forViewportSize: ViewportSize,
) => {
	if (!renderable) {
		return null;
	}
	const matchedViewportSize = forcedViewportSize || currentViewportSize;
	const matchesViewportSize = forViewportSize === matchedViewportSize;
	// During server-side rendering, isFirstMount is true, so we unconditionally render
	// both the provided mobile and the desktop versions, and rely on CSS to show only the
	// correct one. During the first client render, we already know what viewport size we have,
	// but we still need to render both elements because React insists that the first client
	// render match the server render exactly. After that, we can stop rendering one of them.
	if (!isFirstMount && !matchesViewportSize) {
		return null;
	}

	const forViewportClassName = `${componentPrefix}__${forViewportSize}` as const;
	const forcedViewportClassName = forcedViewportSize
		? (`${componentPrefix}__force-${forcedViewportSize}` as const)
		: null;

	const renderProps: RenderProps = {
		className: classNames(forViewportClassName, forcedViewportClassName),
		...(matchesViewportSize ? { ref } : null),
	};
	if (typeof renderable === 'function') {
		return renderable(renderProps);
	}
	return React.cloneElement(renderable, renderProps);
};

const MobileAware = React.forwardRef((props: Props, ref: React.Ref<unknown>) => {
	const { mobile = null, desktop = null } = props;
	const [isFirstMount, setIsFirstMount] = useState(true);
	const { viewportSize } = useViewport({ withEarlyMeasurement: true });
	const { force } = useContext(ForceMobileAwareContext);

	useEffect(() => setIsFirstMount(false), []);

	return (
		<>
			{renderMobileOrDesktop(mobile, ref, isFirstMount, viewportSize!, force, 'mobile')}
			{renderMobileOrDesktop(desktop, ref, isFirstMount, viewportSize!, force, 'desktop')}
		</>
	);
});

export default MobileAware;
