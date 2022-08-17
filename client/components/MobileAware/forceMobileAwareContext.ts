import React from 'react';

import { ViewportSize } from 'types';

export type ForceMobileAwareContextType = {
	force: null | ViewportSize;
};

export const ForceMobileAwareContext = React.createContext<ForceMobileAwareContextType>({
	force: null,
});
