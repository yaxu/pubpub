import React from 'react';
import { Tooltip } from '@blueprintjs/core';

require('./pubSuggestedEditsTooltip.scss');

type Props = {
	children: any;
};

const PubSuggestedEditsTooltip = (props: Props) => {
	const ToolTipContent = () => {
		return (
			<div className="tooltip-content">
				<strong>Using these buttons you can make suggested edits to the document</strong>
				<div>
					<p>
						The button with the marker will toggle suggested edits on and off. This will
						enable suggestions from contributors and editors to be made in the Pub
						document.
					</p>
				</div>
				<div>
					<p>
						The reject and accept buttons will either reject changes suggested, or
						replace the old content with the new suggested edit
					</p>
				</div>
				<div>
					<p>
						You can add entire paragraphs as suggestions, or mark up individual lines
						but it is not advised that you make suggestion in tables, LaTex, or code.
					</p>
				</div>
			</div>
		);
	};
	return (
		<Tooltip content={<ToolTipContent />} className="pub-suggested-edits-tooltip" isOpen={true}>
			{props.children}
		</Tooltip>
	);
};

export default PubSuggestedEditsTooltip;
