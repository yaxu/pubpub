import * as uuid from 'uuid';

import { getPubDraftRef, getDatabaseRef, editFirebaseDraftByRef } from 'server/utils/firebaseAdmin';

const stubstubClientId = 'stubstub-firebase';

export const editFirebaseDraft = (refKey: string = uuid.v4()) => {
	return editFirebaseDraftByRef(getDatabaseRef(refKey)!, stubstubClientId);
};

export const editPub = async (pubId: string) => {
	const draftRef = await getPubDraftRef(pubId);
	return editFirebaseDraftByRef(draftRef, stubstubClientId);
};
