import React from 'react';

import { ForceMobileAwareContext, ForceMobileAwareContextType } from './forceMobileAwareContext';

type Props = ForceMobileAwareContextType & { children: React.ReactNode };

const ForceMobileAware = (props: Props) => {
	const { children, force } = props;

	return (
		<ForceMobileAwareContext.Provider value={{ force }}>
			{children}
		</ForceMobileAwareContext.Provider>
	);
};

export default ForceMobileAware;
