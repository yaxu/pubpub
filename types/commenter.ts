export type Commenter = {
	id: string;
	name: string;
};

export type PubGuestCommenterInfo<RequireFullInfo extends boolean = false> = {
	commenterToken: string;
	commenter: Pick<Commenter, 'id'> &
		(RequireFullInfo extends true ? Pick<Commenter, 'name'> : {});
};
