import * as uuid from 'uuid';

import { Draft } from 'server/models';

export const createDraft = (id: string = uuid.v4()) => {
	return Draft.create({ id, firebasePath: `drafts/draft-${id}` });
};

export const getDraftFirebasePath = async (id: string) => {
	const draft = await Draft.findOne({ where: { id } });
	return draft.firebasePath;
};
