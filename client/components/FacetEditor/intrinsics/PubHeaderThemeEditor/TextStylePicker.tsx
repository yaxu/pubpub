import React from 'react';

import { PubHeaderTheme } from 'facets/intrinsics';
import { usePageContext } from 'utils/hooks';

import { FacetPropEditorProps } from '../../types';
import TextStyleChoice from './TextStyleChoice';

require('./textStylePicker.scss');

type Props = FacetPropEditorProps<typeof PubHeaderTheme, 'textStyle'>;

const TextStylePicker = (props: Props) => {
	const { value, onUpdateValue } = props;
	const { communityData } = usePageContext();

	return (
		<div className="text-style-picker-component">
			<TextStyleChoice
				communityData={communityData}
				label="Light"
				className="light"
				onClick={() => onUpdateValue('light')}
				selected={!value || value === 'light'}
			/>
			<TextStyleChoice
				communityData={communityData}
				label="Dark"
				className="dark"
				onClick={() => onUpdateValue('dark')}
				selected={value === 'dark'}
			/>
			<TextStyleChoice
				communityData={communityData}
				label="White Blocks"
				className="white-blocks"
				onClick={() => onUpdateValue('white-blocks')}
				selected={value === 'white-blocks'}
			/>
			<TextStyleChoice
				communityData={communityData}
				label="Black Blocks"
				className="black-blocks"
				onClick={() => onUpdateValue('black-blocks')}
				selected={value === 'black-blocks'}
			/>
		</div>
	);
};

export default TextStylePicker;
