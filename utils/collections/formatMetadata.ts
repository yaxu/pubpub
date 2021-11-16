import { Collection } from 'types';
import { getSchemaForKind } from 'utils/collections/schemas';

import { MetadataField, SerializedMetadataValue } from './types';

export const getOrderedCollectionMetadataFields = (collection: Collection) => {
	return getSchemaForKind(collection.kind)!.metadata;
};

export const formatMetadataValue = <T extends any, S extends SerializedMetadataValue>(
	field: MetadataField<T, S>,
	serializedValue: S,
) => {
	const { type, label } = field;
	const value = type ? type.deserialize(serializedValue) : (serializedValue as T);
	return field.formatter({ label, value });
};
