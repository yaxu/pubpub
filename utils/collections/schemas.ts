import { CollectionKind } from 'types';
import {
	acronym,
	copyrightYear,
	date,
	doi,
	edition,
	electronicIssn,
	isbn,
	issue,
	location,
	printIssn,
	printPublicationDate,
	publicationDate,
	theme,
	url,
	volume,
} from './fields';

import { CollectionSchema } from './types';

const schemas: CollectionSchema[] = [
	{
		kind: 'tag',
		label: { singular: 'tag', plural: 'tags' },
		bpDisplayIcon: 'tag',
		metadata: [],
		contextHints: [],
	},
	{
		kind: 'issue',
		label: { singular: 'issue', plural: 'issues' },
		bpDisplayIcon: 'manual',
		contextHints: [{ value: 'article', label: 'Article', isDefault: true }],
		metadata: [
			doi,
			url,
			printIssn,
			electronicIssn,
			volume,
			issue,
			printPublicationDate,
			publicationDate,
		],
	},
	{
		kind: 'book',
		label: { singular: 'book', plural: 'books' },
		bpDisplayIcon: 'book',
		contextHints: [
			{ value: 'foreword', label: 'Foreword', crossrefComponentType: 'section' },
			{ value: 'preface', label: 'Preface', crossrefComponentType: 'section' },
			{
				value: 'supplementaryMaterial',
				label: 'Supplementary Material',
				crossrefComponentType: 'reference_entry',
			},
			{
				value: 'chapter',
				label: 'Chapter',
				isDefault: true,
				crossrefComponentType: 'chapter',
			},
			{ value: 'appendix', label: 'Appendix', crossrefComponentType: 'reference_entry' },
			{ value: 'glossary', label: 'Glossary', crossrefComponentType: 'reference_entry' },
			{
				value: 'acknowledgements',
				label: 'Acknowledgements',
				crossrefComponentType: 'section',
			},
		],
		metadata: [doi, url, isbn, copyrightYear, publicationDate, edition],
	},
	{
		kind: 'conference',
		label: { singular: 'conference', plural: 'conferences' },
		bpDisplayIcon: 'presentation',
		contextHints: [{ value: 'paper', label: 'Paper', isDefault: true }],
		metadata: [doi, url, theme, acronym, location, date],
	},
];

export default schemas;

export const getSchemaForKind = (kind: CollectionKind) => {
	const result = schemas.find((s) => s.kind === kind);
	if (result) {
		return result;
	}
	return null;
};

export const getIconForCollectionKind = (kind: CollectionKind) => {
	const schema = getSchemaForKind(kind);
	if (schema) {
		return schema.bpDisplayIcon;
	}
	return null;
};
