import { Collection } from 'types';

export default (collection: Collection) => {
	if (collection.doi) {
		return collection.doi;
	}
	return collection.metadata && collection.metadata.doi;
};
