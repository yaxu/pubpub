export default (sequelize, dataTypes) => {
	return sequelize.define('FacetInstance', {
		id: sequelize.idType,
		pubId: { type: dataTypes.UUID, allowNull: true },
		collectionId: { type: dataTypes.UUID, allowNull: true },
		communityId: { type: dataTypes.UUID, allowNull: true },
	});
};
