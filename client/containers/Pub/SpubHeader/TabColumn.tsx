import React from 'react';
import classNames from 'classnames';

import { GridWrapper } from 'components';

require('./tabColumn.scss');

type Props = {
	className?: string;
	children: React.ReactNode;
};

const TabColumn = (props: Props) => {
	const { className, children } = props;
	return (
		<GridWrapper
			columnClassName="pub"
			containerClassName={classNames('tab-column-component', className)}
		>
			{children}
		</GridWrapper>
	);
};

export default TabColumn;
