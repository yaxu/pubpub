export default (sequelize, dataTypes) => {
	return sequelize.define(
		'UserThreadSubscription',
		{
			id: sequelize.idType,
			createdAutomatically: { type: dataTypes.BOOLEAN, allowNull: false },
			muted: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
			userId: { type: dataTypes.UUID, allowNull: false },
			threadId: { type: dataTypes.UUID, allowNull: false },
		},
		{
			indexes: [
				{ fields: ['userId'], method: 'BTREE' },
				{ fields: ['threadId'], method: 'BTREE' },
			],
			classMethods: {
				associate: (models) => {
					const { Thread, User, UserThreadSubscription } = models;
					UserThreadSubscription.belongsTo(Thread, {
						onDelete: 'CASCADE',
						as: 'thread',
						foreignKey: 'threadId',
					});
					UserThreadSubscription.belongsTo(User, {
						onDelete: 'CASCADE',
						as: 'user',
						foreignKey: 'userId',
					});
				},
			},
		},
	);
};
