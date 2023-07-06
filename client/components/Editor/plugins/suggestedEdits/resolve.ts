import { Attrs, Mark, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Dispatch } from '../../commands';

import { getSuggestionMarkTypeFromSchema } from './operations';
import { suggestedEditsPluginKey } from './key';
import { getSuggestedEditsState } from './state';
import { SuggestionMarkAttrs, SuggestionNodeAttrs } from './types';
import { suggestionNodeAttributes } from './schema';

export const getResolvableRangeForSelection = (
	state: EditorState,
): null | { from: number; to: number } => {
	const { selection } = state;
	const suggestedEditsState = getSuggestedEditsState(state);
	if (suggestedEditsState) {
		const { suggestionRanges } = suggestedEditsState;
		const suggestionRange = suggestionRanges.find((range) => {
			return range.from <= selection.to && selection.from <= range.to;
		});
		if (suggestionRange) {
			// In cases where the selection is a range (from !== to), this max/min logic expands the
			// returned selection to include the full suggestion range. This ensures that the range
			// includes any suggestions that were merged into the suggestions on either end.
			return {
				from: Math.min(suggestionRange.from, selection.from),
				to: Math.max(suggestionRange.to, selection.to),
			};
		}
	}
	return null;
};

const removeSuggestionAttrs = (attrs: Attrs) => {
	const newAttrs: Record<string, any> = {};
	Object.keys(attrs).forEach((key) => {
		if (!suggestionNodeAttributes.includes(key)) {
			newAttrs[key] = attrs[key];
		}
	});
	return newAttrs as Attrs;
};

export const acceptSuggestions = (state: EditorState, from: number, to: number) => {
	const { tr, doc } = state;
	tr.setMeta(suggestedEditsPluginKey, { resolving: true });
	const suggestionMarkType = getSuggestionMarkTypeFromSchema(doc.type.schema);
	// eslint-disable-next-line consistent-return
	doc.nodesBetween(from, to, (node, oldPos) => {
		const { attrs, marks, nodeSize } = node;
		const pos = tr.mapping.map(oldPos);
		const suggestionMark = marks.find((mark) => mark.type === suggestionMarkType);
		if (suggestionMark) {
			const { suggestionKind } = suggestionMark.attrs as SuggestionMarkAttrs;
			if (suggestionKind === 'addition' || suggestionKind === 'modification') {
				tr.removeMark(pos, pos + nodeSize, suggestionMark);
			}
			if (suggestionKind === 'removal') {
				tr.replace(pos, pos + nodeSize, Slice.empty);
			}
		}
		if (attrs.suggestionKind && !node.isText) {
			const { suggestionKind } = attrs as SuggestionNodeAttrs;
			tr.setNodeMarkup(pos, null, removeSuggestionAttrs(attrs), marks);
			if (suggestionKind === 'removal') {
				try {
					tr.join(pos);
				} catch (_) {
					tr.delete(pos, pos + nodeSize);
					return false;
				}
			}
		}
	});
	return tr;
};

export const rejectSuggestions = (state: EditorState, from: number, to: number) => {
	const { tr, doc } = state;
	const { schema } = doc.type;
	tr.setMeta(suggestedEditsPluginKey, { resolving: true });
	const suggestionMarkType = getSuggestionMarkTypeFromSchema(schema);
	// eslint-disable-next-line consistent-return
	doc.nodesBetween(from, to, (node, oldPos) => {
		const { attrs, marks, nodeSize } = node;
		const pos = tr.mapping.map(oldPos);
		const suggestionMark = marks.find((mark) => mark.type === suggestionMarkType);
		if (suggestionMark) {
			const { suggestionKind } = suggestionMark.attrs as SuggestionMarkAttrs;
			if (suggestionKind === 'removal') {
				tr.removeMark(pos, pos + nodeSize, suggestionMark);
			}
			if (suggestionKind === 'addition') {
				tr.replace(pos, pos + nodeSize, Slice.empty);
			}
			if (suggestionKind === 'modification') {
				tr.removeMark(pos, pos + nodeSize, null);
				const { suggestionOriginalMarks } = suggestionMark.attrs as SuggestionMarkAttrs;
				if (suggestionOriginalMarks) {
					const originalMarksJson = JSON.parse(suggestionOriginalMarks);
					const originalMarks: Mark[] = originalMarksJson.map((markJson) =>
						Mark.fromJSON(schema, markJson),
					);
					originalMarks.forEach((mark) => tr.addMark(pos, pos + nodeSize, mark));
				}
			}
		}
		if (attrs.suggestionKind && !node.isText) {
			const { suggestionKind, suggestionOriginalAttrs } = attrs as SuggestionNodeAttrs;
			const originalAttrs = suggestionOriginalAttrs
				? JSON.parse(suggestionOriginalAttrs)
				: null;
			tr.setNodeMarkup(
				pos,
				null,
				{ ...removeSuggestionAttrs(attrs), ...originalAttrs },
				marks,
			);
			if (suggestionKind === 'addition') {
				try {
					tr.join(pos);
				} catch (_) {
					tr.delete(pos, pos + nodeSize);
					return false;
				}
			}
		}
	});
	return tr;
};

export const acceptSuggestedEdits = (state: EditorState, dispatch?: Dispatch): boolean => {
	const range = getResolvableRangeForSelection(state);
	if (range) {
		if (dispatch) {
			const tr = acceptSuggestions(state, range.from, range.to);
			dispatch(tr);
		}
		return true;
	}
	return false;
};

export const rejectSuggestedEdits = (state: EditorState, dispatch?: Dispatch): boolean => {
	const range = getResolvableRangeForSelection(state);
	if (range) {
		if (dispatch) {
			const tr = rejectSuggestions(state, range.from, range.to);
			dispatch(tr);
		}
		return true;
	}
	return false;
};
