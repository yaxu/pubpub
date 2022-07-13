import { NodeLabels } from 'facets/intrinsics';

import { createFacetEditor } from '../createFacetEditor';
import NodeLabelEditor from './NodeLabelEditor';

export default createFacetEditor(NodeLabels, {
	image: NodeLabelEditor,
	audio: NodeLabelEditor,
	video: NodeLabelEditor,
	table: NodeLabelEditor,
	blockEquation: NodeLabelEditor,
});
