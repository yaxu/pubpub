import React from 'react';

import { intrinsics } from 'facets';
import { ImageUpload } from 'components';

import { FacetPropEditorProps } from '../types';

require('./backgroundColorPicker.scss');

type Props = FacetPropEditorProps<typeof intrinsics.PubHeaderTheme, 'backgroundImage'>;

const BackgroundImagePicker = (props: Props) => {
	const { value, onUpdateValue } = props;
	return (
		<ImageUpload
			defaultImage={value!}
			onNewImage={onUpdateValue}
			width={150}
			canClear={true}
			helperText={
				<span>
					Suggested minimum dimensions: <br />
					1200px x 800px
				</span>
			}
		/>
	);
};

export default BackgroundImagePicker;
