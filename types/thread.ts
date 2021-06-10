export type ThreadComment = {
	id: string;
	text: string;
	content: {};
	userId: string;
	threadId: string;
};

export type Thread = {
	id: string;
	updatedAt: string;
	createdAt: string;
	locked?: boolean;
	comments: ThreadComment[];
};

export type UserThreadSubscription = {
	id: string;
	updatedAt: string;
	createdAt: string;
	userId: string;
	threadId: string;
	muted: boolean;
	createdAutomatically: boolean;
};
