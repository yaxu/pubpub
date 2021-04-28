import { Community } from 'server/models';

let localCommunitySubdomain = process.env.PUBPUB_LOCAL_COMMUNITY || 'demo';

const isLocalhostRequest = (req: any) => req.hostname === 'localhost';

export const getLocalCommunity = (req: any) => {
	if (isLocalhostRequest(req)) {
		return `${localCommunitySubdomain}.pubpub.org`;
	}
	return null;
};

export const setLocalCommunity = async (req: any, nextCommunitySubdomain: string) => {
	if (req.headers.localhost) {
		const matchingCommunity = await Community.findOne({
			where: { subdomain: nextCommunitySubdomain },
		});
		if (!matchingCommunity) {
			throw new Error(`No Community with subdomain ${nextCommunitySubdomain}`);
		}
		localCommunitySubdomain = nextCommunitySubdomain;
	}
};
