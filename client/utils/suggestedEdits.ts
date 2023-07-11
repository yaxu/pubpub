import { EditorChangeObject } from 'client/components/Editor';

export const hasMathNode = (editorChangeObject: EditorChangeObject | null): boolean => {
	if (!editorChangeObject || !editorChangeObject.view) return false;
	const doc = editorChangeObject.view.state.doc;
	let hasMath = false;
	doc.nodesBetween(1, doc.nodeSize - 2, (node) => {
		if (hasMath) return;
		console.log(node);
		// replace with function to check for math
		const present = false;
		if (present) hasMath = true;
	});
	return hasMath;
};
