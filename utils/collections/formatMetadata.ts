import { Collection } from 'types';
import { getSchemaForKind } from 'utils/collections/schemas';
import { formatDate } from 'utils/dates';

export const getOrderedCollectionMetadataFields = (collection: Collection) => {
	return getSchemaForKind(collection.kind)!.metadata;
};

export const formattedMetadata = (fieldName: string, data: any) => {
	if (fieldName === 'printIssn') return `ISSN: ${data}`;
	if (fieldName === 'electronicIssn') return `e-ISSN: ${data}`;
	if (fieldName === 'volume') return `Volume ${data}`;
	if (fieldName === 'issue') return `Issue ${data}`;
	if (fieldName === 'printPublicationDate') return `Printed ${formatDate(data)}`;

	if (fieldName === 'publicationDate') return `Published ${formatDate(data)}`;

	if (fieldName === 'isbn') return `ISBN: ${data}`;
	if (fieldName === 'copyrightYear') return `Copyright © ${data}`;
	if (fieldName === 'edition') return `${data} ed.`;

	if (fieldName === 'theme') return `${data}`;
	if (fieldName === 'acronym') return ` ${data}`;
	if (fieldName === 'location') return `${data}`;
	if (fieldName === 'date') return `${formatDate(data)}`;

	return data;
};
