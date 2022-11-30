import { Op, QueryTypes } from 'sequelize';
import { QueryBuilder } from 'knex';

import * as types from 'types';
import { knex, sequelize, Community, SpamTag } from 'server/models';

const orderableFields: Record<types.SpamCommunityQueryOrderingField, string> = {
	'community-created-at': 'Communities.createdAt',
	'spam-tag-updated-at': 'SpamTags.updatedAt',
	'spam-score': 'SpamTags.spamScore',
};

const getFieldsToQueryForUrl = (searchTerm: string) => {
	let url: URL;
	try {
		url = new URL(searchTerm);
	} catch (err: unknown) {
		return {};
	}
	if (url.hostname.endsWith('.pubpub.org')) {
		const subdomain = url.hostname.replace('.pubpub.org', '');
		return { subdomain };
	}
	return { domain: url.hostname };
};

const createCommunitiesWhereClause = (query: types.SpamCommunityQuery) => {
	const { searchTerm } = query;
	return (builder: QueryBuilder) => {
		if (searchTerm) {
			const normalizedSearchTerm = `%${searchTerm.trim()}%`;
			const urlQueryFields = getFieldsToQueryForUrl(searchTerm);
			builder.orWhere('Communities.subdomain', 'ilike', normalizedSearchTerm);
			builder.orWhere('Communities.domain', 'ilike', normalizedSearchTerm);
			builder.orWhere('Communities.title', 'ilike', normalizedSearchTerm);
			if ('domain' in urlQueryFields && urlQueryFields.domain) {
				builder.orWhere('Communities.domain', 'ilike', urlQueryFields.domain);
			}
			if ('subdomain' in urlQueryFields && urlQueryFields.subdomain) {
				builder.orWhere('Communities.subdomain', 'ilike', urlQueryFields.subdomain);
			}
		}
		return builder;
	};
};

const createJoinToSpamTags = (query: types.SpamCommunityQuery) => {
	const { status } = query;
	return (builder: QueryBuilder) => {
		builder.innerJoin('SpamTags', {
			'SpamTags.id': 'Communities.spamTagId',
			'SpamTags.status': knex.raw('some(?::text[])', [status]),
		});
		return builder;
	};
};

const createOrderLimitOffset = (query: types.SpamCommunityQuery) => {
	const { offset, limit, ordering } = query;
	return (builder: QueryBuilder) => {
		if (ordering) {
			const { field, direction } = ordering;
			const orderableField = orderableFields[field];
			const normalizedDirection = direction.toLowerCase() === 'asc' ? 'asc' : 'desc';
			builder.orderByRaw(`?? ${normalizedDirection}`, [orderableField]);
		}
		if (typeof limit === 'number') {
			builder.limit(limit);
		}
		if (typeof offset === 'number') {
			builder.offset(offset);
		}
		return builder;
	};
};

const buildCommunityIdsQuery = (query: types.SpamCommunityQuery) => {
	const whereClause = createCommunitiesWhereClause(query);
	const joinToSpamTags = createJoinToSpamTags(query);
	const orderLimitOffset = createOrderLimitOffset(query);
	const select = knex.select({ id: 'Communities.id' }).from('Communities');
	return [whereClause, joinToSpamTags, orderLimitOffset]
		.reduce((builder, appl) => appl(builder), select)
		.toSQL()
		.toNative();
};

const sortCommunitiesByListOfIds = (communities: any[], communityIds: string[]) => {
	return communities
		.concat()
		.sort((a, b) => communityIds.indexOf(a.id) - communityIds.indexOf(b.id));
};

const getCommunityIdsForQuery = async (query: types.SpamCommunityQuery) => {
	const { sql, bindings } = buildCommunityIdsQuery(query);
	console.log(sql, bindings);
	const results = await sequelize.query(sql, { type: QueryTypes.SELECT, bind: bindings });
	return results.map((r) => r.id);
};

export const queryCommunitiesForSpamManagement = async (
	query: types.SpamCommunityQuery,
): Promise<types.DefinitelyHas<types.Community, 'spamTag'>[]> => {
	const communityIds = await getCommunityIdsForQuery(query);
	const communities = await Community.findAll({
		where: { id: { [Op.in]: communityIds } },
		include: [{ model: SpamTag, as: 'spamTag' }],
	});
	return sortCommunitiesByListOfIds(communities, communityIds);
};
