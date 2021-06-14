import { UserSubscription } from 'server/models';
import * as types from 'types';

type CreateOptions = types.UniqueUserSubscriptionQuery & {
	id?: never;
	createdAutomatically: boolean;
};

type MuteOptions = types.UniqueUserSubscriptionQuery & { muted: boolean };

export const createUserSubscription = async (
	options: CreateOptions,
): Promise<types.UserSubscription> => {
	const { createdAutomatically, ...associationIds } = options;
	return UserSubscription.create({ createdAutomatically, ...associationIds });
};

export const muteUserSubscription = async (options: MuteOptions) => {
	const { muted, ...associationIds } = options;
	await UserSubscription.update({ muted }, { where: associationIds });
};

export const destroyUserSubscription = async (where: types.UniqueUserSubscriptionQuery) => {
	await UserSubscription.destroy({ where });
};

export const findUserSubscription = async (
	where: types.UniqueUserSubscriptionQuery,
): Promise<null | types.UserSubscription> => {
	return UserSubscription.findOne({ where });
};
