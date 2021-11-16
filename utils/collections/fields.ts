import { collectionUrl } from 'utils/canonicalUrls';
import { formatDate, getLocalDateMatchingUtcCalendarDate } from 'utils/dates';

import { MetadataField, MetadataFormatter, MetadataType } from './types';

const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

const dateType: MetadataType<Date, string> = {
	name: 'date',
	deserialize: (str) => {
		const [year, month, day] = dateRegex.exec(str)!.slice(1);
		const date = new Date();
		date.setFullYear(parseInt(year, 10));
		date.setMonth(parseInt(month, 10) - 1);
		date.setDate(parseInt(day, 10));
		return date;
	},
	validate: (str) => dateRegex.test(str),
	labelInfo: '(in YYYY-MM-DD format)',
};

const labelValueFormatter: MetadataFormatter<string> = ({ label, value }) => `${label} ${value}`;

const labelColonValueFormatter: MetadataFormatter<string> = ({ label, value }) =>
	`${label}: ${value}`;

const valueOnlyFormatter: MetadataFormatter<string> = ({ value }) => value;

const makeDateFormatter =
	(prefix: string): MetadataFormatter<Date> =>
	({ value }) => {
		const dateString = formatDate(getLocalDateMatchingUtcCalendarDate(value));
		return `${prefix}${dateString}`;
	};

export const doi: MetadataField<string, string> = {
	name: 'doi',
	label: 'DOI',
	formatter: valueOnlyFormatter,
	derivedFrom: ({ collection }) => collection && collection.doi,
	derivedLabelInfo: '(Registered and cannot be changed)',
};

export const url: MetadataField<string, string> = {
	name: 'url',
	label: 'URL',
	formatter: valueOnlyFormatter,
	defaultDerivedFrom: ({ community, collection }) =>
		community && collection && collection.id && collectionUrl(community, collection),
};

export const printIssn: MetadataField<string, string> = {
	name: 'printIssn',
	label: 'Print ISSN',
	formatter: labelColonValueFormatter,
};

export const electronicIssn: MetadataField<string, string> = {
	name: 'electronicIssn',
	label: 'Electronic ISSN',
	formatter: ({ value }) => `e-ISSN: ${value}`,
};

export const volume: MetadataField<string, string> = {
	name: 'volume',
	label: 'Volume',
	formatter: labelValueFormatter,
};

export const issue: MetadataField<string, string> = {
	name: 'issue',
	label: 'Issue',
	formatter: labelValueFormatter,
};

export const isbn: MetadataField<string, string> = {
	name: 'isbn',
	label: 'ISBN',
	formatter: labelColonValueFormatter,
};

export const copyrightYear: MetadataField<string, string> = {
	name: 'copyrightYear',
	label: 'Copyright year',
	pattern: '^[0-9]*$',
	formatter: ({ value }) => `Copyright © ${value}`,
};

export const edition: MetadataField<string, string> = {
	name: 'edition',
	label: 'Edition no.',
	pattern: '^[0-9]*$',
	formatter: ({ value }) => `${value} ed.`,
};

export const theme: MetadataField<string, string> = {
	name: 'theme',
	label: 'Theme',
	formatter: valueOnlyFormatter,
};

export const acronym: MetadataField<string, string> = {
	name: 'acronym',
	label: 'Acronym',
	formatter: valueOnlyFormatter,
};

export const location: MetadataField<string, string> = {
	name: 'location',
	label: 'Location',
	formatter: valueOnlyFormatter,
};

export const date: MetadataField<Date, string> = {
	name: 'date',
	label: 'Date',
	type: dateType,
	formatter: makeDateFormatter(''),
};

export const printPublicationDate: MetadataField<Date, string> = {
	name: 'printPublicationDate',
	label: 'Print publication date',
	type: dateType,
	formatter: makeDateFormatter('Printed '),
};

export const publicationDate: MetadataField<Date, string> = {
	name: 'publicationDate',
	label: 'Publication date',
	type: dateType,
	formatter: makeDateFormatter('Published '),
};
