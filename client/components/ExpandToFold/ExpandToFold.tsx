import React, { useState, useRef, useLayoutEffect } from 'react';

import { useViewport } from 'client/utils/useViewport';

type Props = {
	active?: boolean;
	gutter?: number;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};

const ExpandToFold = (props: Props) => {
	const { active = true, gutter = 0, children, className, style } = props;
	const elementRef = useRef<HTMLDivElement>(null);
	const [minHeight, setMinHeight] = useState(0);
	const { viewportHeight } = useViewport({ withEarlyMeasurement: true });

	useLayoutEffect(() => {
		if (elementRef.current && typeof viewportHeight === 'number') {
			const { scrollY } = window;
			const { top: viewportOffset } = elementRef.current.getBoundingClientRect();
			setMinHeight(viewportHeight - viewportOffset - scrollY - gutter);
		}
	}, [viewportHeight, gutter]);

	return (
		<div
			style={{ ...style, ...(active && { minHeight }) }}
			ref={elementRef}
			className={className}
		>
			{children}
		</div>
	);
};

export default ExpandToFold;
