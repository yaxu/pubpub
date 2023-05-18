import type { MathView } from '@benrbray/prosemirror-math';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
	NodeViewConstructor,
} from 'prosemirror-view';
import { Fragment } from 'prosemirror-model';
import type { Node } from 'prosemirror-model';
import { nodeContentsWithSuggestionsAccepted } from '../suggestedEdits/resolve';

type MathNodeViewConstructor = (...args: Parameters<NodeViewConstructor>) => MathNodeView;

interface MathNodeView extends NodeView {
	_node: Node;
	renderMath: () => unknown;
}

const addCountToNode = (node: Node, count: number) => {
	const {
		content,
		type: { schema },
	} = node;
	const countLatex = `\\tag{${count}}`;
	const textNode = schema.text(countLatex);
	const contentWithCount = Fragment.from(content).append(Fragment.from(textNode));
	return node.copy(contentWithCount);
};

export const mathViewOverrideWithCount = (constructor: MathNodeViewConstructor) => {
	return (
		node: Node,
		view: EditorView,
		getPos: () => number,
		_: readonly Decoration[],
		__: DecorationSource,
	) => {
		// The last two parameters to the nodeview constructor are not called by prosemirror-math,
		// but we have to add them for typescript
		const delegate = constructor(node, view, getPos, _, __);
		const { renderMath } = delegate;
		const boundRenderMath = renderMath.bind(delegate);
		Object.assign(delegate, {
			renderMath: function (this: MathView) {
				const state = view.state;
				// Typescript complains about accessing a private property from outside a MathView
				// but we know this is only being called from inside a MathView
				// @ts-expect-error
				const oldNode: Node = this._node;
				// We should have access to the `count` reactive attr if node labels
				// for math are currently enabled
				const { count, ...attrs } = oldNode.attrs;
				let updatedNode = oldNode;

				const newContent = nodeContentsWithSuggestionsAccepted(state, oldNode, getPos());
				if (newContent) {
					updatedNode = oldNode.copy(Fragment.from(oldNode.type.schema.text(newContent)));
				}

				if (count) {
					updatedNode = addCountToNode(updatedNode, count);
				}
				// @ts-expect-error
				this._node = updatedNode;
				// replace updatedNode.content.content with resolved version of content
				// acceptSuggestions(this.dom.ownerDocument)\
				// this._node.content
				// render the count-appended node...
				boundRenderMath();
				// ...but don't retain the count in the document
				// @ts-expect-error
				this._node = oldNode;
				Object.entries(attrs).forEach(([key, value]) => {
					(this.dom as HTMLElement).setAttribute(key, value);
				});
			},
		});
		delegate.renderMath();
		return delegate;
	};
};
