import { IconName } from 'client/components';
import { Collection, Community, Maybe } from 'types';

export type SerializedMetadataValue = string | boolean | number | null;
export type SerializedMetadata = Record<string, SerializedMetadataValue>;

export type CollectionContext = {
	collection: Collection;
	community: Community;
};

export type ContextHint = {
	value: string;
	label: string;
	isDefault?: boolean;
	crossrefComponentType?: string;
};

export type MetadataFormatter<Type> = (options: { label: string; value: Type }) => string;

export type MetadataDeriver = (context: CollectionContext) => Maybe<SerializedMetadataValue>;

export type MetadataType<Type, SerializedType extends SerializedMetadataValue> = {
	name: string;
	deserialize: (v: SerializedType) => Type;
	validate: (s: SerializedType) => boolean;
	labelInfo: string;
};

export type MetadataField<Type, SerializedType extends SerializedMetadataValue> = {
	name: string;
	label: string;
	formatter: MetadataFormatter<Type>;
	pattern?: string;
	derivedFrom?: MetadataDeriver;
	defaultDerivedFrom?: MetadataDeriver;
	derivedLabelInfo?: string;
	type?: MetadataType<Type, SerializedType>;
};

export type CollectionSchema = {
	kind: string;
	label: { singular: string; plural: string };
	bpDisplayIcon: IconName;
	metadata: MetadataField<any, any>[];
	contextHints: ContextHint[];
};
