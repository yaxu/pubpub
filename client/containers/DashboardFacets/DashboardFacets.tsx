import React from 'react';
import { Button } from '@blueprintjs/core';

import { DashboardFrame, FacetEditor, FacetsStateProvider } from 'components';
import { ScopeId } from 'types';
import { FacetSourceScope, CascadedFacetsByKind } from 'facets';
import { useFacets } from 'client/utils/useFacets';

require('./dashboardFacets.scss');

type Props = {
	facets: CascadedFacetsByKind;
	scopeId: ScopeId;
};

const getFacetSourceScope = (scope: ScopeId): FacetSourceScope => {
	if ('pubId' in scope) {
		return { kind: 'pub', id: scope.pubId };
	}
	if ('collectionId' in scope) {
		return { kind: 'collection', id: scope.collectionId };
	}
	return { kind: 'community', id: scope.communityId };
};

const DashboardFacets = (props: Props) => {
	const { facets } = props;
	const { persistFacets, isPersisting } = useFacets();

	const facetEditors = Object.entries(facets).map(([facetName]) => {
		return <FacetEditor key={facetName} facetName={facetName as any} />;
	});

	return (
		<DashboardFrame
			title="Facets"
			className="dashboard-facets-container"
			controls={
				<Button intent="primary" onClick={persistFacets} loading={isPersisting}>
					Save Changes
				</Button>
			}
		>
			<div className="editors">{facetEditors}</div>
		</DashboardFrame>
	);
};

const DashboardFacetsWrapper = (props: Props) => {
	const { facets: initialCascadeResults, scopeId } = props;
	const currentScope = getFacetSourceScope(scopeId);
	return (
		<FacetsStateProvider options={{ currentScope, initialCascadeResults }}>
			<DashboardFacets {...props} />
		</FacetsStateProvider>
	);
};

export default DashboardFacetsWrapper;
