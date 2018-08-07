import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import DashboardSide from 'components/DashboardSide/DashboardSide';
// import DashboardCollection from 'components/DashboardCollection/DashboardCollection';
// import DashboardCollectionEdit from 'components/DashboardCollectionEdit/DashboardCollectionEdit';
import DashboardCreatePage from 'components/DashboardCreatePage/DashboardCreatePage';
import DashboardDetails from 'components/DashboardDetails/DashboardDetails';
import DashboardTeam from 'components/DashboardTeam/DashboardTeam';
import DashboardTags from 'components/DashboardTags/DashboardTags';
import DashboardPubs from 'components/DashboardPubs/DashboardPubs';
import DashboardPage from 'components/DashboardPage/DashboardPage';

import { hydrateWrapper } from 'utilities';

require('./dashboard.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pageData: PropTypes.object.isRequired,
	pubsData: PropTypes.array.isRequired,
};

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			communityData: props.communityData,
			pageData: props.pageData,
			// putCommunityIsLoading: false,
			// putCommunityError: undefined,
			// postCollectionIsLoading: false,
			// postCollectionError: undefined,
			// putCollectionIsLoading: false,
			// deleteCollectionIsLoading: false,
			// putCollectionError: undefined,
			// postPubIsLoading: false,
		};
		this.setCommunityData = this.setCommunityData.bind(this);
		this.setPageData = this.setPageData.bind(this);
		// this.handleCreatePub = this.handleCreatePub.bind(this);
		// this.handleSiteSave = this.handleSiteSave.bind(this);
		// this.handleCollectionCreate = this.handleCollectionCreate.bind(this);
		// this.handleCollectionSave = this.handleCollectionSave.bind(this);
		// this.handleCollectionDelete = this.handleCollectionDelete.bind(this);
		// this.handleAddAdmin = this.handleAddAdmin.bind(this);
		// this.handleRemoveAdmin = this.handleRemoveAdmin.bind(this);
	}

	setCommunityData(newCommunityData) {
		this.setState({ communityData: newCommunityData });
	}

	setPageData(newPageData) {
		this.setState({ pageData: newPageData });
	}

	// handleCreatePub(collectionId) {
	// 	this.setState({ postPubIsLoading: true });
	// 	return apiFetch('/api/pubs', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			collectionId: collectionId,
	// 			communityId: this.props.communityData.id,
	// 			createPubHash: undefined,
	// 		})
	// 	})
	// 	.then((result)=> {
	// 		window.location.href = result;
	// 	})
	// 	.catch((err)=> {
	// 		console.error(err);
	// 		this.setState({ postPubIsLoading: false });
	// 	});
	// }
	// handleSiteSave(siteObject) {
	// 	this.setState({ putCommunityIsLoading: true, putCommunityError: undefined });
	// 	return apiFetch('/api/communities', {
	// 		method: 'PUT',
	// 		body: JSON.stringify(siteObject)
	// 	})
	// 	.then(()=> {
	// 		if (!this.props.communityData.domain) {
	// 			window.location.replace(`https://${siteObject.subdomain}.pubpub.org/dashboard/site`);
	// 		} else {
	// 			window.location.reload();
	// 		}
	// 	})
	// 	.catch((err)=> {
	// 		console.error(err);
	// 		this.setState({ putCommunityIsLoading: false, putCommunityError: err });
	// 	});
	// }
	// handleCollectionCreate(collectionObject) {
	// 	this.setState({ postCollectionIsLoading: true, postCollectionError: undefined });
	// 	return apiFetch('/api/collections', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			...collectionObject,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then(()=> {
	// 		window.location.href = `/dashboard/${collectionObject.slug}`;
	// 	})
	// 	.catch((err)=> {
	// 		console.error(err);
	// 		this.setState({ postCollectionIsLoading: false, postCollectionError: err });
	// 	});
	// }
	// handleCollectionSave(collectionObject) {
	// 	this.setState({ putCollectionIsLoading: true, putCollectionError: undefined });
	// 	return apiFetch('/api/collections', {
	// 		method: 'PUT',
	// 		body: JSON.stringify({
	// 			...collectionObject,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then(()=> {
	// 		window.location.href = `/dashboard/${collectionObject.slug}`;
	// 	})
	// 	.catch((err)=> {
	// 		console.error(err);
	// 		this.setState({ putCollectionIsLoading: false, putCollectionError: err });
	// 	});
	// }
	// handleCollectionDelete(collectionId) {
	// 	this.setState({ deleteCollectionIsLoading: true });
	// 	return apiFetch('/api/collections', {
	// 		method: 'DELETE',
	// 		body: JSON.stringify({
	// 			collectionId: collectionId,
	// 			communityId: this.props.communityData.id,
	// 		})
	// 	})
	// 	.then(()=> {
	// 		window.location.href = '/dashboard';
	// 	})
	// 	.catch((err)=> {
	// 		console.error(err);
	// 		this.setState({ deleteCollectionIsLoading: false });
	// 	});
	// }
	// handleAddAdmin(adminObject) {
	// 	return apiFetch('/api/communityAdmins', {
	// 		method: 'POST',
	// 		body: JSON.stringify(adminObject)
	// 	})
	// 	.then(()=> {
	// 		window.location.reload();
	// 	});
	// }
	// handleRemoveAdmin(adminObject) {
	// 	return apiFetch('/api/communityAdmins', {
	// 		method: 'DELETE',
	// 		body: JSON.stringify(adminObject)
	// 	})
	// 	.then(()=> {
	// 		window.location.reload();
	// 	});
	// }

	render() {
		const communityData = this.state.communityData;
		const pageData = this.state.pageData;
		const activeSlug = this.props.locationData.params.slug || '';
		const activeMode = this.props.locationData.params.mode || '';
		return (
			<div id="dashboard-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={communityData}
					locationData={this.props.locationData}
					// fixHeader={true}
					hideNav={true}
					hideFooter={true}
				>
					<div className="container">
						<div className="row">
							<div className="col-12 dashboard-columns">

								<div className="side-content">
									<DashboardSide
										pages={communityData.pages}
										// collections={collections}
										activeTab={activeSlug || activeMode}
										// activeMode={activeMode}
									/>
								</div>

								<div className="main-content">
									{(()=> {
										switch (activeMode) {
										case 'pubs':
											return (
												<DashboardPubs
													communityData={communityData}
													pubsData={this.props.pubsData}
												/>
											);
										case 'team':
											return (
												<DashboardTeam
													communityData={communityData}
													setCommunityData={this.setCommunityData}
													// onAddAdmin={this.handleAddAdmin}
													// onRemoveAdmin={this.handleRemoveAdmin}
												/>
											);
										case 'details':
											return (
												<DashboardDetails
													communityData={communityData}
													setCommunityData={this.setCommunityData}
													// onSave={this.handleSiteSave}
													// isLoading={this.state.putCommunityIsLoading}
													// error={this.state.putCommunityError}
												/>
											);
										case 'tags':
											return (
												<DashboardTags
													communityData={communityData}
													setCommunityData={this.setCommunityData}
													// onSave={this.handleSiteSave}
													// isLoading={this.state.putCommunityIsLoading}
													// error={this.state.putCommunityError}
												/>
											);
										case 'page':
											return (
												<DashboardCreatePage
													communityData={communityData}
													hostname={this.props.locationData.hostname}
													// isPage={true}
													// onCreate={this.handleCollectionCreate}
													// isLoading={this.state.postCollectionIsLoading}
													// error={this.state.postCollectionError}
													// hostname={this.props.locationData.hostname}
												/>
											);
										default:
											return (
												<DashboardPage
													communityData={communityData}
													pageData={pageData}
													// location={this.props.locationData}
													setCommunityData={this.setCommunityData}
													setPageData={this.setPageData}
												/>
											);
											// if (activeMode === 'edit') {
											// 	return (
											// 		<DashboardCollectionEdit
											// 			location={this.props.locationData}
											// 			collectionData={collectionData}
											// 			putIsLoading={this.state.putCollectionIsLoading}
											// 			deleteIsLoading={this.state.deleteCollectionIsLoading}
											// 			error={this.state.putCollectionError}
											// 			onSave={this.handleCollectionSave}
											// 			onDelete={this.handleCollectionDelete}
											// 		/>
											// 	);
											// }
											// return (
											// 	<DashboardCollection
											// 		collectionData={collectionData}
											// 		onCreatePub={this.handleCreatePub}
											// 		createPubLoading={this.state.postPubIsLoading}
											// 		hostname={this.props.locationData.hostname}
											// 	/>
											// );
										}
									})()}
								</div>
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Dashboard.propTypes = propTypes;
export default Dashboard;

hydrateWrapper(Dashboard);
