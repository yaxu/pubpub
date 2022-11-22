import * as uuid from 'uuid';

// This can really be any unique UUID
const UUID_V5_NAMESPACE = '38e51e9f-6ebb-4bd6-9bc8-91f38c60ff0a';

export const getCommenterIdFromSessionId = (sessionId: string) => {
	// We mostly use UUID v4 in our codebase -- v5 is structured identically, but a v5 UUID is
	// based on a seed string and a unique namespace. So we can definitely use "v5" UUIDs as
	// UUID primary keys, for instance.
	return uuid.v5(sessionId, UUID_V5_NAMESPACE);
};
