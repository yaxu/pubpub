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

export type MetadataDeriver = (context: CollectionContext) => Maybe<SerializedMetadataValue>;

export type MetadataType<T> = {
	name: string;
	deserialize: (v: SerializedMetadataValue) => T;
	validate: (s: string) => boolean;
	labelInfo: string;
};

export type MetadataField = {
	name: string;
	label: string;
	pattern?: string;
	derivedFrom?: MetadataDeriver;
	defaultDerivedFrom?: MetadataDeriver;
	derivedLabelInfo?: string;
	type?: MetadataType<any>;
};

export type CollectionSchema = {
	kind: string;
	label: { singular: string; plural: string };
	bpDisplayIcon: IconName;
	metadata: MetadataField[];
	contextHints: ContextHint[];
};
