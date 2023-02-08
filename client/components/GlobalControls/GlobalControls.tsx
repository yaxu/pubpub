import React from 'react';

import {
	ScopeDropdown,
	Menu,
	UserNotificationsPopover,
	DevCommunitySwitcherMenu,
} from 'components';
import { usePageContext } from 'utils/hooks';
import { canSelectCommunityForDevelopment } from 'utils/environment';
import { pubPubIcons } from 'client/utils/icons';
import { MenuItem } from 'components/Menu';

import UserMenu from './UserMenu';
import LoginButton from './LoginButton';
import CreatePubButton from './CreatePubButton';
import GlobalControlsButton from './GlobalControlsButton';

require('./globalControls.scss');

type Props = {
	loggedIn: boolean;
	isBasePubPub?: boolean;
};

const GlobalControls = (props: Props) => {
	const { isBasePubPub = false, loggedIn } = props;
	const {
		locationData,
		loginData,
		communityData: { hideCreatePubButton },
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();

	const renderSearch = () => {
		return (
			<GlobalControlsButton
				href="/search"
				aria-label="Search"
				desktop={{ text: 'Search' }}
				mobile={{ icon: 'search' }}
			/>
		);
	};

	const renderDashboardMenu = () => {
		return (
			<Menu
				aria-label="Dashboard menu"
				placement="bottom-end"
				menuStyle={{ zIndex: 20 }}
				disclosure={
					<GlobalControlsButton
						mobile={{ icon: 'settings' }}
						desktop={{ text: 'Dashboard', rightIcon: 'caret-down' }}
					/>
				}
			>
				<ScopeDropdown />
			</Menu>
		);
	};

	const renderNotificiations = () => {
		if (loggedIn) {
			return (
				<UserNotificationsPopover>
					{({ hasUnreadNotifications }) => (
						<GlobalControlsButton
							aria-label="Notifications inbox"
							mobileOrDesktop={{
								icon: hasUnreadNotifications ? 'inbox-update' : 'inbox',
							}}
						/>
					)}
				</UserNotificationsPopover>
			);
		}
		return null;
	};

	const renderItemsVisibleFromCommunity = () => {
		if (!isBasePubPub) {
			const canCreatePub = loggedIn && (!hideCreatePubButton || canManage);
			return (
				<>
					{canCreatePub && <CreatePubButton />}
					{renderSearch()}
					{renderDashboardMenu()}
					{renderNotificiations()}
				</>
			);
		}
		return null;
	};

	const renderBasePubPubLinks = () => {
		if (isBasePubPub) {
			return (
				<>
					<div className="base-links">
						<GlobalControlsButton
							href="/explore"
							mobileOrDesktop={{ text: 'Explore' }}
						/>
						<GlobalControlsButton
							href="/features"
							mobileOrDesktop={{ text: 'Features' }}
						/>
						<GlobalControlsButton
							href="/pricing"
							mobileOrDesktop={{ text: 'Pricing' }}
						/>
						<GlobalControlsButton href="/about" mobileOrDesktop={{ text: 'About' }} />
						{renderSearch()}
					</div>
					<div className="base-links-mobile">
						<Menu
							aria-label="Website Menu"
							placement="bottom-end"
							menuStyle={{ zIndex: 25 }}
							disclosure={
								<GlobalControlsButton
									mobile={{ icon: 'menu' }}
									desktop={{ text: 'Menu', rightIcon: 'caret-down' }}
								/>
							}
						>
							<MenuItem href="/explore" text="Explore" />
							<MenuItem href="/features" text="Features" />
							<MenuItem href="/pricing" text="Pricing" />
							<MenuItem href="/pricing" text="About" />
						</Menu>
						{renderSearch()}
					</div>
				</>
			);
		}
		return null;
	};

	const renderUserMenuOrLogin = () => {
		if (loggedIn) {
			return <UserMenu loginData={loginData} />;
		}
		return <LoginButton locationData={locationData} />;
	};

	return (
		<div className="global-controls-component">
			{canSelectCommunityForDevelopment() && (
				<DevCommunitySwitcherMenu
					disclosure={
						<GlobalControlsButton
							mobileOrDesktop={{
								icon: pubPubIcons.community,
								rightIcon: 'caret-down',
							}}
						/>
					}
				/>
			)}
			{renderItemsVisibleFromCommunity()}
			{renderBasePubPubLinks()}
			{renderUserMenuOrLogin()}
		</div>
	);
};

export default GlobalControls;
