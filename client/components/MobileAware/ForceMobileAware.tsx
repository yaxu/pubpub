import React from 'react';

import { ForceMobileAwareContext, ForceMobileAwareContextType } from './forceMobileAwareContext';

type Props = ForceMobileAwareContextType & { children: React.ReactNode };

const ForceMobileAware = (props: Props) => {
	const { children, force } = props;
	const className = force ? (`force-${force}-styles` as const) : '';

	return (
		<ForceMobileAwareContext.Provider value={{ force }}>
			<div className={className}>{children}</div>
		</ForceMobileAwareContext.Provider>
	);
};

export default ForceMobileAware;
