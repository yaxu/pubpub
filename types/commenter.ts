export type Commenter = {
	id: string;
	name: string;
};

export type PubGuestCommenterInfo = {
	commenterToken: string;
	commenter: {
		id: string;
	} & (Pick<Commenter, 'name'> | {});
};
