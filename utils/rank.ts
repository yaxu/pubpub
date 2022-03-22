/**
 * A utility to help keep things in a user-defined order in the database.
 * Imagine that we want to keep a user-ordered list of items somewhere on PubPub -- this shouldn't
 * be hard because we often do, in places like the collection or attribution editor. While it's easy
 * to store this user-defined order in a `rank` column in the database, re-ordering elements is
 * inefficient. Imagine you have ranks [1, 2, ..., 100] in the database and you want to move the
 * last item to the beginning to get [100, 1, 2, ...]. This will require you to give the formerly
 * 100th item rank 1 and update the 99 entries now behind it in the list, which will be quite slow!
 *
 * There are quite a few solutions floating around there to make this a little easier. One is to add
 * gaps between ranks, incrementing by 1000 instead of 1 -- this way, you can reorder the list
 * [1000, 2000, 3000] -> [3000, 1000, 2000] by changing 3000's rank to, e.g. 500. Another
 * possibility is to use floats. In both situations, you'll eventually run out of precision, so we
 * use _strings_ instead. Strings have infinite precision -- between "a" and "b" are an infinite
 * number of strings beginning with "a". So we can use them to represent the `rank` and never run
 * out of slots! Most of the heavy lifting of doing this is done by the "mudder" library, which
 * generates new strings in between other ones on the fly.
 */
import mudder from 'mudder';

// All ranks will be greater than BOTTOM and less than TOP. These characters are the first and last
// in the base36 "alphabet", which contains ten digits and all lowercase letters.
const BOTTOM = '0';
const TOP = 'z';

const getBounds = (ranks: string[], index: number) => {
	if (index === 0) {
		return [BOTTOM, ranks[0] || TOP];
	}
	if (index === ranks.length) {
		return [ranks[ranks.length - 1], TOP];
	}
	return ranks.slice(index - 1, index + 1);
};

type RankKey<T> = string | ((t: T) => string);

export const sortByRank = <T>(array: T[], rankKey: RankKey<T> = 'rank'): T[] => {
	if (typeof rankKey === 'string') {
		return array.concat().sort((a, b) => (a[rankKey] || '').localeCompare(b[rankKey] || ''));
	}
	return array.concat().sort((a, b) => rankKey(a).localeCompare(rankKey(b)));
};

export const findRank = (ranks: string[], index: number, count = 1) => {
	const [above, below] = getBounds(ranks, index);
	const [result] = mudder.base36.mudder(above, below, count);
	return result;
};

export const generateRanks = (count: number) => {
	return mudder.base36.mudder(BOTTOM, TOP, count);
};

export const findRankInRankedList = <T>(
	rankedList: T[],
	index: number,
	rankKey: RankKey<T> = 'rank',
): string =>
	findRank(
		sortByRank(rankedList, rankKey).map((s) =>
			typeof rankKey === 'string' ? s[rankKey] : rankKey(s),
		),
		index,
	);
