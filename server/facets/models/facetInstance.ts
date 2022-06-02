export default (sequelize, dataTypes) => {
	return sequelize.define('FacetInstance', {
		id: sequelize.idType,
		pubId: { type: dataTypes.UUID, allowNull: true },
		collectionId: { type: dataTypes.UUID, allowNull: true },
		communityId: { types: dataTypes.UUID, allowNull: true },
		facetDefinitionId: { types: dataTypes.UUID, allowNull: false },
	});
};
